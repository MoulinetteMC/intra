import {
	ComponentType,
	type InteractionEditReplyOptions,
} from "discord.js";

import { replyError } from "../util/functions.js";
import { MoulinetteEventBuilder } from "../types/event.js";

export default MoulinetteEventBuilder({
	name: "interactionCreate",
	once: false,
	async execute(client, interaction) {
		if (interaction.isChatInputCommand()) {
			const cmd = client.commands.get(interaction.commandName);

			if (!cmd) {
				console.error(`Command "${interaction.commandName}" do not exist`);
				return;
			}

			// Check if the user/member have access to the server.
			if (!process.env["A1_GUILD_ID"] || !process.env["ROLE_ID"])
				throw new Error("A1_GUILD_ID or ROLE_ID not set");

			try {
				const a1Guild = await client.guilds.fetch(process.env["A1_GUILD_ID"]);
				const moulinetteRole = await a1Guild.roles.fetch(
					process.env["ROLE_ID"],
				);

				if (!moulinetteRole) {
					console.error("MoulinetteRole has not been found.");
					return;
				}

				if (!moulinetteRole.members.has(interaction.user.id))
					return void (await interaction.reply(
						replyError("You are not autorized to play on MoulinetteMC"),
					));

				// Try to execute the command.
				console.log(`→ ${cmd.data.name} : ${interaction.user.username}`);

				const reply = await cmd.execute(client, interaction);

				if (interaction.deferred || interaction.replied) {
					await interaction.editReply(reply as InteractionEditReplyOptions);
				} else {
					await interaction.reply(reply);
				}
			} catch (err) {
				console.error(err);
			}
		} else if (
			interaction.isMessageComponent() &&
			interaction.componentType == ComponentType.Button
		) {
			const cmpt = client.components.find((_val, key) =>
				key.test(interaction.customId),
			);

			if (!cmpt) {
				console.error(`${interaction.customId} have no matching component.`);
				return;
			}

			try {
				console.log(
					`⌖ ${cmpt.pattern.toString()} : ${interaction.user.username}`,
				);
				await cmpt.execute(client, interaction);
			} catch (err) {
				console.error(err);
			}
		} else if (interaction.isAutocomplete()) {
			const command = client.commands.get(interaction.commandName);

			if (!command?.autocomplete) return;

			try {
				await interaction.respond(await command.autocomplete(interaction));
			} catch (error) {
				console.error(error);
				return;
			}
		}
	},
});
