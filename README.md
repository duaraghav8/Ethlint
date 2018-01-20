<p align="center">
  <img src="./art/Solium.png">
</p>

<br />

[![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.svg)](https://gitter.im/Solium-linter/Lobby)
[![Build Status](https://travis-ci.org/duaraghav8/Solium.svg?branch=master)](https://travis-ci.org/duaraghav8/Solium)
[![Latest News](https://img.shields.io/badge/Blog-Medium-yellowgreen.svg)](https://medium.com/solium)
[![Snap Status](https://build.snapcraft.io/badge/duaraghav8/Solium.svg)](https://build.snapcraft.io/user/duaraghav8/Solium)

Solium analyzes your Solidity code for style & security issues and fixes them.

Standardize Smart Contract practices across your organisation. Integrate with your build system. Deploy with confidence!

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
  "extends": "solium:recommended",
  "plugins": ["security"],
  "rules": {
    "quotes": ["error", "double"],
    "indentation": ["error", 4]
  }
}
```

To know which lint rules Solium applies for you, see [Core rules](http://solium.readthedocs.io/en/latest/user-guide.html#list-of-core-rules) and [Security rules](https://www.npmjs.com/package/solium-plugin-security#list-of-rules)

### Lint
```bash
solium -f foobar.sol
solium -d contracts/
```

### Configure with comments <sup>[BETA]</sup>
**Comment Directives** can be used to configure Solium to ignore specific pieces of code.
They follow the pattern `solium-disable<optional suffix>`.

If you only use the directive, Solium disables all rules for the marked code. If that's not desirable, specify the rules to disable after the directive, separated by comma.

- Disable linting on a specific line
```
contract Foo {
	/* solium-disable-next-line */
	function() {
		var bar = 'Hello world';	// solium-disable-line quotes

		// solium-disable-next-line security/no-throw, indentation
						throw;
	}
}
```

- Disable linting on entire file

```
/* solium-disable */

contract Foo {
	...
}
```

### Fix
Solium automatically fixes your code to resolve whatever issues it can.
```bash
solium -d contracts --fix
```

## Integrations
- [VS Code: Solidity with Solium linting by Beau Gunderson](https://marketplace.visualstudio.com/items?itemName=beaugunderson.solidity-extended)
- [ethereum/emacs-solidity](https://github.com/ethereum/emacs-solidity) with Solium Support by [Lefteris Karapetsas](https://github.com/LefterisJP)
- [VS Code: Solidity with Solium linting by Juan Blanco](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity)
- [VS Code: Solidity with Solium linting by CodeChain.io](https://marketplace.visualstudio.com/items?itemName=kodebox.solidity-language-server)
- [Sublime Solium Gutter by Florian Sey](https://github.com/sey/sublime-solium-gutter)
- [Sublime Solium Linter by Alex Step](https://github.com/alexstep/SublimeLinter-contrib-solium)
- [Atom Solium Linter by Travis Jacobs](https://github.com/travs/linter-solium)
- [Syntastic local solium by Brett Sun](https://github.com/sohkai/syntastic-local-solium.vim)
- [Solium Ale Integration by Jeff Sutherland](https://github.com/w0rp/ale)
- [Solium Neomake Integration by Beau Gunderson](https://github.com/neomake/neomake)
- [Solium Official Plugin for Embark](https://github.com/duaraghav8/embark-solium)

## Migrating from v0
If you're currently using Solium `v0`, we highly recommend you to [migrate to v1](http://solium.readthedocs.io/en/latest/user-guide.html#migrating-to-v1-0-0). v1 is backward compatible and provides you with much greater flexibility to configure rules, powerful security rules and auto code formatting among other features.

## Trusted by the best
- [Augur](https://augur.net/)
- [Zeppelin](https://zeppelin.solutions/)
- [Consensys](https://consensys.net/)
- [Paritytech](https://paritytech.io/)
- [Aragon](https://aragon.one/)
- [Ethereum Name Service](https://github.com/ensdomains)
- [Melon Project](https://ipfs.io/ipns/melon.fund/)
- [Digix](https://digix.global/)
- [Giveth](https://giveth.io/)

#### [Access the complete Documentation](http://solium.readthedocs.io/)
