import {
  type ApplicationCommandOptionChoiceData,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  type InteractionReplyOptions,
  SlashCommandBuilder,
  type SlashCommandOptionsOnlyBuilder,
  type SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import MoulinetteClient from "../classes/client.js";

export interface MoulinetteSlashCommand {
  data:
    | SlashCommandBuilder
    | SlashCommandOptionsOnlyBuilder
    | SlashCommandSubcommandsOnlyBuilder;
  execute: (
    client: MoulinetteClient,
    interaction: ChatInputCommandInteraction,
  ) => InteractionReplyOptions | Promise<InteractionReplyOptions>;
  autocomplete?: (
    interaction: AutocompleteInteraction,
  ) =>
    | readonly ApplicationCommandOptionChoiceData[]
    | Promise<readonly ApplicationCommandOptionChoiceData[]>;
}
