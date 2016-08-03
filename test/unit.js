const assert = require('chai').assert;
const simple = require('simple-mock');
const Common = require('seneca/lib/common');

const Plugin = require('../ember-rest-adapter');

function SenecaMock() {
  this.util = {
    deepextend: Common.deepextend
  };
  this.ready = function () {
  }
}

describe('Unit | Plugin creation', function () {
  var plugin,
    seneca = new SenecaMock(),
    add;

  before(function (done) {
    add = simple.mock(seneca, 'add');
    done();
  });

  beforeEach(function (done) {
    plugin = Plugin.call(seneca);
    done();
  });

  it('should set plugin name', function (done) {
    assert.equal(plugin.plugin, 'ember-rest-adapter');
    done();
  });

  it('should subscribe to pattern init:ember-rest-adapter', function (done) {
    assert.ok(add.called);
    const args = add.calls[0].args;
    assert.deepEqual(args[0], {init: 'ember-rest-adapter'});
    assert.isFunction(args[1]);
    done();
  });
});

describe('Unit | Plugin initialization', function () {
  var plugin,
    seneca = new SenecaMock(),
    init;

  before(function (done) {
    add = simple.mock(seneca, 'add');
    done();
  });

  beforeEach(function (done) {
    plugin = Plugin.call(seneca);
    init = add.calls[0].args[1];
    done();
  });

  it('should call callback', function (done) {
    init.call(seneca, {}, done);
  });
});
