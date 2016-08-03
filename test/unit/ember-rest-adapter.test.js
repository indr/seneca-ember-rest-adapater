const assert = require('chai').assert;
const Common = require('seneca/lib/common');
const simple = require('simple-mock');

const SenecaMock = require('./SenecaMock');

const Plugin = require('../../ember-rest-adapter');

assert.pattern = function (actual, expected) {
  assert.equal(Common.pattern(actual), Common.pattern(expected));
};

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
    init, add, ready, wrap;

  before(function (done) {
    add = simple.mock(seneca, 'add');
    ready = simple.mock(seneca, 'ready');
    wrap = simple.mock(seneca, 'wrap');
    done();
  });

  beforeEach(function (done) {
    add.reset();
    done();
  });

  function createSut(options) {
    plugin = Plugin.call(seneca, options);
    init = add.calls[0].args[1];
    add.reset();
  }

  it('should call callback', function (done) {
    createSut();
    init.call(seneca, {}, done);
  });

  it('should add wrapper when seneca is ready', function (done) {
    createSut();
    init.call(seneca, {}, function () {
      ready.lastCall.args[0].call(seneca, null);
      assert(wrap.called);
      assert.pattern(wrap.lastCall.args[0], 'role:jsonrest-api,method:*');
      assert.isFunction(wrap.lastCall.args[1]);
      done();
    });
  });

  describe('Aliases', function () {
    it('adds an alias', function (done) {
      const options = {
        alias: {
          'foo': 'foos'
        }
      };
      createSut(options);
      init.call(seneca, {}, function() {
        assert.pattern(add.lastCall.args[0], 'kind:foos,name:foos,role:jsonrest-api');
        assert.isFunction(add.lastCall.args[1]);
        done();
      });
    });

    it('adds an array alias', function (done) {
      const options = {
        alias: {
          'foo': ['foos', 'bars']
        }
      };
      createSut(options);
      init.call(seneca, {}, function() {
        assert.pattern(add.calls[0].args[0], 'kind:foos,name:foos,role:jsonrest-api');
        assert.isFunction(add.calls[0].args[1]);
        assert.pattern(add.calls[1].args[0], 'kind:bars,name:bars,role:jsonrest-api');
        assert.isFunction(add.calls[1].args[1]);
        done();
      });
    });

    it('adds multiple aliases', function (done) {
      const options = {
        alias: {
          'foo': 'foos',
          'bar': ['bars', 'cars']
        }
      };
      createSut(options);
      init.call(seneca, {}, function() {
        assert.pattern(add.calls[1].args[0], 'kind:bars,name:bars,role:jsonrest-api');
        assert.isFunction(add.calls[1].args[1]);
        assert.pattern(add.calls[2].args[0], 'kind:cars,name:cars,role:jsonrest-api');
        assert.isFunction(add.calls[2].args[1]);
        assert.pattern(add.calls[0].args[0], 'kind:foos,name:foos,role:jsonrest-api');
        assert.isFunction(add.calls[0].args[1]);
        done();
      });
    });

    it('does not add an alias with same name', function (done) {
      const options = {
        alias: {
          'foo': 'foo'
        }
      };
      createSut(options);
      init.call(seneca, {}, function() {
        assert.equal(add.callCount, 0);
        done();
      });
    });
  });
});
