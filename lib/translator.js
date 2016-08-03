'use strict';

module.exports = function translator(to) {
  return function (args, done) {
    const seneca = this;

    console.log('Translating ' + args.prefix + '/' + args.name + ' => ' + args.prefix + '/' + to);
    args.name = to;

    seneca.act(args, done);
  }
};