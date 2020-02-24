const request = require('supertest');

describe('API', () => {

  var app;

  beforeAll(function () {

    app = require('../app');

  });

  afterAll(function () {

    app.close();

  });

  describe('Authenticate', () => {

    test('When given correct client_id and client_secret, it should return valid token', async (done) => {

      request(app)
        .post('/api/v1/authenticate/')
        .send({
          'client_id': process.env.AUTH0_CLIENT_ID,
          'client_secret': process.env.AUTH0_CLIENT_SECRET
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {

          if (err) throw err;
          
          expect(res.body.token.access_token).toContain('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlFVVkVSamczTkRNME1VVXhOa1V6TlRrMk5UWkROekZGT1VNd1FUVTVNMEZDTkVVNVFVVXdSUSJ9');
          expect(res.body.token.token_type).toBe('Bearer');
          expect(res.body.token.scope).toBe('read:messages');
          expect(res.body.token.expires_in).toBe(86400);
          
          done();
        
        });

    });

    test('When given no client_id and client_secret, it should return an error', async (done) => {

      request(app)
        .post('/api/v1/authenticate/')
        .send({})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .end(function(err, res) {

          if (err) throw err;
          
          expect(res.body.error.status).toBe(400);
          expect(res.body.error.statusText).toBe('Bad Request');
          expect(res.body.error.message).toBe('The body parameter client_id is mandatory.');
          
          done();
        
        });

    });

    test('When given correct client_id and no client_secret, it should return an error', async (done) => {

      request(app)
        .post('/api/v1/authenticate/')
        .send({
          'client_id': process.env.AUTH0_CLIENT_ID
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .end(function(err, res) {

          if (err) throw err;
          
          expect(res.body.error.status).toBe(400);
          expect(res.body.error.statusText).toBe('Bad Request');
          expect(res.body.error.message).toBe('The body parameter client_secret is mandatory.');
          
          done();
        
        });

    });

    test('When given invalid client_id and client_secret, it should return an error', async (done) => {

      request(app)
        .post('/api/v1/authenticate/')
        .send({
          'client_id': 'UNKOWN_CLIENT_ID',
          'client_secret': 'UNKOWN_CLIENT_SECRET'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(401)
        .end(function(err, res) {

          if (err) throw err;
          
          expect(res.body.error.status).toBe(401);
          expect(res.body.error.statusText).toBe('Unauthorized');
          expect(res.body.error.message).toBe('Request failed with status code 401.');
          
          done();
        
        });

    });

  });

});