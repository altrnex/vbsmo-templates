FROM oven/bun:1.4.4 AS build
WORKDIR /app
COPY . .
RUN bun install --frozen-lockfile && bun run build
RUN if [ -d apps/web/public ]; then mkdir -p apps/web/.next/standalone/apps/web && cp -r apps/web/public apps/web/.next/standalone/apps/web/public; fi \
 && mkdir -p apps/web/.next/standalone/apps/web/.next \
 && cp -r apps/web/.next/static apps/web/.next/standalone/apps/web/.next/static
FROM oven/bun:1.4.4
WORKDIR /app
COPY --from=build /app /app
ENV NODE_ENV=production DATABASE_PATH=/data/app.sqlite
ENV HOSTNAME=0.0.0.0 PORT=3000
EXPOSE 3000
CMD ["sh", "-c", "bun run db:migrate && exec bun apps/web/.next/standalone/apps/web/server.js"]
