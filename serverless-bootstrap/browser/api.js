// Preview and local development use /api; deployment can supply a separate API origin.
export async function apiUrl(path) {
  let base = "/api/";
  const response = await fetch("/vbsmo-runtime.json", { signal: AbortSignal.timeout(10000) });
  if (response.ok) base = (await response.json()).apiBase;
  else if (response.status !== 404) throw new Error("API configuration is unavailable");
  return new URL(`${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`, location.origin).href;
}
