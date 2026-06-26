import { type ClientEvents } from "discord.js";
import MoulinetteClient from "../classes/client.js";

type MoulinetteEvent = {
	name: keyof ClientEvents;
	once: boolean;
	execute: (client: MoulinetteClient, ...args: any[]) => Promise<void>;
};

export type { MoulinetteEvent as default }