import {
	EmbedBuilder,
	MessageFlags,
	type InteractionReplyOptions,
} from "discord.js";

export function replyError(message: string): InteractionReplyOptions {
	const trimmed = message.trim();
	if (!message || trimmed.length === 0 || trimmed.length > 4096)
		message = "Unknown error occurred.";

	return {
		embeds: [new EmbedBuilder().setDescription(message).setColor("Red")],
		flags: [MessageFlags.Ephemeral],
	};
}
