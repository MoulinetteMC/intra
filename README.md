<div align="center">
  <img src="https://raw.githubusercontent.com/MoulinetteMC/.github/refs/heads/main/profile/assets/moulinettemc_title.png" width=480 alt="MoulinetteMC">
  <h1>Intra-MoulinetteMC</h1>
</div>

**MoulinetteMC**'s internal API for authentication management and miscellaneous.

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
      DISCORD_TOKEN: "DISCORD_BOT_TOKEN"
      DISCORD_CLIENT_ID: "DISCORD_BOT_CLIENT_ID"
      DATABASE_URI: "mongodb+srv://..."
      API_PORT: 3000
      A1_GUILD_ID: "GUILD_ID"
      ROLE_ID: "ROLE_ID"
      RCON_HOST: "rcon-host"
      RCON_PORT: 25575
      RCON_PWD: 8cc31124b72373f7b0e10311
    ports:
      - "HOST_PORT:API_PORT"
    restart: unless-stopped
    ...
```
