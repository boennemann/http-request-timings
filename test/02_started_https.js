var http = require('http')
var https = require('https')

var test = require('tap').test

var timings = require('../')
timings.start()

test('emits timings via https when started', function (t) {
  t.plan(8)

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
  https.get('https://example.com/', function (res) {
    var body = ''
    res.on('data', function (chunk) {
      body += String(chunk)
    })

    res.on('end', function () {
      t.matches(body, /<html>/)
      timings.stop()
    })
  })
})
