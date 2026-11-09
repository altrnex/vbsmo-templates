from django.contrib.sitemaps.views import sitemap
from django.urls import path
from django_distill import distill_path

from siteapp.sitemaps import PageSitemap
from siteapp.views import handler404, healthz, home

urlpatterns = [
    distill_path("", home, name="home"),
    distill_path("404.html", handler404, name="not-found", distill_status_codes=(404,)),
    path("healthz", healthz, name="healthz"),
    path("sitemap.xml", sitemap, {"sitemaps": {"pages": PageSitemap}}, name="sitemap"),
]
