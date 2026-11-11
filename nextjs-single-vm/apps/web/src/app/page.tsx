import { notes } from "@vbsmo/db/schema";
import { getDb } from "@/server/db";
import { NotesForm } from "./notes-form";

export const dynamic = "force-dynamic";

export default async function Page() {
  const saved = await getDb().select().from(notes);
  return (
    <main className="mx-auto max-w-xl space-y-6 p-8">
      <h1 className="text-3xl font-semibold">Notes</h1>
      <NotesForm />
      <ul>
        {saved.map((note) => (
          <li key={note.id}>{note.body}</li>
        ))}
      </ul>
    </main>
  );
}
