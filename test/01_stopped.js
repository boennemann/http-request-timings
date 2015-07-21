var http = require('http')

var nock = require('nock')
var request = require('request')
var test = require('tap').test

var timings = require('../')
timings.stop()

nock('http://example.com/')
  .get('/')
  .times(5)
  .reply(200, 'YO!')

test('does not emit timings via http when stopped', function (t) {
  t.plan(
    3 // number of tests in callbacks
  )

  timings.on('timing', function (timing, options, res) {
    t.fail()
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
