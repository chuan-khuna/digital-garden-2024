FROM oven/bun:1.1

WORKDIR /app
COPY package.json .

RUN bun install
COPY . .