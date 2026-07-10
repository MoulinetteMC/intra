import dayjs from "dayjs";
import { EmbedBuilder, MessageFlags, SlashCommandBuilder } from "discord.js";
import Players from "../models/players.js";
import Sessions from "../models/sessions.js";
import type { MoulinetteSlashCommand } from "../types/command.js";
import { replyError } from "../util/functions.js";

export default {
  data: new SlashCommandBuilder()
    .setName("session")
    .setDescription("Get info about sessions")
    .addSubcommand((sub) =>
      sub
        .setName("history")
        .setDescription("Get the last 10 sessions")
        .addUserOption((opt) =>
          opt.setName("user").setDescription("Target user").setRequired(false),
        ),
    ),
  async execute(_client, interaction) {
    const playerAccount = await Players.findOne({
      userid: (interaction.options.getUser("user") ?? interaction.user).id,
    });

    if (!playerAccount)
      return replyError("This player is not registered on MoulinetteMC");

    const subcmd = interaction.options.getSubcommand();
    if (subcmd == "history") {
      const sessionsHistory = await Sessions.find(
        { uuid: playerAccount._id.toString(), createdAt: { $exists: true } },
        null,
        { sort: "-createdAt" },
      ).limit(10);

      if (sessionsHistory.length > 0) {
        return {
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: playerAccount.playername,
                iconURL: `https://www.mc-heads.net/avatar/${playerAccount.playername}/32.png`,
              })
              .setTitle("Sessions history")
              .setDescription(
                sessionsHistory
                  .map((s) => {
                    const unixDate = dayjs(s._id.getTimestamp()).unix();
                    return `- <t:${String(unixDate)}:f> (<t:${String(unixDate)}:R>)`;
                  })
                  .join("\n"),
              )
              .setColor("Blurple"),
          ],
          flags: [MessageFlags.Ephemeral],
        };
      } else {
        return {
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: playerAccount.playername,
                iconURL: `https://www.mc-heads.net/avatar/${playerAccount.playername}/32.png`,
              })
              .setDescription("**No registered session.**")
              .setColor("Orange"),
          ],
          flags: [MessageFlags.Ephemeral],
        };
      }
    } else return replyError(`Undefined subcommand **\`${subcmd}\`**`);
  },
} as MoulinetteSlashCommand;
