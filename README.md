# Solium

[![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.svg)](https://gitter.im/Solium-linter/Lobby)
[![Build Status](https://travis-ci.org/duaraghav8/Solium.svg?branch=master)](https://travis-ci.org/duaraghav8/Solium)
[![Latest News](https://img.shields.io/badge/Blog-Medium-yellowgreen.svg)](https://medium.com/solium)
[![Snap Status](https://build.snapcraft.io/badge/duaraghav8/Solium.svg)](https://build.snapcraft.io/user/duaraghav8/Solium)

Solium is a Security & Style focused Linter for your Solidity Smart Contracts.

It provides powerful rules for writing cleaner, more secure contracts, automatic code formatting and simple-to-understand re-distributable configuration files.

## Install
```bash
npm install -g solium
solium -V
```

## Usage
In the root directory of your DApp:
```bash
solium --init
```

This creates 2 files for you:
- `.soliumignore` - contains names of files and directories to ignore while linting
- `.soliumrc.json` - contains configuration that tells Solium how to lint your project. You should modify this file to configure rules, plugins and sharable configs.

`.soliumrc.json` looks like:

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

To know which lint rules Solium applies for you, see [Core rules](http://solium.readthedocs.io/en/latest/user-guide.html#list-of-core-rules) and [Security rules](https://www.npmjs.com/package/solium-plugin-security#list-of-rules)

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

### Fix lint issues
Solium automatically fixes your code to resolve whatever issues it can.
```bash
solium -d contracts --fix
```

## IDE & Editor Integrations
- [VS Code: Solidity with Solium linting by Beau Gunderson](https://marketplace.visualstudio.com/items?itemName=beaugunderson.solidity-extended)
- [VS Code: Solidity with Solium linting by Juan Blanco](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity)
- [VS Code: Solidity with Solium linting by CodeChain.io](https://marketplace.visualstudio.com/items?itemName=kodebox.solidity-language-server)
- [Sublime Solium Gutter by Florian Sey](https://github.com/sey/sublime-solium-gutter)
- [Sublime Solium Linter by Alex Step](https://github.com/alexstep/SublimeLinter-contrib-solium)
- [Atom Solium Linter by Travis Jacobs](https://github.com/travs/linter-solium)
- [Syntastic local solium by Brett Sun](https://github.com/sohkai/syntastic-local-solium.vim)

## Migrating from v0
If you're currently using Solium `v0`, we highly recommend you to [migrate to v1](http://solium.readthedocs.io/en/latest/user-guide.html#migrating-to-v1-0-0). v1 is backward compatible and provides you with much greater flexibility to configure rules, powerful security rules and auto code formatting among other features.

#### [Access the complete Documentation](http://solium.readthedocs.io/)
