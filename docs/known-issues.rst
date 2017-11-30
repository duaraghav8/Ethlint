############
Known Issues
############

While Solium is being actively maintained, a few major issues are still lurking around and we thought it best to make you aware of them so you don't spend time discovering them instead. We're working on resolving these issues so please be patient.

- On large code bases, the linter is slightly slow. Solium heavily relies on a `Solidity parsing engine <https://www.npmjs.com/package/solparse>`_ to operate on your contract code. This parser is currently a bottleneck (see `speed issue <https://github.com/duaraghav8/Solium/issues/114>`_). Good news is that we've devised the strategy to tackle this and are actively working on it as you read this!

- Solium is currently **file-aware instead of being project-aware**. What this means is that while linting, Solium doesn't have the context of all the contracts and how they may be using the contract currently being linted. A consequence of this is that the linter currently flags a state variable as unused if it doesn't find its usage in the same contract, whereas its clearly possible that you're ``import`` ing the contract elsewhere to use that variable (See `issue <https://github.com/duaraghav8/Solium/issues/11>`_). This is a fairly critical problem and will be resolved in a future release. We believe a codebase-aware linter would be much more powerful because of its broader context.


If you discover any other pain points while using Solium, we encourage you to open up an issue.

Or if you don't feel like going through the formality of detailing the error(s), tap us with your problems on our `Gitter Channel <https://gitter.im/Solium-linter/Lobby#>`_.
