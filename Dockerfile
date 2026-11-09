FROM oven/bun:1 AS dependencies

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM oven/bun:1 AS builder

WORKDIR /app
ENV DATABASE_URL=mysql://build:build@localhost:3306/build

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=dependencies /app/node_modules ./node_modules
COPY package.json bun.lock ./
COPY prisma ./prisma
COPY . .

RUN bunx --bun prisma generate
RUN bun run build

FROM oven/bun:1-slim AS runner

WORKDIR /app
ENV NODE_ENV=production

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app ./

EXPOSE 3000

CMD ["bun", "run", "start"]
