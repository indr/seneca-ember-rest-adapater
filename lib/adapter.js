'use strict';

const normalize = require('./normalize');
const serializer = require('./serializer');

module.exports = function adapter(args, done) {
  const seneca = this;

  console.log('Intercepted ' + args.method + ' ' + args.prefix + '/' + args.kind);
  normalize(args);

  seneca.prior(args, serializer(done, args.kind));
};