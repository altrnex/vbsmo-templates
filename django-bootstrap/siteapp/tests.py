from xml.etree import ElementTree

from django.template.loader import render_to_string
from django.test import SimpleTestCase, override_settings


@override_settings(DEBUG=False)
class SiteContractTests(SimpleTestCase):
    def test_home_renders(self):
        self.assertEqual(self.client.get("/").status_code, 200)

    def test_custom_not_found_renders(self):
        response = self.client.get("/__vibeissimo_missing_page__/")
        self.assertEqual(response.status_code, 404)
        self.assertTemplateUsed(response, "404.html")

    def test_exported_not_found_uses_the_custom_handler(self):
        response = self.client.get("/404.html")
        self.assertEqual(response.status_code, 404)
        self.assertTemplateUsed(response, "404.html")

    def test_sitemap_is_xml_with_home(self):
        response = self.client.get("/sitemap.xml")
        self.assertEqual(response.status_code, 200)
        root = ElementTree.fromstring(response.content)
        locations = root.findall("{*}url/{*}loc")
        self.assertIn("http://testserver/", [node.text for node in locations])

    def test_local_icon_loader(self):
        self.assertIn("<svg", render_to_string("icons/check.svg"))
