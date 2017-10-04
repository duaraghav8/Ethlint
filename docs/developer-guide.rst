###############
Developer Guide
###############

.. index:: architecture

************
Architecture
************

Solium is organized as a module that exposes an API for any javascript application to use. The user would supply a source code string along with a configuration object that determines what exactly solium does with the code.

``Solium`` refers to an engine (a middleman) that accepts user input (source code & configuration) from one side and rule implementations from another.
A rule implementation can refer to any piece of code that operates on the given solidity code's Abstract Syntax Tree, points out flaws and suggests fixes.

In a sense, Solium is a generic engine that operates on any given solidity code. The linter itself is a special use case of this engine where the "analyzer" refers to a set of rule implementations that tell whether something in the code looks right or wrong.
Because you can write plugins and get access to the complete solidity code, its AST and a solium-exposed set of utility functions to operate on the AST, you can build anything on top of solium that you can imagine!

Solium has a set of core rules for the purpose of linting code.

The frontend of the app is a CLI that a user uses to interact with the Solium module to get things done. The module exposes 2 main functions for usage: ``lint()`` and ``lintAndFix()``.

Architecture will be explained in more detail in future.


.. index:: dev-env

****************************************************
Installation & Setting up the Development Enviroment
****************************************************

Make sure you have Node.js and NPM installed on your system.
Install Solium v1 as a local module using ``npm install --save solium@v1``. The ``@v1`` tag is necessary till the time v1 is in Beta (until then, ``latest`` points to ``v0.5.5``).

You can now use Solium like:

.. code-block:: javascript

	const Solium = require('solium'),
		sourceCode = 'contract fOO_bar { string hola = \'hello\'; }';

	const errors = Solium.lint(sourceCode, {
		"extends": "solium:all",
		"rules": {
			"quotes": ["error", "double"],
			"double-quotes": [2],	// returns a rule deprecation warning
			"pragma-on-top": 1
		},

		"options": { "returnInternalIssues": true }
	});

	errors.forEach(console.log);

- Source Code can be either a string or a buffer object
- ``lint()`` takes in the source code, followed by the soliumrc configuration object.
- ``returnInternalIssues`` option tells solium to return internal issues (like rule deprecation) in addition to the lint issues. If this option is ``false``, Solium only returns lint issues. It is recommended that you set it to ``true``, otherwise you're missing out on a lot ;-)
- ``lint()`` returns an array of error objects. The function's output looks something like:

.. code-block:: javascript

	[
		{
			type: 'warning',
			message: '[DEPRECATED] Rule "double-quotes" is deprecated. Please use "quotes" instead.',
			internal: true,
			line: -1,
			column: -1
		},
		{
			ruleName: 'quotes',
			type: 'error',
			node: { type: 'Literal', value: 'hello', start: 79, end: 86 },
			message: '\'hello\': String Literals must be quoted with double quotes only.',
			line: 7,
			column: 15,
			fix: { range: [Array], text: '"hello"' }
		}
	]

- You can use the ``lintAndFix()`` function as demonstrated in the following example:

.. code-block:: javascript

	const Solium = require('solium'),
		sourceCode = 'contract fOO_bar { string hola = \'hello\'; }';

	const result = Solium.lintAndFix(sourceCode, {
		"extends": "solium:all",
		"rules": {
			"quotes": ["error", "double"],
			"double-quotes": [2],	// returns a rule deprecation warning
			"pragma-on-top": 1
		},

		"options": { "returnInternalIssues": true }
	});

	console.log(result);

The output of ``lintAndFix()`` look like:

.. code-block:: javascript

	{
		originalSourceCode: 'pragma solidity ^0.4.0;\n\n\nimport "./hello.sol";\n\ncontract Foo {\n\tstring hola = \'hello\';\n}\n',
		fixesApplied:[
			{ 
				ruleName: 'quotes',
				type: 'error',
				node: [Object],
				message: '\'hello\': String Literals must be quoted with double quotes only.',
				line: 7,
				column: 15,
				fix: [Object]
			}
		],
		fixedSourceCode: 'pragma solidity ^0.4.0;\n\n\nimport "./hello.sol";\n\ncontract Foo {\n\tstring hola = "hello";\n}\n',
		errorMessages: [
			{
				type: 'warning',
				message: '[DEPRECATED] Rule "double-quotes" is deprecated. Please use "quotes" instead.',
				internal: true,
				line: -1,
				column: -1 },
				{ ruleName: 'double-quotes',
				type: 'warning',
				node: [Object],
				message: '\'hello\': String Literals must be quoted with "double quotes" only.',
				line: 7,
				column: 15
			}
		]
	}


.. note::
	The input supplied to ``lint()`` and ``lintAndFix()`` is the same. Its the output format that differs.

To work with Solium:
- clone the repository to your local machine using, for eg, ``git clone git@github.com:duaraghav8/Solium.git``.
- Move into its directory using ``cd Solium``.
- Install all dependencies **and** dev dependencies using ``npm install``.
- To ensure that everything works fine, run ``npm test``. If you've cloned the ``master`` branch, there should be no test failures. If there are, please raise an issue or start a chat on our `Gitter channel <https://gitter.im/Solium-linter/Lobby#>`_.


.. index:: writing-core-rule

*******************
Writing a Core Rule
*******************

To write a core rule for Solium, please start by raising an issue on `github <https://github.com/duaraghav8/Solium>`_ describing you proposal. You can check out some of the rules in the roadmap in our `Rules Wishlist <https://github.com/duaraghav8/Solium/issues/44>`_.

.. note::
	Solium is currently written entirely in ES5. We plan to `move to ES6 <https://github.com/duaraghav8/Solium/issues/76>`_ but for now, please write all the JS code you'd be contributing to solium core in ES5.

Say you want to develop a new rule ``foo-bar``. Here's how you'd go about it:

Creating a core rule
====================

Create a file ``foo-bar.js`` inside `lib/rules <https://github.com/duaraghav8/Solium/tree/master/lib/rules>`_. This is the main implementation of your rule. Use the below template to implement your core rule:

.. code-block:: javascript

	module.exports = {
		meta: {
			docs: {
				recommended: true,
				type: 'warning',	// either 'warning' or 'error'
				description: 'This is my foobar rule'
			},
			schema: [],
			fixable: 'code'
		},

		create: function (context) {
			function lintIfStatement(emitted) {
				var node = emitted.node;

				if (emitted.exit) { return; }

				context.report({
					node: node
					fix: function(fixer) {
						// magic
					},
					message: 'Oh snap! A lint error:('
				});
			}

			return {
				IfStatement: lintIfStatement
			};
		}
	};

Your rule should expose an object that contains 2 attributes - ``meta`` object which describes the rule and ``create()`` function that actually lints over the given solidity code.

``meta``

- Contains ``docs`` object used to describe the rule.
- The ``schema`` object is used to describe the schema of options the user can pass to this rule via soliumrc config (see `AJV <https://github.com/epoberezkin/ajv>`_). This ensure that a valid set of options are passed to your rule. You can see the schema of `quotes <https://github.com/duaraghav8/Solium/blob/master/lib/rules/quotes.js#L37>`_ rule to understand how to write the schema for your rule.
- The ``fixable`` attribute can have value as either ``code`` or ``whitespace``. Set this attribute if your rule also contains fixes for the issues you report. Use ``whitespace`` if your rule only add/removes whitespace from the code. Else use ``code``.
- When a rule needs to be deprecated, we can add ``deprecated: true`` inside meta. We can add ``replacedBy: ["RULE NAME"]`` inside meta.docs if this rule is to be replaced by a new rule (see `deprecated example <https://github.com/duaraghav8/Solium/blob/master/lib/rules/double-quotes.js#L32-L36>`_).

.. note::
	``replacedBy`` doesn't force the linter to apply the new rule. Instead, it only throws a warning to the user, notifying them that they're using a deprecated rule and should consider moving to the new rule(s) specified inside ``replacedBy`` array. Try adding ``double-quotes: "error"`` inside ``rules`` inside your soliumrc.json and running the linter.

``create()``

This function is responsible for actual processing of the contract code, determining whether something is wrong or not, reporting an issue and suggesting fixes.
create() must return an object whose Key is an AST node type, and value is the function to execute on that node. So, for example, ``IfStatement`` is the type of the AST node representing an ``if`` clause and block in solidity.

.. note::
	To know which node type you need to capture, install `solparse <https://github.com/duaraghav8/solparse>`_, parse some sample code into AST, then examine the particular node of interest for its ``type`` field. Specify that type as your return object key. You can see `any rule implementation <https://github.com/duaraghav8/Solium/tree/master/lib/rules>`_ to understand what create()'s return object looks like.

The create() function receives a ``context`` object, which allows you to access the solidity code to be linted and many other things to help your rule work its magic.

- ``context.options`` - ``undefined`` if user doesn't supply any options to your rule through soliumrc. An Array of options otherwise. Solium ensures that the options passed inside the array are fully compliant with the ``schema`` you define for each of them in ``meta``. So if a user specifies ``foo-bar: ['error', 'hello', 110, {a: [99]}]``, then ``foo-bar`` rule's ``context.options`` contains the array ``['hello', 110, {a: [99]}]`` (all but the first item, because the first is the severity of the rule). See `options example <https://github.com/duaraghav8/Solium/blob/master/lib/rules/quotes.js#L47>`_.
- ``context.getSourceCode()`` - returns a SourceCode object that gives you access to the solidity code and several functions to operate on it and AST nodes.

The functions exposed by SourceCode object are as follows:

``getText (node)`` - get source code for the specified node. If no arguments given, it returns the complete source code

``getTextOnLine (lineNumber)`` - get the complete text on the specified line number (lineNumber is an Integer)

``getLine (node)`` - get the line number on which the specified node's code starts

``getEndingLine (node)`` - get the line number on which the specified node's code ends

``getColumn (node)`` - get column no. of the first character of the specified node's code

``getEndingColumn (node)`` - get column no. of the last character of the specified node's code

``getParent (node)`` - get the parent node of the specified node

``getNextChar (node)`` - get 1 character after the code of specified node

``getPrevChar (node)`` - get 1 character before the code of specified node

``getNextChars (node, charCount)`` - get charCount no. of characters after the code of specified node

``getPrevChars (node, charCount)`` - get charCount no. of characters befre the code of specified node

``isASTNode (arg)`` - Returns true if the given argument is a valid (Spider-Monkey compliant) AST Node

``getStringBetweenNodes (prevNode, nextNode)`` - get the complete code between 2 specified nodes. (The code ranges from prevNode.end (inclusive) to nextNode.start (exclusive) )

- ``context.report()`` - Lastly, the context object provides you with a clean interface to report lint issues:

.. code-block:: javascript

	context.report({
		node,	// the AST node retrieved through emitted.node (see below)
		fix(fixer) {	// [OPTIONAL]
			return [fixer.replaceText(node, "hello world!!")];
		},
		message: 'Lint issue raised yayy!',
		location: {	// [OPTIONAL]
			line: 9,	// [OPTIONAL]
			column: 20	// [OPTIONAL]
		}
	});

See `report with fix example <https://github.com/duaraghav8/Solium/blob/master/lib/rules/quotes.js#L67-L73>`_ and `report with location example <https://github.com/duaraghav8/Solium/blob/master/lib/rules/quotes.js#L67-L73>`_.

.. note::
	If you're supplying the ``fix()`` function, make sure you specify the ``fixable`` attribute in ``meta``.

Your ``fix()`` function will receive a ``fixer`` object that exposes several functions so you can tell Solium **how** to fix the raised lint issue. Every fixer function you call returns a fixer packet. Solium understands how to work with this packet. Your fix function must return either a single fixer packet or an array of fixer packets.

.. warning::
	Multiple fixer packets inside the array must not overlap, else Solium throws an error. For eg- the first packet tries to remove the first 10 characters from the solidity code, whereas another packet tries to replace them by, say, "hello world". This results in an overlap and hence the complete fix is not valid. However, if the replacement begins at the 11th character, then there is no conflict and so your fix is valid!

Below is the list of functions exposed by the ``fixer`` object:

``insertTextAfter (node, text)`` - inserts text after the given node

``insertTextAfterRange (range, text)`` - inserts text after the given range

``insertTextBefore(node, text)`` - inserts text before the given node

``insertTextBeforeRange(range, text)`` - inserts text before the given range

``remove (node)`` - removes the given node

``removeRange(range)`` - removes text in the given range

``replaceText(node, text)`` - replaces the text in the given node

``replaceTextRange(range, text)`` - replaces the text in the given range

Where ``range`` is an array of 2 integers, like ``[12, 19]``, ``node`` is a valid AST node retrieved from ``emitted.node`` (see below) and ``text`` is a valid string.


``emitted``

As mentioned earlier, ``create()`` should return an object. The function specified as the value for a key is responsible for operating over that AST node, so it gets passed an ``emitted`` object. This object's properties are as follows:

- ``emitted.exit`` - Solium passes an AST node to a rule twice - once when it enters the node during its Depth-first traversal and second when its leaving it. exit property, if true, means Solium is leaving the node. So if you only want your rule to execute once over a node, you can specify ``if(emitted.exit) { return; }``.

.. note::
	A common use case for ``exit`` is when you want your rule to access the whole contract's AST Node (type ``Program``) at the end, ie, when all other rules are done reporting their rules. Then you could specify ``if(!emitted.exit) { return; }``.

- ``emitted.node`` - is the AST Node object of type specified as the key in your return object. So if, for eg, your create() returns ``{ ForStatement: inspectForLoop }``, then you can access the AST Node representing the ``for`` loop in solidity like:

.. code-block:: javascript

	create(context) {
		function inspectForLoop(emitted) {
			const {node} = emitted;
			console.log (node.type);	// prints "ForStatement" and the node has appropriate properties of 'for' statement
		}

		return {ForStatement: inspectForLoop};
	}

See `emitted node example <https://github.com/duaraghav8/Solium/blob/master/lib/rules/quotes.js#L55>`_

You now have all the required knowledge to develop your core rule ``lib/rules/foo-bar.js``. Its now time to write tests.


Testing your Core rule
======================

- Inside the ``test/lib/rules``, creating a new diretcory ``foo-bar`` and a file inside this directory ``foo-bar.js`` (see `test examples <https://github.com/duaraghav8/Solium/tree/master/test/lib/rules>`_).
- Now paste the below template in ``test/lib/rules/foo-bar/foo-bar.js``:

.. code-block:: javascript

	/**
	 * @fileoverview Description of the rule
	 * @author YOUR NAME <your@email>
	 */

	'use strict';

	var Solium = require('../../../../lib/solium'),
		wrappers = require('../../../utils/wrappers');
	var toContract = wrappers.toContract, toFunction = wrappers.toFunction;

	// Solium should only lint using your rule so only issues flagged by your rule are reported
	// so you can easily test it. Replace foo-bar with your rule name.
	var config = {
		"rules": {
			"foo-bar": "error"	// alternatively - ["error" OR "warning", options acc. to meta.schema of rule]
		}
	};

	describe('[RULE] foo-bar: Rejections', function () {
		it('should reject some stuff', function(done) {
			var code = 'contract Blah { function bleh() {} }',
				errors = Solium.lint(code, config);

			// YOUR TESTS GO HERE. For eg:
			errors.should.be.size(2);	// If you're expecting your rule to flag 2 lint issues on the given code.

			Solium.reset();
			done();
		});
	});

	describe('[RULE] foo-bar: Acceptances', function () {
		it('should accept some stuff', function(done) {
			// YOUR LINTING & TESTS GO HERE. For eg:

			Solium.reset();
			done();
		});
	});

You're now ready to write your tests (see `shouldjs documentation <https://shouldjs.github.io/>`_).

After writing your tests, add an entry for your rule ``foo-bar`` in `solium json <https://github.com/duaraghav8/Solium/blob/master/config/solium.json>`_.

Finally, add an entry for your rule in `solium all <https://github.com/duaraghav8/Solium/blob/master/config/rulesets/solium-all.js>`_ ruleset: ``foo-bar: <SEVERITY>`` where severity should be how your rule should be treated by default (as an error or warning). Severity should be same as what you specified in your rule's ``meta.docs.type``.

Now run ``npm test`` and resolve any failures. Once everything passes, you're ready to make a Pull Request :D


.. index:: develop-sharable-config

****************************
Developing a Sharable Config
****************************

sharab


.. index:: develop-plugin

*******************
Developing a Plugin
*******************

dev plugin


.. index:: plugins

*******
Plugins
*******

Pluginss


.. index:: api-reference

*************
API Reference
*************

apiii


.. index:: building-doc

**********************************
Contributing to this documentation
**********************************

docss
