/**
 * @fileoverview Class definition of the object responsible for notifying the rules when a node they've subscribed to is entered or left
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

/**
 * EventGenerator object constructor
 * @param {Object} emitter EventEmitter object
 */
function EventGenerator(emitter) {
    this.emitter = emitter;
}

EventGenerator.prototype = {

    constructor: EventGenerator,

    /**
	 * emit event that the node with type = node.type is being entered
	 * @param {Object} node The AST node being entered
	 */
    enterNode: function(node) {
        this.emitter.emit(node.type, {
            node: node,
            exit: false
        });
    },

    /**
	 * emit event that the node with type = node.type is being left
	 * @param {Object} node The AST node being left
	 */
    leaveNode: function(node) {
        this.emitter.emit(node.type, {
            node: node,
            exit: true
        });
    }

};

module.exports = EventGenerator;