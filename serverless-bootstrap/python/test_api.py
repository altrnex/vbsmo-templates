import json
import unittest

from index import handler


def request(method, payload=None, path="/v1/hello"):
    return handler(
        {
            "resource": path,
            "path": path,
            "httpMethod": method,
            "headers": {"host": "example.invalid", "content-type": "application/json"},
            "requestContext": {"identity": {"sourceIp": "127.0.0.1"}},
            "body": json.dumps(payload) if payload is not None else "",
            "isBase64Encoded": False,
        },
        {},
    )


class GreetingTests(unittest.TestCase):
    def test_health(self):
        for path in ("/v1/health/", "/v1/health"):
            response = request("GET", path=path)
            self.assertEqual(response["statusCode"], 200)
            self.assertEqual(json.loads(response["body"]), {"status": "ok"})

    def test_no_api_prefix(self):
        self.assertEqual(request("GET", path="/api/v1/hello")["statusCode"], 404)

    def test_greeting(self):
        response = request("POST", {"name": " Ada "})
        self.assertEqual(response["statusCode"], 200)
        self.assertEqual(json.loads(response["body"]), {"message": "Hello, Ada!"})

    def test_invalid_names(self):
        for name in ("", "   ", "x" * 81, 7, None):
            with self.subTest(name=name):
                self.assertEqual(request("POST", {"name": name})["statusCode"], 400)

    def test_missing_name(self):
        self.assertEqual(request("POST", {})["statusCode"], 400)

    def test_unknown_route(self):
        self.assertEqual(request("GET", path="/api/missing")["statusCode"], 404)

    def test_unknown_method(self):
        self.assertEqual(request("DELETE")["statusCode"], 405)
