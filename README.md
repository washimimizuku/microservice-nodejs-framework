# README #

This project exists to serve as a framework for Node.js micro services.

## How do I get set up? ##

### Installation

To install the project, you need Node.js and Npm installed. Once you have them, just run the following command:

```
npm install
```

### Setup

If you don't have an Auth0 account, create one: https://auth0.com/

Create .env file with the port we want to use, as well as the auth0 necessary configurations.

```
PORT=PORT
AUTH0_AUDIENCE=AUTH0_AUDIENCE
AUTH0_DOMAIN=AUTH0_DOMAIN
AUTH0_CLIENT_ID=AUTH0_CLIENT_ID
AUTH0_CLIENT_SECRET=AUTH0_CLIENT_SECRET
```

For more information on Auth0, go to https://auth0.com/docs/

### Execution

#### Production

In production the project can be launched with any of the following commands:

```
npm start
bash exec.sh
docker-compose up
```

npm start launches it as a node.js proccess, while the other two launches it with docker.

#### Development

```
npm run dev
nodemon DEBUG=microservice-nodejs-framework:* ./bin/www
```

#### Testing

For tests with coverage, just use one of the two commands:

```
npm test
jest --coverage
```

The coverage report can then be accessed on the browser with the following path (replace {INSTALL_PATH} with the location of the proejct folder):

```
file:///{INSTALL_PATH}/microservice-nodejs-framework/coverage/lcov-report/index.html
```

For tests without coverage, you can simply run jest:

```
jest
```

More information can be found here: https://jestjs.io/docs/en/getting-started

## Contribution guidelines ##

Contact <nbarreto@gmail.com>.

## Who do I talk to? ##

Nuno Barreto <nbarreto@gmail.com>.