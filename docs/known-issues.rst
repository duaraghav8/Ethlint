############
Known Issues
############

While Solium is being actively maintained, a few major issues are still lurking around and we thought it best to make you aware of them so you don't spend time discovering them instead.

- Solium is currently **file-aware instead of being project-aware**. What this means is that while linting, Solium doesn't have the context of all the contracts and how they may be using the contract currently being linted. A consequence of this is that the linter currently flags a state variable as unused if it doesn't find its usage in the same contract, whereas its clearly possible that you're ``import`` ing the contract elsewhere to use that variable (See `issue <https://github.com/duaraghav8/Solium/issues/11>`_). This is a fairly critical problem and will be resolved in a future release. We believe a codebase-aware linter would be much more powerful because of its broader context.

- The linter's internal parser supports Solidity ``v0.5``. This means that it supports the `calldata <https://solidity.readthedocs.io/en/v0.5.2/types.html#data-location>`_ storage location specifier, but in a non-backward-compatible manner. If you're currently using Solidity version < 0.5 and have used ``calldata`` as a name for a variable or function parameter, you might see false lint issues because ``calldata`` is treated as location and hence, the variable name is seen as ``null``. Regardless of whether you use Solium or not, it is a good idea to rename all such variables to keep your code compatible with Solidity 0.5.

- When installing the Linter from the ``ethlint`` NPM package, you might see the following warning:

.. code-block:: bash

    npm WARN solium-plugin-security@0.1.1 requires a peer of solium@^1.0.0 but none is installed. You must install peer dependencies yourself.

You can safely ignore this warning.

Solium was recently `renamed <https://medium.com/solium/renaming-solium-to-ethlint-18b3cf043d15>`_ to Ethlint and the linter is available for download from both ``solium`` and ``ethlint`` NPM packages. Ethlint comes shipped with its Security plugin. This plugin checks to ensure whether ``solium`` NPM package is installed or not.

There is currently no way in NPM to *allow any one of the specified packages to satisfy as peer dependency*, so we can't specify ``solium OR ethlint``. We also cannot change ``solium`` to ``ethlint`` in ``peerDependencies`` because its a potential breaking change. See the `original issue <https://github.com/duaraghav8/solium-plugin-security/issues/33>`_.

- There is a limitation when using the ``solium-enable`` comment directive: You cannot disable all rules (using ``// solium-disable`` for example) and then enable a select few (using ``// solium-enable rule1, rule2`` for example). The enabling part doesn't work and rules remain disabled even after using the ``enable`` directive. This is due to how the linter internally represents disabling **all** rules.

In the below example, the ``security/no-throw`` rule will **not** be enabled on the ``throw;`` statement, against the expectations.

.. code-block:: javascript

    contract Foo {
        // solium-disable
        function b11d() {
            // solium-enable security/no-throw
            throw;
        }
    }
