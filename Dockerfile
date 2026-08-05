# Optional: only needed if you choose to deploy via Docker (e.g. Render's
# "Docker" runtime, or Fly.io). Render's native Node runtime does not need this.
FROM node:22-slim AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["sh", "-c", "unset HOSTNAME; exec node server.js"]
