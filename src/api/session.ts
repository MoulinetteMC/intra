import express from "express";
import Players from "../models/players.js";
import Session from "../models/sessions.js";

const router = express.Router();

export default function ApiSession() {
	router.get("/", async (req, res) => {
		if (!req.query.token) {
			res.status(400);
			res.json({ error: "Missing token" });
		} else {
			const sessionData = await Session.findById(req.query.token);

			if (!sessionData) {
				// Session expired or inexistant
				res.status(200);
				res.json({ auth: -1 });
			} else if (!sessionData.granted) {
				// Session denied
				res.status(200);
				res.json({ auth: 0 });
			} else if (sessionData.granted) {
				// Session granted

				const playerData = await Players.findById(
					sessionData.uuid,
					"playername", // Returns only "playername" field.
				);

				if (playerData) {
					res.status(200);
					res.json({
						auth: 1,
						playername: playerData.playername,
						uuid: sessionData.uuid,
					});
				} else {
					res.status(500);
					res.json({ error: "Player is not registered..." });
				}
			} else {
				res.status(500);
				res.json({ error: "Something goes wrong..." });
			}
		}
	});

	return router;
}
