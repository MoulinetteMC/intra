import {
	SlashCommandBuilder,
	EmbedBuilder,
	MessageFlags,
} from "discord.js";
import RconGetPlayerList from "../rcon/getPlayerList.js";
import type MoulinetteCommand from "../types/command.js";

export default <MoulinetteCommand>{
	data: new SlashCommandBuilder()
		.setName("list")
		.setDescription("Get players list online on the server."),

	async execute() {
		const playerList = await RconGetPlayerList();

		if (playerList)
			return {
				embeds: [
					new EmbedBuilder()
						.setColor("Blurple")
						.setTitle("Players online")
						.setDescription(
							playerList.map((name) => `- \`${name}\``).join("\n"),
						),
				],
				flags: MessageFlags.Ephemeral,
			};
		else
			return {
				embeds: [
					new EmbedBuilder()
						.setColor("Blurple")
						.setDescription("There is no player online."),
				],
				flags: MessageFlags.Ephemeral,
			};
	},
};
