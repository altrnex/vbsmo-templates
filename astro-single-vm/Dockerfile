FROM oven/bun:1.4.4 AS build
WORKDIR /app
COPY . .
RUN bun install --frozen-lockfile && bun run build
FROM oven/bun:1.4.4
WORKDIR /app
COPY --from=build /app /app
ENV NODE_ENV=production DATABASE_PATH=/data/app.sqlite
ENV HOST=0.0.0.0 PORT=4321
EXPOSE 4321
CMD ["sh", "-c", "bun run db:migrate && exec bun apps/web/dist/server/entry.mjs"]
