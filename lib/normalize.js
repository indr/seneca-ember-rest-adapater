'use strict';

module.exports = function normalize(args) {
  if (args.method === 'get')
    return;

  console.log('Normalizing ' + args.method + ' for name ' + args.name + ' / kind ' + args.kind);

  if (args.data && Object.keys(args.data).length === 1 && args.data.hasOwnProperty(args.name)) {
    console.log('Unwrapping root object ' + args.name);
    args.data = args.data[args.name]
  }
};
