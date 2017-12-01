const params = require('./helpers/parameters');
const responses = require('./helpers/responses');

module.exports = {
  description: 'Dashboard Service',
  get: {
    description: 'Returns all the data of a user to generate a dashboard', 
    summary: 'Get a dashboard',
    parameters: [
      params.id
    ],
    responses: {
      '200': responses.successProperties,
      '404': responses.notFound,
      '401': responses.invalidLogin
    },    
    produces: ['application/json']
  }
};