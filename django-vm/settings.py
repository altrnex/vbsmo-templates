"""Django/PostgreSQL settings shared by local development, preview and the customer VM."""

import json
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
PRODUCTION = os.environ.get("VBSMO_PRODUCTION") == "1"
# The platform-owned file is excluded from Git and source exports. Relative discovery also
# supports management commands issued by the coding agent without a separate secret channel.
preview_file = os.environ.get("VBSMO_PREVIEW_DATABASE_FILE")
if not preview_file and not PRODUCTION:
    candidate = BASE_DIR.parent.parent / ".vbsmo-runtime/config/vm-preview.json"
    if candidate.is_file():
        preview_file = str(candidate)
preview = json.loads(Path(preview_file).read_text()) if preview_file else {}
SECRET_KEY = preview.get("signingKey") or os.environ.get("DJANGO_SECRET_KEY", "")
if not SECRET_KEY:
    raise RuntimeError("Set DJANGO_SECRET_KEY for your local development environment")
DEBUG = not PRODUCTION
HOSTNAME = os.environ.get("VBSMO_HOSTNAME", "")
if PRODUCTION and not HOSTNAME:
    raise RuntimeError("The production hostname is required")
# Preview is reachable only through the authenticated gateway, which sends the public host
# as X-Forwarded-Host (USE_X_FORWARDED_HOST below) for host and CSRF origin checks.
ALLOWED_HOSTS = (
    [HOSTNAME]
    if PRODUCTION
    else (["*"] if preview else ["localhost", "127.0.0.1", "testserver"])
)
if not PRODUCTION and os.environ.get("VBSMO_PREVIEW_HOST"):
    ALLOWED_HOSTS.append(os.environ["VBSMO_PREVIEW_HOST"])

INSTALLED_APPS = [
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.humanize",
    "django.contrib.sitemaps",
    "siteapp",
]
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    *(
        ["django.middleware.clickjacking.XFrameOptionsMiddleware"]
        if not preview
        else []
    ),
]
ROOT_URLCONF = "vibeissimo.urls"
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates", BASE_DIR / "node_modules" / "lucide-static"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ]
        },
    }
]
WSGI_APPLICATION = "vibeissimo.wsgi.application"
ASGI_APPLICATION = "vibeissimo.asgi.application"
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "HOST": preview.get("socket") or os.environ.get("PGHOST", "127.0.0.1"),
        "PORT": "5432" if preview else os.environ.get("PGPORT", "5432"),
        "NAME": preview.get("database") or os.environ.get("PGDATABASE", "vbsmo_app"),
        "USER": preview.get("user") or os.environ.get("PGUSER", "vbsmo_app"),
        "PASSWORD": preview.get("password") or os.environ.get("PGPASSWORD", ""),
        "OPTIONS": {"options": "-c statement_timeout=15000 -c lock_timeout=5000"},
        "CONN_MAX_AGE": 60 if PRODUCTION else 0,
    }
}
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"
    },
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
# Preview and deployment both serve from the origin root.
FORCE_SCRIPT_NAME = None
STATIC_URL = "/static/"
STATIC_ROOT = Path(os.environ.get("STATIC_ROOT", str(BASE_DIR / "staticfiles")))
STATICFILES_DIRS = [BASE_DIR / "static"]
MEDIA_URL = "/media/"
MEDIA_ROOT = Path(
    preview.get("media") or os.environ.get("MEDIA_ROOT", str(BASE_DIR / "media"))
)
MESSAGE_STORAGE = "django.contrib.messages.storage.session.SessionStorage"
SESSION_COOKIE_NAME = "app_session"
CSRF_COOKIE_NAME = "app_csrf"
SESSION_COOKIE_DOMAIN = None
CSRF_COOKIE_DOMAIN = None
SESSION_COOKIE_PATH = "/"
CSRF_COOKIE_PATH = "/"
SESSION_COOKIE_SECURE = PRODUCTION or bool(preview)
CSRF_COOKIE_SECURE = PRODUCTION or bool(preview)
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = "Lax"
CSRF_COOKIE_SAMESITE = "Lax"
CSRF_TRUSTED_ORIGINS = [f"https://{HOSTNAME}"] if PRODUCTION else []
USE_X_FORWARDED_HOST = bool(preview)
SECURE_PROXY_SSL_HEADER = (
    ("HTTP_X_FORWARDED_PROTO", "https") if PRODUCTION or preview else None
)
SECURE_SSL_REDIRECT = PRODUCTION
SECURE_HSTS_SECONDS = 3600 if PRODUCTION else 0
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY" if PRODUCTION else "SAMEORIGIN"
DATA_UPLOAD_MAX_MEMORY_SIZE = 2 * 1024 * 1024
FILE_UPLOAD_MAX_MEMORY_SIZE = 1024 * 1024
