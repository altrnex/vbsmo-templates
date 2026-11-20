import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [{ title: "About" }, { name: "description", content: "About this site." }],
  }),
  component: () => (
    <main>
      <h1>About</h1>
      <p>A second page: each main section of the site is its own file route.</p>
    </main>
  ),
});
