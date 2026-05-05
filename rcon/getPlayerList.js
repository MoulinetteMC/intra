const rcon = require("./rconDriver");

module.exports = async function () {
	const response = await rcon("list");

	if (response) {
		const endOfLine = response.split(": ").pop().trim();

		if (endOfLine == "" || endOfLine.includes("players online"))
			return [];
		else return endOfLine.split(",").map(name => name.trim());
	}
	else return [];
}
