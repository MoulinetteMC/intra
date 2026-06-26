import RconDriver from "./rconDriver.js";

export default async function RconGetPlayerList() {
	const response = await RconDriver("list");

	if (response) {
		const endOfLine = response.split(": ").pop();

		if (endOfLine === undefined || endOfLine.includes("players online"))
			return [];
		else
			return endOfLine
				.trim()
				.split(",")
				.map((name) => name.trim());
	} else return [];
}
