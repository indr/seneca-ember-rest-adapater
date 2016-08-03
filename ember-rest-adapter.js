'use strict';

const _ = require('lodash');

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

      from.forEach(function (each) {
        _addAlias(seneca, each, to);
      });
    }

    seneca.ready(function (err) {
      if (err) return;

      const pattern = 'role:jsonrest-api,method:*';
      console.log('Adding wrapper ' + pattern);
      seneca.wrap(pattern, function (args, done) {
        const seneca = this;
        seneca.prior(args, done);

        // const seneca = this;
        //
        // console.log('Intercepted ' + args.method + ' ' + args.prefix + '/' + args.kind);
        //
        // if (args.method !== 'get') {
        //   console.log('Normalizing ' + args.method + ' for name ' + args.name + ' / kind ' + args.kind);
        //
        //   if (args.data && Object.keys(args.data).length === 1 && args.data.hasOwnProperty(args.name)) {
        //     console.log('Unwrapping root object ' + args.name);
        //     args.data = args.data[args.name]
        //   }
        // }
        //
        // seneca.prior(args, _serialize(done, args.kind));
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

  // function _serialize(done, kind) {
  //   return function (err, result) {
  //     if (err) return done(err, result);
  //
  //     console.log('Serializing ' + kind);
  //     var out = {};
  //     if (_.isArray(result)) {
  //       console.log('Wrapping root object ' + kind);
  //       out[kind] = result;
  //     } else {
  //       console.log('Wrapping root object ' + kind);
  //       out[kind] = result;
  //     }
  //
  //     done(err, out);
  //   }
  // }

  return {
    plugin: plugin
  }
};
