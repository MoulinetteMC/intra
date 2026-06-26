import {
	type InteractionReplyOptions,
	type MessageComponentBuilder,
	UserContextMenuCommandInteraction,
} from "discord.js";
import MoulinetteClient from "../classes/client.js";

export type MoulinetteMessageComponent = {
	data: MessageComponentBuilder;
	execute: (
		client: MoulinetteClient,
		interaction: UserContextMenuCommandInteraction
	) => Promise<InteractionReplyOptions>;
};

type MoulinetteComponent =
	| MoulinetteMessageComponent

export type { MoulinetteComponent as default }