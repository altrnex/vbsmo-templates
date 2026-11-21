FROM dunglas/frankenphp:1.12-php8.5-trixie AS build
RUN install-php-extensions pdo_pgsql intl bcmath zip
COPY --from=node:24.20.0-slim /usr/local/bin/node /usr/local/bin/node
COPY --from=oven/bun:1.4.5 /usr/local/bin/bun /usr/local/bin/bun
COPY --from=composer:2.11.2 /usr/bin/composer /usr/bin/composer
WORKDIR /app
COPY package.json bun.lock ./
COPY apps/web/package.json apps/web/package.json
RUN bun install --frozen-lockfile
COPY apps/web/composer.json apps/web/composer.lock apps/web/
RUN cd apps/web && composer install --no-dev --no-interaction --no-scripts --no-autoloader --prefer-dist
COPY apps/web apps/web
# The build generates the Wayfinder route helpers by booting the application, which needs a key but no database.
RUN cd apps/web && mkdir -p storage/framework/views storage/framework/cache storage/framework/sessions \
  && composer dump-autoload --optimize --no-dev --no-interaction \
  && APP_KEY=base64:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA= bun run build

FROM dunglas/frankenphp:1.12-php8.5-trixie
RUN install-php-extensions pdo_pgsql intl bcmath zip
WORKDIR /app
COPY apps/web .
COPY --from=build /app/apps/web/vendor vendor
COPY --from=build /app/apps/web/bootstrap/cache bootstrap/cache
COPY --from=build /app/apps/web/public/build public/build
COPY Caddyfile.app /etc/frankenphp/Caddyfile
ENV LARAVEL_STORAGE_PATH=/data/storage UPLOADS_DIR=/data/uploads APP_ENV=production APP_DEBUG=false LOG_CHANNEL=stderr SESSION_DRIVER=database CACHE_STORE=file QUEUE_CONNECTION=sync
EXPOSE 3000
CMD ["sh", "-c", "umask 077 && mkdir -p $LARAVEL_STORAGE_PATH/app $LARAVEL_STORAGE_PATH/framework/cache/data $LARAVEL_STORAGE_PATH/framework/sessions $LARAVEL_STORAGE_PATH/framework/views $LARAVEL_STORAGE_PATH/logs $UPLOADS_DIR/public && { test -s /data/app-key || php -r 'echo \"base64:\".base64_encode(random_bytes(32));' > /data/app-key; } && export APP_KEY=\"$(cat /data/app-key)\" && php artisan storage:link --force && php artisan migrate --force && php artisan optimize && exec frankenphp run --config /etc/frankenphp/Caddyfile"]
