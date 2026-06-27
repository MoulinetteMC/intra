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

type AutocompleteReturnable = readonly ApplicationCommandOptionChoiceData<
	string | number
>[];

export type MoulinetteSlashCommand = {
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
	) => AutocompleteReturnable | Promise<AutocompleteReturnable>;
};

type MoulinetteCommand = MoulinetteSlashCommand;

export type { MoulinetteCommand as default };
