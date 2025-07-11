FROM oven/bun:1.2

WORKDIR /app
COPY package.json .
COPY package-lock.json .

RUN bun install
COPY . .