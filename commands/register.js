const {
	Client,
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	EmbedBuilder,
	MessageFlags,
} = require("discord.js");
const Players = require("../models/players");
const { v4: uuid } = require("uuid");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("register")
		.setDescription("Register yourself to MoulinetteMC")
		.addStringOption((opt) =>
			opt
				.setName("playername")
				.setDescription("In-game pseudo")
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
		if (preExistingAccount)
			return await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setDescription(
							`You are already registered under the name **\`${preExistingAccount.playername}\`**`
						)
						.setColor("Red"),
				],
				flags: MessageFlags.Ephemeral,
			});

		const preExistingName = await Players.findOne({
			playername: interaction.options.getString("playername"),
		});
		if (preExistingName)
			return await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setDescription(
							`This name as been already taken by <@${preExistingName.userid}>`
						)
						.setColor("Red"),
				],
				flags: MessageFlags.Ephemeral,
			});

		Players.create({
			_id: uuid(),
			playername: interaction.options.getString("playername"),
			userid: interaction.user.id,
		});

		await interaction.reply({
			embeds: [
				new EmbedBuilder().setDescription("Registered !").setColor("Green"),
			],
			flags: MessageFlags.Ephemeral,
		});
	},
};
