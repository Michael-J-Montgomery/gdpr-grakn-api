const { authenticate } = require('feathers-authentication').hooks;
const isOwner = require('../../hooks/isOwner').isOwner;


const restrict = [
  authenticate('jwt'),
  isOwner()
];

module.exports = {
  before: {
    all: [],
    find: [],
    get: [...restrict],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
