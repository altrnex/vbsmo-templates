"use client";

import { hc } from "hono/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ApiType } from "@/server/api";

const client = hc<ApiType>("/");

export function NotesForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  return (
    <form
      className="flex gap-2"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const body = (form.elements.namedItem("body") as HTMLInputElement)
          .value;
        try {
          const response = await client.api.notes.$post({ json: { body } });
          if (!response.ok) throw new Error("Note rejected");
          form.reset();
          setError("");
          router.refresh();
        } catch {
          setError("Could not save note.");
        }
      }}
    >
      <label htmlFor="body">New note</label>
      <input
        id="body"
        name="body"
        maxLength={500}
        required
        className="border p-2"
      />
      <button type="submit" className="border p-2">
        Save
      </button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
