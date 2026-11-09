from django.http import HttpRequest, HttpResponse
from django.shortcuts import render


def home(request: HttpRequest) -> HttpResponse:
    return render(request, "index.html")


def handler404(request: HttpRequest, exception: Exception | None = None) -> HttpResponse:
    return render(request, "404.html", status=404)


def healthz(_request: HttpRequest) -> HttpResponse:
    return HttpResponse("ok", content_type="text/plain")
