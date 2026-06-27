import type MoulinetteCommand from "../types/command.js";

import { SlashCommandBuilder, EmbedBuilder, MessageFlags } from "discord.js";
import Players from "../models/players.js";
import { v4 as uuid } from "uuid";
import { replyError } from "../util/functions.js";

export default <MoulinetteCommand>{
	data: new SlashCommandBuilder()
		.setName("register")
		.setDescription("Register yourself to MoulinetteMC")
		.addStringOption((opt) =>
			opt
				.setName("playername")
				.setDescription("In-game pseudo")
				.setRequired(true),
		),

	async execute(_client, interaction) {
		const preExistingAccount = await Players.findOne({
			userid: interaction.user.id,
		});

		if (preExistingAccount)
			return replyError(
				`You are already registered under the name **\`${preExistingAccount.playername}\`**`,
			);

		const playerName = interaction.options.getString("playername");
		if (!playerName) return replyError("Please specify your playername.");

		const preExistingName = await Players.findOne({
			playername: playerName,
		});

		if (preExistingName)
			return replyError(
				`This name as been already taken by <@${preExistingName.userid}>`,
			);

		Players.create({
			_id: uuid(),
			playername: playerName,
			userid: interaction.user.id,
		});

		return {
			embeds: [
				new EmbedBuilder().setDescription("Registered !").setColor("Green"),
			],
			flags: MessageFlags.Ephemeral,
		};
	},
};
