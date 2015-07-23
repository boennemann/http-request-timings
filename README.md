# http-request-timings

[![Build Status](https://travis-ci.org/boennemann/http-request-timings.svg?branch=master)](https://travis-ci.org/boennemann/http-request-timings)
[![Coverage Status](https://coveralls.io/repos/boennemann/http-request-timings/badge.svg?branch=master&service=github)](https://coveralls.io/github/boennemann/http-request-timings?branch=master)
[![Dependency Status](https://david-dm.org/boennemann/http-request-timings/master.svg)](https://david-dm.org/boennemann/http-request-timings/master)
[![devDependency Status](https://david-dm.org/boennemann/http-request-timings/master/dev-status.svg)](https://david-dm.org/boennemann/http-request-timings/master#info=devDependencies)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

[![NPM](https://nodei.co/npm/http-request-timings.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/http-request-timings/)

This module monkey-patches the `http.request` method – which is used internally by `http.get`, `https.request`, `https.get` and therefor any library like `request` – to record timings.

_Note:_ The core `https` module isn't patched on node <=0.10. This will be addressed in a future version.

```bash
npm install -S http-request-timings
```

```js
var http = require('http')

var timings = require('http-request-timings')

// monkey-patch http.request
timings.start()

timings.on('timing', function (timing, options, res) {
  timing.start // Date
  timing.firstByte // Date
  timing.end // Date

  timing.timeToFirstByte // duration in ms
  timing.timeToEnd // duration in ms

  // options passed to http.request
  // if it was originally a string then it's `url.parse`d
  options

  // the response
  res
})

http.get('http://example.com/', function (res) {
  // …

  // go back to default http.request
  timings.stop()
})
```
