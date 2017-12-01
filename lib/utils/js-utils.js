/**
 * @fileoverview Utility functions for rest of teh code base
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

module.exports = {

    /**
	 * Check if given argument is a non-null, non-Array javascript object
	 * @param {Object} possibleObject Argument to check for validity
	 * @returns {Boolean} isObject true if given argument is object, false otherwise
	 */
    isStrictlyObject: function(possibleObject) {
        return (
            possibleObject !== null &&	//because typeof null equals 'object', make sure the object is non-null
			typeof possibleObject === "object" &&
			possibleObject.constructor.name === "Object"
        );
    }
};
