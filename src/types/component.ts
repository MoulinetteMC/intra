import {
	ButtonBuilder,
	ButtonInteraction,
} from "discord.js";
import MoulinetteClient from "../classes/client.js";

export type MoulinetteButtonComponent = {
	data: ButtonBuilder;
	regexp: RegExp;
	execute: (
		client: MoulinetteClient,
		interaction: ButtonInteraction,
	) => void | Promise<void>;
};

type MoulinetteComponent = MoulinetteButtonComponent;

export type { MoulinetteComponent as default };
