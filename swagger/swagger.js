'use strict';

const path = require('path');
const pkg = require('../package.json');

const uiIndex = path.join(__dirname, 'docs.html');


module.exports = {
  docsPath: '/docs',
  uiIndex,
  version: pkg.version,
  schemes: process.env.NODE_ENV === 'production' ? ['https'] : ['http'],
  info: {
    title: pkg.name,
    description: pkg.description,
    contact:{email:'webmaster@ersnet.org'}
  },
  securityDefinitions: {
    bearer: {
      type: 'apiKey',
      name: 'authorization',
      in: 'header'
    }
  },
  security: [
    {
      bearer: []
    }
  ]
};