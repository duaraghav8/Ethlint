# Solium
Solium is a linter for Solidity which uses Abstract Syntax Trees and allows the user to enable/disable existing rules and add their own ones!

#Install
```bash
npm install -g solium
```

#Usage
In the root directory of your DApp, run the following:
```bash
solium --init
```

This creates ```.soliumrc.json``` inside your root directory, which has the configuration for the enabled and custom rules.

You can disable a particular rule by setting its value to ```false```

In order to lint a specific file, use:
```bash
solium --file foobar.sol
```

To run the linter over your entire project, use the following command in your root directory:
```bash
solium
```

#Integrate Solium in your app
To access Solium's API, first install it:

```bash
npm install --save solium
```
##Usage
```js
let Solium = require ('solium'),
  sourceCode = 'contract fOO_bar { function HELLO_WORLD () {} }';
    
let errorObjects = Solium.lint (sourceCode, {
  rules: {
    camelcase: true,
    mixedcase: true
  }
});

errorObjects.forEach ( (err) => {
  console.log (err);
});
```

For a list of all available rules, see [solium.json](https://github.com/duaraghav8/Solium/blob/master/config/solium.json).
