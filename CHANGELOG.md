# Changelog

## 1.2.0 (2018-12-25) :santa:
- Deprecated the npm package `solium`. All updates will be pushed simultaneously to npm packages `solium` and `ethlint`. There is no difference between the software being pushed to these packages, but it is highly recommended that you move to the `ethlint` npm package.
- Added Changelog
- Added syntax support for Solidity `0.5`.
- Added `ignore` option for `function-order` rule (See [issue](https://github.com/duaraghav8/Ethlint/issues/235))
- Added file name in addition to stack trace in the output of `--debug` option.
- Fixed the ignore feature to account for windows line endings in `.soliumignore` file. (Thanks to @romaric-juniet)
- Fixed documentation errors.
