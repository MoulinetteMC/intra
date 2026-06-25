import express from "express";
import {
	Client,
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} from "discord.js";
import { uid } from "uid/secure";
import Players from "../models/players.js";
import Session from "../models/sessions.js";

const router = express.Router();

export default function ApiLogin(client: Client) {
	router.get("/", async (req, res) => {
		if (!req.query.username) {
			res.status(400);
			res.json({ error: "Missing username" });
		} else {
			const playerData = await Players.findOne({
				playername: req.query.username,
			});

			if (!playerData) {
				res.status(401);
				res.send({ error: "Unregistered player" });
			} else {
				const token = uid();

				Session.create({
					_id: token,
					uuid: playerData._id,
				});

				client.users.send(playerData.userid, {
					embeds: [
						new EmbedBuilder()
							.setColor("Blurple")
							.setTitle("Are you trying to connect to the server ?")
							.setTimestamp(),
					],
					components: [
						new ActionRowBuilder()
							.addComponents(
								new ButtonBuilder()
									.setCustomId(`grant-${token}`)
									.setStyle(ButtonStyle.Success)
									.setLabel("Yes"),
							)
							.addComponents(
								new ButtonBuilder()
									.setCustomId(`deny-${token}`)
									.setStyle(ButtonStyle.Danger)
									.setLabel("No"),
							)
							.toJSON(),
					],
				});

				res.status(200);
				res.json({ token: token });
			}
		}
	});

	return router;
}
