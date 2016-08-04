const seneca = require('seneca')()
  .use('entity')
  .use('web')
  .use('jsonrest-api', {
    pin: {
      name: 'foo'
    },
    prefix: '/api'
  })
  .use('../ember-rest-adapter', {
    alias: {
      'foo': 'foos'
    }
  })
  // This call is necessary because of a bug when plugins are loaded with path information
  // See https://github.com/senecajs/seneca/issues/463
  .act('init:ember-rest-adapter');

express = require('express')()
  .use(require('body-parser').json())
  .use(seneca.export('web'))
  .listen(3000);
