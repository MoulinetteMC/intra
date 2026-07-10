import { Rcon } from "rcon-client";

export default async function RconDriver(
  command: string,
): Promise<string | undefined> {
  if (
    !process.env["RCON_HOST"] ||
    !process.env["RCON_PWD"] ||
    !process.env["RCON_PORT"]
  )
    throw new Error("RCON_HOST or RCON_PORT or RCON_PWD not set.");

  let rcon: Rcon | undefined = undefined;

  try {
    rcon = await Rcon.connect({
      host: process.env["RCON_HOST"],
      port: Number(process.env["RCON_PORT"]),
      password: process.env["RCON_PWD"],
    });

    return await rcon.send(command);
  } catch (err) {
    console.error("¤ [rcon]:", err);
    return undefined;
  } finally {
    if (rcon) {
      try {
        await rcon.end();
      } catch (endErr) {
        console.error("¤ [rcon]:", endErr);
      }
    }
  }
}
