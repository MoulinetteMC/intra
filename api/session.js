const express = require("express");
const router = express.Router();

const Players = require("../models/players");
const Session = require("../models/sessions");

router.get("/session", async (req, res) => {
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
			const playerData = await Players.findById(sessionData.uuid, "playername");
			res.status(200);
			res.json({
				auth: 1,
				playername: playerData.playername,
				uuid: sessionData.uuid,
			});
		} else {
			res.status(500);
			res.json({ error: "Something goes wrong..." });
		}
	}
});

module.exports = router;
