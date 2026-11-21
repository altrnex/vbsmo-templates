FROM oven/bun:1.4.5 AS assets
WORKDIR /app
COPY package.json bun.lock ./
COPY apps/web/package.json apps/web/package.json
RUN bun install --frozen-lockfile
COPY apps/web apps/web
RUN cd apps/web && bun ./node_modules/vite/bin/vite.js build

FROM composer:2.11.2 AS vendor
WORKDIR /app
COPY apps/web/composer.json apps/web/composer.lock ./
RUN composer install --no-dev --no-interaction --no-scripts --no-autoloader --prefer-dist

FROM dunglas/frankenphp:1.12-php8.5-trixie
RUN install-php-extensions pdo_pgsql intl bcmath zip
COPY --from=vendor /usr/bin/composer /usr/bin/composer
WORKDIR /app
COPY apps/web .
COPY --from=vendor /app/vendor vendor
COPY --from=assets /app/apps/web/public/build public/build
RUN composer dump-autoload --optimize --no-dev --no-interaction
COPY Caddyfile.app /etc/frankenphp/Caddyfile
ENV LARAVEL_STORAGE_PATH=/data/storage UPLOADS_DIR=/data/uploads APP_ENV=production APP_DEBUG=false LOG_CHANNEL=stderr SESSION_DRIVER=database CACHE_STORE=file QUEUE_CONNECTION=sync
EXPOSE 3000
CMD ["sh", "-c", "umask 077 && mkdir -p $LARAVEL_STORAGE_PATH/app $LARAVEL_STORAGE_PATH/framework/cache/data $LARAVEL_STORAGE_PATH/framework/sessions $LARAVEL_STORAGE_PATH/framework/views $LARAVEL_STORAGE_PATH/logs $UPLOADS_DIR && { test -s /data/app-key || php -r 'echo \"base64:\".base64_encode(random_bytes(32));' > /data/app-key; } && export APP_KEY=\"$(cat /data/app-key)\" && php artisan migrate --force && php artisan optimize && exec frankenphp run --config /etc/frankenphp/Caddyfile"]
