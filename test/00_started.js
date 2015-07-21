var http = require('http')

var nock = require('nock')
var request = require('request')
var test = require('tap').test

var timings = require('../')
timings.start()

nock('http://example.com/')
  .get('/')
  .delayConnection(100)
  .delay(200)
  .times(5)
  .reply(200, 'YO!')

function roughly (number) {
  return Math.round(number / 100) * 100
}

test('emits timings via http when started', function (t) {
  t.plan(
    (5/* number of requests */ * 7 /* number of tests per timing */) +
    3 // number of tests in callbacks
  )

  timings.on('timing', function (timing, options, res) {
    t.ok(timing.start instanceof Date)
    t.ok(timing.firstByte instanceof Date)
    t.ok(timing.end instanceof Date)
    t.is(roughly(timing.timeToFirstByte), 100)
    t.is(roughly(timing.timeToEnd), 200)

    t.ok(typeof options.hostname, 'string')

    t.ok(res instanceof http.IncomingMessage)
  })

  // Works with http.get and object
  http.get({
    hostname: 'example.com',
    port: 80,
    path: '/'
  })

  // Works with http.get and string
  http.get('http://example.com/')

  // Works with http.get and string and callback
  http.get('http://example.com/', function (res) {
    t.ok(res instanceof http.IncomingMessage)
  })

  // Works with http.request and object
  http.request({
    hostname: 'example.com',
    port: 80,
    method: 'GET',
    path: '/'
  }).end()

  // Works when wrapped with request
  request('http://example.com', function (err, res, body) {
    t.error(err)
    t.ok(res instanceof http.IncomingMessage)
  })
})
