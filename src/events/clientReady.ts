import { ActivityType } from "discord.js";
import { MoulinetteEventBuilder } from "../types/event.js";

export default MoulinetteEventBuilder({
  name: "clientReady",
  once: true,
  execute(_client, client) {
    console.log(`Ω ${client.user.tag} is online !`);

    if (process.env["NODE_ENV"] == "production") {
      client.user.setPresence({
        status: "online",
        activities: [
          { name: `submits of practicals`, type: ActivityType.Watching },
        ],
      });
    } else {
      client.user.setPresence({
        status: "dnd",
        activities: [{ name: `0% archi tags`, type: ActivityType.Watching }],
      });
    }
  },
});
