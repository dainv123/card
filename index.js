import Grid from 'gridfs-stream';
import helmet from 'helmet';
import multer from 'multer';
import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import loggerConfig from './config/loggerConfig.js';
import typeDefs from './graphql/schemas/schemas.js';
import resolvers from './graphql/resolvers/resolvers.js';
import schemaDirectives from './graphql/directives/directives.js';
import { ApolloServer } from 'apollo-server-express';
import { GridFsStorage } from 'multer-gridfs-storage';
import { FILE_BUCKET } from './constants/config.js';
import { UPLOADS_FOLDER } from './client/constants/common.js';
import { GetFile, UploadFile, DeleteFile } from './helpers/upload.js';

mongoose.set('useCreateIndex', true);

const { PORT, NODE_ENV, CLIENT_URI, MONGO_DB_URI, SESSION_NAME, SESSION_SECRET, SESSION_MAX_AGE } = process.env;

let grid;
const app = express();
const mongooseConnection = mongoose.connection;
const MongoSessionConnection = connectMongo(session);

if (NODE_ENV === 'development') {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  loggerConfig(app);
}

app.use(helmet());
app.use(helmet.permittedCrossDomainPolicies());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(__dirname + '/client/dist'));
app.use('/themes', express.static(__dirname + '/client/themes'));
app.use('/public', express.static(__dirname + '/client/public'));
app.post('/upload', UploadFile.single('file'), (req, res) => res.json({ file: req.file.filename }));
app.get('/file/:filename', (req, res) => GetFile(req, res, grid));
app.delete('/file/:filename', (req, res) => DeleteFile(req, res, grid));
app.get('/*', (req, res) => res.sendFile(__dirname + '/client/dist/index.html'));

app.use(
  session({
    store: new MongoSessionConnection({ mongooseConnection: mongoose.connection }),
    name: SESSION_NAME,
    secret: SESSION_SECRET,
    resave: true,
    rolling: true,
    saveUninitialized: false,
    cookie: {
      maxAge: parseInt(SESSION_MAX_AGE, 10),
      sameSite: true,
      httpOnly: true,
      secure: !NODE_ENV.trim() === 'development'
    }
  })
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives,
  playground: NODE_ENV.trim() !== 'development' ? false : {
    settings: {
      'request.credentials': 'include',
      'schema.polling.enable': false
    }
  },
  context: ({ req, res }) => ({ req, res })
});


server.applyMiddleware({
  app,
  cors: {
    credentials: true,
    origin: CLIENT_URI
  }
});

mongoose.connect(MONGO_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.once('open', () => {
  const port = PORT || 8080;
  grid = Grid(mongoose.connection.db, mongoose.mongo);
  grid.collection(FILE_BUCKET);
  app.listen({ port }, () => console.log(`Server running on port ${port}`));
});

mongoose.connection.on('error', error => console.error(error));
