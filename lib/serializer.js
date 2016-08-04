'use strict';

const _ = require('lodash');

module.exports = function serializer(done, kind) {
  return function serialize(err, result) {
    if (err) return done(err, result);

    console.log('Serializing ' + kind);
    var out = {};
    if (_.isArray(result)) {
      console.log('Wrapping root object ' + kind);
      out[kind] = result;
    }
    else {
      console.log('Wrapping root object ' + kind);
      out[kind] = result;
    }

    done(null, out);
  }
};
