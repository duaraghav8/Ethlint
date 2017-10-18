############
Known Issues
############

While Solium is being actively maintained, a few major issues are still lurking around and we thought it best to make you aware of them so you don't spend time discovering them instead. We're working on resolving these issues so please be patient.

- There was a `breaking change <https://github.com/duaraghav8/Solium/issues/108>`_ made in Solium a while back that forced you to disable the ``mixedcase`` rule. **You can re-enable it now**, so this is no longer an issue.

- Issues `116 <https://github.com/duaraghav8/Solium/issues/116>`_, `110 <https://github.com/duaraghav8/Solium/issues/110>`_, `106 <https://github.com/duaraghav8/Solium/issues/106>`_, `7 <https://github.com/duaraghav8/Solium/issues/7>`_ and `104 <https://github.com/duaraghav8/Solium/issues/104>`_ clearly demonstrate that the ``indentation`` and ``whitespace`` rules currently have a slightly flawed implementation that results in false positives. This needs fixing. If you're seeing a lot of redundant lint issues because of this, we recommend you to temporarily disable these 2 rules. They will be fixed in a subsequent release.

- Solium is currently **file-aware instead of being project-aware**. What this means is that while linting, Solium doesn't have the context of all the contracts and how they may be using the contract currently being linted. A consequence of this is that the linter currently flags a state variable as unused if it doesn't find its usage in the same contract, whereas its clearly possible that you're ``import`` ing the contract elsewhere to use that variable (See `issue <https://github.com/duaraghav8/Solium/issues/11>`_). This is a fairly critical problem and will be resolved in a future release. We believe a codebase-aware linter would be much more powerful because of its broader context.

- On large code bases, the linter is slightly slow. Solium heavily relies on a `Solidity parsing engine <https://www.npmjs.com/package/solparse>`_ to operate on your contract code. This parser is currently a bottleneck and we're exploring how best to reduce the time consumption (see `speed issue <https://github.com/duaraghav8/Solium/issues/114>`_).


If you discover any other pain points while using Solium, we encourage you to open up an issue.

Or if you don't feel like going through the formality of detailing the error(s), tap us with your problems on our `Gitter Channel <https://gitter.im/Solium-linter/Lobby#>`_.
