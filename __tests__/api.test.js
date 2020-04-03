const request = require('supertest');

describe('API', () => {

  var app;
  var token;
  const expiredToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImFUU2hGQnhEd0ttbUhfYnphY0cxbSJ9.eyJpc3MiOiJodHRwczovL2Rldi0teTBqbzRnOS5ldS5hdXRoMC5jb20vIiwic3ViIjoiOGZUMmhnWnlNV2xsYm5pY1FlZzJWYzFIZ3JOSjhPd29AY2xpZW50cyIsImF1ZCI6Imh0dHA6Ly93YXNoaW1pbWl6dWt1LmdpdGh1Yi5pby8iLCJpYXQiOjE1ODU5MTExOTEsImV4cCI6MTU4NTk5NzU5MSwiYXpwIjoiOGZUMmhnWnlNV2xsYm5pY1FlZzJWYzFIZ3JOSjhPd28iLCJzY29wZSI6InJlYWQgd3JpdGUiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMifQ.tMBOErvsnztUt6tIJwIaVVEmpL0rHTiZD9dTVHJ0MWuh0RtpM1o8fmeQNPw0lmQEpMwSq-i_pB9OcEzK-wQ0L531FjgULmltzp65Wa59asML44x0XHL-zOosPWO5V1R1Qddhmg7_lurNdF2YDwcOvQHn-9AeK155bypSDZOPpJ0L8FHk8qhyQPRTtpl00beGltNXKAEw1Gyh6a9p6gqID5QRGF1IWOKTB73d-Ok_bUj1L4OfNYJ4NikH-BOhfhjFA4uVXFOge3aARpYxwEJ_x8J7CqaE3PRjPYJQCJ5ITKCnVzzSxdPNJAQ08inmf1bglFPABGyOBVltb6I8VVHMAA';
  const invalidToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6I12345GQnhEd0ttbUhfYnphY0cxbSJ9.eyJpc3MiOiJodHRwczovL2Rldi0teTBqbzRnOS5ldS5hdXRoMC5jb20vIiwic3ViIjoiOGZUMmhnWnlNV2xsYm5pY1FlZzJWYzFIZ3JOSjhPd29AY2xpZW50cyIsImF1ZCI6Imh0dHA6Ly93YXNoaW1pbWl6dWt1LmdpdGh1Yi5pby8iLCJpYXQiOjE1ODU5MTExOTEsImV4cCI6MTU4NTk5NzU5MSwiYXpwIjoiOGZUMmhnWnlNV2xsYm5pY1FlZzJWYzFIZ3JOSjhPd28iLCJzY29wZSI6InJlYWQgd3JpdGUiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMifQ.tMBOErvsnztUt6tIJwIaVVEmpL0rHTiZD9dTVHJ0MWuh0RtpM1o8fmeQNPw0lmQEpMwSq-i_pB9OcEzK-wQ0L531FjgULmltzp65Wa59asML44x0XHL-zOosPWO5V1R1Qddhmg7_lurNdF2YDwcOvQHn-9AeK155bypSDZOPpJ0L8FHk8qhyQPRTtpl00beGltNXKAEw1Gyh6a9p6gqID5QRGF1IWOKTB73d-Ok_bUj1L4OfNYJ4NikH-BOhfhjFA4uVXFOge3aARpYxwEJ_x8J7CqaE3PRjPYJQCJ5ITKCnVzzSxdPNJAQ08inmf1bglFPABGyOBVltb6I8VVHMAA';

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

          expect(res.body.token.access_token).toContain('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImFUU2hG');
          expect(res.body.token.token_type).toBe('Bearer');
          expect(res.body.token.scope).toBe('read write');
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

  describe('__MICROSERVICE_NAME__', () => {

    test('With valid authorization token it should work.', async (done) => {

      request(app)
        .post('/api/v1/example/')
        .send({
          'message': 'This is an example.'
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function (err, res) {

          if (err) throw err;

          expect(res.body.status).toBe('Successfully created.');
          expect(res.body.message).toBe('This is an example.');

          done();

        });

    });

    test('When given an empty message it should give an error.', async (done) => {

      request(app)
        .post('/api/v1/example/')
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

    test('With malformed authorization token it should give an error.', async (done) => {

      request(app)
        .post('/api/v1/example/')
        .send({
          'message': 'This is an example.'
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

    test('With expired authorization token it should give an error.', async (done) => {

      request(app)
        .post('/api/v1/example/')
        .send({
          'message': 'This is an example.'
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

    test('With invalid authorization token it should give an error.', async (done) => {

      request(app)
        .post('/api/v1/example/')
        .send({
          'message': 'This is an example.'
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + invalidToken)
        .expect('Content-Type', /json/)
        .expect(401)
        .end(function (err, res) {

          if (err) throw err;

          expect(res.body.error.message).toBe('invalid token');

          done();

        });

    });

  });

});