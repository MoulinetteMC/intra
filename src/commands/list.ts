import { EmbedBuilder, MessageFlags, SlashCommandBuilder } from "discord.js";
import RconGetPlayerList from "../rcon/getPlayerList.js";
import type { MoulinetteSlashCommand } from "../types/command.js";

export default {
  data: new SlashCommandBuilder()
    .setName("list")
    .setDescription("Get players list online on the server."),

  async execute() {
    const playerList = await RconGetPlayerList();

    if (playerList.length > 0)
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
} as MoulinetteSlashCommand;
