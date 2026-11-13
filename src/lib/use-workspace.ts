"use client";
import { useSyncExternalStore } from "react";
import { demoWorkspace } from "./demo";
import { localRepository } from "./storage";
import type { Workspace } from "./models";
const serverSnapshot = { workspace: demoWorkspace, error: "", ready: false };
let snapshot: typeof serverSnapshot | undefined;
const listeners = new Set<() => void>();
function getSnapshot() {
  if (!snapshot) {
    try {
      snapshot = { workspace: localRepository.load(), error: "", ready: true };
    } catch {
      snapshot = {
        workspace: demoWorkspace,
        error:
          "No pudimos leer los datos locales. Se muestran ejemplos; no se sobrescribirán tus datos hasta que guardes un cambio.",
        ready: true,
      };
    }
  }
  return snapshot;
}
function emit() {
  listeners.forEach((listener) => listener());
}
function storageChanged(e: StorageEvent) {
  if (e.key === "videolab.workspace.v1" || e.key === null) {
    snapshot = undefined;
    emit();
  }
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", storageChanged);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", storageChanged);
  };
}
export function useWorkspace() {
  const state = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => serverSnapshot,
  );
  function save(workspace: Workspace) {
    try {
      localRepository.save(workspace);
      snapshot = { workspace, error: "", ready: true };
      emit();
      return true;
    } catch {
      snapshot = {
        ...getSnapshot(),
        error:
          "No se pudo guardar. Comprueba el espacio y los permisos de almacenamiento del navegador.",
      };
      emit();
      return false;
    }
  }
  return { ...state, save };
}
