##########
User Guide
##########

.. index:: quickstart

**********
Quickstart
**********

- ``npm install -g solium``
- ``cd myDapp``
- ``solium --init``
- ``solium -d contracts/`` or ``solium -d .`` or ``solium -f myContract.sol``

Fix stuff

- ``solium -f myContract.sol --fix``
- ``git diff myContract.sol``


.. index:: installation

************
Installation
************

Since this documentation is for Solium ``v1``, we're going to neglect ``v0``. Furthermore, ``v0`` is now deprecated and we highly recommend you to move to ``v1``.

Use ``npm install -g solium``.

Verify that all is working fine using ``solium -V``.

Install from the snap store
===========================

In any of the `supported Linux distros <https://snapcraft.io/docs/core/install>`_, ``sudo snap install solium --edge``

.. note::
	If you're using vim with syntastic, and prefer to use a locally installed version of Solium (rather than a global version), you can install `syntastic local solium <https://github.com/sohkai/syntastic-local-solium.vim>`_ to automatically load the local version in packages that have installed their own.


.. index:: usage

*****
Usage
*****

``cd`` to your DApp directory and run ``solium --init``. This will produce ``.soliumrc.json`` and ``.soliumignore`` files in your root directory. Both are to be commited to version control.

Now run ``solium --dir .`` to lint all ``.sol`` files in your directory and sub-directories.

If you want to run the linter over a specific file, use ``solium --file myContract.sol``.

You can also run solium so it watches your directory for changes and automatically re-lints the contracts:
``solium --watch --dir contracts/``.

By default, solium looks for the ``.soliumrc.json`` configuration file in your current directory. You can override this setting by using the ``--config``/``-c`` option like ``solium -d contracts/ -c ../configs/.soliumrc.json``.

Solium supports multiple output formats:

- ``Pretty`` (Default): ``--reporter pretty``
- ``GCC``: ``--reporter gcc``


Use ``solium --help`` for more information on usage.

.. note::
	If all your contracts reside inside a directory like ``contracts/``,
	you can instead run ``solium --dir contracts``.

.. note::
	``-d`` can be used in place of ``--dir`` and ``-f`` in place of ``--file``.


You can specify rules or plugins to apply as commandline options. If you specify one, it overrides its corresponding configuration in the soliumrc file.

``solium --plugin zeppelin --rule 'indentation: ["error", 4]' -d contracts/``

Use ``--no-soliumrc`` and ``--no-soliumignore`` if you want to run solium in any arbitrary folder without looking for the config files.

``solium --no-soliumrc --no-soliumignore --plugin zeppelin --rule 'indentation: ["error", 4]' -f contract.sol``

After linting over your code, Solium produces either warnings, errors or both. The tool exits with a non-zero code only if 1 or more errors were found.
So if all you got was warnings, solium exits with ``0``.

Whether an issue should be flagged as an error or warning by its rule is configurable through ``.soliumrc.json``.


.. index:: configuring the linter

**********************
Configuring the Linter
**********************
Think of Solium as a 2-sided engine. 1 side accepts the Solidity smart contracts along with a configuration and the other a set of rule implementations.

Solium's job is to **execute the rules on the contracts based on the configuration**!

You can configure solium in several ways. You can choose which all rules to apply on your code, what should their severity be (either `error` or `warning`) and you can pass them options to modify their behavior. Rule implementations will **always** contain default behavior, so its fine if you don't pass any options to a rule.

Solium contains some core rules and allows for third party developers to write plugins.

The ``.soliumrc.json`` created in the initialisation phase contains some default configurations for you to get started.

.. code-block:: javascript

	{
		"extends": "BASE RULESET",
		"plugins": ["security"],
		"rules": {
			"RULE NAME": ["SEVERITY", "PARAMETERS"],
			"RULE NAME": "ONLY SEVERITY"
		}
	}

- By default, soliumrc inherits ``solium:recommended`` (starting ``v1.1.3``, prior to which it was ``solium:all``) - the base ruleset which enables all non-deprecated rules recommended for general audience. You can replace the value by a sharable config's name (see `Sharable Configs`_).
- A few rules are passed additional configuration, like double quotes for all strings, 4 spaces per indentation level, etc.
- Solium comes bundled with its official security plugin. By default, this plugin is enabled. **We recommend that you keep the security plugin enabled without modifying behaviour of any of its rules.** But if you still wish to configure them or remove the plugin altogether, you can.

.. note::
	soliumrc must contain at least one of ``extends``, ``plugins`` and ``rules`` properties.

.. note::
	Severity can be expressed either as a string or integer. ``error`` = ``2``, ``warning`` = ``1``. ``off`` = ``0``, which means the rule is turned off.


.. index:: configuring with comments

Configuring with comments
=========================
**Comment Directives** can be used to configure Solium to ignore specific pieces of code.
They follow the pattern ``solium-disable<optional suffix>``.

If you only use the directive, Solium disables all rules for the marked code. If that's not desirable, specify the rules to disable after the directive, separated by comma.

- Disable linting on a specific line

.. code-block:: javascript

	contract Foo {
		/* solium-disable-next-line */
		function() {
			var bar = 'Hello world';	// solium-disable-line quotes

			// solium-disable-next-line security/no-throw, indentation
							throw;
		}
	}

- Disable linting on entire file

.. code-block:: javascript

	/* solium-disable */

	contract Foo {
		...
	}


.. index:: automatic code formatting

*************************
Automatic code formatting
*************************

For the times when you're feeling lazy, just run ``solium -d contracts/ --fix`` to fix your lint issues.
This doesn't fix all your problems (nothing fixes all your problems) but all lint issues that CAN be fixed WILL be fixed, if the rule implementation that flags the issue also contains a fix for it.

.. warning::
	Solium fixes your code in-place, so your original file is over-written.
	It is therefore recommended that you use this feature after ensuring that your original files are easily recoverable (recovering can be as simple as ``git checkout``).
	You have been warned.

.. note::
	It is not guaranteed that all the fixes will be applied to your contract code. Below is a brief explanation of why it is so. Skip to the next section if you don't wish to know the details, they're not necessary as long as you accept the idea.

How the autofix mechanism works is:

- All rule implementations (either core or plugin) supply their fixes via the ``fix()`` method
- All rules are executed on your solidity code and their provided fixes registered
- The supplied fixes are then sorted. Starting from the 1st line & 1st character, the fix that wishes to manipulate code earlier gets applied earlier. So if fix ``A`` wants to start make changes from Line 1, Char 7 to Line 1 Char 15 and fix ``B`` starts at Line 2 Char 19, the order of fixes applied is ``A`` -> ``B``.
- In case of overlapping fixes, the **one that comes later is discarded**. If fix ``C`` wishes to make changes starting at Line 1 Char 9, it will result in a conflict with fix ``A`` in the previous point. In this case, ``A`` gets applied but ``C`` doesn't. So even though we have a total of 3 fixes, only 2 get applied.

.. note::
	In case of the ``A``, ``B``, ``C`` example, its easy to conclude that if you run the linter with autofixing twice, you will have applied all 3 fixes. The first run applies ``A`` and ``B``, whilst the second run will apply ``C`` as well, because this time there is no ``A`` to conflict with.

.. note::
	Fixes for all possible errors have not been implemented yet. Whichever rules have the fix mechanism (for eg- the ``quotes`` rule does) will apply it. More fixes will be added in future, you can see the list of rules below to know which rules are currently able to apply fixes.
	So if you see a warning/error despite using ``--fix``, its because that issue wasn't resolved by the autofix mechanism (either because the fix doesn't exist at the moment or due to a conflict).


.. index:: sharable configs

****************
Sharable Configs
****************

The list of rules in Solium will keep growing over time. After a point, its just overkill to spend time specifying rules, their severities and options in your soliumrc every time you create a new Solidity Project. At that time, you can either choose to inherit ``solium:recommended`` or ``solium:all`` configuration or borrow configurations written by others.

A Sharable Config allows you to borrow someone else's soliumrc configuration. The idea is to simply pick a style to follow and focus on your business problem instead of making your own style specification.

Even if there are 1 or 2 rules that you disagree with in someone else's sharable config, you can always inherit it and override those rules in your soliumrc!

Sharable Configs are installed via NPM. All solium SCs will have a prefix ``solium-config-``. Distributors of sharable configs are encouraged to add ``solium`` and ``soliumconfig`` as tags in their NPM modules to make them more discoverable.

Suppose `Consensys <https://github.com/ConsenSys/smart-contract-best-practices>`_ releases their own sharable config called ``solium-config-consensys``. Here's how you'd go about using it, assuming you already have solium globally installed:

- Run ``npm install -g solium-config-consensys``
- Now, in your ``.soliumrc.json``, set the value of ``extends`` key to ``consensys`` and remove the ``rules`` key altogether. Your config file should now look something like:

.. code-block:: javascript

	{
		"extends": "consensys"
	}

.. note::
	The above assumes that you completely follow consensys's style spec. If, say, you don't agree with how they've configured a rule ``race-conditions``. You can override this rule and add your own spec inside the ``rules`` key. This way, you follow all rules as specified in consensys' sharable config except ``race-condition``, which you specify yourself.

.. code-block:: javascript

	{
		"extends": "consensys",
		"rules": {
			"race-condition": ["error", {"reentrancy": true, "cross-function": false}, 100, "foobar"]
		}
	}


That's it! Now you can run ``solium -d contracts/`` to see the difference.

Note that you **didn't have to specify the prefix of the sharable config**. Whether you're specifying a config or a plugin name, you should omit their prefixes (``solium-config-`` for configs & ``solium-plugin-`` for plugins). So if you have installed a config ``solium-config-foo-bar``, you should have ``"extends": "foo-bar"`` in your ``.soliumrc.json``. Solium will resolve the actual npm module name for you.

.. note::
	Internally, Solium simply ``require()`` s the config module. So as long as require() is able to find a module named ``solium-config-consensys``, it doesn't matter whether you install your config globally or locally and link it.

.. note::
	1 limitation here is that Sharable configs can currently not import Plugins. This means SCs can only configure the core rules provided by Solium. Plugin importing is a work in progress, please be patient!


.. index:: plugins

*******
Plugins
*******

Plugins allow Third party developers to write their own rules and re-distribute them via NPM. Every solium plugin module has the prefix ``solium-plugin-``. Plugin developers are encouraged to include the tags ``solium`` and ``soliumplugin`` in their modules for easy discoverability.

Once you install a plugin, you can specify it inside ``plugins`` array and configure its rules inside ``rules`` exactly like how you configure solium's core rules. Plugin rules too can contain fixes if the developer supplies them. There's no special way of applying these fixes. Simply lint with the ``--fix`` option and fixes for both core rules and pugin rules will be applied to your code.

Coming back to our previous example - Consensys' ``solium-plugin-consensys``:

- Install the plugin using ``npm install -g solium-plugin-consensys``
- Add the plugin's entry into your ``.soliumrc.json``:

.. code-block:: javascript

	{
		"extends": "solium:recommended",
		"plugins": ["consensys"]
	}

.. note::
	Just like in sharable configs, don't specify the plugin prefix. Simply specify the plugin name. So if a plugin exists on NPM by the name of ``solium-plugin-foo-bar``, you need only specify ``"plugins": ["foo-bar"]``.

- In the ``rules`` object, you can configure the plugin's rules by adding an entry ``"<PLUGIN NAME>/<RULE NAME>": "<SEVERITY>"`` or ``"<PLUGIN NAME>/<RULE NAME>": ["<SEVERITY>", "<OPTIONS>"]``.

.. code-block:: javascript

	{
		"extends": "solium:recommended",
		"plugins": ["consensys"],
		"rules": {
			"consensys/race-conditions": "error",
			"consensys/foobar": [1, true, "Hello world"]
		}
	}

- The above configuration means you've applied all the rules supplied by the plugin and modified the behaviour of 2 of them. Try running the linter using ``solium -d contracts/``.

If you simply specify a plugin and do not configure any of its rules, all the rules provided by the plugin are applied on your code with their default severities and no additional options. **If you wish to change the behaviour of any of the rules of a plugin, you have to configure them inside "rules".**

You should check the plugin's documentation provided by the plugin developer to know the list of rules provided and the options they accept.

.. note::
	Just like in sharable configs, solium internally ``require()`` s the plugin module. So as long as require() is able to find a module named ``solium-plugin-consensys``, it doesn't matter whether you install your plugin globally or locally and link it.


Recommended Security Plugin
===========================

Starting ``v1.0.1``, Solium comes pre-installed with its `official security plugin <https://github.com/duaraghav8/solium-plugin-security>`_ (`view on NPM <https://www.npmjs.com/package/solium-plugin-security>`_) containing lint rules for best security practices. These rules have been taken from `Consensys recommended practices <https://consensys.github.io/smart-contract-best-practices/recommendations/>`_ and Solium's `Rule Wishlist thread <https://github.com/duaraghav8/Solium/issues/44>`_.

You can get information about all the rules this plugin supplies on its `README <https://github.com/duaraghav8/solium-plugin-security/blob/master/README.md>`_.

When you run ``solium --init``, the ``.soliumrc.json`` created for you contains the entry ``"plugins": ["security"]``. This means all security rules will by default be applied during linting.

**We recommend that you keep the security plugin applied without modifying behaviour of any of its rules.** But if you still wish to configure them or remove the plugin altogether, you can.


.. index:: list of core rules

*******************
List of Style Rules
*******************

.. note::
       See `security plugin <https://github.com/duaraghav8/solium-plugin-security/blob/master/README.md#list-of-rules>`_ if you're looking for documentation on Solium's security rules.

Below is the list of style rules supplied by Solium. By default, ``solium:recommended`` is extended by your soliumrc, which enables all lint rules recommended for general audience (See `solium-recommended <https://github.com/duaraghav8/Solium/blob/master/config/rulesets/solium-recommended.js>`_).
You can choose to further configure their severities inside your soliumrc itself.
If you choose ``solium:all`` instead, all core rules are enabled **except for the deprecated ones**.
Enabling a deprecated rule will display a warning message on Solium CLI.

These rules may or may not contain fixes. Their fixes will be applied on the code if you use the ``--fix`` flag in your lint command. Some rules even take options that can modify their behavior.

For eg- your choice of indentation might be Tab or 4 spaces or 2 spaces. What indentation is enforced is configurable.


+----------------------------+--------------------------------------------------------------------------------------------------------------+-----------------------------------------------------------------------------------+-------------------------------------+-------+
|            Name            |                                                  Description                                                 |                                      Options                                      |     Defaults                        | Fixes |
+----------------------------+--------------------------------------------------------------------------------------------------------------+-----------------------------------------------------------------------------------+-------------------------------------+-------+
| imports-on-top             | Ensure that all import statements are on top of the file                                                     |                                         -                                         |                                     | YES   |
+----------------------------+--------------------------------------------------------------------------------------------------------------+-----------------------------------------------------------------------------------+-------------------------------------+-------+
| variable-declarations      | Ensure that names 'l', 'O' & 'I' are not used for variables                                                  | Array of strings representing forbidden names. This overwrites the default names. | ['l', 'O', 'I']                     |       |
+----------------------------+--------------------------------------------------------------------------------------------------------------+-----------------------------------------------------------------------------------+-------------------------------------+-------+
| array-declarations         | Ensure that array declarations don't have space between the type and brackets                                |                                         -                                         |                                     | YES   |
+----------------------------+--------------------------------------------------------------------------------------------------------------+-----------------------------------------------------------------------------------+-------------------------------------+-------+
| operator-whitespace        | Ensure that operators are surrounded by a single space on either side                                        |                                         -                                         |                                     |       |
+----------------------------+--------------------------------------------------------------------------------------------------------------+-----------------------------------------------------------------------------------+-------------------------------------+-------+
| conditionals-whitespace    | Ensure that there is exactly one space between conditional operators and parenthetic blocks                  |                                         -                                         |                                     |       |
+----------------------------+--------------------------------------------------------------------------------------------------------------+-----------------------------------------------------------------------------------+-------------------------------------+-------+
| comma-whitespace           | Ensure that there is no whitespace or comments between comma delimited elements and commas                   |                                         -                                         |                                     |       |
+----------------------------+--------------------------------------------------------------------------------------------------------------+-----------------------------------------------------------------------------------+-------------------------------------+-------+
| semicolon-whitespace       | Ensure that there is no whitespace or comments before semicolons                                             |                                         -                                         |                                     |       |
+----------------------------+--------------------------------------------------------------------------------------------------------------+-----------------------------------------------------------------------------------+-------------------------------------+-------+
| function-whitespace        | Ensure function calls and declaration have (or don't have) whitespace in appropriate locations               |                                         -                                         |                                     |       |
+----------------------------+--------------------------------------------------------------------------------------------------------------+-----------------------------------------------------------------------------------+-------------------------------------+-------+
| lbrace                     | Ensure that every if, for, while and do statement is followed by an opening curly brace '{' on the same line |                                         -                                         |                                     |       |
+----------------------------+--------------------------------------------------------------------------------------------------------------+-----------------------------------------------------------------------------------+-------------------------------------+-------+
| mixedcase                  | Ensure that all variable, function and parameter names follow the mixedCase naming convention                |                                         -                                         |                                     |       |
+----------------------------+--------------------------------------------------------------------------------------------------------------+-----------------------------------------------------------------------------------+-------------------------------------+-------+
| camelcase                  | Ensure that contract, library, modifier and struct names follow CamelCase notation                           |                                         -                                         |                                     |       |
+----------------------------+--------------------------------------------------------------------------------------------------------------+-----------------------------------------------------------------------------------+-------------------------------------+-------+
| uppercase                  | Ensure that all constants (and only constants) contain only upper case letters and underscore                |                                         -                                         |                                     |       |
+----------------------------+--------------------------------------------------------------------------------------------------------------+-----------------------------------------------------------------------------------+-------------------------------------+-------+
| no-with [DEPRECATED]       | Ensure no use of with statements in the code                                                                 |                                         -                                         |                                     |       |
+----------------------------+--------------------------------------------------------------------------------------------------------------+-----------------------------------------------------------------------------------+-------------------------------------+-------+
| no-empty-blocks            | Ensure that no empty blocks {} exist                                                                         |                                         -                                         |                                     |       |
+----------------------------+--------------------------------------------------------------------------------------------------------------+-----------------------------------------------------------------------------------+-------------------------------------+-------+
| no-unused-vars             | Flag all the variables that were declared but never used                                                     |                                         -                                         |                                     |       |
+----------------------------+--------------------------------------------------------------------------------------------------------------+-----------------------------------------------------------------------------------+-------------------------------------+-------+
| double-quotes [DEPRECATED] | Ensure that string are quoted with double-quotes only. Deprecated and replaced by "quotes".                  |                                         -                                         |                                     |       |
+----------------------------+--------------------------------------------------------------------------------------------------------------+-----------------------------------------------------------------------------------+-------------------------------------+-------+
| quotes                     | Ensure that all strings use only 1 style - either double quotes or single quotes                             |                    Single option - either "double" or "single"                    | double                              | YES   |
+----------------------------+--------------------------------------------------------------------------------------------------------------+-----------------------------------------------------------------------------------+-------------------------------------+-------+
| blank-lines                | Ensure that there is exactly a 2-line gap between Contract and Funtion declarations                          |                                         -                                         |                                     | YES   |
+----------------------------+--------------------------------------------------------------------------------------------------------------+-----------------------------------------------------------------------------------+-------------------------------------+-------+
| indentation                | Ensure consistent indentation of 4 spaces per level                                                          |            either "tab" or an integer representing the number of spaces           | 4 spaces                            |       |
+----------------------------+--------------------------------------------------------------------------------------------------------------+-----------------------------------------------------------------------------------+-------------------------------------+-------+
| arg-overflow               | In the case of 4+ elements in the same line require they are instead put on a single line each               |          Single integer representing the number of args to allow per line         | 4                                   |       |
+----------------------------+--------------------------------------------------------------------------------------------------------------+-----------------------------------------------------------------------------------+-------------------------------------+-------+
| whitespace                 | Specify where whitespace is suitable and where it isn't                                                      |                                         -                                         |                                     |       |
+----------------------------+--------------------------------------------------------------------------------------------------------------+-----------------------------------------------------------------------------------+-------------------------------------+-------+
| deprecated-suicide         | Suggest replacing deprecated 'suicide' for 'selfdestruct'                                                    |                                         -                                         |                                     | YES   |
+----------------------------+--------------------------------------------------------------------------------------------------------------+-----------------------------------------------------------------------------------+-------------------------------------+-------+
| pragma-on-top              | Ensure a) A PRAGMA directive exists and b) its on top of the file                                            |                                         -                                         |                                     | YES   |
+----------------------------+--------------------------------------------------------------------------------------------------------------+-----------------------------------------------------------------------------------+-------------------------------------+-------+
| function-order             | Ensure order of functions in a contract: constructor,fallback,external,public,internal,private               |                                         -                                         |                                     |       |
+----------------------------+--------------------------------------------------------------------------------------------------------------+-----------------------------------------------------------------------------------+-------------------------------------+-------+
| emit                       | Ensure that emit statement is used to trigger a solidity event                                               |                                         -                                         |                                     | YES   |
+----------------------------+--------------------------------------------------------------------------------------------------------------+-----------------------------------------------------------------------------------+-------------------------------------+-------+
| no-constant                | Ensure that view is used over deprecated constant in function declarations                                   |                                         -                                         |                                     | YES   |
+----------------------------+--------------------------------------------------------------------------------------------------------------+-----------------------------------------------------------------------------------+-------------------------------------+-------+
| value-in-payable           | Ensure 'msg.value' is only used in functions with the 'payable' modifier                                     |                                         -                                         |                                     |       |
+----------------------------+--------------------------------------------------------------------------------------------------------------+-----------------------------------------------------------------------------------+-------------------------------------+-------+
| no-experimental            | Ensure that experimental features are not used in production                                                 |                                         -                                         |                                     |       |
+----------------------------+--------------------------------------------------------------------------------------------------------------+-----------------------------------------------------------------------------------+-------------------------------------+-------+
| max-len                    | Ensure that a line of code doesn't exceed the specified number of characters                                 |  Single integer representing the number of characters to allow per line of code   | 145                                 |       |
+----------------------------+--------------------------------------------------------------------------------------------------------------+-----------------------------------------------------------------------------------+-------------------------------------+-------+
| error-reason               | Ensure that error message is provided for revert and require statements                                      |            Object with "revert" and "require" keys with boolean values            | { "revert": true, "require": true } |       |
+----------------------------+--------------------------------------------------------------------------------------------------------------+-----------------------------------------------------------------------------------+-------------------------------------+-------+
| visibility-first           | Ensure that the visibility modifier for a function should come before any custom modifiers                   |                                         -                                         |                                     |       |
+----------------------------+--------------------------------------------------------------------------------------------------------------+-----------------------------------------------------------------------------------+-------------------------------------+-------+
| linebreak-style            | Ensure consistent linebreak style                                                                            |                    linebreak style (either "windows" or "unix")                   |  unix                               | YES   |
+----------------------------+--------------------------------------------------------------------------------------------------------------+-----------------------------------------------------------------------------------+-------------------------------------+-------+


.. index:: IDE and Editor integrations

*************************
IDE & Editor Integrations
*************************

-  `VS Code: Solidity with Solium linting by Beau Gunderson`_
-  `ethereum/emacs-solidity with Solium support by Lefteris Karapetsas`_
-  `VS Code: Solidity with Solium linting by Juan Blanco`_
-  `VS Code: Solidity with Solium linting by CodeChain.io`_
-  `Sublime Solium Gutter by Florian Sey`_
-  `Sublime Solium Linter by Alex Step`_
-  `Atom Solium Linter by Travis Jacobs`_
-  `Syntastic local solium by Brett Sun`_
-  `Solium Ale Integration by Jeff Sutherland`_
-  `Solium Neomake Integration by Beau Gunderson`_
-  `Solium official plugin for Embark Framework`_

.. _`VS Code: Solidity with Solium linting by Beau Gunderson`: https://marketplace.visualstudio.com/items?itemName=beaugunderson.solidity-extended
.. _`ethereum/emacs-solidity with Solium support by Lefteris Karapetsas`: https://github.com/ethereum/emacs-solidity
.. _`VS Code: Solidity with Solium linting by Juan Blanco`: https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity
.. _`VS Code: Solidity with Solium linting by CodeChain.io`: https://marketplace.visualstudio.com/items?itemName=kodebox.solidity-language-server
.. _Sublime Solium Gutter by Florian Sey: https://github.com/sey/sublime-solium-gutter
.. _Sublime Solium Linter by Alex Step: https://github.com/alexstep/SublimeLinter-contrib-solium
.. _Atom Solium Linter by Travis Jacobs: https://github.com/travs/linter-solium
.. _Syntastic local solium by Brett Sun: https://github.com/sohkai/syntastic-local-solium.vim
.. _Solium Ale Integration by Jeff Sutherland: https://github.com/w0rp/ale
.. _Solium Neomake Integration by Beau Gunderson: https://github.com/neomake/neomake
.. _Solium official plugin for Embark Framework: https://github.com/duaraghav8/embark-solium


.. index:: migration guide

*******************
Migrating to v1.0.0
*******************

If you're currently using Solium ``v0`` and wish to migrate to ``v1``, then this section is for you.

.. note::
	If you simply upgrade to Solium v1 right now and lint your project with v0's configuration files, it will work fine (but will give you a deprecation warning) since v1 has been built in a backward-compatible manner. The only 2 exception to this are the discontinuation of ``custom-rules-filename`` attribute and ``--sync`` option - these features provided negligible benefit.

What you need to do
===================
Let's say your current ``.soliumrc.json`` looks like this:

.. code-block:: javascript

    {
      "custom-rules-filename": null,
      "rules": {
        "imports-on-top": false,
        "variable-declarations": false,
        "array-declarations": true,
        "operator-whitespace": true,
        "lbrace": true,
        "mixedcase": true,
        "camelcase": true,
        "uppercase": true,
        "no-empty-blocks": true,
        "no-unused-vars": true,
        "quotes": true,
        "indentation": true,
        "whitespace": true,
        "deprecated-suicide": true,
        "pragma-on-top": true
      }
    }

Please change it to this:

.. code-block:: javascript

    {
      "extends": "solium:recommended",
      "rules": {
        "imports-on-top": 0,
        "variable-declarations": 0,
        "indentation": ["error", 4],
        "quotes": ["error", "double"]
      }
    }

You:

- Only had to specify those rules separately whose behaviour you need to change. Set a rule to ``0`` or ``off`` to turn it off. Other values can be ``1``/``warning`` or ``2``/``error``.
- Set up the indentation rule to enforce 4 spaces (replace ``4`` with any other integer or ``tab``).
- Instructed Solium to enforce double quotes for strings (change that to ``single`` if you so desire).
- Instructed Solium to import all other non-deprecated rules and enable them by default.

.. note::
	Alternatively, you can back up your current ``.soliumrc.json`` and ``.soliumignore`` (if you made changes to it), then run ``solium init`` (after installing v1). You can then make changes to the new ``.soliumrc.json``.

A complete list of changes made in ``v1`` are documented below.

Custom Rule injection is now deprecated
=======================================

v0 allows you to inject custom rule implementations using the ``custom-rules-filename`` attribute in your ``.soliumrc.json``. This feature is now deprecated. If you specify a file, the linter would simply throw a warning informing you that the custom rules supplied will not be applied while linting.

Custom rule injection has now been replaced by Solium `Plugins`_.


Deprecated rules
================

Following rules have been deprecated:

- ``double-quotes`` has been replaced by ``quotes``.
- ``no-with``


soliumrc configuration has a new format
=======================================

A fully fledged example of v1's ``.soliumrc.json`` is:

.. code-block:: javascript

	{
		"extends": "solium:recommended",
		"plugins": ["consensys", "foobar"],
		"rules": {
			"consensys/race-conditions": "error",
			"consensys/foobar": [1, true, "Hello world"],
			"foobar/baz": 1
		}
	}

To learn about the new format, please see `Configuring the Linter`_.

Note that v1 still accepts the old soliumrc format but throws a format deprecation warning.


Rule implementation has a new format
====================================

.. note::
	Unless you're developing rules (whether core or plugins) for Solium, you can skip this part.

The new format of a rule implementation is:

.. code-block:: javascript

	module.exports = {
		meta: {
			docs: {
				recommended: true,
				type: 'warning',
				description: 'This is a rule'
			},
			schema: [],
			fixable: 'code'
		},

		create(context) {
			function lintIfStatement(emitted) {
				context.report({
					node: emitted.node,
					fix(fixer) {
						// magic
					}
				});
			}

			return {
				IfStatement: lintIfStatement
			};
		}
	};

See an example `on github <https://github.com/duaraghav8/Solium/blob/fafce50e3930011ffd2c8113a2ea1c97c5150d75/lib/rules/deprecated-suicide.js>`_.

Learn how to develop a Solium rule on the Developer Guide.


Additions in Solium API
=======================

There have been additions in the Solium API. However, there are no breaking changes.

- When using the ``lint(sourceCode, config)`` method (where ``config`` is your soliumrc configuration), you can now pass an ``options`` object inside ``config`` to modify Linter behavior. You can specify the ``returnInternalIssues`` option whose value is Boolean. If ``true``, solium returns internal issues (like deprecation warnings) in the error list. If ``false``, the method behaves exactly like in ``v0``, and doesn't spit out any warnings (even if, for eg, you're using deprecated rules).

.. code-block:: javascript

	const mySourceCode = '...',;
	const config = {
		extends: "solium:recommended",
		plugins: ["security"],
		rules: {
			"double-quotes": "error"
		},
		options: {
			returnInternalIssues: true
		}
	};

	const errors = Solium.lint(mySourceCode, config);
	// Now errors list contains a deprecated rule warning since "double-quotes" is deprecated.
	// If returnInternalIssues were false, we wouldn't receive this warning.

- The API now exposes another method ``lintAndFix()``. Guess what it does? Please refer to the developer guide on how to use this method to retrieve lint errors as well as the fixed solidity code along with a list of fixes applied.


--sync has been removed
=======================

v0's CLI allowed the ``--sync`` flag so a user could sync their ``.soliumrc.json`` with the newly added rules after updating solium. sync was not a great design choice and so we've removed it. v1 is designed in a way such that core developers can keep adding more rules to solium and a user doesn't need to do anything apart from installing an update in order to use that rule. It gets applied automatically.
