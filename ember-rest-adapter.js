'use strict';

const _ = require('lodash');

const adapter = require('./lib/adapter');
const translator = require('./lib/translator');

const plugin = 'ember-rest-adapter';

const default_options = {
  alias: {}
};

module.exports = function (options) {
  const seneca = this;

  options = seneca.util.deepextend(default_options, options);

  seneca.add({init: plugin}, init_plugin);

  function init_plugin(args, done) {
    console.log('Initializing plugin ' + plugin);
    const seneca = this;

    createAliases(options.alias);

    seneca.ready(function (err) {
      if (err) return;

      const pattern = 'role:jsonrest-api,method:*';
      console.log('Adding wrapper for ' + pattern);
      seneca.wrap(pattern, adapter);
    });

    done();
  }

  function createAliases(aliases) {
    for (const to in aliases) {
      if (!aliases.hasOwnProperty(to))
        continue;

      const from = _.isArray(aliases[to]) ? aliases[to] : [aliases[to]];

      from.forEach(function (eachFrom) {
        createAlias(seneca, eachFrom, to);
      });
    }
  }

  function createAlias(seneca, from, to) {
    if (to === from) {
      console.log('Ignoring alias ' + from + ' => ' + to);
      return;
    }

    var pattern = {role: 'jsonrest-api', name: from, kind: from};
    console.log('Adding alias ' + from + ' => ' + to);
    console.log('     pattern', seneca.util.pattern(pattern));
    seneca.add(pattern, translator(to));
  }

  return {
    plugin: plugin
  }
};
