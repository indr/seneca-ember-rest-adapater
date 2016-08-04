# seneca-ember-rest-adapter

*A Seneca plugin to wrap seneca-jsonrest-api for Embers rest adapter*

[![npm version](https://badge.fury.io/js/seneca-ember-rest-adapter.svg)](https://badge.fury.io/js/seneca-ember-rest-adapter)
[![Build Status](https://travis-ci.org/indr/seneca-ember-rest-adapter.svg?branch=master)](https://travis-ci.org/indr/seneca-ember-rest-adapter)
[![dependencies Status](https://david-dm.org/indr/seneca-ember-rest-adapter/status.svg)](https://david-dm.org/indr/seneca-ember-rest-adapter)
[![Code Climate](https://codeclimate.com/github/indr/seneca-ember-rest-adapter/badges/gpa.svg)](https://codeclimate.com/github/indr/seneca-ember-rest-adapter)

This [seneca](https://github.com/senecajs/seneca) plugin provides a wrapper for
the [jsonrest-api](https://github.com/rjrodger/seneca-jsonrest-api) plugin to talk fluently with Ember.js'
[DS.RESTAdapter](http://emberjs.com/api/data/classes/DS.RESTAdapter.html). It provides two features:

 * A configurable plural form of the endpoint, e.g. /api/foos
 * Wrapping and unwrapping of the payloads object root

## Installation

```bash
npm install seneca-ember-rest-adapter
```

## Example

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
  
const express = require('express')()
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
$ curl -X GET http://localhost:3000/api/foos/dip1d0
{"foos":{"name":"foo2","id":"dip1d0"}}
```

You can find this example in the example directory and run it:

```bash
cd node_modules/seneca-ember-rest-adapter/ && npm install
node example/app.js
```

## Notes

As you can see in the example above, the plugin returns the plural form
(the alias) for `GET` requests. This is according to the
[object root documentation](http://emberjs.com/api/data/classes/DS.RESTAdapter.html#toc_object-root)
of DS.RESTAdapter totally acceptable:

> Note that the object root can be pluralized for both a single-object response and an array response: the REST adapter is not strict on this. 

## Test

To run tests, simply use npm:

```bash
npm test
```

## License

[MIT](LICENSE)
