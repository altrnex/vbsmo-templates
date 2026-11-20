FROM oven/bun:1.4.5 AS build
WORKDIR /app
COPY . .
RUN --mount=type=secret,id=app_env,target=/run/secrets/app_env \
  mkdir -p apps/web/public && bun install --frozen-lockfile && set -a && . /run/secrets/app_env && set +a && bun run build

FROM oven/bun:1.4.5
WORKDIR /app
COPY package.json bun.lock ./
COPY apps/web/package.json apps/web/package.json
COPY packages/db/package.json packages/db/package.json
RUN bun install --production --frozen-lockfile
COPY --from=build /app/apps/web/.next/standalone ./
COPY --from=build /app/apps/web/.next/static apps/web/.next/static
COPY --from=build /app/apps/web/public apps/web/public
COPY --from=build /app/apps/web/src/server apps/web/src/server
COPY --from=build /app/packages/db packages/db
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0 PORT=3000
EXPOSE 3000
CMD ["sh", "-c", "bun run db:migrate && exec bun apps/web/server.js"]
