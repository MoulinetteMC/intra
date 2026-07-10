import {
  type APIApplicationCommand,
  type APIButtonComponentWithCustomId,
  Client,
  type ClientOptions,
  Collection,
  REST,
  Routes,
} from "discord.js";
import { connect } from "mongoose";
import { existsSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "url";
import ApiExpress from "../api/express.js";
import type { MoulinetteSlashCommand } from "../types/command.js";
import type MoulinetteComponent from "../types/component.js";
import type MoulinetteEvent from "../types/event.js";

function isJsOrTsFile(file: string): boolean {
  return file.endsWith(".js") || file.endsWith(".ts");
}

export default class MoulinetteClient extends Client {
  constructor(options: ClientOptions) {
    if (!process.env["DISCORD_TOKEN"])
      throw new Error("DISCORD_TOKEN not set.");

    super(options);

    this.commands = new Collection();
    this.components = new Collection();

    console.log("> Starting Intra-MoulinetteMC\n");

    void this.init().catch((e: unknown) => {
      throw e;
    });
  }

  public commands: Collection<string, MoulinetteSlashCommand>;
  public components: Collection<RegExp, MoulinetteComponent>;
  private directory: string = resolve(
    dirname(fileURLToPath(import.meta.url)),
    "..",
  );

  private async init(): Promise<void> {
    await this.loadCommands();
    await this.registerCommands();
    await this.loadEvents();
    await this.loadComponents();
    await this.connectDatabase();
    await this.startApi();
    await this.login(process.env["DISCORD_TOKEN"]);
    console.log("! Initialisation complete");
  }

  private async loadCommands(): Promise<void> {
    const commandsPath = join(this.directory, "commands");

    if (!existsSync(commandsPath)) return;

    const commandFiles = readdirSync(commandsPath).filter(isJsOrTsFile);
    for (const file of commandFiles) {
      const module = (await import(resolve(commandsPath, file))) as {
        default: MoulinetteSlashCommand;
      };
      const command = module.default;

      console.log(`+ [command] /${command.data.name}`);
      this.commands.set(command.data.name, command);
    }

    console.log(`> ${String(this.commands.size)} commands loaded!`);
  }

  private async registerCommands(): Promise<void> {
    if (
      !process.env["DISCORD_TOKEN"] ||
      !process.env["DISCORD_CLIENT_ID"] ||
      !process.env["A1_GUILD_ID"]
    )
      throw new Error(
        "DISCORD_TOKEN or DISCORD_CLIENT_ID or A1_GUILD_ID not set.",
      );

    try {
      const data = (await new REST()
        .setToken(process.env["DISCORD_TOKEN"])
        .put(
          Routes.applicationGuildCommands(
            process.env["DISCORD_CLIENT_ID"],
            process.env["A1_GUILD_ID"],
          ),
          {
            body: this.commands.map((c) => c.data.toJSON()),
          },
        )) as APIApplicationCommand[];

      console.log(`> ${String(data.length)} commands registered!\n`);
    } catch (e) {
      console.error(e);
    }
  }

  private async loadEvents(): Promise<void> {
    let eventCount = 0;

    const eventsPath = join(this.directory, "events");

    if (!existsSync(eventsPath)) return;

    const eventFiles = readdirSync(eventsPath).filter(isJsOrTsFile);
    for (const file of eventFiles) {
      const module = (await import(resolve(eventsPath, file))) as {
        default: MoulinetteEvent;
      };
      const event = module.default;
      console.log(`+ [event]: ${event.name}`);

      if (event.once) {
        this.once(event.name, (...args) => {
          void event.execute(this, ...args);
        });
      } else {
        this.on(event.name, (...args) => {
          void event.execute(this, ...args);
        });
      }

      eventCount++;
    }
    console.log(`> ${String(eventCount)} events loaded !\n`);
  }

  private async loadComponents(): Promise<void> {
    const componentsPath = join(this.directory, "components");

    if (!existsSync(componentsPath)) return;

    const commandFiles = readdirSync(componentsPath).filter(isJsOrTsFile);
    for (const file of commandFiles) {
      const module = (await import(resolve(componentsPath, file))) as {
        default: MoulinetteComponent;
      };
      const component = module.default;

      if (
        !component.pattern.test(
          (component.data.toJSON() as APIButtonComponentWithCustomId).custom_id,
        )
      ) {
        console.error(
          `- [component] ${String(component.pattern)} do not match.`,
        );
        continue;
      }

      console.log(`+ [component] ${String(component.pattern)}`);
      this.components.set(component.pattern, component);
    }

    console.log(`> ${String(this.components.size)} components loaded!\n`);
  }

  private async connectDatabase(): Promise<void> {
    if (!process.env["DATABASE_URI"]) throw new Error("DATABASE_URI not set.");
    await connect(process.env["DATABASE_URI"], {
      autoIndex: false, // Don't build indexes
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
    })
      .then(() => {
        console.log("> MongoDB connected!\n");
      })
      .catch((err: unknown) => {
        throw err;
      });
  }

  private async startApi(): Promise<void> {
    await ApiExpress(this);
    console.log(`> ExpressJS server online!\n`);
  }
}
