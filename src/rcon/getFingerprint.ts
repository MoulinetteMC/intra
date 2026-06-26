import RconDriver from "./rconDriver.js";

export default async function RconGetFingerprint() {
	const response = await RconDriver("automodpack host fingerprint");

	if (response) {
		const match = response.match(/([a-f0-9]{64})/g);
		if (!match) console.error("Impossible to retrieve fingerprint.");
		else return match[0];
	}

	else return "";
}
