import {
	Client,
	type ClientOptions,
	Collection,
	REST,
	Routes,
} from "discord.js";

import { join, dirname, resolve } from "node:path";
import { readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "url";

import { connect } from "mongoose";

import type MoulinetteCommand from "../types/command.js";
import type MoulinetteEvent from "../types/event.js";
import ApiExpress from "../api/express.js";

function isJsOrTsFile(file: string): boolean {
	return file.endsWith(".js") || file.endsWith(".ts");
}

export default class MoulinetteClient extends Client {
	constructor(options: ClientOptions) {
		if (!process.env.DISCORD_TOKEN) throw new Error("DISCORD_TOKEN not set.");

		super(options);

		this.commands = new Collection();

		console.log("α Starting Intra-MoulinetteMC");

		void this.init().catch((e) => console.error("Initialization failed: ", e));
	}

	public commands: Collection<string, MoulinetteCommand>;

	private async init(): Promise<void> {
		await this.loadCommands();
		await this.registerCommands();
		await this.loadEvents();
		await this.connectDatabase();
		this.startApi();
		await this.login(process.env.DISCORD_TOKEN);
	}

	private async loadCommands(): Promise<void> {
		const commands: MoulinetteCommand[] = [];

		const directory = dirname(fileURLToPath(import.meta.url));
		const commandsPath = join(resolve(directory, ".."), "commands");

		if (!existsSync(commandsPath)) return;

		const commandFiles = readdirSync(commandsPath).filter(isJsOrTsFile);
		for (const file of commandFiles) {
			const module = await import(resolve(commandsPath, file));
			const command = module.default as MoulinetteCommand;

			console.log(`➤ [command] /${command.data.name}`);
			this.commands.set(command.data.name, command as any);

			commands.push(command);
		}

		console.log(`➤ ${commands.length} commands loaded !`);
	}

	private async registerCommands(): Promise<void> {
		if (process.env.DISCORD_TOKEN && process.env.DISCORD_CLIENT_ID) {
			try {
				const data = (await new REST()
					.setToken(process.env.DISCORD_TOKEN)
					.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), {
						body: [...this.commands.map((c) => c.data.toJSON())],
					})) as any[];

				console.log(`⯐ ${data.length} commands registered !`);
			} catch (e) {
				console.error(e);
			}
		} else {
			throw new Error("DISCORD_TOKEN or DISCORD_CLIENT_ID not set.");
		}
	}

	private async loadEvents(): Promise<void> {
		let eventCount = 0;

		const directory = dirname(fileURLToPath(import.meta.url));
		const eventsPath = join(resolve(directory, ".."), "events");

		if (!existsSync(eventsPath)) return;

		const eventFiles = readdirSync(eventsPath).filter(isJsOrTsFile);
		for (const file of eventFiles) {
			const module = await import(resolve(eventsPath, file));
			const event = module.default as MoulinetteEvent;
			console.log(`★ [event]: ${event.name}`);

			if (event.once) {
				this.once(
					event.name,
					async (...args: any[]) => await event.execute(this, ...args),
				);
			} else {
				this.on(
					event.name,
					async (...args: any[]) => await event.execute(this, ...args),
				);
			}

			eventCount++;
		}
		console.log(`★ ${eventCount} events loaded !`);
	}

	private async connectDatabase(): Promise<void> {
		if (!process.env.DATABASE_URI) throw new Error("DATABASE_URI not set.");
		connect(process.env.DATABASE_URI, {
			autoIndex: false, // Don't build indexes
			maxPoolSize: 10, // Maintain up to 10 socket connections
			serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
			socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
			family: 4, // Use IPv4, skip trying IPv6
		}).then(() => {
			console.log("✔ MongoDB connected !");
		});
	}

	private startApi(): void {
		ApiExpress(this);
	}
}
