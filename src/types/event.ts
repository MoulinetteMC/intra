import { type ClientEvents } from "discord.js";
import MoulinetteClient from "../classes/client.js";

export type MoulinetteEvent<
	ClientEvent extends keyof ClientEvents = keyof ClientEvents,
> = {
	name: ClientEvent;
	once: boolean;
	execute: (
		client: MoulinetteClient,
		...args: ClientEvents[ClientEvent]
	) => void | Promise<void>;
};

export type { MoulinetteEvent as default };

export const MoulinetteEventBuilder = <ClientEvent extends keyof ClientEvents>(
	event: MoulinetteEvent<ClientEvent>,
) => event;
