FROM node:20-alpine AS builder

RUN apk add --no-cache openssl

WORKDIR /app

COPY backend/package.json ./

RUN yarn install --frozen-lockfile

COPY backend .

RUN yarn prisma generate

RUN yarn build

FROM node:20-alpine

RUN apk add --no-cache openssl python3 make g++

WORKDIR /app

COPY backend/package.json ./
RUN yarn install --production --frozen-lockfile

RUN yarn add --dev ts-node

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
CMD ["node", "dist/src/main.js"]