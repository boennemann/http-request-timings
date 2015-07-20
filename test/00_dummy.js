var test = require('tap').test

var httpRequestTimings = require('../')

test('dummy', function (t) {
  t.is(httpRequestTimings(1, 2), 3)
})
