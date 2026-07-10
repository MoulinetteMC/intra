import {
  codeBlock,
  EmbedBuilder,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import RconGetFingerprint from "../rcon/getFingerprint.js";
import { type MoulinetteSlashCommand } from "../types/command.js";
import { replyError } from "../util/functions.js";

export default {
  data: new SlashCommandBuilder()
    .setName("fingerprint")
    .setDescription("Get server's fingerprint"),

  async execute() {
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
} as MoulinetteSlashCommand;
