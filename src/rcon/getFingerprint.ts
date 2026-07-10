import RconDriver from "./rconDriver.js";

export default async function RconGetFingerprint(): Promise<
  string | undefined
> {
  const response = await RconDriver("automodpack host fingerprint");

  if (!response) return undefined;

  const match = response.match(/([a-f0-9]{64})/g);
  if (!match) {
    console.error("Fingerprint cannot be extracted.");
    return undefined;
  }

  return match[0];
}
