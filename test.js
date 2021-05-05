import path from 'path'
import fs from 'fs'
import tmp from 'temp-dir'
import test from 'tape'
import {toVFile as vfile} from 'to-vfile'
import {mkdirp, mkdirpSync} from './index.js'

var o777 = 0o0777
var o755 = 0o0755
var o666 = 0o0666
var defaults = global.process.platform === 'win32' ? o666 : o777
var changed = global.process.platform === 'win32' ? o666 : o755
var umask = process.umask()

var statP = fs.promises.stat
var stat = fs.statSync

test('vfile-mkdirp', function (t) {
  t.test('mkdirp(file[, mode|options], callback)', function (st) {
    st.test('defaults', function (sst) {
      var file = random()

      sst.plan(3)

      mkdirp(file, function (error, result) {
        sst.deepEqual([error, result], [null, file], 'should work')
        var stats = stat(path.resolve(file.cwd, file.dirname))
        sst.ok(stats.isDirectory(), 'should create directories')
        sst.equal(stats.mode & o777, defaults & ~umask, 'default mask')
      })
    })

    st.test('mode', function (sst) {
      var file = random()

      sst.plan(2)

      mkdirp(file, o755, function (error) {
        sst.ifError(error, 'should work')
        var stats = stat(path.resolve(file.cwd, file.dirname))
        sst.equal(stats.mode & o777, changed, 'should support a given mask')
      })
    })

    st.test('options', function (sst) {
      var file = random()

      sst.plan(2)

      mkdirp(file, {mode: o755}, function (error) {
        sst.ifError(error, 'should work')
        var stats = stat(path.resolve(file.cwd, file.dirname))
        sst.equal(stats.mode & o777, changed, 'should support a given mask')
      })
    })

    st.test('errors', function (sst) {
      var file = random()
      var fp = file.dirname.split(path.sep)[0]

      vfile.writeSync({contents: 'in the way', cwd: tmp, path: fp})

      sst.plan(1)

      mkdirp(file, function (error) {
        sst.ok(
          // Unix / Windows
          error.code === 'ENOTDIR' || error.code === 'EEXIST',
          'should pass errors'
        )
      })
    })

    st.end()
  })

  t.test('mkdirp(file[, mode|options])', async function (st) {
    var file = random()
    var result = await mkdirp(file)
    var stats

    st.equal(result, file, 'should resolve to the given file')
    stats = await statP(path.resolve(file.cwd, file.dirname))
    st.ok(stats.isDirectory(), 'should create directories')
    st.equal(stats.mode & o777, defaults & ~umask, 'default mask')

    file = random()
    await mkdirp(file, o755)
    stats = await statP(path.resolve(file.cwd, file.dirname))
    st.equal(stats.mode & o777, changed, 'should support a given mask')

    file = random()
    await mkdirp(file, {mode: o755})
    stats = await statP(path.resolve(file.cwd, file.dirname))
    st.equal(stats.mode & o777, changed, 'should support given options')

    file = random()
    var fp = file.dirname.split(path.sep)[0]

    await vfile.write({contents: 'in the way', cwd: tmp, path: fp})

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

  t.test('mkdirpSync(file[, mode|options])', function (st) {
    var file = random()
    var result = mkdirpSync(file)
    var stats

    st.equal(result, file, 'should resolve to the given file')
    stats = stat(path.resolve(file.cwd, file.dirname))
    st.ok(stats.isDirectory(), 'should create directories')
    st.equal(stats.mode & o777, defaults & ~umask, 'default mask')

    file = mkdirpSync(random(), o755)
    stats = stat(path.resolve(file.cwd, file.dirname))
    st.equal(stats.mode & o777, changed, 'should support a given mask')

    file = mkdirpSync(random(), {mode: o755})
    stats = stat(path.resolve(file.cwd, file.dirname))
    st.equal(stats.mode & o777, changed, 'should support given options')

    file = random()
    var fp = file.dirname.split(path.sep)[0]

    vfile.writeSync({contents: 'in the way', cwd: tmp, path: fp})

    try {
      mkdirpSync(file)
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
  return vfile({cwd: tmp, dirname: path.join(r(), r(), r()), basename: 'tmp'})
}

function r() {
  return Math.floor(Math.random() * 16 ** 4).toString(16)
}
