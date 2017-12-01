const GraknGraph = require('grakn');

/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
    this.graph =  new GraknGraph(options.grakn, options.keyspace);
  }

  update (id, data, params) {
    // revoke a property
    return new Promise((resolve, reject) => {
      let query = '';
      if(data.type === 'revoke') {
        query = `        
          match $p id ${data.relId};
          (demand:$a, needed:$b);
          $b id ${data.authId};
          $a has value "${data.property}";
          insert (revoker:$a, revoked:$b) isa revoke;
        `;
      }
      if(data.type === 'needs') {
        query = `        
          match $p id ${data.relId};
          (revoker:$a, revoked:$b);
          $b id ${data.authId};
          $a has value "${data.property}";
          insert (demand:$a, needed:$b) isa needs;
        `;
      }

      const delQuery = `
      match $rel id ${data.relId}; 
      delete $rel;`;
  
      this.graph.execute(query).then( res => {
        this.graph.execute(delQuery)
          .then(res => {
            resolve(res);
          })
          .catch(err =>{
            reject(err.message);
          });
      }).catch(err => {
        reject(err.message);
      });
    });
  }

  patch (id, data, params) {
    return Promise.resolve(data);
  }

  remove (id, params) {
    return Promise.resolve({ id });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
