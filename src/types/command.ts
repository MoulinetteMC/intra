import {
  type ApplicationCommandChoicesData,
	AutocompleteInteraction,
	ChatInputCommandInteraction,
	type InteractionReplyOptions,
	SlashCommandBuilder,
} from "discord.js";
import MoulinetteClient from "../classes/client.js";

type MoulinetteSlashCommand = {
	data: SlashCommandBuilder;
	execute: (
		client: MoulinetteClient,
		interaction: ChatInputCommandInteraction,
	) => Promise<InteractionReplyOptions>;
	autocomplete?: (
		interaction: AutocompleteInteraction,
	) => Promise<ApplicationCommandChoicesData[]>;
};

type MoulinetteCommand = 
  | MoulinetteSlashCommand 

export type { MoulinetteCommand as default };
