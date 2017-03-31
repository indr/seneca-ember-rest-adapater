const seneca = require('seneca')()
  .use('entity')
  .use('web')
  .use('jsonrest-api', {
    pin: {name: 'news'},
    prefix: '/api'
  })
  .use('jsonrest-api', {
    pin: [{name: 'foo'},{name: 'person'}],
    prefix: '/api'
  })
  .use('../ember-rest-adapter', {
    alias: {'foo': 'foos', 'person': 'people'}
  })
  // This call is necessary because of a bug when plugins are loaded with path information
  // See https://github.com/senecajs/seneca/issues/463
  .act('init:ember-rest-adapter');

const express = require('express')()
  .use(require('body-parser').json())
  .use(seneca.export('web'))
  .listen(3000);
