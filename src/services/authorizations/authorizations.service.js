// Initializes the `relationships` service on path `/relationships`
const createService = require('./authorizations.class.js');
const hooks = require('./authorizations.hooks');
const filters = require('./authorizations.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'authorizations',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/authorizations', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('authorizations');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
