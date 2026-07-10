import { EmbedBuilder, MessageFlags, SlashCommandBuilder } from "discord.js";
import Players from "../models/players.js";
import type { MoulinetteSlashCommand } from "../types/command.js";
import { replyError } from "../util/functions.js";

export default {
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
    const playerName = interaction.options.getString("playername");

    if (!playerName) return replyError("Please provide a playername.");

    const preExistingName = await Players.findOne({
      playername: playerName,
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
      { playername: playerName },
    );
    return {
      embeds: [
        new EmbedBuilder()
          .setDescription(
            `Your name has been changed from **\`${preExistingAccount.playername}\`** ` +
              `to **\`${playerName}\`**`,
          )
          .setColor("Green"),
      ],
      flags: [MessageFlags.Ephemeral],
    };
  },
} as MoulinetteSlashCommand;
