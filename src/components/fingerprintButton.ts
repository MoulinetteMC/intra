import {
  ButtonBuilder,
  ButtonStyle,
  codeBlock,
  EmbedBuilder,
} from "discord.js";
import { type MoulinetteButtonComponent } from "../types/component.js";
import RconGetFingerprint from "../rcon/getFingerprint.js";
import { replyError } from "../util/functions.js";

export default {
  data: new ButtonBuilder()
    .setCustomId(`fingerprint`)
    .setStyle(ButtonStyle.Primary)
    .setLabel("Get server's fingerprint"),
  pattern: /^fingerprint$/,
  async execute(_client, interaction) {
    const figerprint = await RconGetFingerprint();

    if (!figerprint)
      return void (await interaction.reply(
        replyError("Impossible to retrieve fingerprint..."),
      ));

    await interaction.reply({
      embeds: [
        ...interaction.message.embeds,
        new EmbedBuilder()
          .setColor("Greyple")
          .setTitle("Server's fingerprint")
          .setDescription(codeBlock(figerprint)),
      ],
      components: [],
    });

    return;
  },
} as MoulinetteButtonComponent;
