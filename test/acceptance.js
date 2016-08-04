const assert = require('chai').assert;
const bodyParser = require('body-parser');
const Express = require('express');
const Request = require('supertest');
const Seneca = require('seneca');

describe('Acceptance', function () {
  var seneca, express,
    agent;

  const options = {
    'jsonrest-api': {
      pin: {
        name: 'foo'
      },
      prefix: '/api'
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
      .use('jsonrest-api', options['jsonrest-api'])
      .use('../ember-rest-adapter', options['ember-rest-adapter'])
      .add('role:api,route:ping', function (args, done) {
        done(null, {ok: true});
      })
      .error(assert)
      .ready(function (err) {
        seneca.act('role:web', {
          use: {
            prefix: '/',
            pin: 'role:api,route:*',
            map: {ping: true}
          }
        });

        express = Express()
          .use(bodyParser.json())
          .use(seneca.export('web'));

        agent = Request(express);

        // TODO: Why do I have to call this manually?
        seneca.act('init:ember-rest-adapter', done);
      });
  });

  after(function (done) {
    seneca.close(done);
  });

  it('GET /ping should return ok:true', function (done) {
    agent.get('/ping')
      .expect(200)
      .end(function (err, res) {
        assert.isNull(err);
        assert.equal(res.body.ok, true);
        done();
      })
  });

  it('GET /api/foos', function (done) {
    agent.get('/api/foos')
      .expect(200)
      .end(function (err, res) {
        assert.isNull(err);
        assert.deepEqual(res.body, {foos: []});
        done();
      })
  });
});