/**
 * @fileoverview RuleContext object's class definition - this object is what we pass to every rule being executed
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

let util = require("util"),
    isErrObjectValid = require("../config/schemas/error-reported-by-rule").validationFunc;

let INHERITABLE_METHODS = [
    "getSourceCode"
];

/**
 * context object Constructor to set read-only properties and provide additional functionality to the rules using it
 * @param {String} ruleName Name of the rule the object is for
 * @param {Object} ruleDesc Description of the rule the object is for
 * @param {Object} ruleMeta meta object defined inside the rule file by rule developer
 * @param {Object} Solium Main Solium object from which to inherit functionality to provide to the rules
 */
function RuleContext(ruleName, ruleDesc, ruleMeta, Solium) {
    let contextObject = this;

    // Set contect attribute 'options' iff options were provided.
    ruleDesc.options && Object.assign(contextObject, { options: ruleDesc.options });

    //set read-only properties of the context object
    Object.defineProperties(contextObject, {

        name: {
            value: ruleName,
            writable: false	//though the default is false anyway, I think its better to express your intention clearly
        },

        meta: {
            value: ruleDesc,
            writable: false
        }

    });

    //inherit all Solium methods which are of relevance to the rule
    INHERITABLE_METHODS.forEach(function(methodName) {
        contextObject [methodName] = function(s, z, a, b, o) {	//every method will receive 5 arguments tops
            return Solium [methodName].call(Solium, s, z, a, b, o);
        };
    });

    /**
     * wrapper around Solium.report () which adds some additional information to the error object
     * @param {Object} error An object describing the lint error, sent by the rule currently running
     */
    contextObject.report = function(error) {

        if (!isErrObjectValid(error)) {
            throw new Error("Rule \"" + ruleName +
                "\": invalid error object was passed. AJV message:\n" + util.inspect(isErrObjectValid.errors));
        }

        Object.assign(error, { ruleName: ruleName, ruleMeta: ruleMeta, type: contextObject.meta.type });
        Solium.report(error);

    };
}


RuleContext.prototype = { constructor: RuleContext };
module.exports = RuleContext;
