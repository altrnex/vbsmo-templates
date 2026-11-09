from django.contrib.sitemaps.views import sitemap
from django.urls import path
from siteapp.sitemaps import PageSitemap
from siteapp.views import healthz, home

handler404 = "siteapp.views.handler404"

urlpatterns = [
    path("", home, name="home"),
    path("healthz", healthz, name="healthz"),
    path("sitemap.xml", sitemap, {"sitemaps": {"pages": PageSitemap}}, name="sitemap"),
]
