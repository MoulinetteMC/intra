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
		)
		.addUserOption((opt) =>
			opt.setName("user").setDescription("Discord user").setRequired(false)
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
		if (interaction.options.getString("playername")) {
			const playerName = interaction.options.getString("playername");
			const player = await Players.findOne({
				playername: playerName,
			});

			if (player)
				return await interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setAuthor({
								name: player.playername,
								iconURL: `https://www.mc-heads.net/avatar/${player.playername}/32.png`,
							})
							.setDescription(`**Owned by <@${player.userid}>**`)
							.setColor("Green"),
					],
					flags: MessageFlags.Ephemeral,
				});
			else
				return await interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setDescription(`**\`${playerName}\`** doesn't exist.`)
							.setColor("Red"),
					],
					flags: MessageFlags.Ephemeral,
				});
		} else if (interaction.options.getUser("user")) {
			const user = interaction.options.getUser("user");

			const player = await Players.findOne({
				userid: user.id,
			});

			if (player)
				return await interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setAuthor({
								name: player.playername,
								iconURL: `https://www.mc-heads.net/avatar/${player.playername}/32.png`,
							})
							.setDescription(`**Owned by <@${player.userid}>**`)
							.setColor("Green"),
					],
					flags: MessageFlags.Ephemeral,
				});
			else
				return await interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setDescription(
								`**<@${user.id}>** don't have a MoulinetteMC account.`
							)
							.setColor("Red"),
					],
					flags: MessageFlags.Ephemeral,
				});
		} else {
			return await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setDescription(`Please use at least one option.`)
						.setColor("Red"),
				],
				flags: MessageFlags.Ephemeral,
			});
		}
	},
};
