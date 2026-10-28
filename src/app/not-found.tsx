import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 text-center">
      <div>
        <h1 className="text-7xl font-bold">404</h1>
        <p className="mt-4 text-muted-foreground">
          Aradığınız sayfa bulunamadı.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block bg-primary px-4 py-2 text-primary-foreground"
        >
          Ana sayfaya dön
        </Link>
      </div>
    </main>
  );
}
