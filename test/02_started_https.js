var http = require('http')
var https = require('https')

var test = require('tap').test

var timings = require('../')
timings.start()

test('emits timings via https when started', function (t) {
  t.plan(
    1/* number of requests */ * 7 /* number of tests per timing */
  )

  timings.on('timing', function (timing, options, res) {
    t.ok(timing.start instanceof Date)
    t.ok(timing.firstByte instanceof Date)
    t.ok(timing.end instanceof Date)
    t.is(typeof timing.timeToFirstByte, 'number')
    t.is(typeof timing.timeToEnd, 'number')

    t.ok(typeof options.hostname, 'string')

    t.ok(res instanceof http.IncomingMessage)
  })

  // Works with https.get and string
  https.get('https://example.com/', timings.stop)
})
