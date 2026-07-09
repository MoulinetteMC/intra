import express from "express";
import Players from "../models/players.js";
import Session from "../models/sessions.js";

const router = express.Router();

export default function ApiSession() {
	router.get("/", async (req, res) => {
		if (!req.query["token"])
			return res.status(400).json({ error: "Missing token" });

		const sessionData = await Session.findById(req.query["token"]);

		if (!sessionData)
			// Session expired or inexistant
			return res.status(200).json({ auth: -1 });
		else if (!sessionData.granted)
			// Session denied
			return res.status(200).json({ auth: 0 });
		else {
			// Session granted
			const playerData = await Players.findById(
				sessionData.uuid,
				"playername", // Returns only "playername" field.
			);

			if (!playerData)
				return res.status(500).json({ error: "Player is not registered..." });

			return res.status(200).json({
				auth: 1,
				playername: playerData.playername,
				uuid: sessionData.uuid,
			});
		}
	});

	return router;
}
