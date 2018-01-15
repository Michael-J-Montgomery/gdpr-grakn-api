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

  get (id, params) {
    return new Promise((resolve, reject) => {
      const _id = parseInt(id);
      const query = `
        match $person isa person has identifier $id; 
        $id val ${_id};
        $sys isa system has value $name has icon $icon;
        $attr isa property has value $value;
        $auth isa authorization has description $description;
        ($person,$attr) isa belongs; 
        $rel($attr, $auth);
        ($auth, $sys) isa requires;
        get;
      `;

      this.graph.execute(query).then(res => {
        let result = JSON.parse(res).reduce((a, c) => {
          if(!a.person && _id === parseInt(c.id.value)) {
            a.person = {
              id: _id,
              gid: c.person.id
            };
          }
          if (a.properties.filter(e => e.name === c.attr.type.label).length > 0) {
            const index = _.findIndex(a.properties, i => i.name === c.attr.type.label);
            if(!a.properties[index].systems.filter(e => e.system === c.name.value).length > 0) {
              a.properties[index].systems.push(setSystem(c));
            }
            return a;
          }
          a.properties.push({
            value: c.value.value,
            name: c.attr.type.label,
            icon: c.icon.value,
            systems: [setSystem(c)]
          });
          return a;
        }, {properties: []});
        result.properties = _.sortBy(result.properties, i => i.name);
        resolve(result);
      });
    });
  }
}

function setSystem(obj) {
  return {
    system: obj.name.value,
    auth: obj.description.value,
    authId: obj.auth.id,
    rel: obj.rel.type.label,
    relId: obj.rel.id
  };
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
