import RconDriver from "./rconDriver.js";

export default async function RconGetFingerprint(): Promise<
	string | undefined
> {
	const response = await RconDriver("automodpack host fingerprint");

	if (!response) return undefined;

	const match = response.match(/([a-f0-9]{64})/g);
	if (!match) return void console.error("Fingerprint cannot be extracted.");

	return match[0];
}
