FROM node:26-alpine AS builder

WORKDIR /home/node/app

COPY package*.json ./

RUN set -eux; \
  if [ -f package-lock.json ]; then \
    npm ci --no-audit --no-fund; \
  else \
    npm install --no-audit --no-fund; \
  fi

COPY . .

RUN npm run build
RUN npm prune --omit=dev

FROM node:26-alpine AS runtime

WORKDIR /home/node/app

COPY --from=builder --chown=node:node /home/node/app/node_modules ./node_modules
COPY --from=builder --chown=node:node /home/node/app/dist ./dist
COPY --from=builder --chown=node:node /home/node/app/package*.json ./

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

USER node

CMD ["npm", "start"]