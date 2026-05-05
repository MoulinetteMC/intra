const {
	Client,
	ChatInputCommandInteraction,
	codeBlock,
	SlashCommandBuilder,
	EmbedBuilder,
	MessageFlags,
} = require("discord.js");
const fingerprint = require("../util/fingerprintServer");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("fingerprint")
		.setDescription("Get server's fingerprint"),

	/**
	 * @param {Client} client
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(client, interaction) {
		if (await fingerprint())
			return await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor("Greyple")
						.setTitle("Server's fingerprint")
						.setDescription(codeBlock(fingerprint)),
				],
        flags: MessageFlags.Ephemeral,
			});
		else
			return await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor("Red")
						.setDescription("Impossible to retrieve fingerprint..."),
				],
        flags: MessageFlags.Ephemeral,
			});
	},
};
