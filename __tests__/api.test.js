const request = require('supertest');

describe('API', () => {

  var app;
  var token;
  const expiredToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlFVVkVSamczTkRNME1VVXhOa1V6TlRrMk5UWkROekZGT1VNd1FUVTVNMEZDTkVVNVFVVXdSUSJ9.eyJpc3MiOiJodHRwczovL2Rldi11Mzk5dHdreC5ldS5hdXRoMC5jb20vIiwic3ViIjoiMndPVjQzMHR3UlJCVmptS1RsYnNwaGpHV1FlTjZldU1AY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vcXVlZW4tYXBpLnN1bmZsb3dlci1sYWJzLmNvbSIsImlhdCI6MTU4MjIxMjMzNywiZXhwIjoxNTgyMjk4NzM3LCJhenAiOiIyd09WNDMwdHdSUkJWam1LVGxic3BoakdXUWVONmV1TSIsInNjb3BlIjoicmVhZDptZXNzYWdlcyIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.BdOJv1NjZ6UeEEUdt4Su4j2_k9Icegq5PzYmPKc991Xm6KHlGBQ659MZpgQ1kaPEvT_pp7UcaRDNo4sfUxbXcezJ06hELhI-ZgplLxPP6hsNi7fVMNJ23fokcFVMZ6Med6gvpBlGUe1EZIlT8EO9M_A766uvpbXiXXn9iADM3pIRW8G-E5PUHI7adTgEUyIVjDaBjtCoIudV_ZA8ILDnveBw01kGJxtmLudykZybV4cNPv4bxrEvl8VQEAyvEmzSVIsQ8gzVbOayYgTab6XIaVJ7yYnYabQtU7851EU1sPgaRM_CXgfMXnlWUwPTbW3PICQG7ppiZALWnaf_jGYYwQ';
  const invalidToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlFVVkVSamczTkRNME1VVXhOa1V6TlRrMk5UWkROekZGT1VNd1FUVTVNMEZDTkVVNVFVVXdSUSJ9.eyJpc3MiOiJodHRwczovL2Rldi11Mzk5dHdreC5ldS5hdXRoMC5jb20vIiwic3ViIjoiMndPVjQzMHR3UlJCVmptS1RsYnNwaGpHV1FlTjZldU1AY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vcXVlZW4tYXBpLnN1bmZsb3dlci1sYWJzLmNvbSIsImlhdCI6MTU5MjIxMjMzNywiZXhwIjoxNTgyMjk4NzM3LCJhenAiOiIyd09WNDMwdHdSUkJWam1LVGxic3BoakdXUWVONmV1TSIsInNjb3BlIjoicmVhZDptZXNzYWdlcyIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.BdOJv1NjZ6UeEEUdt4Su4j2_k9Icegq5PzYmPKc991Xm6KHlGBQ659MZpgQ1kaPEvT_pp7UcaRDNo4sfUxbXcezJ06hELhI-ZgplLxPP6hsNi7fVMNJ23fokcFVMZ6Med6gvpBlGUe1EZIlT8EO9M_A766uvpbXiXXn9iADM3pIRW8G-E5PUHI7adTgEUyIVjDaBjtCoIudV_ZA8ILDnveBw01kGJxtmLudykZybV4cNPv4bxrEvl8VQEAyvEmzSVIsQ8gzVbOayYgTab6XIaVJ7yYnYabQtU7851EU1sPgaRM_CXgfMXnlWUwPTbW3PICQG7ppiZALWnaf_jGYYwQ';

  beforeAll(function () {

    app = require('../app');

  });

  afterAll(function () {

    app.close();

  });

  describe('Authenticate', () => {

    test('When given correct client_id and client_secret, it should return valid token.', async (done) => {

      request(app)
        .post('/api/v1/authenticate/')
        .send({
          'client_id': process.env.AUTH0_CLIENT_ID,
          'client_secret': process.env.AUTH0_CLIENT_SECRET
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {

          if (err) throw err;

          expect(res.body.token.access_token).toContain('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlFVVkVS');
          expect(res.body.token.token_type).toBe('Bearer');
          expect(res.body.token.scope).toBe('read:messages');
          expect(res.body.token.expires_in).toBe(86400);

          token = res.body.token.access_token;

          done();

        });

    });

    test('When given no client_id and client_secret, it should return an error.', async (done) => {

      request(app)
        .post('/api/v1/authenticate/')
        .send({})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .end(function (err, res) {

          if (err) throw err;

          expect(res.body.error.status).toBe(400);
          expect(res.body.error.statusText).toBe('Bad Request');
          expect(res.body.error.message).toBe('The body parameter client_id is mandatory.');

          done();

        });

    });

    test('When given correct client_id and no client_secret, it should return an error.', async (done) => {

      request(app)
        .post('/api/v1/authenticate/')
        .send({
          'client_id': process.env.AUTH0_CLIENT_ID
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .end(function (err, res) {

          if (err) throw err;

          expect(res.body.error.status).toBe(400);
          expect(res.body.error.statusText).toBe('Bad Request');
          expect(res.body.error.message).toBe('The body parameter client_secret is mandatory.');

          done();

        });

    });

    test('When given invalid client_id and client_secret, it should return an error.', async (done) => {

      request(app)
        .post('/api/v1/authenticate/')
        .send({
          'client_id': 'UNKOWN_CLIENT_ID',
          'client_secret': 'UNKOWN_CLIENT_SECRET'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(401)
        .end(function (err, res) {

          if (err) throw err;

          expect(res.body.error.status).toBe(401);
          expect(res.body.error.statusText).toBe('Unauthorized');
          expect(res.body.error.message).toBe('Request failed with status code 401');

          done();

        });

    });

    test('When given wrong type for client_id and client_secret, it should return an error.', async (done) => {

      request(app)
        .post('/api/v1/authenticate/')
        .send({
          'client_id': ['UNKOWN_CLIENT_ID'],
          'client_secret': ['UNKOWN_CLIENT_SECRET']
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .end(function (err, res) {

          if (err) throw err;

          expect(res.body.error.status).toBe(400);
          expect(res.body.error.statusText).toBe('Bad Request');
          expect(res.body.error.message).toBe('request.body.client_id should be string, request.body.client_secret should be string');

          done();

        });

    });

  });

  describe('Log', () => {

    test('When given a correct debug message with valid authorization token it should work.', async (done) => {

      request(app)
        .post('/api/v1/log/')
        .send({
          'level': 'debug',
          'message': {
            'everything': 'is possible'
          }
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function (err, res) {

          if (err) throw err;

          expect(res.body.message).toBe('Log message successfully created.');
          expect(res.body.log.level).toBe('debug');
          expect(res.body.log.message.everything).toBe('is possible');

          done();

        });

    });

    test('When given a correct info message with valid authorization token it should work.', async (done) => {

      request(app)
        .post('/api/v1/log/')
        .send({
          'level': 'info',
          'message': {
            'everything': 'is possible'
          }
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function (err, res) {

          if (err) throw err;

          expect(res.body.message).toBe('Log message successfully created.');
          expect(res.body.log.level).toBe('info');
          expect(res.body.log.message.everything).toBe('is possible');

          done();

        });

    });

    test('When given a correct notice message with valid authorization token it should work.', async (done) => {

      request(app)
        .post('/api/v1/log/')
        .send({
          'level': 'notice',
          'message': {
            'everything': 'is possible'
          }
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function (err, res) {

          if (err) throw err;

          expect(res.body.message).toBe('Log message successfully created.');
          expect(res.body.log.level).toBe('notice');
          expect(res.body.log.message.everything).toBe('is possible');

          done();

        });

    });

    test('When given a correct warning message with valid authorization token it should work.', async (done) => {

      request(app)
        .post('/api/v1/log/')
        .send({
          'level': 'warning',
          'message': {
            'everything': 'is possible'
          }
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function (err, res) {

          if (err) throw err;

          expect(res.body.message).toBe('Log message successfully created.');
          expect(res.body.log.level).toBe('warning');
          expect(res.body.log.message.everything).toBe('is possible');

          done();

        });

    });

    test('When given a correct error message with valid authorization token it should work.', async (done) => {

      request(app)
        .post('/api/v1/log/')
        .send({
          'level': 'error',
          'message': {
            'everything': 'is possible'
          }
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function (err, res) {

          if (err) throw err;

          expect(res.body.message).toBe('Log message successfully created.');
          expect(res.body.log.level).toBe('error');
          expect(res.body.log.message.everything).toBe('is possible');

          done();

        });

    });

    test('When given a correct crit message with valid authorization token it should work.', async (done) => {

      request(app)
        .post('/api/v1/log/')
        .send({
          'level': 'crit',
          'message': {
            'everything': 'is possible'
          }
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function (err, res) {

          if (err) throw err;

          expect(res.body.message).toBe('Log message successfully created.');
          expect(res.body.log.level).toBe('crit');
          expect(res.body.log.message.everything).toBe('is possible');

          done();

        });

    });

    test('When given a correct alert message with valid authorization token it should work.', async (done) => {

      request(app)
        .post('/api/v1/log/')
        .send({
          'level': 'alert',
          'message': {
            'everything': 'is possible'
          }
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function (err, res) {

          if (err) throw err;

          expect(res.body.message).toBe('Log message successfully created.');
          expect(res.body.log.level).toBe('alert');
          expect(res.body.log.message.everything).toBe('is possible');

          done();

        });

    });

    test('When given a correct emerg message with valid authorization token it should work.', async (done) => {

      request(app)
        .post('/api/v1/log/')
        .send({
          'level': 'emerg',
          'message': {
            'everything': 'is possible'
          }
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function (err, res) {

          if (err) throw err;

          expect(res.body.message).toBe('Log message successfully created.');
          expect(res.body.log.level).toBe('emerg');
          expect(res.body.log.message.everything).toBe('is possible');

          done();

        });

    });

    test('When given a correct message without level with valid authorization token it should work.', async (done) => {

      request(app)
        .post('/api/v1/log/')
        .send({
          'message': {
            'everything': 'is possible'
          }
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function (err, res) {

          if (err) throw err;

          expect(res.body.message).toBe('Log message successfully created.');
          expect(res.body.log.level).toBe('info');
          expect(res.body.log.message.everything).toBe('is possible');

          done();

        });

    });

    test('When given an empty body it should give an error.', async (done) => {

      request(app)
        .post('/api/v1/log/')
        .send({})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/)
        .expect(400)
        .end(function (err, res) {

          if (err) throw err;

          expect(res.body.error.errors[0].errorCode).toBe('required.openapi.validation');
          expect(res.body.error.message).toContain('request.body should have required property');

          done();

        });

    });

    test('When given an empty message it should give an error.', async (done) => {

      request(app)
        .post('/api/v1/log/')
        .send({
          'message': ''
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/)
        .expect(400)
        .end(function (err, res) {

          if (err) throw err;

          expect(res.body.error.message).toBe('The body parameter message is mandatory.');
          expect(res.body.error.status).toBe(400);
          expect(res.body.error.statusText).toBe('Bad Request');

          done();

        });

    });

    test('When given a correct message without level with malformed authorization token it should give an error.', async (done) => {

      request(app)
        .post('/api/v1/log/')
        .send({
          'message': {
            'everything': 'is possible'
          }
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer SOME_FAKE_TOKEN')
        .expect('Content-Type', /json/)
        .expect(401)
        .end(function (err, res) {

          if (err) throw err;

          expect(res.body.error.message).toBe('jwt malformed');

          done();

        });

    });

    test('When given a correct message without level with expired authorization token it should give an error.', async (done) => {

      request(app)
        .post('/api/v1/log/')
        .send({
          'message': {
            'everything': 'is possible'
          }
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + expiredToken)
        .expect('Content-Type', /json/)
        .expect(401)
        .end(function (err, res) {

          if (err) throw err;

          expect(res.body.error.message).toBe('jwt expired');

          done();

        });

    });

    test('When given a correct message without level with invalid authorization token it should give an error.', async (done) => {

      request(app)
        .post('/api/v1/log/')
        .send({
          'message': {
            'everything': 'is possible'
          }
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + invalidToken)
        .expect('Content-Type', /json/)
        .expect(401)
        .end(function (err, res) {

          if (err) throw err;

          expect(res.body.error.message).toBe('invalid signature');

          done();

        });

    });

  });

});