import { type MoulinetteSlashCommand } from "../types/command.js";

import {
	codeBlock,
	SlashCommandBuilder,
	EmbedBuilder,
	MessageFlags,
} from "discord.js";
import RconGetFingerprint from "../rcon/getFingerprint.js";
import { replyError } from "../util/functions.js";

export default <MoulinetteSlashCommand>{
	data: new SlashCommandBuilder()
		.setName("fingerprint")
		.setDescription("Get server's fingerprint"),

	async execute(_client, _interaction) {
		const figerprint = await RconGetFingerprint();
		if (!figerprint) return replyError("Impossible to retrieve fingerprint...");
		
		return {
			embeds: [
				new EmbedBuilder()
					.setColor("Greyple")
					.setTitle("Server's fingerprint")
					.setDescription(codeBlock(figerprint)),
			],
			flags: MessageFlags.Ephemeral,
		};
	},
};
