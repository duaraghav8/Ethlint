# Solium
Solium is a linter for Solidity which uses Abstract Syntax Trees and allows the user to enable/disable existing rules and add their own ones!

#Install
```bash
npm install solium
```

#Usage
In the root directory of your DApp, run the following once:
```bash
solium --init
```

This create ```.soliumrc``` inside your root directory, which has the configuration for the enabled rules.

You can disable a particular rule by setting its value to ```false```

In order to lint a specific file, use:
```bash
solium --file foobar.sol
```

To run the linter over your entire project, use the following command in your root directory:
```bash
solium
```
