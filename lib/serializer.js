'use strict';

const _ = require('lodash');
const Seneca = require('seneca');

module.exports = function serializer(done, kind) {
  return function serialize(err, result) {
    if (err) return done(err, result);

    console.log('Serializing ' + kind);
    var out = {};
    if (_.isArray(result)) {
      console.log('Wrapping root object ' + kind);
      out[kind] = _.map(result, Seneca.util.clean);
    }
    else {
      console.log('Wrapping root object ' + kind);
      out[kind] = Seneca.util.clean(result);
    }

    done(null, out);
  }
};
