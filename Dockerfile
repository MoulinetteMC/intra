FROM node:24-alpine

# Build arguments and environment
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /home/node/app

# Install dependencies first to leverage Docker cache. Prefer npm ci, fall back to npm install.
COPY package*.json ./
RUN set -eux; \
  if [ -f package-lock.json ]; then \
  npm ci --omit=dev --no-audit --no-fund; \
  else \
  npm install --no-audit --no-fund; \
  fi

# Copy app files and set ownership to non-root user
COPY --chown=node:node . .

USER node

EXPOSE 3005

CMD ["node", "home.js"]