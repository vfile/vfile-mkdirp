'use strict'

var resolve = require('path').resolve
var oMkdirp = require('mkdirp')

module.exports = mkdirp

mkdirp.sync = sync

function mkdirp(file, options, callback) {
  var root = base(file)

  if (!callback && typeof options === 'function') {
    callback = options
    options = {}
  }

  if (!callback) {
    return new Promise(executor)
  }

  executor(null, callback)

  function executor(resolve, reject) {
    oMkdirp(root, options, done)

    function done(err, made) {
      if (err) {
        reject(err)
      } else if (resolve) {
        resolve(file)
      } else {
        callback(null, file, made)
      }
    }
  }
}

function sync(file, options) {
  oMkdirp.sync(base(file), options)
  return file
}

function base(file) {
  return resolve(file.cwd, file.dirname)
}
