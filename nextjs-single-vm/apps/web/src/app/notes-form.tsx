"use client";

import { hc } from "hono/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ApiType } from "@/server/api";

const client = hc<ApiType>("/");

export function NotesForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  return (
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
          router.refresh();
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
  );
}
