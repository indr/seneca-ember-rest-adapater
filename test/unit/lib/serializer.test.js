const _ = require('lodash');
const assert = require('chai').assert;
const simple = require('simple-mock');

const SenecaMock = require('../SenecaMock');

const serializer = require('../../../lib/serializer');

describe('Unit | serializer', function () {
  var sut,
    seneca = new SenecaMock();

  it('calls callback', function (done) {
    sut = serializer(done, 'foos');
    sut(null, null);
  });

  it('funnels error with data', function (done) {
    var error = {}, data = {};
    sut = serializer(function (err, result) {
      assert.equal(err, error);
      assert.equal(result, data);
      done();
    }, 'foos');
    sut(error, data);
  });

  it('wraps array into root object', function (done) {
    const data = [{a: 'foo1'}, {a: 'foo2'}];
    sut = serializer(function (err, result) {
      assert.isNull(err);
      assert.equal(Object.keys(result).length, 1);
      assert(_.isArray(result['foos']));
      assert.deepEqual(result['foos'], data);
      done();
    }, 'foos');

    sut(null, data);
  });

  it('wraps object into root object', function (done) {
    const data = {a: 'foo1'};
    sut = serializer(function (err, result) {
      assert.isNull(err);
      assert.equal(Object.keys(result).length, 1);
      assert.deepEqual(result['foos'], data);
      done();
    }, 'foos');

    sut(null, data);
  });

  it('cleans properties with $ from array result', function (done) {
    const data = [{a: 'foo1', a$: 'foo1$'}];
    sut = serializer(function (err, result) {
      assert.isNull(err);
      assert.equal(Object.keys(result).length, 1);
      assert.isFalse(result['foos'][0].hasOwnProperty('a$'));
      done();
    }, 'foos');

    sut(null, data);
  });

  it('cleans properties with $ from object result', function (done) {
    const data = {a: 'foo1', a$: 'foo1$'};
    sut = serializer(function (err, result) {
      assert.isNull(err);
      assert.equal(Object.keys(result).length, 1);
      assert.isFalse(result['foos'].hasOwnProperty('a$'));
      done();
    }, 'foos');

    sut(null, data);
  });
});