const { Schema, model, models } = require("mongoose");

module.exports =
	models["players"] ||
	model(
		"players",
		new Schema({
			_id: {
				type: String,
				required: true,
			},
			playername: {
				type: String,
				required: true,
			},
			userid: {
				type: String,
				required: true,
			},
			skin: {
				type: String,
			},
		})
	);
