const GraknGraph = require('grakn');
const _ = require('lodash');

/* eslint-disable no-unused-vars */
class Service {

  constructor (options) {
    this.options = options || {};
    this.graph =  new GraknGraph(options.grakn, options.keyspace);
  }

  setup(app) {
    this.app = app;
  }

  // find (params) {
    
  //   return new Promise((resolve, reject) => {
  //     this.graph.execute(`
  //       match $p isa person;
  //       $e isa last-name has value "MemberLName"; 
  //       $s isa system;
  //       $a isa attributes; 
  //       ($p, $e) isa belongs;
  //       ($p,$a) isa belongs; 
  //       ($a, $s) isa authorizes; get;
  //     `).then(res => {
  //       resolve(JSON.parse(res));
  //     });
  //   });
  // }

  get (id, params) {
    return new Promise((resolve, reject) => {
      const _id = parseInt(id);

      this.graph.execute(`
        match $person isa person has identifier $id; 
        $id val ${_id};
        $sys isa system has value $name has icon $icon;
        $attr isa attributes has value $value;
        $auth isa authorization has description $description;
        ($person,$attr) isa belongs; 
        $rel($attr, $auth) isa $type;
        ($auth, $sys) isa requires;
        get;
      `).then(res => {
        let result = JSON.parse(res).reduce((a, c, i) => {
          if(!a.person && _id === c.id.value) {
            a.person = {
              id: _id,
              gid: c.person.id
            };
          }
          if (a.properties.filter(e => e.name === c.attr.isa).length > 0) {
            const index = _.findIndex(a.properties, i => i.name === c.attr.isa);
            if(!a.properties[index].systems.filter(e => e.system === c.name.value).length > 0) {
              a.properties[index].systems.push({
                system: c.name.value,
                auth: c.description.value,
                authId: c.auth.id,
                rel: c.rel.isa,
                relId: c.rel.id
              });
            }
            return a;
          }
          a.properties.push({
            value: c.value.value,
            name: c.attr.isa,
            icon: c.icon.value,
            systems: [{
              system: c.name.value,
              auth: c.description.value,
              authId: c.auth.id,
              rel: c.rel.isa,
              relId: c.rel.id
            }]
          });
          return a;
        }, {properties: []});
        result.properties = _.sortBy(result.properties, i => i.name);
        resolve(result);
      });
    });
  }

  create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current)));
    }

    return Promise.resolve(data);
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
