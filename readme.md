# vfile-mkdirp

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

Make sure the directory to a [`vfile`][vfile] exists.

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c):
Node 12+ is needed to use it and it must be `import`ed instead of `require`d.

[npm][]:

```sh
npm install vfile-mkdirp
```

## Use

```js
import {toVFile as vfile} from 'to-vfile'
import {mkdirp} from 'vfile-mkdirp'

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

This package exports the following identifiers: `mkdirp`, `mkdirpSync`.
There is no default export.

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

### `mkdirpSync(file[, mode|options])`

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

[build-badge]: https://github.com/vfile/vfile-mkdirp/workflows/main/badge.svg

[build]: https://github.com/vfile/vfile-mkdirp/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/vfile/vfile-mkdirp.svg

[coverage]: https://codecov.io/github/vfile/vfile-mkdirp

[downloads-badge]: https://img.shields.io/npm/dm/vfile-mkdirp.svg

[downloads]: https://www.npmjs.com/package/vfile-mkdirp

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/vfile/vfile/discussions

[npm]: https://docs.npmjs.com/cli/install

[contributing]: https://github.com/vfile/.github/blob/HEAD/contributing.md

[support]: https://github.com/vfile/.github/blob/HEAD/support.md

[health]: https://github.com/vfile/.github

[coc]: https://github.com/vfile/.github/blob/HEAD/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[vfile]: https://github.com/vfile/vfile

[mkdirp]: https://github.com/substack/node-mkdirp

[callback]: #callbackerror-file
