const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'node-express-mongoose-boilerplate API documentation',
    version,
    license: {
      name: 'MIT',
      url: 'https://webdevari@bitbucket.org/webdevari/node-boilerplate-es6.git',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
    },
    {
      url: `http://localhost:${config.port}/v1`,
    },
  ],
};

module.exports = swaggerDef;
