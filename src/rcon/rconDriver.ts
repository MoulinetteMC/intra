import { Rcon } from "rcon-client";

export default async function RconDriver(command: string) {
	if (!process.env.RCON_PWD) throw new Error("RCON_PWD not set.");

	const rcon = await Rcon.connect({
		host: "moulinettemc-server",
		port: 25575,
		password: process.env.RCON_PWD,
	});

	try {
		return await rcon.send(command);
	} catch (err) {
		console.error(err);
		return "";
	} finally {
		await rcon.end();
	}
}
