import { apiUrl } from "./api.js";

const form = document.querySelector('[data-vbsmo-route="hello.submit"]');
const result = document.querySelector("#greeting-result");
const button = form.querySelector('button[type="submit"]');

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  button.disabled = true;
  result.textContent = "Sending…";
  try {
    const response = await fetch(await apiUrl("/v1/hello"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: new FormData(form).get("name") }),
      signal: AbortSignal.timeout(10000),
    });
    const body = await response.json();
    result.textContent = response.ok ? body.message : "Enter a name between 1 and 80 characters.";
  } catch {
    result.textContent = "Could not reach the API. Please try again.";
  } finally {
    button.disabled = false;
  }
});

button.disabled = false;
