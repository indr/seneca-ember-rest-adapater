const assert = require('chai').assert;
const Seneca = require('seneca');

describe('Integration', function () {
  var seneca,
    id1, id2;

  const options = {
    'jsonrest-api': {
      pin: {
        name: 'foo'
      },
      prefix: '/a/b'
    },
    'ember-rest-adapter': {
      alias: {
        'foo': 'foos'
      }
    }
  };

  before(function (done) {
    seneca = Seneca()
      .use('entity')
      .use('web')
      // IMPLICIT TEST: use ember-rest-adapter before jsonrest-api to verify
      //                arbitrary usage order
      .use('../ember-rest-adapter', options['ember-rest-adapter'])
      .use('jsonrest-api', options['jsonrest-api'])

      .error(assert)
      .ready(function (err) {
        assert(!err);

        seneca.make$('foo', {a: 'foo1'}).save$(function (err, entity) {
          id1 = entity.id;
        });
        seneca.make$('foo', {a: 'foo2'}).save$(function (err, entity) {
          id2 = entity.id;
        });

        // TODO: I don't know why I have to call this manually?
        seneca.act('init:ember-rest-adapter', done());
      });
  });

  after(function (done) {
    seneca.close(done);
  });

  function getMessage(kind, method) {
    return {
      role: 'jsonrest-api',
      method: method || 'get',
      prefix: '/a/b',
      kind: kind,
      zone: '-',
      base: '-',
      name: kind
    }
  }

  it('GET /foo | returns root object \'foo\' as array', function (done) {
    const msg = getMessage('foo');
    seneca.act(msg, function (err, result) {
      assert(!err);
      assert.equal(Object.keys(result).length, 1);
      const data = result['foo'];
      assert.equal(data.length, 2);
      assert.equal(data[0].a, 'foo1');
      assert.equal(data[1].a, 'foo2');
      done();
    });
  });

  it('GET /foos | translates from foos to foo and returns root object \'foos\' as array', function (done) {
    const msg = getMessage('foos');
    seneca.act(msg, function (err, result) {
      assert(!err);
      assert.equal(Object.keys(result).length, 1);
      const data = result['foos'];
      assert.equal(data.length, 2);
      assert.equal(data[0].a, 'foo1');
      assert.equal(data[1].a, 'foo2');
      done();
    });
  });

  it('GET /foo/:id | returns root object \'foo\' as object', function (done) {
    const msg = getMessage('foo');
    msg.id = id1;
    seneca.act(msg, function (err, result) {
      assert(!err);
      assert.equal(Object.keys(result).length, 1);
      const data = result['foo'];
      assert.equal(data.id, id1);
      assert.equal(data.a, 'foo1');
      done();
    });
  });

  it('GET /foos/:id | translates from foos to foo and returns root object \'foos\' as object', function (done) {
    const msg = getMessage('foos');
    msg.id = id1;
    seneca.act(msg, function (err, result) {
      assert(!err);
      assert.equal(Object.keys(result).length, 1);
      const data = result['foos'];
      assert.equal(data.id, id1);
      assert.equal(data.a, 'foo1');
      done();
    });
  });

  it('POST /foo | unwraps root object, makes, saves and returns a wrapped foo', function (done) {
    const msg = getMessage('foo', 'post');
    msg.data = {
      foo: {
        a: 'foo-new-1'
      }
    };
    seneca.act(msg, function (err, result) {
      assert(!err);
      console.log(result);
      const foo = result['foo'];
      assert(foo);
      assert.equal(foo.id.length, 6);
      assert.equal(foo.a, 'foo-new-1');
      done();
    });
  });

  it('POST /foos | unwraps root object, makes, saves and returns a wrapped foos', function (done) {
    const msg = getMessage('foos', 'post');
    msg.data = {
      foo: {
        a: 'foo-new-2'
      }
    };
    seneca.act(msg, function (err, result) {
      assert(!err);
      console.log(result);
      const foo = result['foos'];
      assert(foo);
      assert.equal(foo.id.length, 6);
      assert.equal(foo.a, 'foo-new-2');
      done();
    });
  });
});