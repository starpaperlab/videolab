import Link from "next/link";
export default function NotFound() {
  return (
    <main className="error-page">
      <h1>Esta página no está en el estudio</h1>
      <Link href="/">Volver al dashboard</Link>
    </main>
  );
}
