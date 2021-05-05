import path from 'path'
import oMkdirp from 'mkdirp'

export function mkdirp(file, options, callback) {
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
    oMkdirp(root, options).then(ok, reject)

    function ok() {
      if (resolve) {
        resolve(file)
      } else {
        callback(null, file)
      }
    }
  }
}

export function mkdirpSync(file, options) {
  oMkdirp.sync(base(file), options)
  return file
}

function base(file) {
  return path.resolve(file.cwd, file.dirname)
}
