import {
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	MessageFlags,
} from "discord.js";
import Sessions from "../models/sessions.js";
import type { MoulinetteButtonComponent } from "../types/component.js";

export default <MoulinetteButtonComponent>{
	data: new ButtonBuilder()
		.setCustomId(`session:deny-00000000000`)
		.setStyle(ButtonStyle.Danger)
		.setLabel("No"),
	regexp: /^session:deny-[a-f0-9]{11}$/,
	async execute(_client, interaction) {
		const token = interaction.customId.match(/[a-f0-9]{11}$/)?.[0];
		const session = await Sessions.findByIdAndDelete(token);

		if (!session)
			return interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor("Grey")
						.setTitle("Request expired...")
						.setTimestamp(),
				],
				components: [],
				flags: MessageFlags.Ephemeral,
			});

		interaction.update({
			embeds: [
				new EmbedBuilder()
					.setColor("Red")
					.setTitle("Acces denied! Take care!")
					.setTimestamp(),
			],
			components: [],
		});

		return;
	},
};
