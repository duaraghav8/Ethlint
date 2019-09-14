# Changelog

## 1.2.5 (2019-09-14)
- Fixed `no-empty-blocks` to not report inherited constructors with empty blocks ([#264](https://github.com/duaraghav8/Ethlint/issues/264#issue-447647594)).
- Added option `errorMessageMaxLength` for rule `error-reason` to specify a character limit on error message.

## 1.2.4 (2019-04-08)
- Added rule `no-trailing-whitespace` to warn the user when code, comment or blank lines contain trailing whitespaces. This rule will supply the `fix` functionality in a future release.
- Added `getLines()` sourceCode utility function for rule developers. This method returns the source code split into lines.
- Added `getComments()` sourceCode utility function for rule developers. This method returns a list of AST Nodes representing comments in the source code.

## 1.2.3 (2019-02-11)
- Added support for `solium-disable-previous-line` comment directive.
- Added support for `solium-enable` comment directive. See [configuring with comments](https://ethlint.readthedocs.io/en/latest/user-guide.html#configuring-with-comments). This feature currently has a limitation which has been documented in [Known Issues](https://ethlint.readthedocs.io/en/latest/known-issues.html).
- Added Pull Request template.
- Fixed rule `no-empty-blocks` to report function declarations with empty bodies. Fallback and `payable` functions and `payable` constructors are not reported if their body is empty. See [#254](https://github.com/duaraghav8/Ethlint/issues/254).
- Fixed rule `quotes` to stop reporting false positives due to brackets enclosing strings (see [#240](https://github.com/duaraghav8/Ethlint/issues/240)).
- Modified rule `uppercase` to allow up to 2 leading and trailing underscores for a constant's name.

## 1.2.2 (2019-01-13)
- Added support for parsing function declarations inside Inline Assembly blocks.
- Added Issue Templates to the repository for Bug report, Feature request and Lint rule suggestion.
- Added Contribution guidelines.
- Changed `.soliumignore`-related warning messages to be more user-friendly.
- Fixed bugs in parser related to Inline Assembly variable declaration.
- Fixed `uppercase` rule to allow single-character names, where the character must be an alphabet.
- Fixed `indentation` rule to allow Call expression arguments to start with circular bracket ([#223](https://github.com/duaraghav8/Ethlint/issues/223)).
- Fixed `BinaryExpression` position bug in parser that led to [#175](https://github.com/duaraghav8/Ethlint/issues/175) & [#223](https://github.com/duaraghav8/Ethlint/issues/223).

## 1.2.1 (2019-01-01) :sparkler:
- Added `fix` functionality to `linebreak-style` rule.
- Added `linebreak-style` rule configuration to default `.soliumrc.json`.
- Added support for tilde for specifying version literals in `pragma` statements.
- Added rule `constructor` to warn the user when the deprecated style of constructor declaration is being used.
- Added `--fix-dry-run` option to CLI to allow users to see a git-style diff of the changes the `--fix` option will make.
- Fixed Hex literal parsing. Incorrect parsing caused the linter to crash in some [cases](https://github.com/duaraghav8/Ethlint/issues/232).
- Fixed source code util's `getTextOnLine()` to account for both linebreak-styles on both platforms (see [issue](https://github.com/duaraghav8/Ethlint/issues/173))
- Changed documentation URL to [ethlint.readthedocs.io](https://ethlint.readthedocs.io). `solium.readthedocs.io` is deprecated but will receive updates.
- Moved deprecated rules in documentation into their own section.

## 1.2.0 (2018-12-25) :santa:
- Deprecated the npm package `solium`. All updates will be pushed simultaneously to npm packages `solium` and `ethlint`. There is no difference between the software being pushed to these packages, but it is highly recommended that you move to the `ethlint` npm package.
- Added Changelog
- Added syntax support for Solidity `0.5`.
- Added `ignore` option for `function-order` rule (See [issue](https://github.com/duaraghav8/Ethlint/issues/235))
- Added file name in addition to stack trace in the output of `--debug` option.
- Fixed the ignore feature to account for windows line endings in `.soliumignore` file. (Thanks to @romaric-juniet)
- Fixed documentation errors.
