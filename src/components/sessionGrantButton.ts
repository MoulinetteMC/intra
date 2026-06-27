import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	MessageFlags,
} from "discord.js";
import Sessions from "../models/sessions.js";
import type { MoulinetteButtonComponent } from "../types/component.js";
import fingerprintButton from "./fingerprintButton.js";

export default <MoulinetteButtonComponent>{
	data: new ButtonBuilder()
		.setCustomId(`session:grant-00000000000`)
		.setStyle(ButtonStyle.Success)
		.setLabel("Yes"),
	regexp: /^session:grant-[a-f0-9]{11}$/,
	async execute(_client, interaction) {
		const token = interaction.customId.match(/[a-f0-9]{11}$/)?.[0];

		const session = await Sessions.findByIdAndUpdate(token, {
			granted: true,
		});

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
					.setColor("Green")
					.setTitle("Access granted! Have fun!")
					.setTimestamp(),
			],
			components: [
				new ActionRowBuilder().addComponents(fingerprintButton.data).toJSON(),
			],
		});

		return;
	},
};
