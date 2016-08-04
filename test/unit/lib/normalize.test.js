const assert = require('chai').assert;

const normalize = require('../../../lib/normalize');

describe('Unit | normalize', function () {

  it('unwraps an array root object \'foos\'', function (done) {
    const foos = [{a: 'foo1'}, {a: 'foo2'}];
    const args = {
      name: 'foos',
      data: {'foos': foos}
    };
    normalize(args);

    assert.equal(args.data, foos);
    done();
  });

  it('unwraps an object root object \'foos\'', function (done) {
    const foo = {a: 'foo1'};
    const args = {
      name: 'foos',
      data: {'foos': foo}
    };
    normalize(args);

    assert.equal(args.data, foo);
    done();
  });

  it('does not unwrap if method is get', function (done) {
    const foos = [{a: 'foo1'}, {a: 'foo2'}];
    const args = {
      method: 'get',
      name: 'foos',
      data: {'foos': foos}
    };
    normalize(args);

    assert.equal(args.data.foos, foos);
    done();
  });
});