import express from 'express';
const path = require('path');
import helmet from 'helmet';
import mongoose from 'mongoose';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import loggerConfig from './config/loggerConfig';
import typeDefs from './graphql/schemas/schemas';
import resolvers from './graphql/resolvers/resolvers';
import schemaDirectives from './graphql/directives/directives';
import fileUpload from 'express-fileupload';
import uploadRoutes from './api/upload';
import { ApolloServer } from 'apollo-server-express';

const { 
  PORT, 
  NODE_ENV, 
  CLIENT_URI,
  MONGO_DB_URI, 
  UPLOADS_FOLDER,
  SESSION_NAME, 
  SESSION_SECRET, 
  SESSION_MAX_AGE, 
} = process.env;

const app = express();

app.use(helmet());
app.use(helmet.permittedCrossDomainPolicies());
app.use(express.json({ limit: '1mb' }));
app.use(express.static('dist'));
app.use(fileUpload());

// Serve React Application
if (NODE_ENV === 'development') {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
}

// View Public Images
app.use('/uploads', express.static(path.join(__dirname, UPLOADS_FOLDER)));

// Use the defined routes under the /api subpath
app.use('/api', uploadRoutes);  

// Set User Session
const MongoStore = connectMongo(session);

mongoose.set('useCreateIndex', true);

app.use(
  session({
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
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
  playground:
    NODE_ENV.trim() !== 'development'
      ? false
      : {
        settings: {
          'request.credentials': 'include',
          'schema.polling.enable': false
        }
      },
  context: ({ req, res }) => ({ req, res })
});

// Logging with Morgan
if (NODE_ENV === 'development') {
  loggerConfig(app);
}

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
  app.listen({ port }, () => {
    console.log(`Server running on port ${port}`);
  });
});

mongoose.connection.on('error', error => console.error(error));
