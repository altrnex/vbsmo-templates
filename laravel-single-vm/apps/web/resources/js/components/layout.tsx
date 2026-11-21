import { Form, Link, usePage } from "@inertiajs/react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

type SharedProps = { auth: { user: { name: string; email: string } | null } };

export function Layout({ children }: { children: ReactNode }) {
  const { auth } = usePage<SharedProps>().props;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <nav className="mx-auto flex max-w-3xl items-center justify-between p-4">
          <Link href="/" className="font-semibold">
            Your new site
          </Link>
          {auth.user ? (
            <Form action="/logout" method="post" className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{auth.user.name}</span>
              <Button type="submit" variant="outline" size="sm">
                Log out
              </Button>
            </Form>
          ) : (
            <div className="flex gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}
        </nav>
      </header>
      <main className="mx-auto max-w-3xl p-4">{children}</main>
    </div>
  );
}
