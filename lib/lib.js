var solium = require('./solium')
'use strict'

/**
 * Lint a source code string based on user settings. If autofix is enabled, write the fixed code back to file.
 * @param {String} sourceCode The source code to be linted
 * @param {Object} userConfig User configuration
 * @param {String} fileName (optional) File name to use when reporting errors
 * @param {Bool} autoFix (optional) override userConfig
 * @returns {Integer} numOfErrors Number of Lint ERRORS that occured.
 */
function lint (sourceCode, userConfig, fileName, autoFix) {
  let results
  userConfig = userConfig || JSON.parse(defaultRCFile)
  try {
    if (autoFix || (userConfig.options && userConfig.options.autofix)) {
      results = solium.lintAndFix(sourceCode, userConfig)
    } else {
      results = solium.lint(sourceCode, userConfig)
    }
  } catch (e) {
    // Don't abort in case of a parse error, just report it as a normal lint issue.
    if (e.name !== 'SyntaxError') {
      throw new Error(`An error occurred while linting over ${fileName}: ${e.message}`)
    }

    results = [{
      ruleName: '',
      type: 'error',
      message: `Syntax error: unexpected token ${e.found}`,
      line: e.location.start.line,
      column: e.location.start.column
    }]
  }

  return results
}

var defaultRCFile = `{
    "extends": "solium:recommended",
    "plugins": ["security"],
    "rules": {
        "quotes": ["error", "double"],
        "indentation": ["error", 4]
    }
}
`

var exports = {
  lint,
  defaultRCFile
}

if (window) window.solium = exports
if (module && module.exports) module.exports = exports

