const {
	Client,
	ChatInputCommandInteraction,
	codeBlock,
	SlashCommandBuilder,
	EmbedBuilder,
	MessageFlags,
} = require("discord.js");
const getPlayerList = require("../rcon/getPlayerList");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("list")
		.setDescription("Get players list online on the server."),

	/**
	 * @param {Client} client
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(client, interaction) {
		const playerList = await getPlayerList();
		if (playerList)
			return await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor("Blurple")
						.setTitle("Players online")
						.setDescription(
							playerList.map((name) => `- \`${name}\``).join("\n"),
						),
				],
				flags: MessageFlags.Ephemeral,
			});
		else
			return await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor("Blurple")
						.setDescription("There is no player online."),
				],
				flags: MessageFlags.Ephemeral,
			});
	},
};
