const assert = require('chai').assert;
const simple = require('simple-mock');

const Plugin = require('../ember-rest-adapter');

describe('Unit | Plugin creation', function () {
  var plugin,
    seneca = {},
    add;

  function makeInstance(options) {
    return Plugin.call(seneca, options || {});
  }

  before(function (done) {
    add = simple.mock(seneca, 'add');
    done();
  });

  it('should set plugin name', function (done) {
    const plugin = makeInstance();
    assert.equal(plugin.plugin, 'ember-rest-adapter');
    done();
  });

  it('should subscribe pattern init:ember-rest-adapter', function (done) {
    makeInstance();
    assert.ok(add.called);
    const args = add.calls[0].args;
    assert.deepEqual(args[0], {init: 'ember-rest-adapter'});
    assert.isFunction(args[1]);
    done();
  });
});
