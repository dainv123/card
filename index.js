// index.js
require('dotenv').config();
import Grid from 'gridfs-stream';
import helmet from 'helmet';
import multer from 'multer';
import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import cors from 'cors';
import loggerConfig from './config/loggerConfig.js';
import typeDefs from './graphql/schemas/schemas.js';
import resolvers from './graphql/resolvers/resolvers.js';
import schemaDirectives from './graphql/directives/directives.js';
import { ApolloServer } from 'apollo-server-express';
import { GridFsStorage } from 'multer-gridfs-storage';
import { FILE_BUCKET } from './constants/config.js';
import { UPLOADS_FOLDER } from './client/constants/common.js';
import { GetFile, UploadFile, DeleteFile } from './helpers/upload.js';
import { sendEmailGuest } from './helpers/token.js';
// import * as migrateMongo from './migrate-mongo-config.js';
// import './models/Blog.js';

// Suppress deprecated warnings
mongoose.set('strictQuery', false); // Replace useCreateIndex with strictQuery

// Environment variables
const {
  PORT = 8080,
  NODE_ENV = 'development',
  CLIENT_URI = 'http://localhost:3000',
  MONGO_DB_URI = 'mongodb://127.0.0.1:27017/invitation-cards',
  SESSION_NAME,
  SESSION_SECRET,
  SESSION_MAX_AGE = 3600000,
} = process.env;

// Initialize Express and MongoDB connections
const app = express();
const mongooseConnection = mongoose.connection;
const MongoSessionConnection = connectMongo(session);

// Initialize GridFS
let grid;

// --- Basic Middleware ---
app.use(helmet());
app.use(helmet.permittedCrossDomainPolicies());
loggerConfig(app);

// --- CORS Configuration ---
const allowedOrigins = [CLIENT_URI, 'http://localhost:3000'];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// --- Other Middleware ---
app.use(express.json({ limit: '1mb' }));
app.use(express.static(__dirname + '/client/dist'));
app.use('/themes', express.static(__dirname + '/client/themes'));
app.use('/public', express.static(__dirname + '/client/public'));

// --- API Routes ---
app.post('/upload', UploadFile.single('file'), (req, res) => {
  res.json({ file: req.file.filename });
});
app.get('/file/:filename', (req, res) => GetFile(req, res, grid));
app.delete('/file/:filename', (req, res) => DeleteFile(req, res, grid));
app.post('/send-mail', (req, res) => sendEmailGuest(req, res));

// --- Session Middleware ---
app.use(
  session({
    store: new MongoSessionConnection({ mongooseConnection }),
    name: SESSION_NAME,
    secret: SESSION_SECRET,
    resave: false,
    rolling: true,
    saveUninitialized: false,
    cookie: {
      maxAge: parseInt(SESSION_MAX_AGE, 10),
      sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
      httpOnly: true,
      secure: NODE_ENV === 'production',
    },
  })
);

// --- Apollo Server ---
const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives,
  playground: NODE_ENV !== 'production' ? {
    settings: {
      'request.credentials': 'include',
      'schema.polling.enable': false,
    },
  } : false,
  context: ({ req, res }) => ({ req, res }),
});
server.applyMiddleware({ app, cors: false });

// --- Catch-all Route for SPA ---
app.get('/*', (req, res) => {
  res.sendFile(__dirname + '/client/dist/index.html');
});

// --- Run Migrations ---
// async function runMigrations() {
//   try {
//     const migrate = createMigrate(migrateMongo);
//     const appliedMigrations = await migrate.up();
//     console.log('Applied migrations:', appliedMigrations);
//   } catch (error) {
//     console.error('Migration error:', error);
//     process.exit(1);
//   }
// }

// --- MongoDB Connection and Server Startup ---
mongoose.connect(MONGO_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongooseConnection.once('open', async () => {
  console.log('Connected to MongoDB');
  // await runMigrations();
  grid = Grid(mongooseConnection.db, mongoose.mongo);
  grid.collection(FILE_BUCKET);
  app.listen({ port: PORT }, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
});

mongooseConnection.on('error', (error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});