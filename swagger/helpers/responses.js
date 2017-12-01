module.exports = {
  notFound: {
    description: 'not found - it aslo returns an empty data array ',
    schema: {
      type: 'object',
      properties: {
        data: {type: 'array', items: {}},
        message: {type: 'string'},
        status: {
          type: 'string',
          enum: [404]
        }
      }
    }
  },
  invalidLogin: {
    description: 'Invalid login',
    schema: {
      type: 'object',
      properties:{
        name: {type: 'string'},
        message: {type: 'string'},
        code: {
          type: 'string',
          enum: [401]
        },
        className: {type: 'string'},
        errors: {}
      }
    }
  },
  success: {
    description: 'successful operation',
    schema: {
      type: 'object',
      example: {
        data: [],
        category: [],
      }   
    }
  },
  successProperties: {
    description: 'successful opration',
    schema: {
      type: 'object',
      example: {
        properties: [
          {
            value: 'string',
            name: 'string',
            icon: 'string',
            systems: [
              {
                system: 'string',
                auth: 'string',
                authId: 'sting (GRAKN System ID)',
                rel: 'string',
                relId: 'sting (GRAKN System ID)'
              }
            ]
          }
        ],
        person: {
          id: 'int',
          gid: 'sting (GRAKN System ID)'
        }
      }
    }
  },
  successUserCreated: {
    description: 'sucessful operation',
    schema: {
      type: 'object',
      example: {
        email: 'string',
        permissions: 'string',
        _id: 'string'
      }
    }
  }, 
  conflict: {
    description: 'Conflict when creating the user',
    schema: {
      type: 'object',
      properties:{
        name: {type: 'string'},
        message: {type: 'string'},
        code: {
          type: 'string',
          enum: [409]
        },
        className: {type: 'string'},
        errors: {}
      }
    }
  }
};