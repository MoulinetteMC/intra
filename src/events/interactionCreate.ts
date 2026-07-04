import {
	ComponentType,
	ButtonInteraction,
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

			if (!cmd)
				return console.error(
					`Command "${interaction.commandName}" do not exist`,
				);

			// Check if the user/member have access to the server.
			if (!process.env["A1_GUILD_ID"] || !process.env["ROLE_ID"])
				throw new Error("A1_GUILD_ID or ROLE_ID not set");

			try {
				const a1Guild = await client.guilds.fetch(process.env["A1_GUILD_ID"]);
				const moulinetteRole = await a1Guild.roles.fetch(
					process.env["ROLE_ID"],
				);
				if (!moulinetteRole)
					return console.error("MoulinetteRole has not been found.");

				if (!moulinetteRole.members.has(interaction.user.id))
					return void (await interaction.reply(
						replyError("You are not autorized to play on MoulinetteMC"),
					));

				// Try to execute the command.
				console.log(`→ ${cmd.data.name} : ${interaction.user.username}`);

				const reply = cmd
					? await cmd.execute(client, interaction as never)
					: replyError("Unknown command");

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

			if (!cmpt)
				return console.error(
					`${interaction.customId} have no matching component.`,
				);

			try {
				console.log(
					`⌖ ${cmpt.regexp.toString()} : ${interaction.user.username}`,
				);
				await cmpt.execute(client, interaction as ButtonInteraction);
			} catch (err) {
				console.error(err);
			}
		} else if (interaction.isAutocomplete()) {
			const command = client.commands.get(interaction.commandName);

			if (!command || !command.autocomplete) return;

			try {
				await interaction.respond(await command.autocomplete(interaction));
			} catch (error) {
				console.error(error);
				return;
			}
		}
	},
});