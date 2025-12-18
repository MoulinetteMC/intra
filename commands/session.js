const {
	Client,
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	MessageFlags,
	EmbedBuilder,
} = require("discord.js");
const dayjs = require("dayjs");
const Players = require("../models/players");
const Sessions = require("../models/sessions");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("session")
		.setDescription("Get info about sessions")
		.addSubcommand((sub) =>
			sub
				.setName("history")
				.setDescription("Get the last 10 sessions")
				.addUserOption((opt) =>
					opt.setName("user").setDescription("Target user").setRequired(false)
				)
		),

	/**
	 * @param {Client} client
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(client, interaction) {
		const playerAccount = await Players.findOne({
			userid: (interaction.options.getUser("user") || interaction.user).id,
		});

		if (playerAccount) {
			if (interaction.options.getSubcommand() == "history") {
				const sessionsHistory = await Sessions.find(
					{ uuid: playerAccount._id, createdAt: { $exists: true } },
					null,
					{ sort: "-createdAt" }
				).limit(10);

				if (sessionsHistory.length > 0) {
					return await interaction.reply({
						embeds: [
							new EmbedBuilder()
								.setAuthor({
									name: playerAccount.playername,
									iconURL: `https://www.mc-heads.net/avatar/${playerAccount.playername}/32.png`,
								})
								.setDescription(
									sessionsHistory
										.map((s) => {
											console.log(s.createdAt);
											const unixDate = dayjs(s.createdAt).unix();
											return `- <t:${unixDate}:f> (<t:${unixDate}:R>)`;
										})
										.join("\n")
								)
								.setColor("Blurple"),
						],
						flags: MessageFlags.Ephemeral,
					});
				} else {
					return await interaction.reply({
						embeds: [
							new EmbedBuilder()
								.setAuthor({
									name: playerAccount.playername,
									iconURL: `https://www.mc-heads.net/avatar/${playerAccount.playername}/32.png`,
								})
								.setDescription("**No registered session.**")
								.setColor("Orange"),
						],
						flags: MessageFlags.Ephemeral,
					});
				}
			}
		} else {
			return await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setDescription("You are not registered on MoulinetteMC")
						.setColor("Red"),
				],
				flags: MessageFlags.Ephemeral,
			});
		}
	},
};
