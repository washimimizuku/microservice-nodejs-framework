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

/* GET home page. */
router.get('/', checkJwt, checkScopes, function(req, res, next) {
  res.json({
    message: 'Hello'
  });
});

/* POST get token */
router.post('/authenticate', async function(req, res, next) {

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

module.exports = router;
