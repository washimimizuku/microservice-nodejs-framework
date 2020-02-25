const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');
const httpStatus = require('http_status_codes');

// Load .env variables.
require('dotenv').config();

if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_AUDIENCE) {
  throw 'Make sure you have AUTH0_DOMAIN, and AUTH0_AUDIENCE in your .env file';
}

const apiRouter = require('./routes/api');

const app = express();

const corsOptions =  {
  origin: 'http://localhost'
};
app.use(cors(corsOptions));

const OpenApiValidator = require('express-openapi-validator').OpenApiValidator;

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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
