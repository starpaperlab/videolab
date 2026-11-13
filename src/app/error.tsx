"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="error-page">
      <h1>No pudimos abrir el estudio</h1>
      <p>Tus datos locales permanecen en este navegador.</p>
      <button onClick={reset}>Volver a intentar</button>
    </main>
  );
}
