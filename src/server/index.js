import express from 'express';
import path from 'path';
import helmet from 'helmet';
import mongoose from 'mongoose';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import { ApolloServer } from 'apollo-server-express';
import loggerConfig from './config/loggerConfig';
import typeDefs from './graphql/schemas/schemas';
import resolvers from './graphql/resolvers/resolvers';
import schemaDirectives from './graphql/directives/directives';
import { graphqlUploadExpress } from './node_modules/graphql-upload';

const { NODE_ENV, SESSION_NAME, SESSION_SECRET, SESSION_MAX_AGE, MONGO_DB_URI, PORT } = process.env;

const app = express();

mongoose.set('useCreateIndex', true);

// Set Secure Headers with Helmet
app.use(helmet());
app.use(helmet.permittedCrossDomainPolicies());
app.use(graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 }));
app.use(express.json({ limit: '1mb' }));

// Serve React Application
// if (NODE_ENV !== 'development') {
app.use(express.static('dist'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
// }

// Set User Session
const MongoStore = connectMongo(session);
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
  uploads: false,
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
    origin: 'http://localhost:3000'
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
