const { Rcon } = require("rcon-client");

module.exports = async function () {
	const rcon = await Rcon.connect({
		host: "moulinettemc-server",
		port: 25575,
		password: process.env.RCON_PWD,
	});

	let result = "";

	try {
		const response = await rcon.send("automodpack host fingerprint");
		const match = response.match(/([a-f0-9]{64})/g);

		if (!match) console.error("Impossible to retrieve fingerprint.");
		else result = match[0];
	} finally {
		await rcon.end();
	}

	return result;
};
