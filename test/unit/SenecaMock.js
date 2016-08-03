const _ = require('lodash');
const Common = require('seneca/lib/common');

module.exports = function SenecaMock() {
  this.act = function (args, done) {
    _.each(arguments, function (arg) {
      if (_.isFunction(arg)) {
        return arg()
      }
    })
  };
  this.util = {
    deepextend: Common.deepextend,
    pattern: Common.pattern
  };
};