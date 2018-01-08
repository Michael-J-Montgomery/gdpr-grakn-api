const errors = require('feathers-errors');
const GraknGraph = require('grakn');

/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
    this.graph =  new GraknGraph(options.grakn, options.keyspace);
  }

  find (params) {
    return Promise.resolve([]);
  }

  get (id, params) {
    return Promise.resolve({
      id, text: `A new message with ID: ${id}!`
    });
  }

  create (data, params) {
    return new Promise((resolve, reject) => { 
      if(Object.keys(data).length !== 3) {
        reject(new errors.BadRequest('Invalid object', data));
      }

      const er = data[`${params.query.type}er`];
      const ed = data[`${params.query.type}ed`];
      const edto = data[`${params.query.type}ed-to`];
      const r = er.type === 'person' ? `identifier ${er.data}` : `value "${er.data}"`;

      const query = `
        match 
        $a isa ${er.type}, has ${r}; 
        $b isa ${ed.type}, has value "${ed.data}"; 
        $c isa ${edto.type}, has value "${edto.data}"; 
        insert (importer:$a, imported:$b, imported-to:$c) isa import;
      `;

      this.graph.execute(query).then( res => {
        resolve(JSON.parse(res));
      }).catch(err => {
        reject(err.message);
      });
    });
  }

  update (id, data, params) {
    return Promise.resolve(data);
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
