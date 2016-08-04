'use strict';

const _ = require('lodash');

const normalize = require('./lib/normalize');
const serializer = require('./lib/serializer');
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

    for (const to in options.alias) {
      if (!options.alias.hasOwnProperty(to))
        continue;

      const from = _.isArray(options.alias[to]) ? options.alias[to] : [options.alias[to]];

      from.forEach(function (eachFrom) {
        _addAlias(seneca, eachFrom, to);
      });
    }

    seneca.ready(function (err) {
      if (err) return;

      const pattern = 'role:jsonrest-api,method:*';
      console.log('Adding wrapper ' + pattern);
      seneca.wrap(pattern, function (args, done) {
        const seneca = this;

        console.log('Intercepted ' + args.method + ' ' + args.prefix + '/' + args.kind);
        normalize(args);

        seneca.prior(args, serializer(done, args.kind));
      });
    });

    done();
  }

  function _addAlias(seneca, from, to) {
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
