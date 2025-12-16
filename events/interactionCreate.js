const {
	Events,
	codeBlock,
	ComponentType,
	Client,
	BaseInteraction,
	EmbedBuilder,
	ButtonInteraction,
	MessageFlags,
} = require("discord.js");
const Sessions = require("../models/sessions");
require("colors");

module.exports = {
	name: Events.InteractionCreate,
	once: false,
	/**
	 * @param {Client} client
	 * @param {BaseInteraction} interaction
	 */
	async execute(client, interaction) {
		if (interaction.isChatInputCommand()) {
			//* Command Manager
			const cmd = client.slash.get(interaction.commandName);

			if (!cmd)
				return console.error(
					`Command "${interaction.commandName}" do not exist`.red
				);

			if (!interaction.member.roles.cache.has(process.env.ROLE_ID))
				return await interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setDescription("You are not autorized to play on MoulinetteMC")
							.toJSON(),
					],
					flags: MessageFlags.Ephemeral,
				});

			try {
				console.log(`→ ${cmd.data.name} : ${interaction.user.username}`);
				await cmd.execute(client, interaction);
			} catch (err) {
				console.error(err);
				const errMsgOpts = {
					embeds: [
						new EmbedBuilder().setTitle("Intern error!").setColor("Red"),
					],
					flags: MessageFlags.Ephemeral,
				};
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp(errMsgOpts);
				} else {
					errMsgOpts.embeds[0].setDescription(codeBlock("js", err.toString()));
					await interaction.reply(errMsgOpts);
				}
			}
		} else if (
			interaction.isMessageComponent() &&
			interaction.componentType == ComponentType.Button
		) {
			/**
			 * @param {ButtonInteraction} interaction
			 */

			const [action, token] = interaction.customId.split("-");
			const session = await Sessions.findById(token);

			if (!session)
				return interaction.message.edit({
					embeds: [
						new EmbedBuilder()
							.setColor("Grey")
							.setTitle("Request expired...")
							.setTimestamp(),
					],
					components: [],
					flags: MessageFlags.Ephemeral,
				});

			switch (action) {
				case "grant":
					await Sessions.findByIdAndUpdate(token, {
						flags: MessageFlags.Ephemeral,
					});

					interaction.message.edit({
						embeds: [
							new EmbedBuilder()
								.setColor("Green")
								.setTitle("Access granted! Have fun!")
								.setTimestamp(),
						],
						components: [],
						flags: MessageFlags.Ephemeral,
					});
					break;
				case "deny":
					await Sessions.findByIdAndDelete(token);
					interaction.message.edit({
						embeds: [
							new EmbedBuilder()
								.setColor("Red")
								.setTitle("Acces denied! Take care!")
								.setTimestamp(),
						],
						components: [],
						flags: MessageFlags.Ephemeral,
					});
					break;
			}
		} else if (interaction.isAutocomplete()) {
			const command = client.slash.get(interaction.commandName);

			if (!command || !command.autocomplete) return;

			try {
				await command.autocomplete(interaction);
			} catch (error) {
				console.error(error);
				return;
			}
		}
	},
};
