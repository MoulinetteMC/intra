const {
	Client,
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	EmbedBuilder,
} = require("discord.js");
const Players = require("../models/players");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("whois")
		.setDescription("Find a player on MoulinetteMC")
		.addStringOption((opt) =>
			opt
				.setName("playername")
				.setDescription("In-game pseudo")
				.setAutocomplete(true)
				.setRequired(true)
		),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async autocomplete(interaction) {
		await interaction.respond(
			(
				await Players.find({
					playername: new RegExp("^" + interaction.options.getFocused(), "i"),
				})
			).map((e) => ({ name: e.playername, value: e.playername }))
		);
	},

	/**
	 * @param {Client} client
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(client, interaction) {
		console.log(`→ whois : ${interaction.user.username}`);
		if (!interaction.member.roles.cache.has("1309990370087801004"))
			return await interaction.reply({
				content: "You are not autorized to play on MoulinetteMC",
				ephemeral: true,
			});

		if (
			(exist = await Players.findOne({
				playername: interaction.options.getString("playername"),
			}))
		)
			return await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setAuthor({
							name: exist.playername,
							iconURL: `https://www.mc-heads.net/avatar/${exist.playername}/64.png`,
						})
						.setDescription(`**Owned by <@${exist.userid}>**`)
						.setColor("Green"),
				],
				ephemeral: true,
			});
		else
			return awaitinteraction.reply({
				content: `${interaction.options.getString(
					"playername"
				)} doesn't exist.`,
				ephemeral: true,
			});
	},
};
