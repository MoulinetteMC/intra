import RconDriver from "./rconDriver.js";

export default async function RconGetPlayerList(): Promise<string[]> {
	const response = await RconDriver("list");

	if (!response) return [];
	const endOfLine = response.split(": ").pop();

	if (endOfLine === undefined || endOfLine.includes("players online"))
		return [];

	const res = endOfLine
		.trim()
		.split(",")
		.map((name) => name.trim());
		
	return res;
}
