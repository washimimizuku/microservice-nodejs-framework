const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');
const httpStatus = require('http_status_codes');
const winston = require('winston');
const expressWinston = require('express-winston');

// Load .env variables.
require('dotenv').config();

if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_AUDIENCE) {
  throw 'Make sure you have AUTH0_DOMAIN, and AUTH0_AUDIENCE in your .env file';
}

const apiRouter = require('./routes/api');

const app = express();

const corsOptions = {
  origin: 'http://localhost'
};
app.use(cors(corsOptions));

const OpenApiValidator = require('express-openapi-validator').OpenApiValidator;

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.simple(),
  meta: true, // optional: control whether you want to log the meta data about the request (default to true)
  msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
  expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  // ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
}));

new OpenApiValidator({
    apiSpec: './openapi.yaml',
    validateRequests: true, // (default)
    validateResponses: true, // false by default
  }).install(app)
  .then(() => {

    app.use('/api/v1/', apiRouter);

    app.use((error, req, res, next) => {

      const errorStatus = error.response ? error.response.status : error.status;
      const errorObject = {
        'error': {
          'status': errorStatus,
          'statusText': httpStatus[errorStatus],
          'message': error.message,
          'errors': error.errors
        }
      };

      // format error
      res.status(errorStatus || 500).json(errorObject);

    });

  });

module.exports = app;