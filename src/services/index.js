const users = require('./users/users.service.js');
const dashboard = require('./dashboard/dashboard.service.js');
const authorizations = require('./authorizations/authorizations.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(users);
  app.configure(dashboard);
  app.configure(authorizations);
};
