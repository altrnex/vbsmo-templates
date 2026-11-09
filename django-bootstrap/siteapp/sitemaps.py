from django.contrib.sitemaps import Sitemap
from django.urls import reverse


class PageSitemap(Sitemap):
    """List named public pages here; use a separate sitemap for content collections."""

    def items(self):
        return ["home"]

    def location(self, item):
        return reverse(item)
