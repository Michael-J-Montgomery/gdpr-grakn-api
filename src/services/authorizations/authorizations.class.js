const errors = require('feathers-errors');
const GraknGraph = require('grakn');

/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
    this.graph =  new GraknGraph(options.grakn, options.keyspace);
  }

  create (data, params) {
    return new Promise((resolve, reject) => { 
      if(Object.keys(data).length !== 2) {
        reject(new errors.BadRequest('Invalid object', data));
      }

      let properties = [];
      let auth = [];
      let insert = [];

      data.authorizations.map((c, i) => {
        const a = `$a${i}`;
        auth.push(a + ` isa authorization, has name "${c.name}"; `);
        c.properties.map(c => {
          const prop = `$p${i + c}`;
          properties.push(`${prop} isa ${c}; ($p, ${prop}) isa belongs; `);
          insert.push(`(demand: ${prop}, needed: ${a}) isa needs; `);
        });
      });


      const query = `
      match $p isa person, has identifier ${data.personId}; 
        ${auth.join('')}
        ${properties.join('')}
      insert 
        ${insert.join('')}
      `;

      this.graph.execute(query).then( res => {
        resolve({
          status: 200,
          message: 'Authorizations have been inserted',
          data: JSON.parse(res)
        });
      }).catch(err => {
        reject(err.message);
      });
    });
  }

  get (sys, params) {
    return new Promise((resolve, reject) => {
      const query = `
        match
          $a isa system, has value "${sys}";
          ($a, $b) isa requires;
          $b isa authorization has description $description, has name $name;
          ($b, $c);
          $c isa property; 
        get $description, $name, $c;
      `;
      this.graph.execute(query)
        .then( res => {
          const result = JSON.parse(res)
            .reduce((a, c) => {
              if(!a[c.name.value]) {
                a[c.name.value] = {
                  properties: [{
                    property:c.c.type.label, 
                    description: c.description.value}]
                };
              }

              if(!a[c.name.value].properties.filter(e => e.property === c.c.type.label).length > 0) {
                a[c.name.value].properties.push({
                  property:c.c.type.label, 
                  description: c.description.value
                });
              }
              return a;
            }, {});
          resolve(result);
        })
        .catch(err => {
          reject(err.message);
        });
    });
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
