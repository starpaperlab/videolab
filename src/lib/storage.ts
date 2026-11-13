import { demoWorkspace } from "./demo";
import type { Workspace, WorkspaceRepository } from "./models";
const key = "videolab.workspace.v1";
function valid(value: unknown): value is Workspace {
  if (!value || typeof value !== "object") return false;
  const w = value as Workspace;
  return (
    w.version === 1 &&
    Array.isArray(w.brands) &&
    Array.isArray(w.projects) &&
    w.brands.every(
      (b) =>
        typeof b.id === "string" &&
        typeof b.name === "string" &&
        typeof b.color === "string" &&
        /^#[0-9a-f]{6}$/i.test(b.color) &&
        typeof b.initials === "string" &&
        Array.isArray(b.platforms) &&
        b.platforms.every((p) => typeof p === "string") &&
        [
          "secondaryColor",
          "font",
          "description",
          "audience",
          "tone",
          "logoUrl",
        ].every((k) => typeof b[k as keyof typeof b] === "string"),
    ) &&
    w.projects.every(
      (p) =>
        typeof p.id === "string" &&
        typeof p.name === "string" &&
        w.brands.some((b) => b.id === p.brandId) &&
        ["Borrador", "En progreso", "Programado"].includes(p.status) &&
        ["9:16", "16:9", "1:1"].includes(p.format) &&
        ["nature", "architecture", "product", "abstract"].includes(p.style) &&
        typeof p.updatedAt === "string" &&
        Number.isFinite(Date.parse(p.updatedAt)) &&
        (p.scheduledAt === undefined ||
          Number.isFinite(Date.parse(p.scheduledAt))),
    )
  );
}
export const localRepository: WorkspaceRepository = {
  load() {
    const raw = localStorage.getItem(key);
    if (!raw) return structuredClone(demoWorkspace);
    const data: unknown = JSON.parse(raw);
    if (!valid(data)) throw new Error("Formato de almacenamiento no válido");
    return data;
  },
  save(workspace) {
    localStorage.setItem(key, JSON.stringify(workspace));
  },
};
