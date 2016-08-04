# seneca-ember-rest-adapter

*A Seneca plugin to wrap seneca-jsonrest-api for Embers rest adapter*

[![npm version](https://badge.fury.io/js/seneca-ember-rest-adapter.svg)](https://badge.fury.io/js/seneca-ember-rest-adapter)
[![Build Status](https://travis-ci.org/indr/seneca-ember-rest-adapter.svg?branch=master)](https://travis-ci.org/indr/seneca-ember-rest-adapter)
[![dependencies Status](https://david-dm.org/indr/seneca-ember-rest-adapter/status.svg)](https://david-dm.org/indr/seneca-ember-rest-adapter)
[![Code Climate](https://codeclimate.com/github/indr/seneca-ember-rest-adapter/badges/gpa.svg)](https://codeclimate.com/github/indr/seneca-ember-rest-adapter)

This [seneca](senecajs/seneca) plugin provides a wrapper for
the [jsonrest-api](rjrodgers/seneca-jsonrest-api) plugin to talk fluently with Ember.js
[DS.RESTAdapter](http://emberjs.com/api/data/classes/DS.RESTAdapter.html).

## Installation

```bash
npm install seneca-ember-rest-adapter
```

## Usage

```js
const seneca = require('seneca')()
  .use('entity')
  .use('web')
  .use('jsonrest-api', {
    pin: {name: 'foo'},
    prefix: '/api'
  })
  .use('ember-rest-adapter', {
    alias: {'foo': 'foos'}
  });
  
express = require('express')()
  .use(require('body-parser').json())
  .use(seneca.export('web'))
  .listen(3000);

```

```bash
$ curl -X POST http://localhost:3000/api/foos -H 'Content-Type: application/json' -d '{"foo":{"name":"foo1"}}'
{"foos":{"name":"foo1","id":"880i2f"}}
$ curl -X POST http://localhost:3000/api/foos -H 'Content-Type: application/json' -d '{"foo":{"name":"foo2"}}'
{"foos":{"name":"foo2","id":"dip1d0"}}
$ curl -X GET http://localhost:3000/api/foos
{"foos":[{"name":"foo1","id":"880i2f"},{"name":"foo2","id":"dip1d0"}]}
```

## License

[MIT](LICENSE)
