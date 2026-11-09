// Preview and local development use /api; deployment can supply a separate API origin.
export async function apiUrl(path: string): Promise<string> {
  let base = "/api/";
  const response = await fetch("/vbsmo-runtime.json", { signal: AbortSignal.timeout(10_000) });
  if (response.ok) {
    const runtime: { apiBase: string } = await response.json();
    base = runtime.apiBase;
  } else if (response.status !== 404) throw new Error("API configuration is unavailable");
  return new URL(`${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`, location.origin).href;
}
