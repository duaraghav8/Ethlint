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

To know which lint rules Solium applies for you, see [Style rules](http://solium.readthedocs.io/en/latest/user-guide.html#list-of-style-rules) and [Security rules](https://www.npmjs.com/package/solium-plugin-security#list-of-rules).

---
**NOTE**

Solium does **not** strictly adhere to Solidity [Style Guide](http://solidity.readthedocs.io/en/latest/style-guide.html). It aims to promote coding practices agreed upon by the community at large.

---

### Lint
```bash
solium -f foobar.sol
solium -d contracts/
```

### Configure with comments
**Comment Directives** can be used to configure Solium to ignore specific pieces of code.
They follow the pattern `solium-disable<optional suffix>`.

If you only use the directive, Solium disables all rules for the marked code. If that's not desirable, specify the rules to disable after the directive, separated by comma.

- Disable linting on a specific line
```
contract Foo {
	/* solium-disable-next-line */
	function() {
		bytes32 bar = 'Hello world';	// solium-disable-line quotes

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
solium -d contracts/ --fix
```

## Trusted by the best
- [Augur](https://augur.net/)
- [Zeppelin](https://zeppelin.solutions/)
- [Consensys](https://consensys.net/)
- [Paritytech](https://paritytech.io/)
- [Aragon](https://aragon.one/)
- [Ethereum Name Service](https://github.com/ensdomains)
- [Melon Project](https://ipfs.io/ipns/melon.fund/)

## Our supporters
<p align="left">
  <a href="https://blog.ethereum.org/2018/03/07/announcing-beneficiaries-ethereum-foundation-grants/">
    <img src="./art/ethereum-logo.png" width="100" alt="Ethereum">
  </a>
  <a href="https://medium.com/@AugurProject/announcing-the-augur-bounty-program-bf11b1e1b7cf">
    <img src="./art/augur.png" width="70" alt="Augur">
  </a>
  &nbsp;&nbsp;
  <a href="https://gitcoin.co/universe?sort=None&direction=-&page=1&q=solium">
    <img src="./art/gitcoin.png" width="80" alt="Gitcoin">
  </a>
</p>

If Solium helped make your life simpler, please consider donating ETH to `0xacc661A56af9793a4437876a52F4Ad3fc3C443d6`

#### [IDE and Editor Integrations](http://solium.readthedocs.io/en/latest/user-guide.html#index-9) | [Complete Documentation](http://solium.readthedocs.io/) | [Demo Video](https://www.youtube.com/watch?v=MlQ6fzwixpI)