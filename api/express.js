const express = require("express");
const app = express();
const port = 3005;

const Players = require("../models/players");
const Session = require("../models/sessions");
const {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} = require("discord.js");

const { uid } = require("uid/secure");

module.exports = async (client) => {
	app.get("/", async (req, res) => {
		console.log(`◊ / : ${req.socket.remoteAddress.split(":").pop()}`);
		res.status(200);
		res.json({ status: "OK" });
	});

	app.get("/login", async (req, res) => {
		console.log(`◊ /login : ${req.socket.remoteAddress.split(":").pop()}`);
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
									.setLabel("Yes")
							)
							.addComponents(
								new ButtonBuilder()
									.setCustomId(`deny-${token}`)
									.setStyle(ButtonStyle.Danger)
									.setLabel("No")
							),
					],
				});

				res.status(200);
				res.json({ token: token });
			}
		}
	});

	app.get("/session", async (req, res) => {
		console.log(`◊ /session : ${req.socket.remoteAddress.split(":").pop()}`);
		if (!req.query.token) {
			res.status(400);
			res.json({ error: "Missing token" });
		} else {
			const sessionData = await Session.findById(req.query.token);
			if (!sessionData) {
				res.status(200);
				res.json({ auth: -1 });
			} else if (!sessionData.granted) {
				res.status(200);
				res.json({ auth: 0 });
			} else if (sessionData.granted) {
				const playerData = await Players.findById(
					sessionData.uuid,
					"playername"
				);
				res.status(200);
				res.json({
					auth: 1,
					playername: playerData.playername,
					uuid: sessionData.uuid
				});
			} else {
				res.status(500);
				res.json({ error: "Something goes wrong..." });
			}
		}
	});

	app.listen(port, () => console.log(`✔ ExpressJS server online !`.magenta));
};
