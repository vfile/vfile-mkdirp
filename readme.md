# vfile-mkdirp

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

Make sure the directory to a [`vfile`][vfile] exists.

## Install

[npm][]:

```sh
npm install vfile-mkdirp
```

## Use

```js
var vfile = require('to-vfile')
var mkdirp = require('vfile-mkdirp')

var file = vfile('a/deep/path/to/docs/readme.md')

try {
  await vfile.write(file)
} catch (error) {
  console.log(error)
  // [Error: ENOENT: no such file or directory, open '~/a/deep/path/to/docs/readme.md']
}

await mkdirp(file)
await vfile.write(file)
// Works!
```

## API

### `mkdirp(file[, mode|options][, callback])`

Make sure the directory to the given [`vfile`][vfile] exists.
Passes `mode` or `options` through to [`mkdirp`][mkdirp].

If no callback is given, returns a promise that resolves to the given file,
or rejects with an error.

###### Parameters

*   `file` ([`VFile`][vfile]) — Virtual file
*   `mode` (`string`, optional) — Passed to [`mkdirp`][mkdirp]
*   `options` (`Object`, optional) — Passed to [`mkdirp`][mkdirp]
*   `callback` ([`Function`][callback], optional)

###### Returns

Promise or void.

### `callback(error[, file])`

Callback called when done.

###### Parameters

*   `error` (`Error`) — Error, when failed
*   `file` ([`VFile`][vfile], optional) — Given file, when complete

### `mkdirp.sync(file[, mode|options])`

Like `mkdirp(file[, mode|options])` but synchronous.
Either throws an error or returns the given file.

## Contribute

See [`contributing.md`][contributing] in [`vfile/.github`][health] for ways to
get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/vfile/vfile-mkdirp.svg

[build]: https://travis-ci.org/vfile/vfile-mkdirp

[coverage-badge]: https://img.shields.io/codecov/c/github/vfile/vfile-mkdirp.svg

[coverage]: https://codecov.io/github/vfile/vfile-mkdirp

[downloads-badge]: https://img.shields.io/npm/dm/vfile-mkdirp.svg

[downloads]: https://www.npmjs.com/package/vfile-mkdirp

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-spectrum-7b16ff.svg

[chat]: https://spectrum.chat/unified/vfile

[npm]: https://docs.npmjs.com/cli/install

[contributing]: https://github.com/vfile/.github/blob/master/contributing.md

[support]: https://github.com/vfile/.github/blob/master/support.md

[health]: https://github.com/vfile/.github

[coc]: https://github.com/vfile/.github/blob/master/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[vfile]: https://github.com/vfile/vfile

[mkdirp]: https://github.com/substack/node-mkdirp

[callback]: #callbackerror-file
