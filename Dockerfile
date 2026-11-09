FROM oven/bun:1 AS dependencies

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM oven/bun:1 AS builder

WORKDIR /app
ENV DATABASE_URL=file:/app/data/portfolio.db

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=dependencies /app/node_modules ./node_modules
COPY package.json bun.lock ./
COPY prisma ./prisma
COPY . .

RUN mkdir -p /app/data
RUN bunx --bun prisma db push --skip-generate
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
