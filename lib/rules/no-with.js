/**
 * @fileoverview Ensure no use of with statements in the code
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

module.exports = {

	verify: function (context) {

		context.on ('WithStatement', function (emitted) {
			if (emitted.exit) {
				return;
			}
			
			context.report ({
				node: emitted.node,
				message: 'Use of \'with\' statement'
			});
		});

	}

};