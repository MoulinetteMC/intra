const {
	Client,
	ChatInputCommandInteraction,
	SlashCommandBuilder,
  MessageFlags,
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
		console.log(`→ register : ${interaction.user.username}`);

		const preExist = await Players.findOne({ userid: interaction.user.id });

		if (preExist) {
			await Players.findOneAndUpdate(
				{ userid: interaction.user.id },
				{ playername: interaction.options.getString("playername") }
			);
			return await interaction.reply({
				content: 
            `Your name has been changed from **\`${preExist.playername}\`** ` +
            `to **\`${interaction.options.getString("playername")}\`**`,
				flags: MessageFlags.Ephemeral,
			});
		} else
			return await interaction.reply({
				content: `You are not registered on MoulinetteMC`,
				flags: MessageFlags.Ephemeral,
			});
	},
};
