import { EmbedBuilder, MessageFlags, SlashCommandBuilder } from "discord.js";
import Players from "../models/players.js";
import type { MoulinetteSlashCommand } from "../types/command.js";
import { replyError } from "../util/functions.js";

export default {
  data: new SlashCommandBuilder()
    .setName("whois")
    .setDescription("Find a player on MoulinetteMC")
    .addStringOption((opt) =>
      opt
        .setName("playername")
        .setDescription("In-game pseudo")
        .setAutocomplete(true),
    )
    .addUserOption((opt) =>
      opt.setName("user").setDescription("Discord user").setRequired(false),
    ),
  async autocomplete(interaction) {
    return (
      await Players.find({
        playername: new RegExp("^" + interaction.options.getFocused(), "i"),
      })
        .lean()
        .exec()
    ).map((p) => ({
      name: p.playername,
      value: p.playername,
    }));
  },
  async execute(_client, interaction) {
    if (interaction.options.getString("playername")) {
      const playerName = interaction.options.getString("playername");

      if (!playerName) return replyError("Please provide a playername.");

      const player = await Players.findOne({
        playername: playerName,
      });

      if (!player) return replyError(`**\`${playerName}\`** doesn't exist.`);

      return {
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: player.playername,
              iconURL: `https://www.mc-heads.net/avatar/${player.playername}/32.png`,
            })
            .setDescription(`**Owned by <@${player.userid}>**`)
            .setColor("Green"),
        ],
        flags: [MessageFlags.Ephemeral],
      };
    } else if (interaction.options.getUser("user")) {
      const user = interaction.options.getUser("user");

      if (!user) return replyError("Unable to found the Discord user.");

      const player = await Players.findOne({
        userid: user.id,
      });

      if (!player)
        return replyError(
          `**<@${user.id}>** don't have a MoulinetteMC account.`,
        );

      return {
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: player.playername,
              iconURL: `https://www.mc-heads.net/avatar/${player.playername}/32.png`,
            })
            .setDescription(`**Owned by <@${player.userid}>**`)
            .setColor("Green"),
        ],
        flags: [MessageFlags.Ephemeral],
      };
    } else return replyError("Please use at least one option.");
  },
} as MoulinetteSlashCommand;
