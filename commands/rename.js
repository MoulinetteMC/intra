const {
	Client,
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	MessageFlags,
	EmbedBuilder,
} = require("discord.js");
const Players = require("../models/players");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("rename")
		.setDescription("Rename yourself in-game")
		.addStringOption((opt) =>
			opt
				.setName("playername")
				.setDescription("New In-game playername")
				.setRequired(true)
		),

	/**
	 * @param {Client} client
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(client, interaction) {
		const preExistingAccount = await Players.findOne({
			userid: interaction.user.id,
		});
		const preExistingName = await Players.findOne({
			playername: interaction.options.getString("playername"),
		});

		if (preExistingName)
			return await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setDescription(
							`This name as been already taken by <@${preExist.userid}>`
						)
						.setColor("Red"),
				],
				flags: MessageFlags.Ephemeral,
			});

		if (preExistingAccount) {
			await Players.findOneAndUpdate(
				{ userid: interaction.user.id },
				{ playername: interaction.options.getString("playername") }
			);
			return await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setDescription(
							`Your name has been changed from **\`${preExist.playername}\`** ` +
								`to **\`${interaction.options.getString("playername")}\`**`
						)
						.setColor("Green"),
				],
				flags: MessageFlags.Ephemeral,
			});
		} else
			return await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setDescription("You are not registered on MoulinetteMC")
						.setColor("Red"),
				],
				flags: MessageFlags.Ephemeral,
			});
	},
};
