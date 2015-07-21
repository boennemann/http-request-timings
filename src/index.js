var EventEmitter = require('events').EventEmitter
var http = require('http')
var url = require('url')

var timings = module.exports = new EventEmitter()

var original = http.request

timings.start = function start () {
  http.request = wrapper.bind(null, original)
}

timings.stop = function stop () {
  http.request = original
}

function wrapper (original, options, callback) {
  var timing = {
    start: new Date()
  }

  function noop () {}
  function wrappedCallback (res) {
    timing.firstByte = new Date()
    timing.timeToFirstByte = timing.firstByte - timing.start

    res.on('data', noop)
    res.on('end', function emitTiming () {
      if (typeof options === 'string') options = url.parse(options)

      timing.end = new Date()
      timing.timeToEnd = timing.end - timing.start

      timings.emit('timing', timing, options, res)
      res.removeListener('end', emitTiming)
      res.removeListener('data', noop)
    })

    if (typeof callback === 'function') callback.apply(null, arguments)
  }

  return original.call(http, options, wrappedCallback)
}
