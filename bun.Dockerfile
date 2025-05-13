FROM oven/bun:1.1

WORKDIR /app
COPY package.json .
COPY package-lock.json .

RUN bun install
COPY . .