<div align="center">
  <img src="https://raw.githubusercontent.com/MoulinetteMC/.github/refs/heads/main/profile/assets/moulinettemc_title.png" width=480 alt="MoulinetteMC">
  <h1>Intra-MoulinetteMC</h1>
</div>

Bot Discord d'assistance et de gestion du serveur **`MoulinetteMC`**.

# Utilisation

```yml
services:
  intra:
    image: ghcr.io/moulinettemc/intra:latest
    container_name: moulinettemc-intra
    # Start when the Minecraft server is online.
    # depends_on:
    #   server:
    #     condition: service_started
    environment:
      TOKEN: "DISCORD_TOKEN"
      DATABASE: "MONGO_DB_URI"
      CLIENT_ID: "DISCORD_BOT_ID"
      A1: "GUILD_ID"
      ROLE_ID: "ROLE_ID"
    ports:
      - "PORT:3005"
    restart: unless-stopped
```
