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
import fileUpload from 'express-fileupload';
import fs from 'fs';

const { NODE_ENV, SESSION_NAME, SESSION_SECRET, SESSION_MAX_AGE, MONGO_DB_URI, PORT, CLIENT_URI } = process.env;

const app = express();

mongoose.set('useCreateIndex', true);

// Set Secure Headers with Helmet
app.use(helmet());
app.use(helmet.permittedCrossDomainPolicies());
app.use(express.json({ limit: '1mb' }));
app.use(fileUpload());

// Serve React Application
// if (NODE_ENV !== 'development') {
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.static('dist'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.post('/upload', function (req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  let file = req.files.file;
  let filename = '/uploads/' + new Date().getTime() + '-' + file.name;
  let uploadPath = __dirname + filename;

  file.mv(uploadPath, function (err) {
    if (err)
      return res.status(500).send(err);

    res.send({ url: filename });
  });
});

app.post('/upload-delete', function (req, res) {
  const filename = req.body.filename;
  const filePath = __dirname + filename;

  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    res.send('File deleted successfully');
  });
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
