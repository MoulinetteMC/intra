import { GatewayIntentBits as Intent } from "discord.js";
import MoulinetteClient from "./classes/client.js";
import "dotenv/config";

new MoulinetteClient({
	intents: [
		Intent.Guilds,
		Intent.GuildMessages,
		Intent.MessageContent,
		Intent.GuildMembers,
		Intent.GuildMessageReactions,
		Intent.GuildPresences,
		Intent.GuildMessageReactions,
	],
});
