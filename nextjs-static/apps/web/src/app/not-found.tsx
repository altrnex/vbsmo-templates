import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen flex-col justify-center gap-6 px-8">
      <h1 className="font-semibold">Page not found</h1>
      <p>The page you requested could not be found.</p>
      <Link className="underline underline-offset-4" href="/">
        Return home
      </Link>
    </main>
  );
}
