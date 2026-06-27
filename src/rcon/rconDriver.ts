import { Rcon } from "rcon-client";

export default async function RconDriver(command: string) {
	if (
		!process.env["RCON_HOST"] ||
		!process.env["RCON_PWD"] ||
		!process.env["RCON_PORT"]
	)
		throw new Error("RCON_PWD not set.");

	const rcon = await Rcon.connect({
		host: process.env["RCON_HOST"],
		port: Number(process.env["RCON_PORT"]),
		password: process.env["RCON_PWD"],
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
