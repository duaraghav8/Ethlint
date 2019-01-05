############
Known Issues
############

While Solium is being actively maintained, a few major issues are still lurking around and we thought it best to make you aware of them so you don't spend time discovering them instead. We're working on resolving these issues so please be patient.

- Solium is currently **file-aware instead of being project-aware**. What this means is that while linting, Solium doesn't have the context of all the contracts and how they may be using the contract currently being linted. A consequence of this is that the linter currently flags a state variable as unused if it doesn't find its usage in the same contract, whereas its clearly possible that you're ``import`` ing the contract elsewhere to use that variable (See `issue <https://github.com/duaraghav8/Solium/issues/11>`_). This is a fairly critical problem and will be resolved in a future release. We believe a codebase-aware linter would be much more powerful because of its broader context.

- The linter's internal parser supports Solidity ``v0.5``. This means that it supports the `calldata <https://solidity.readthedocs.io/en/v0.5.2/types.html#data-location>` storage location specifier, but in a non-backward-compatible manner. If you're currently using Solidity version < 0.5 and have used ``calldata`` as a name for a variable or function parameter, you might see false lint issues because ``calldata`` is treated as location and hence, the variable name is seen as ``null``. Regardless of whether you use Solium or not, it is a good idea to rename all such variables to keep your code compatible with Solidity 0.5.

If you discover any other pain points while using Solium, we encourage you to open up an issue.

Or if you don't feel like going through the formality of detailing the error(s), tap us with your problems on our `Gitter Channel <https://gitter.im/Solium-linter/Lobby#>`_.
