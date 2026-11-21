import { Form, Head } from "@inertiajs/react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Note = { id: number; body: string; created_at: string };

export default function Home({ notes }: { notes: Note[] }) {
  return (
    <Layout>
      <Head title="Notes" />
      <h1 className="mb-4 text-2xl font-semibold">Notes</h1>
      <Form action="/notes" method="post" resetOnSuccess className="mb-6 flex gap-2">
        {({ errors, processing }) => (
          <div className="flex-1">
            <div className="flex gap-2">
              <Input name="body" placeholder="Write a note" aria-label="Note" />
              <Button type="submit" disabled={processing}>
                Add
              </Button>
            </div>
            {errors.body && <p className="mt-1 text-sm text-destructive">{errors.body}</p>}
          </div>
        )}
      </Form>
      <div className="space-y-2">
        {notes.map((note) => (
          <Card key={note.id}>
            <CardContent className="py-3">{note.body}</CardContent>
          </Card>
        ))}
        {notes.length === 0 && <p className="text-muted-foreground">No notes yet.</p>}
      </div>
    </Layout>
  );
}
