const request = require('supertest');

describe('Index page', () => {

  var app;

  beforeAll(function () {

    app = require('../app');

  });

  afterAll(function () {

    app.close();

  });

  describe('Homepage', () => {

    test('Should exist', async (done) => {

      request(app)
        .get('/')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(/Welcome to __MICROSERVICE_NAME__/)
        .end(function (err, res) {

          if (err) throw err;

          expect(res.text).toContain('Welcome to __MICROSERVICE_NAME__');

          done();

        });

    });

  });

});