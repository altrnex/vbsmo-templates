"""Development-only proxy to the local FastAPI process; never part of the static export."""

import http.client
import os
import re

from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def api_proxy(request, route):
    if os.environ.get("VBSMO_STATIC_EXPORT") or not re.fullmatch(
        r"(?:[A-Za-z0-9_-]+/)*[A-Za-z0-9_-]+/?", route
    ):
        return JsonResponse({"error": "Not found"}, status=404)
    if len(request.body) > 65536:
        return JsonResponse({"error": "Request too large"}, status=413)
    connection = http.client.HTTPConnection("127.0.0.1", 3001, timeout=15)
    headers = {
        name: request.headers[name]
        for name in ("Content-Type", "Accept")
        if name in request.headers
    }
    query = request.META.get("QUERY_STRING", "")
    try:
        connection.request(
            request.method,
            f"/v1/{route}" + (f"?{query}" if query else ""),
            request.body,
            headers,
        )
        response = connection.getresponse()
        body = response.read(1024 * 1024 + 1)
        if len(body) > 1024 * 1024:
            return JsonResponse({"error": "API response too large"}, status=502)
        return HttpResponse(
            body,
            status=response.status,
            content_type=response.getheader("Content-Type", "application/json"),
        )
    except (OSError, http.client.HTTPException):
        return JsonResponse(
            {"error": "Start the API with bun run dev from the project root."},
            status=502,
        )
    finally:
        connection.close()
