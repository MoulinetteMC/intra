import {
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  MessageFlags,
} from "discord.js";
import Sessions from "../models/sessions.js";
import type { MoulinetteButtonComponent } from "../types/component.js";
import { replyError } from "../util/functions.js";

export default {
  data: new ButtonBuilder()
    .setCustomId(`session:deny-00000000000`)
    .setStyle(ButtonStyle.Danger)
    .setLabel("No"),
  pattern: /^session:deny-[a-f0-9]{11}$/,
  async execute(_client, interaction) {
    const token = /[a-f0-9]{11}$/.exec(interaction.customId)?.[0];

    if (!token)
      return interaction.reply(
        replyError("Invalid session token, please try again later..."),
      );

    const session = await Sessions.findByIdAndDelete(token);

    if (!session)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Grey")
            .setTitle("Request expired...")
            .setTimestamp(),
        ],
        components: [],
        flags: MessageFlags.Ephemeral,
      });

    await interaction.update({
      embeds: [
        new EmbedBuilder()
          .setColor("Red")
          .setTitle("Acces denied! Take care!")
          .setTimestamp(),
      ],
      components: [],
    });

    return;
  },
} as MoulinetteButtonComponent;
