![solium](https://cloud.githubusercontent.com/assets/12758282/18283522/4b206522-7483-11e6-9bcd-2a70ebc8cfdb.png)

[![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.svg)](https://gitter.im/Solium-linter/Lobby)
[![Build Status](https://travis-ci.org/duaraghav8/Solium.svg?branch=master)](https://travis-ci.org/duaraghav8/Solium)
[![Latest News](https://img.shields.io/badge/Blog-Medium-yellowgreen.svg)](https://medium.com/solium)
[![Snap Status](https://build.snapcraft.io/badge/duaraghav8/Solium.svg)](https://build.snapcraft.io/user/duaraghav8/Solium)

Solium is a Security & Style focused Linter for your Solidity Smart Contracts.

It provides powerful rules for writing cleaner, more secure contracts, automatic code formatting and simple-to-understand re-distributable configuration files.

# Install
```bash
npm install -g solium
solium -V
```

## Install from the snap store

In any of the [supported Linux distros](https://snapcraft.io/docs/core/install):

```bash
sudo snap install solium --edge
```

(Note that this is an experimental and unstable release, at the moment)

# Usage
In the root directory of your DApp, run the following:
```bash
solium --init
```

This creates 2 files for you:
- `.soliumignore` - contains names of files and directories to ignore while linting
- `.soliumrc.json` - contains configuration that tells Solium how to lint your project. You should modify this file to configure rules, plugins and sharable configs.

`.soliumrc.json` looks something like:

```json
{
  "extends": "solium:all",
  "plugins": ["security"],
  "rules": {
    "quotes": ["error", "double"],
    "indentation": ["error", 4],
    "arg-overflow": ["warning", 3]
  }
}
```

### Lint a single Solidity file
```bash
solium -f ./contracts/foobar.sol
```

### Lint over a directory
```bash
solium -d contracts/
```
Or over the entire project using `solium -d .`.
Solium lints all the files inside your project with ```.sol``` extension.

# Additional Options

1. Use ```--watch``` to enable Hot loading (Hot swapping).
2. Use the `--fix` flag to apply automatic formatting
3. Use `solium --help` to get the full list of options you can supply.

# Migrating from v0
If you're currently using Solium `v0`, we highly recommend you to [migrate to v1](http://solium.readthedocs.io/en/latest/user-guide.html#migrating-to-v1-0-0). v1 is backward compatible and provides you with much greater flexibility to configure rules, powerful security rules and auto code formatting among other features.

#### [Access the complete Documentation](http://solium.readthedocs.io/)
