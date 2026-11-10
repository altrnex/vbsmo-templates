import { getDb } from "@/server/db";
import { notes } from "@/server/schema";

export const dynamic = "force-dynamic";

export default function Page() {
  const saved = getDb().select().from(notes).all();
  return (
    <main className="mx-auto max-w-xl space-y-6 p-8">
      <h1 className="text-3xl font-semibold">Notes</h1>
      <form action="/api/notes" method="post" className="flex gap-2">
        <label htmlFor="body">New note</label>
        <input id="body" name="body" maxLength={500} required className="border p-2" />
        <button type="submit" className="border p-2">
          Save
        </button>
      </form>
      <ul>
        {saved.map((note) => (
          <li key={note.id}>{note.body}</li>
        ))}
      </ul>
    </main>
  );
}
