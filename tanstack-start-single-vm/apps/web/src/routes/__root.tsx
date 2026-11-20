import { createRootRoute, HeadContent, Link, Outlet, Scripts } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import css from "@/styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Your new site" },
      { name: "description", content: "A new site built with Vibeissimo." },
    ],
    links: [{ rel: "stylesheet", href: css }],
  }),
  component: () => (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Outlet />
        <Toaster />
        <Scripts />
      </body>
    </html>
  ),
  notFoundComponent: () => (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 px-8">
      <h1 className="text-4xl font-semibold">Page not found</h1>
      <p>The page you requested could not be found.</p>
      <Link className="underline underline-offset-4" to="/">
        Return home
      </Link>
    </main>
  ),
});
