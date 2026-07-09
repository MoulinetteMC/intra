import {
	ButtonBuilder,
	ButtonInteraction,
	ComponentBuilder,
	MessageComponentInteraction,
} from "discord.js";
import MoulinetteClient from "../classes/client.js";

export default interface MoulinetteComponent<
	TBuilder extends ComponentBuilder = ComponentBuilder,
	TInteraction extends MessageComponentInteraction =
		MessageComponentInteraction,
> {
	data: TBuilder;
	pattern: RegExp;
	execute: (
		client: MoulinetteClient,
		interaction: TInteraction,
	) => void | Promise<void>;
}

export type MoulinetteButtonComponent = MoulinetteComponent<
	ButtonBuilder,
	ButtonInteraction
>;
