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
Install Solium v1 as a local module using ``npm install --save solium@v1``.

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


.. index:: writing-core-rule

*******************
Writing a Core Rule
*******************

coreeee


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
