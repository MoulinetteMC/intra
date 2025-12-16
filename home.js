const {
	Client,
	GatewayIntentBits: Intent,
	Collection,
	REST,
	Routes,
} = require("discord.js");
const { readdirSync } = require("node:fs");
const { join } = require("node:path");
const { connect } = require("mongoose");
require("dotenv/config");
require("colors");

const client = new Client({
	fetchAllMembers: true,
	disableMentions: "everyone",
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

/**
 * Console colors
 * blue : Slash
 * yellow : Events
 * gray : Models
 * magenta : ExpressJS
 *
 * red : Warns
 * red + bold : Errors
 */

console.log("α Lancement de Intra-MoulinetteMC");

// Création des collections (databases temporaires)
//["slash"].forEach((x) => (client[x] = new Collection()));
client.slash = new Collection();

//* Slash-commands (/)
const slashs = [];
const slashPath = join(process.cwd(), "commands");
const slashFiles = readdirSync(slashPath).filter((file) =>
	file.endsWith(".js")
);

for (const file of slashFiles) {
	const slash = require(join(slashPath, file));
	if ("data" in slash && "execute" in slash) {
		client.slash.set(slash.data.name, slash);
		slashs.push(slash.data.toJSON());
		console.log(`✔ Slash-command ${file}`.blue);
	} else {
		console.warn(`⚠ Slash-command ${file}: Missing infos`.red);
		// slashFiles.splice(slashFiles.indexOf(file), 1);
	}
}

//! Envoyer les slash-commands à Discord
(async function () {
	try {
		const data = await new REST()
			.setToken(process.env.TOKEN)
			.put(
				Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.A1),
				{ body: slashs }
			);
		console.log(`⯐ ${data.length} commands registered !`.blue);
	} catch (e) {
		console.error(e);
	}
})();

//* Events
const eventPath = join(process.cwd(), "events");
const eventFiles = readdirSync(eventPath).filter((file) =>
	file.endsWith(".js")
);

for (const file of eventFiles) {
	const event = require(join(eventPath, file));

	if ("execute" in event) {
		if (event.once) {
			client.once(event.name, (...args) => event.execute(client, ...args));
		} else {
			client.on(event.name, (...args) => event.execute(client, ...args));
		}
		console.log(`✔ Event ${file}`.yellow);
	} else {
		console.warn(`⚠ Event ${file}: Missing informations`.red);
		// eventFiles.splice(eventFiles.indexOf(file), 1);
	}
}

//* Models (detection, not registration)
const modelsPath = join(process.cwd(), "models");
const modelsFiles = readdirSync(modelsPath).filter((file) =>
	file.endsWith(".js")
);
for (const file of modelsFiles) {
	console.log(`✔ Model ${file}`.cyan);
}
// console.log(`✦ ${modelsFiles.length} Models`.gray)

//* MongoDB
try {
	connect(process.env.DATABASE, {
		autoIndex: false, // Don't build indexes
		maxPoolSize: 10, // Maintain up to 10 socket connections
		serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
		socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
		family: 4, // Use IPv4, skip trying IPv6
	}).then(() => {
		console.log("✔ MongoDB connected !".green);
	});
} catch (err) {
	console.error(err);
}

//* Express Server
require("./api/express")(client);

client.login(process.env.TOKEN);
