module.exports = {

	'CUSTOM_RULE': function (context) {
		context.on ('IfStatement', function (emitted) {
			if (emitted.exit) {
				return;
			}

			context.report ({
				node: emitted.node,
				message: '*******************THIS IS MY CUSTOM RULE**********************'
			});
		});
	},

	//this rule overlaps a built-in rule
	'lbrace': function (context) {
		context.on ('IfStatement', function (emitted) {
			if (emitted.exit) {
				return;
			}

			context.report ({
				node: emitted.node,
				message: '*******************THIS IS MY CUSTOM RULE**********************'
			});
		});
	}

};