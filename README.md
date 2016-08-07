# Solium
Solium is a linter for Solidity which uses Abstract Syntax Trees and allows the user to enable/disable existing rules and add their own ones! 

It internally uses [solparse](https://github.com/duaraghav8/solparse) to parse your solidity code into a Spider Monkey compliant AST

Solium aims to comply with the official [Solidity Style Guide](http://solidity.readthedocs.io/en/latest/style-guide.html). In future, Solium would allow its users to choose between certain rules (for example - tabs vs. spaces).

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

This lints all the files inside your project with ```.sol``` extension.

#Additional Options

1. use ```solium --hot``` to enable Hot loading (Hot swapping). This currently works only over the full project.

#Plugging in your custom rules
-> Open up the ```.soliumrc.json``` configuration file and set the value of ```custom-rules-filename``` to the path of the file that defines your rules. You can either provide an absolute path or a path relative to the directory in which .soliumrc.json resides. For example: ```"custom-rules-filename": "./my-rules.js"```

The format for writing your custom rule file (for example, ```my-rules.js```) is:

```js
module.exports = {
  'my-rule-name-1': function (context) {
    //Solium internally uses EventEmitter and emits an event every time it enters or leaves a node during the Depth First Traversal of the AST
    context.on ('IfStatement', function (emittedObject) {
    
      //exit property is set to true if we are leaving the node
      if (emittedObject.exit) {
        return;
      }
      
      //View the node representing an If Statement 
      console.log (emittedObject.node);
      
      //report an error
      context.report ({
        node: emittedObject.node,
        message: 'I JUST ENTERED AN IF STATEMENT!!',
        line: 1,  //optional
        column: 2 //optional
      });
      
    });
  },
  
  'my-rule-name-2': function (context) {
    context.on ('ContractStatement', function (emittedObject) {
      //similarly define this rule to do something with Contract Declarations
    });
  }
};
```
**NOTE**: The best way to know which event you're looking for is to simply install [solparse](https://github.com/duaraghav8/solparse) or [solidity-parser](https://github.com/ConsenSys/solidity-parser), then parse your code into the AST and see the value of the ```type``` field of the node that you wish to target.

See the [existing rules](https://github.com/duaraghav8/Solium/tree/master/lib/rules) to get an idea of how the rules are making use of the context object being provided to them.

-> Then, inside the ```rules``` object in the same file, set your rule names to ```true```. For instance:

```json
"rules": {
  "my-rule-name-1": true,
  "my-rule-name-2": true
}
```

**NOTE**: If you write a rule whose name clashes with the name of a pre-defined rule, your custom rule overrides the pre-defined one.

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

#Contributing
Please see the Developer Guide to understand how to contribute rules to this repository.