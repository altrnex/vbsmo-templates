import { notes } from "@vbsmo/db/schema";
import { getDb } from "@/server/db";
import { NotesForm } from "./notes-form";

export const dynamic = "force-dynamic";

export default async function Page() {
  const saved = await (await getDb()).select().from(notes);
  return (
    <main className="mx-auto space-y-6 p-8">
      <h1 className="font-semibold">Notes</h1>
      <NotesForm />
      <ul>
        {saved.map((note) => (
          <li key={note.id}>{note.body}</li>
        ))}
      </ul>
    </main>
  );
}
