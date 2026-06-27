import express from "express";
import { Client } from "discord.js";
import ApiLogin from "./login.js";
import ApiSession from "./session.js";

const app = express();

export default function ApiExpress(client: Client): void {
	if (!process.env["API_PORT"]) throw new Error("API_PORT not set");

	app.get("/*", (req, _res, next) => {
		console.log(
			`◊ /${req.originalUrl} : ${req.socket.remoteAddress ? req.socket.remoteAddress.split(":").pop() : "unknown IP"}`,
		);
		next();
	});

	app.get("/", async (_req, res) => res.status(200).json({ status: "OK" }));

	app.use("/login", ApiLogin(client));
	app.use("/session", ApiSession());

	app.use((_req, res) => res.status(404).send("Not Found"));

	app.listen(process.env["API_PORT"], () =>
		console.log(`✔ ExpressJS server online !`),
	);
}
