import express from "express";
import { Client, EmbedBuilder, ActionRowBuilder } from "discord.js";
import { uid } from "uid/secure";
import Players from "../models/players.js";
import Session from "../models/sessions.js";
import SessionGrantButton from "../components/sessionGrantButton.js";
import SessionDenyButton from "../components/sessionDenyButton.js";

const router = express.Router();

export default function ApiLogin(client: Client) {
	router.get("/", async (req, res) => {
		if (!req.query["username"])
			return res.status(400).json({ error: "Missing username" });

		const playerData = await Players.findOne({
			playername: req.query["username"].toString(),
		});

		if (!playerData)
			return res.status(401).json({ error: "Unregistered player" });

		const token = uid();

		Session.create({
			_id: token,
			uuid: playerData._id.toString(),
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
					.setComponents(
						SessionGrantButton.data.setCustomId(`session:grant-${token}`),
						SessionDenyButton.data.setCustomId(`session:deny-${token}`),
					)
					.toJSON(),
			],
		});

		return res.status(200).json({ token: token });
	});

	return router;
}
