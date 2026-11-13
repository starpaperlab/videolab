import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Studio } from "@/components/studio";
const routes = [
  "dashboard",
  "proyectos",
  "editor",
  "biblioteca",
  "marcas",
  "calendario",
  "automatizaciones",
  "configuracion",
];
export default async function Page({
  params,
}: {
  params: Promise<{ section?: string[] }>;
}) {
  const { section } = await params;
  if (section && (section.length !== 1 || !routes.includes(section[0])))
    notFound();
  return (
    <Suspense fallback={<main>Cargando tu estudio…</main>}>
      <Studio section={section?.[0] ?? "dashboard"} />
    </Suspense>
  );
}
