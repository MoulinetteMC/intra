const { Rcon } = require("rcon-client");

module.exports = async function (command) {
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
};
