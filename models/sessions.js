const { Schema, model, models } = require("mongoose");

module.exports = model(
	"sessions",
	new Schema(
		{
			_id: {
				type: String,
				required: true,
			},
			uuid: {
				type: String,
				required: true,
			},
			granted: {
				type: Boolean,
				default: false,
			},
		},
		{
			timestamps: true,
		}
	)
);
