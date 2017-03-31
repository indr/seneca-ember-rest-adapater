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
      pin: [{name: 'foo'}, {name: 'news'}],
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
      .act('init:ember-rest-adapter') // Bug: https://github.com/senecajs/seneca/issues/463
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
        done();
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

  describe('/api/foos', function () {
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

  describe('api/news', function () {
    it("GET /api/news should have root 'news' with empty array", function (done) {
      agent.get('/api/news')
        .expect(200)
        .end(function (err, res) {
          assert.isNull(err);
          assert.deepEqual(res.body, {'news': []});
          done();
        })
    });

    it("POST /api/news should return 'news' object", function (done) {
      agent.post('/api/news')
        .send({'title': 'Title 1'})
        .expect(200)
        .end(function (err, res) {
          console.log(err, res);
          assert.isNull(err);
          assert.equal(res.body.news.title, 'Title 1');
          done();
        });
    });
  });
});
