# Contributing rules to this repository

Ideally, you would want to write a rule that complies with the Solidity [Style Guide](http://solidity.readthedocs.io/en/latest/style-guide.html). However, if you feel that a certain rule is not mentioned in the guide or contradicts a rule mentioned in the guide but is crucial to the linter, please raise an Issue to discuss this rule. Once, finalized, you may proceed to develop the rule, test it, and make a PR.

Let's take an example rule that you wish to add: 'foo-bar'.

-> Open up **config/solium.json** and add the following JSON inside the ```rules``` object:

```json
"foo-bar": {
	"enabled": true,
	"recommended": true,
	"type": "error",
	"description": "Enable foo-bar validation over code"
}
```

Set ```enabled``` to ```true``` if you want to keep your rule enabled by default.

Set ```recommended``` to ```true``` (this field currently doesn't play a role in the linter).

Set ```type``` to either ```error``` or ```warning```, depending on the severity of the rule.

Describe exactly what your rule does inside ```description```

-> Add a new file called ```foo-bar.js``` inside the **lib/rules** directory. Below is the basic template for the rule file:

```js
/**
 * @fileoverview DESCRIPTION OF THIS RULE
 * @author YOUR NAME <YOUR EMAIL ID>
 */

'use strict';

module.exports = {

	meta: {
		fixable: 'whitespace'
	},

	verify: function (context) {

		/**
		 * The SourceCode object provides several functions for the developer to make use of.
		 * See below for a list of all functions.
		 */
		var sourceCodeObject = context.getSourceCode ();

		/**
		 * targetNodeType is the type of node your rule should apply on.
		 * So if your rule must apply to all the import statements, that's your target node.
		 */
		var targetNodeType = 'ImportStatement';

		/**
		 * context internally uses EventEmitter to emit an event while entering or leaving a node during the Depth first traversal of the AST
		 * The name of the event is the same as the type of the node.
		 * So, for instance, the event for capturing a for loop is 'ForStatement'.
		 * To know which event you need to capture, a good practice is to install solparse or solidity-parser,
		 *  parse some sample code into AST,
		 *  then examine the particular node of interest for its 'type' field.
		 */
		context.on (targetNodeType, function (emitted) {

			//include this code if you only wish to execute your rule while ENTERING the node
			if (emitted.exit) {
				return;
			}

			//access the node using...
			var node = emitted.node;

			//Write your rule's validation logic. Now, suppose an error has occured:

			context.report ({
				node: node,
				message: 'Your message: try to make it as short and descriptive as possible',
				location: {	//optional
					line: 1,	//optional
					column: 2	//optional
				},
				fix: function (fixer) {
					// fixer object exposes a set of functions to operate on nodes or range of source code.
					// An example could be that you want to replace the contents of the current node:
					return fixer.replaceText (this.node, 'BLAH_BLAH');
					
					// If you want to return multiple fixes, simply return them inside an array.
					// Scroll down for an exhaustive list of methods provided by fixer.
				}
			});

		});

	}

};
```

See the [existing rules](https://github.com/duaraghav8/Solium/tree/master/lib/rules) to better understand rule implementation.

-> For the last step, navigate to **test/lib/rules**, create a directory ```foo-bar```. Inside the directory, create a file ```foo-bar.js```. Use the below template for your rule:

```js
/**
 * @fileoverview Tests for foo-bar rule
 * @author Name <YOUR_EMAIL_ID>
 */

'use strict';

var Solium = require ('../../../../lib/solium');

//INSERT YOUR RULE'S NAME IN THE BELOW userConfig Object, leave the rest of the object untouched
var userConfig = {
  "custom-rules-filename": null,
  "rules": {
    "foo-bar": true
  }
};

describe ('[RULE] foo-bar: Acceptances', function () {
	it ('should ... ', function (done) {
		//-------------------------YOUR TEST CASES
		
		Solium.reset ();
		done ();
	});
});

describe ('[RULE] foo-bar: Rejections', function () {
	it ('should ... ', function (done) {
		//-------------------------YOUR TEST CASES
		
		Solium.reset ();
		done ();
	});
});
```

Use ```Should.js``` to implement tests for your rule. Write code snippets of both types - those that should be accepted without errors and those that should fail in the presence of your rule.

See the [existing rule tests](https://github.com/duaraghav8/Solium/tree/master/test/lib/rules) for a better understanding.

## That's it!
Yep, you're done and ready to make a Pull Request.

Hopefully, you didn't have much trouble following this guide. If you think it has some flaws or it could be improved in some way, please open up an issue.

# Functions available to rule implementers

```getText (node)``` - get source code for the specified node. If no arguments given, it returns the complete source code

```getTextOnLine (lineNumber)``` - get the complete text on the specified line number (```lineNumber``` is an Integer)

```getLine (node)``` - get the line number on which the specified node's code **starts**

```getEndingLine (node)``` - get the line number on which the specified node's code **ends**

```getColumn (node)``` - get column no. of the **first character** of the specified node's code

```getEndingColumn (node)``` - get column no. of the **last character** of the specified node's code

```getParent (node)``` - get the parent node of the specified node

```getNextChar (node)``` - get 1 character after the code of specified node

```getPrevChar (node)``` - get 1 character before the code of specified node

```getNextChars (node, charCount)``` - get charCount no. of characters after the code of specified node

```getPrevChars (node, charCount)``` - get charCount no. of characters befre the code of specified node

```isASTNode (arg)``` - Returns ```true``` if the given argument is a valid (Spider-Monkey compliant) AST Node

```getStringBetweenNodes (prevNode, nextNode)``` - get the complete code between 2 specified nodes. (The code ranges from ```prevNode.end``` (inclusive) to ```nextNode.start``` (exclusive) )

# Functions provided by the fixer object

`insertTextAfter (node, text)` - inserts text after the given node

`insertTextAfterRange (range, text)` - inserts text after the given range

`insertTextBefore(node, text)` - inserts text before the given node

`insertTextBeforeRange(range, text)` - inserts text before the given range

`remove (node)` - removes the given node

`removeRange(range)` - removes text in the given range

`replaceText(node, text)` - replaces the text in the given node

`replaceTextRange(range, text)` - replaces the text in the given range


Where `range` is an array of 2 integers, like `[12, 19]`, `node` is a valid AST node and `text` is a valid string.

The above functions all return a `Fixer` Packet that looks like:
```js
{
	range: [2, 10],
	text: 'hello world'
}
```

The `fix()` function written by a rule dev can return one of the following:
1. a `Fixer` packet.
2. An array of `Fixer` packets

**NOTE:** If you make a `fix()` function which returns multiple fixing objects, those fixing objects must not be overlapped.
Also, given fixes won't be applied unless your rule also exports the `meta.fixable` property. For eg-
```js
module.exports = {
	meta: { fixable: 'code'	/* alternatively, the value could be 'whitespace'*/ },
	verify: function (..) {..}
};
```
