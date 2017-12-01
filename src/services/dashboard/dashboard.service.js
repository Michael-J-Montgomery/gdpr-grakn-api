// Initializes the `dashboard` service on path `/dashboard`
const createService = require('./dashboard.class.js');
const hooks = require('./dashboard.hooks');
const filters = require('./dashboard.filters');

const def = require('../../../swagger/dashboard');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'dashboard',
    grakn: app.get('grakn'),
    keyspace: app.get('keyspace'),
    paginate,
  };

  // Initialize our service with any options it requires
  app.use('/dashboard', Object.assign(createService(options), {
    docs: def
  }));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('dashboard');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
