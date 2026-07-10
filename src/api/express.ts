import express from "express";
import { Client } from "discord.js";
import ApiLogin from "./login.js";
import ApiSession from "./session.js";

const app = express();

export default async function ApiExpress(client: Client): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    if (!process.env["API_PORT"]) throw new Error("API_PORT not set");

    app.get(["/", "/login", "/session"], (req, _res, next) => {
      const ip = req.socket.remoteAddress?.split(":").pop() ?? "unknown IP";
      console.log(`◊ ${req.originalUrl} : ${ip}`);
      next();
    });

    app.get("/", (_req, res) => res.status(200).json({ status: "OK" }));

    app.use("/login", ApiLogin(client));
    app.use("/session", ApiSession());

    app.use((_req, res) => res.status(404).send("Not Found"));

    app.listen(process.env["API_PORT"], (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}
