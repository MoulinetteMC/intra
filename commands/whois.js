const {
	Client,
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	EmbedBuilder,
	MessageFlags,
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
				flags: MessageFlags.Ephemeral,
			});
		else
			return await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setDescription(`${interaction.options.getString("playername")} doesn't exist.`)
						.setColor("Red")
				],
				flags: MessageFlags.Ephemeral,
			});
	},
};
