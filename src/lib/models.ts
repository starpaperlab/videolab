/** Serializable domain records. IDs map to UUIDs in a future Supabase repository. */
export type Brand = {
  id: string;
  name: string;
  initials: string;
  color: string;
  secondaryColor: string;
  font: string;
  description: string;
  audience: string;
  tone: string;
  platforms: string[];
  logoUrl: string;
  demo?: boolean;
};
export type ProjectStatus = "Borrador" | "En progreso" | "Programado";
export type Project = {
  id: string;
  name: string;
  brandId: string;
  status: ProjectStatus;
  format: "9:16" | "16:9" | "1:1";
  style: "nature" | "architecture" | "product" | "abstract";
  updatedAt: string;
  scheduledAt?: string;
  demo?: boolean;
};
export type Workspace = { version: 1; brands: Brand[]; projects: Project[] };
/** Implement this boundary with Supabase + RLS when authentication is introduced. */
export interface WorkspaceRepository {
  load(): Workspace;
  save(workspace: Workspace): void;
}
