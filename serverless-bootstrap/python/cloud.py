"""Cloud HTTP adapter. Infrastructure supplies secret references, never secret values in Git."""

import importlib
import json
import os
from contextlib import closing
from pathlib import Path

_config = json.loads((Path(__file__).parent / ".vbsmo.json").read_text())["capabilities"][
    "functions"
]
_handler = None


def initialize():
    global _handler
    if _handler is not None:
        return _handler
    names = _config["environment"]
    if names and os.environ.get("VBSMO_SECRET_ID"):
        import boto3
        from botocore.config import Config

        with closing(
            boto3.client(
                "secretsmanager",
                config=Config(connect_timeout=5, read_timeout=5, retries={"total_max_attempts": 2}),
            )
        ) as client:
            result = client.get_secret_value(
                SecretId=os.environ["VBSMO_SECRET_ID"],
                VersionId=os.environ["VBSMO_SECRET_VERSION"],
            )
        values = json.loads(result["SecretString"])
        for name in names:
            if not isinstance(values.get(name), str):
                raise ValueError("Missing secret binding")
            os.environ[name] = values[name]
    # Every declared binding must be available before the application starts.
    for name in names:
        if name not in os.environ:
            raise ValueError("Missing secret binding")
    _handler = importlib.import_module("index").handler
    return _handler


def response(status, message):
    return {
        "statusCode": status,
        "headers": {"Content-Type": "application/json", "Cache-Control": "no-store"},
        "body": json.dumps({"error": message}),
    }


def handler(event, context):
    route = next(
        (
            route
            for route in _config["routes"]
            if route["path"].rstrip("/") == event.get("path", "").rstrip("/")
            and route["method"] == event.get("httpMethod")
        ),
        None,
    )
    if route is None:
        return response(404, "Not found")
    if route["protection"]["captcha"] != "none":
        return response(403, "Route protection is unavailable")
    try:
        return initialize()(event, context)
    except Exception:
        return response(503, "Application API is unavailable")
