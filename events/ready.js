const { ActivityType, Client, Events } = require("discord.js");
require("colors");
const os = require("os");

module.exports = {
	name: Events.ClientReady,
	once: true,
	/**
	 * @param {Client} client
	 */
	async execute(client) {
		console.log(`Ω ${client.user.tag} is online !`.green);

		client.user.setPresence({
			status: "online",
			activities: [
				{ name: `submits of practicals`, type: ActivityType.Watching },
			],
		});
	},
};
