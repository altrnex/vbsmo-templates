import type { APIRoute } from "astro";
import { api } from "../../server/api.ts";

export const ALL: APIRoute = ({ request }) => api.fetch(request);
