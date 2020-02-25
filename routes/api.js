const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');

const checkJwt = jwt({
  // Dynamically provide a signing key based on the [Key ID](https://tools.ietf.org/html/rfc7515#section-4.1.4) header parameter ("kid") and the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

const checkScopes = jwtAuthz(['read:messages']);

/**
 * @description Ask for a new token.
 *
 * @route POST /api/v1/authenticate
 *
 * @example POST /api/v1/authenticate
 * {
 *   "client_id": "CLIENT_ID",
 *   "client_secret": "CLIENT_SECRET"
 * }
 *
 * @param {object} req Representation of the HTTP request received.
 * @param {object} res Representation of the HTTP response sent.
 * @param {function} next Callback.
 *
 * @returns {void}
 */
router.post('/authenticate', async function (req, res, next) {

  const client_id = req.body.client_id;
  const client_secret = req.body.client_secret;

  if (!client_id) {

    return next({
      'status': 400,
      'message': 'The body parameter client_id is mandatory.'
    });

  }

  if (!client_secret) {

    return next({
      'status': 400,
      'message': 'The body parameter client_secret is mandatory.'
    });

  }

  try {

    const result = await axios.post('https://dev-u399twkx.eu.auth0.com/oauth/token', {
      'grant_type': 'client_credentials',
      'client_id': client_id,
      'client_secret': client_secret,
      'audience': 'https://queen-api.sunflower-labs.com'
    }, {
      'headers': {
        'content-type': 'application/json'
      }
    });

    return res.json({
      'token': {
        'access_token': result.data.access_token,
        'token_type': result.data.token_type,
        'scope': result.data.scope,
        'expires_in': result.data.expires_in
      }
    });

  } catch (error) {

    return next(error);

  }

});

/**
 * @description Create new log entry.
 *
 * @route POST /api/v1/logs
 * @header Authorization: Bearer {token}
 *
 * @example POST /api/v1/logs
 * {
 *   "timestamp": 1582629861,
 *   "tags": ["tag1", "tag2"],
 *   "data": {
 *     "everything": "is possible"
 *   }
 * }
 * 
 * @param {object} req Representation of the HTTP request received.
 * @param {object} res Representation of the HTTP response sent.
 *
 * @returns {void}
 */
router.post('/logs', checkJwt, checkScopes, function (req, res, next) {

  res.json({
    message: 'POST /api/v1/logs'
  });

});

/**
 * @description Get log entry by id.
 *
 * @route GET /api/v1/logs/{id}
 * @header Authorization: Bearer {token}
 *
 * @example GET /api/v1/logs/123
 * 
 * @param {object} req Representation of the HTTP request received.
 * @param {object} res Representation of the HTTP response sent.
 *
 * @returns {void}
 */
router.get('/logs/:id', checkJwt, checkScopes, function (req, res, next) {

  res.json({
    message: 'GET /api/v1/logs/:id'
  });

});

/**
 * @description Get list of log entries.
 *
 * @route GET /api/v1/logs/{quantity}/{offset}?order={order}&order={order}&level={level}&tags=[{tag}]&start={start}&end={end}
 * @header Authorization: Bearer {token}
 *
 * @example GET /api/v1/logs/100/0?order=timestamp&order=desc&level=debug&tags=['honeycomb','sunflowers']&start=1582633163&end=1582633163
 * 
 * @param {object} req Representation of the HTTP request received.
 * @param {object} res Representation of the HTTP response sent.
 *
 * @returns {void}
 */
router.get('/logs/:id', checkJwt, checkScopes, function (req, res, next) {

  res.json({
    message: 'GET /api/v1/logs/:id'
  });

});

module.exports = router;