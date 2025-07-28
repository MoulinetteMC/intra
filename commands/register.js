const {
	Client,
	ChatInputCommandInteraction,
	SlashCommandBuilder,
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
		console.log(`→ register : ${interaction.user.username}`)
		if (!interaction.member.roles.cache.has("1309990370087801004"))
			return await interaction.reply({
				content: "You are not autorized to play on MoulinetteMC",
				flags: MessageFlags.Ephemeral,
			});

		if (preExist = await Players.findOne({ userid: interaction.user.id }))
			return await interaction.reply({
				content: `You are already registred under the name **\`${preExist.playername}\`**`,
				flags: MessageFlags.Ephemeral,
			});
		if (preExist = await Players.findOne({ playername: interaction.options.getString("playername") }))
			return await interaction.reply({
				content: `This name as been already taken by <@${preExist.userid}>`,
				flags: MessageFlags.Ephemeral,
			});

		Players.create({
			_id: uuid(),
			playername: interaction.options.getString("playername"),
			userid: interaction.user.id,
		});

		await interaction.reply({ content: "Registered !", ephemeral: true });
	},
};
