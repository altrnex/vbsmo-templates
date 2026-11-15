FROM python:3.14-slim
COPY --from=oven/bun:1.4.4 /usr/local/bin/bun /usr/local/bin/bun
WORKDIR /app
COPY . .
RUN bun install --frozen-lockfile && python -m venv apps/web/.venv \
  && apps/web/.venv/bin/pip install --no-cache-dir -r apps/web/requirements.txt
# collectstatic signs nothing; the throwaway key never leaves this step.
RUN --mount=type=secret,id=app_env,target=/run/secrets/app_env \
  set -a && . /run/secrets/app_env && set +a \
  && DJANGO_SECRET_KEY="$(python -c 'import secrets; print(secrets.token_urlsafe(50))')" bun run build
WORKDIR /app/apps/web
ENV VBSMO_PRODUCTION=1
EXPOSE 8000
CMD ["sh", "-c", "umask 077 && { test -s /data/secret-key || python -c 'import secrets; print(secrets.token_urlsafe(50))' > /data/secret-key; } && export DJANGO_SECRET_KEY=\"$(cat /data/secret-key)\" && .venv/bin/python manage.py migrate --noinput && exec .venv/bin/gunicorn vibeissimo.wsgi --bind 0.0.0.0:8000 --workers 2"]
