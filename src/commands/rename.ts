import type MoulinetteCommand from "../types/command.js";

import { SlashCommandBuilder, MessageFlags, EmbedBuilder } from "discord.js";
import Players from "../models/players.js";
import { replyError } from "../util/functions.js";

export default <MoulinetteCommand>{
	data: new SlashCommandBuilder()
		.setName("rename")
		.setDescription("Rename yourself in-game")
		.addStringOption((opt) =>
			opt
				.setName("playername")
				.setDescription("New In-game playername")
				.setRequired(true),
		),
	async execute(_client, interaction) {
		const preExistingName = await Players.findOne({
			playername: interaction.options.getString("playername"),
		});

		if (preExistingName)
			return replyError(
				`This name as been already taken by <@${preExistingName.userid}>`,
			);

		const preExistingAccount = await Players.findOne({
			userid: interaction.user.id,
		});

		if (!preExistingAccount)
			return replyError("You are not registered on MoulinetteMC");

		await Players.findOneAndUpdate(
			{ userid: interaction.user.id },
			{ playername: interaction.options.getString("playername") },
		);
		return {
			embeds: [
				new EmbedBuilder()
					.setDescription(
						`Your name has been changed from **\`${preExistingAccount.playername}\`** ` +
							`to **\`${interaction.options.getString("playername")}\`**`,
					)
					.setColor("Green"),
			],
			flags: [MessageFlags.Ephemeral],
		};
	},
};
