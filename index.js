/**
 * @typedef {import('vfile').VFile} VFile
 * @typedef {import('mkdirp').Mode | import('mkdirp').Options} Options
 * @typedef {import('mkdirp').Mode | import('mkdirp').OptionsSync} OptionsSync
 */

/**
 * @template CallbackFile
 * @callback Callback
 * @param {Error|null} error
 * @param {CallbackFile} file
 */

import path from 'node:path'
import oMkdirp from 'mkdirp'

export const mkdirp =
  /**
   * @type {{
   *   <F = VFile>(file: F, options: Options, callback: Callback<F>): void
   *   <F = VFile>(file: F, callback: Callback<F>): void
   *   <F = VFile>(file: F, options?: Options): Promise<F>
   * }}
   */
  (
    /**
     * @template {VFile} LocalFile
     * @param {LocalFile} file
     * @param {Options} [options]
     * @param {Callback<LocalFile>} [callback]
     * @returns {Promise.<LocalFile>?}
     */
    function (file, options, callback) {
      var root = base(file)

      if (!callback && typeof options === 'function') {
        callback = options
        options = {}
      }

      if (!callback) {
        return new Promise(executor)
      }

      executor(null, callback)

      /**
       * @param {(x: LocalFile) => void} resolve
       * @param {(x: Error, y?: LocalFile) => void} reject
       */
      function executor(resolve, reject) {
        oMkdirp(root, options).then(ok, reject)

        /** */
        function ok() {
          if (resolve) {
            resolve(file)
          } else {
            callback(null, file)
          }
        }
      }
    }
  )

/**
 * @template {VFile} F
 * @param {F} file
 * @param {OptionsSync} [options]
 * @returns {F}
 */
export function mkdirpSync(file, options) {
  oMkdirp.sync(base(file), options)
  return file
}

/**
 * @param {VFile} file
 * @returns {string}
 */
function base(file) {
  return path.resolve(file.cwd, file.dirname)
}
