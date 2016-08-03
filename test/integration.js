const assert = require('chai').assert;
const Seneca = require('seneca');

describe('Integration', function () {
  var seneca;

  before(function (done) {
    seneca = Seneca()
      .use('entity')
      .use('jsonrest-api', {
        pin: {
          name: 'foo'
        },
        prefix: '/a/b'
      })
      .use('../ember-rest-adapter', {
        alias: {
          'foo': 'foos'
        }
      })
      .error(assert)
      .ready(function (err) {
        assert(!err);

        // I don't know why I have to call this manually...
        seneca.act('init:ember-rest-adapter', function (err, result) {
          seneca.make$('foo', {a:'foo1'}).save$();
          seneca.make$('foo', {a:'foo2'}).save$();
          done();
        });
      });
  });

  after(function (done) {
    seneca.close(done);
  });

  it('translates from foos to foo', function (done) {
    seneca.act('role:jsonrest-api,method:get,prefix:/a/b,kind:foos,zone:-,base:-,name:foos', function (err, result) {
      assert(!err);
      assert.equal(result.length, 2);
      assert.equal(result[0].a, 'foo1');
      assert.equal(result[1].a, 'foo2');
      done();
    });
  });
});