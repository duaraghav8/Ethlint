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


.. index:: writing-core-rule

*******************
Writing a Core Rule
*******************

To write a core rule for Solium, please start by raising an issue on `github <https://github.com/duaraghav8/Solium>`_ describing you proposal. You can check out some of the rules in the roadmap in our `Rules Wishlist <https://github.com/duaraghav8/Solium/issues/44>`_.

Say you want to develop a new rule ``foo-bar``. Here's how you'd go about it:

Create...
=========

\.\.\.a file ``foo-bar.js`` inside `lib/rules <https://github.com/duaraghav8/Solium/tree/master/lib/rules>`_. This is the main implementation of your rule. Use the below template to implement your core rule:

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

		create(context) {
			function lintIfStatement(emitted) {
				const node = emitted.node;

				if(emitted.exit) { return; }

				context.report({
					node,
					fix(fixer) {
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

Your rule should expose an object that contains 2 attributes - ``meta`` object which describes the rule and ``create()`` function that actually peroforms linting over the given solidity code.

``meta``

- Contains ``docs`` object used to describe the rule.
- The ``schema`` object is used to describe the schema of options the user can pass to this rule via soliumrc config (see `AJV <https://github.com/epoberezkin/ajv>`_). This ensure that a valid set of options are passed to your rule. You can see the schema of `quotes <https://github.com/duaraghav8/Solium/blob/master/lib/rules/quotes.js#L37>`_ rule to understand how to write the schema for your rule.
- The ``fixable`` attribute can have value as either ``code`` or ``whitespace``. Set this attribute if your rule also contains fixes for the issues you report. Use ``whitespace`` if your rule only add/removes whitespace from the code. Else use ``code``.
- When a rule needs to be deprecated, we can add ``deprecated: true`` inside meta. We can add ``replacedBy: ["RULE NAME"]`` inside meta.docs if this rule is to be replaced by a new rule (see `example <https://github.com/duaraghav8/Solium/blob/master/lib/rules/double-quotes.js#L32-L36>`_).

.. note::
	``replacedBy`` doesn't force the linter to apply the new rule. Instead, it only throws a warning to the user, notifying them that they're using a deprecated rule and should consider moving to the new rule(s) specified inside ``replacedBy`` array. Try adding ``double-quotes: "error"`` inside ``rules`` inside your soliumrc.json and running the linter.

``create()``

This function is responsible for actual processing of the contract code, determining whether something is wrong or not, reporting an issue and suggesting fixes.
create() must return an object whose Key is an AST node type, and value is the function to execute on that node. So, for example, ``IfStatement`` is the type of the AST node representing an `if` clause and block in solidity.

.. note::
	To know which node type you need to capture, install `solparse <https://github.com/duaraghav8/solparse>`_, parse some sample code into AST, then examine the particular node of interest for its `type` field. Specify that type as your return object key.


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
