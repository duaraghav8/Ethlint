###################
User Guide
###################

.. index:: quickstart

**********
Quickstart
**********

- ``npm install -g solium@v1``
- ``cd myDapp``
- ``solium init``
- ``solium -d contracts/`` or ``solium -d .`` or ``solium -f myContract.sol``

Fix stuff

- ``solium -f myContract.sol --fix``
- ``git diff myContract.sol``


.. index:: installation

************
Installation
************

Since this documentation is for Solium ``v1`` (currently in Beta), we're going to neglect ``v0``.

Use ``npm install -g solium@v1``.

Once v1 is out of Beta, the above instruction will be removed and you will simply be able to use ``npm install -g solium`` to install it. Currently, this command would install the ``latest`` stable package that is ``v0.5.5``.

Verify that all is working fine using ``solium --version``.


.. index:: usage

*****
Usage
*****

``cd`` to your DApp directory and run ``solium --init``. This will produce ``.soliumrc.json`` and ``.soliumignore`` files in your root directory. Both are to be commited to version control.

Now run ``solium --dir .`` to lint all ``.sol`` files in your directory and sub-directories.

If you want to run the linter over a specific file, use ``solium --file myContract.sol``.

You can also run solium so it watches your directory for changes and automatically re-lints the contracts:
``solium --watch --dir contracts/``.

Use ``solium --help`` for more information on usage.

.. note::
	If all your contracts reside inside a directory like ``contracts/``,
	you can instead run ``solium --dir contracts``.

.. note::
	``-d`` can be used in place of ``--dir`` and ``-f`` in place of ``--file``.


After linting over your code, Solium produces either warnings, errors or both. The app exits with a non-zero code ONLY if 1 or more errors were found.
So if all you got was warnings, solium exits with code ``0``.

Whether an issue should be flagged as an error or warning by its rule is configurable through ``soliumrc.json``.


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
		"rules": {
			"RULE NAME": ["SEVERITY", "PARAMETERS"],
			"RULE NAME": "ONLY SEVERITY"
		}
	}

- By default, soliumrc inherits ``solium:all`` - the base ruleset which enables all non-deprecated rules. You can replace the value by a sharable config's name (see `Sharable Configs`_).
- A few rules are passed additional configuration, like double quotes for all strings, 4 spaces per indentation level, etc.

.. note::
	soliumrc must contain at least one of ``extends`` and ``rules``.


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


.. index:: sharable configs

****************
Sharable Configs
****************

The list of rules in Solium will keep growing over time. After a point, its just overkill to spend time specifying rules, their severities and options in your soliumrc every time you create a new Solidity Project. At that time, you can either choose to inherit ``solium:all`` configuration or borrow configurations written by others.

A Sharable Config allows you to borrow someone else's soliumrc configuration. The idea is to simply pick a style to follow and focus on your business problem instead of making your own style specification.

Even if there are 1 or 2 rules that you disagree with in someone else's sharable config, you can always inherit it and override those rules in your soliumrc!

Sharable Configs are installed via NPM. All solium SCs will have a prefix ``solium-config-``. Distributors of sharable configs are encouraged to add ``solium`` and ``soliumconfig`` as tags in their NPM modules to make them more discoverable.

Suppose `Consensys <https://github.com/ConsenSys/smart-contract-best-practices>`_ releases their own sharable config called ``solium-config-consensys``. Here's how you'd go about using it, assuming you already have solium globally installed:

- Run ``npm install -g solium-config-consensys``
- Now, in your ``soliumrc.json``, set the value of ``extends`` key to ``consensys`` and remove the ``rules`` key altogether. Your config file should now look something like:

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

Note that you **didn't have to specify the prefix of the sharable config**. Whether you're specifying a config or a plugin name, you should omit their prefixes (``solium-config-`` for configs & ``solium-plugin-`` for plugins). So if you have installed a config ``solium-config-foo-bar``, you should have ``"extends": "foo-bar"`` in your ``soliumrc.json``. Solium will resolve the actual npm module name for you.

.. note::
	Internally, Solium simply ``require()`` s the config module. So as long as require() is able to find a module named ``solium-config-consensys``, it doesn't matter whether you install your config globally or locally and link it.

.. note::
	1 limitation here is that Sharable configs can currently not import Plugins. This means SCs can only configure the core rules provided by Solium. Plugin importing is a work in progress, please be patient!


.. index:: plugins

*******
Plugins
*******

Pluginss


.. index:: core-rules

**********
Core Rules
**********

rulzzz


.. index:: migration-guide

*******************
Migrating to v1.0.0
*******************

migraate


.. index:: roadmap

*******
Roadmap
*******

Roaaad
