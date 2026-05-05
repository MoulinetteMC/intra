const rcon = require("./rconDriver");

module.exports = async function () {
	const response = await rcon("automodpack host fingerprint");

	if (response) {
		const match = response.match(/([a-f0-9]{64})/g);
		if (!match) console.error("Impossible to retrieve fingerprint.");
		else return match[0];
	}
	else return "";
}
