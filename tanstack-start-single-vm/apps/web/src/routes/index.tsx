import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { hc } from "hono/client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ApiType } from "@/server/api";

const client = hc<ApiType>("/");

const listNotes = createServerFn({ method: "GET" }).handler(async () => {
  const { notes } = await import("@vbsmo/db/schema");
  const { getDb } = await import("../server/db.ts");
  return (await getDb()).select().from(notes);
});

export const Route = createFileRoute("/")({
  loader: () => listNotes(),
  component: Home,
});

function Home() {
  const saved = Route.useLoaderData();
  const router = useRouter();
  const [error, setError] = useState("");
  return (
    <main className="mx-auto space-y-6 p-8">
      <h1 className="font-semibold">Notes</h1>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          const form = event.currentTarget;
          const body = (form.elements.namedItem("body") as HTMLInputElement).value;
          try {
            const response = await client.api.notes.$post({ json: { body } });
            if (!response.ok) throw new Error("Note rejected");
            form.reset();
            setError("");
            await router.invalidate();
          } catch {
            setError("Could not save note.");
          }
        }}
      >
        <div className="flex items-center gap-2">
          <Label htmlFor="body">New note</Label>
          <Input id="body" name="body" maxLength={500} required />
          <Button type="submit">Save</Button>
        </div>
        {error && <p role="alert">{error}</p>}
      </form>
      <ul>
        {saved.map((note) => (
          <li key={note.id}>{note.body}</li>
        ))}
      </ul>
    </main>
  );
}
