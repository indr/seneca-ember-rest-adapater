const assert = require('chai').assert;
const simple = require('simple-mock');

const SenecaMock = require('../SenecaMock');

const translator = require('../../../lib/translator');

describe('Unit | translator', function () {
  var sut,
    seneca = new SenecaMock();

  beforeEach(function () {
    sut = translator('foos');
  });


  it('sets args.name', function () {
    const args = {
      name: 'foo'
    };

    sut.call(seneca, args);

    assert.equal(args.name, 'foos');
  });

  it('acts with the same args and callback', function () {
    const args = {};
    const cb = function () {};
    const act = simple.mock(seneca, 'act');

    sut.call(seneca, args, cb);

    assert(act.called);
    assert.equal(act.lastCall.args[0], args);
    assert.equal(act.lastCall.args[1], cb);
  });
});