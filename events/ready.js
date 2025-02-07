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

		if (os.hostname() !== "PC-Valentin") {
			client.user.setPresence({
				status: "online",
				activities: [
					{ name: `submits of practicals`, type: ActivityType.Watching },
				],
			});
		} else {
			client.user.setPresence({
				status: "idle",
				activities: [{ name: `0% archi tags`, type: ActivityType.Watching }],
			});
		}
	},
};
