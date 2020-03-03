'use strict'

var {join, resolve, sep} = require('path')
var fs = require('fs')
var tmp = require('temp-dir')
var test = require('tape')
var vfile = require('to-vfile')
var mkdirp = require('.')

var o777 = parseInt('0777', 8)
var o755 = parseInt('0755', 8)
var o666 = parseInt('0666', 8)
var defaults = global.process.platform === 'win32' ? o666 : o777
var changed = global.process.platform === 'win32' ? o666 : o755
var umask = process.umask()

var statP = fs.promises.stat
var stat = fs.statSync

test('vfile-mkdirp', function(t) {
  t.test('mkdirp(file[, mode|options], callback)', function(st) {
    st.test('defaults', function(sst) {
      var file = random()

      sst.plan(3)

      mkdirp(file, function(err, res) {
        sst.deepEqual([err, res], [null, file], 'should work')
        var stats = stat(resolve(file.cwd, file.dirname))
        sst.ok(stats.isDirectory(), 'should create directories')
        sst.equal(stats.mode & o777, defaults & ~umask, 'default mask')
      })
    })

    st.test('mode', function(sst) {
      var file = random()

      sst.plan(2)

      mkdirp(file, o755, function(err) {
        sst.ifError(err, 'should work')
        var stats = stat(resolve(file.cwd, file.dirname))
        sst.equal(stats.mode & o777, changed, 'should support a given mask')
      })
    })

    st.test('options', function(sst) {
      var file = random()

      sst.plan(2)

      mkdirp(file, {mode: o755}, function(err) {
        sst.ifError(err, 'should work')
        var stats = stat(resolve(file.cwd, file.dirname))
        sst.equal(stats.mode & o777, changed, 'should support a given mask')
      })
    })

    st.test('errors', function(sst) {
      var file = random()
      var path = file.dirname.split(sep)[0]

      vfile.writeSync({contents: 'in the way', cwd: tmp, path: path})

      sst.plan(1)

      mkdirp(file, function(error) {
        sst.ok(
          // Unix / Windows
          error.code === 'ENOTDIR' || error.code === 'EEXIST',
          'should pass errors'
        )
      })
    })

    st.end()
  })

  t.test('mkdirp(file[, mode|options])', async function(st) {
    var file = random()
    var res = await mkdirp(file)
    var stats

    st.equal(res, file, 'should resolve to the given file')
    stats = await statP(resolve(file.cwd, file.dirname))
    st.ok(stats.isDirectory(), 'should create directories')
    st.equal(stats.mode & o777, defaults & ~umask, 'default mask')

    file = random()
    await mkdirp(file, o755)
    stats = await statP(resolve(file.cwd, file.dirname))
    st.equal(stats.mode & o777, changed, 'should support a given mask')

    file = random()
    await mkdirp(file, {mode: o755})
    stats = await statP(resolve(file.cwd, file.dirname))
    st.equal(stats.mode & o777, changed, 'should support given options')

    file = random()
    var path = file.dirname.split(sep)[0]

    await vfile.write({contents: 'in the way', cwd: tmp, path: path})

    try {
      await mkdirp(file)
    } catch (error) {
      st.ok(
        // Unix / Windows
        error.code === 'ENOTDIR' || error.code === 'EEXIST',
        'should reject errors'
      )
    }

    st.end()
  })

  t.test('mkdirp.sync(file[, mode|options])', function(st) {
    var file = random()
    var res = mkdirp.sync(file)
    var stats

    st.equal(res, file, 'should resolve to the given file')
    stats = stat(resolve(file.cwd, file.dirname))
    st.ok(stats.isDirectory(), 'should create directories')
    st.equal(stats.mode & o777, defaults & ~umask, 'default mask')

    file = mkdirp.sync(random(), o755)
    stats = stat(resolve(file.cwd, file.dirname))
    st.equal(stats.mode & o777, changed, 'should support a given mask')

    file = mkdirp.sync(random(), {mode: o755})
    stats = stat(resolve(file.cwd, file.dirname))
    st.equal(stats.mode & o777, changed, 'should support given options')

    file = random()
    var path = file.dirname.split(sep)[0]

    vfile.writeSync({contents: 'in the way', cwd: tmp, path: path})

    try {
      mkdirp.sync(file)
    } catch (error) {
      st.ok(
        // Unix / Windows
        error.code === 'ENOTDIR' || error.code === 'EEXIST',
        'should throw errors'
      )
    }

    st.end()
  })

  t.end()
})

function random() {
  return vfile({cwd: tmp, dirname: join(r(), r(), r()), basename: 'tmp'})
}

function r() {
  return Math.floor(Math.random() * Math.pow(16, 4)).toString(16)
}
