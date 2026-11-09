import { expect, test } from "bun:test";
import { app } from "./index.ts";

test.each(["/v1/health/", "/v1/health"])("health is available at %s", async (pathname) => {
  const response = await app.request(pathname);
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ status: "ok" });
});

test("the API responds to a greeting", async () => {
  const response = await app.request("/v1/hello");
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ message: "Hello!" });
});

test("the form receives a personalized greeting", async () => {
  const response = await submit({ name: "  Ada  " });
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ message: "Hello, Ada!" });
});

test.each([{}, { name: " " }, { name: "a".repeat(81) }, { name: 42 }])(
  "invalid form input is rejected: %j",
  async (body) => {
    const response = await submit(body);
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Enter a name between 1 and 80 characters." });
  },
);

test("malformed JSON is rejected", async () => {
  const response = await app.request("/v1/hello", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{",
  });
  expect(response.status).toBe(400);
});

test("large requests are rejected", async () => {
  const response = await submit({ name: "a".repeat(5000) });
  expect(response.status).toBe(413);
});

test("unimplemented paths and methods are not exposed", async () => {
  expect((await app.request("/private")).status).toBe(404);
  expect((await app.request("/api/v1/hello")).status).toBe(404);
  expect((await app.request("/v1/hello", { method: "DELETE" })).status).toBe(404);
});

function submit(body: unknown) {
  return app.request("/v1/hello", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
