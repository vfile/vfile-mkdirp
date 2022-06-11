import process from 'node:process'
import path from 'node:path'
import fs from 'node:fs'
import tmp from 'temp-dir'
import test from 'tape'
import {toVFile as vfile} from 'to-vfile'
import {mkdirp, mkdirpSync} from './index.js'

const o777 = 0o0777
const o755 = 0o0755
const o666 = 0o0666
const defaults = process.platform === 'win32' ? o666 : o777
const changed = process.platform === 'win32' ? o666 : o755
const umask = process.umask()

const statP = fs.promises.stat
const stat = fs.statSync

test('vfile-mkdirp', function (t) {
  t.test('mkdirp(file[, mode|options], callback)', function (st) {
    st.test('defaults', function (sst) {
      const file = random()

      sst.plan(3)

      mkdirp(file, function (error, result) {
        sst.deepEqual([error, result], [null, file], 'should work')
        const stats = stat(path.resolve(file.cwd, file.dirname))
        sst.ok(stats.isDirectory(), 'should create directories')
        sst.equal(stats.mode & o777, defaults & ~umask, 'default mask')
      })
    })

    st.test('mode', function (sst) {
      const file = random()

      sst.plan(2)

      mkdirp(file, o755, function (error) {
        sst.ifError(error, 'should work')
        const stats = stat(path.resolve(file.cwd, file.dirname))
        sst.equal(stats.mode & o777, changed, 'should support a given mask')
      })
    })

    st.test('options', function (sst) {
      const file = random()

      sst.plan(2)

      mkdirp(file, {mode: o755}, function (error) {
        sst.ifError(error, 'should work')
        const stats = stat(path.resolve(file.cwd, file.dirname))
        sst.equal(stats.mode & o777, changed, 'should support a given mask')
      })
    })

    st.test('errors', function (sst) {
      const file = random()
      const fp = file.dirname.split(path.sep)[0]

      vfile.writeSync({value: 'in the way', cwd: tmp, path: fp})

      sst.plan(1)

      mkdirp(file, function (error) {
        sst.ok(
          // Unix / Windows
          // @ts-ignore Sure `code` exists.
          error.code === 'ENOTDIR' || error.code === 'EEXIST',
          'should pass errors'
        )
      })
    })

    st.end()
  })

  t.test('mkdirp(file[, mode|options])', async function (st) {
    let file = random()
    const result = await mkdirp(file)

    st.equal(result, file, 'should resolve to the given file')
    let stats = await statP(path.resolve(file.cwd, file.dirname))
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
    const fp = file.dirname.split(path.sep)[0]

    await vfile.write({value: 'in the way', cwd: tmp, path: fp})

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
    let file = random()
    const result = mkdirpSync(file)

    st.equal(result, file, 'should resolve to the given file')
    let stats = stat(path.resolve(file.cwd, file.dirname))
    st.ok(stats.isDirectory(), 'should create directories')
    st.equal(stats.mode & o777, defaults & ~umask, 'default mask')

    file = mkdirpSync(random(), o755)
    stats = stat(path.resolve(file.cwd, file.dirname))
    st.equal(stats.mode & o777, changed, 'should support a given mask')

    file = mkdirpSync(random(), {mode: o755})
    stats = stat(path.resolve(file.cwd, file.dirname))
    st.equal(stats.mode & o777, changed, 'should support given options')

    file = random()
    const fp = file.dirname.split(path.sep)[0]

    vfile.writeSync({value: 'in the way', cwd: tmp, path: fp})

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
