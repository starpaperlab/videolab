"use client";
import { useState, type FormEvent } from "react";
import { FolderOpen, ArrowRight, Check } from "lucide-react";
import type { Brand, Project } from "@/lib/models";
export function ProjectForm({
  brands,
  onSave,
  onCancel,
}: {
  brands: Brand[];
  onSave: (p: Project) => void;
  onCancel: () => void;
}) {
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name")).trim();
    if (!name) return;
    onSave({
      id: crypto.randomUUID(),
      name,
      brandId: String(data.get("brand")),
      format: String(data.get("format")) as Project["format"],
      status: "Borrador",
      style: "abstract",
      updatedAt: new Date().toISOString(),
    });
  }
  return (
    <form onSubmit={submit}>
      <p className="form-intro">
        Elige una marca y un formato. El resto empieza con tu imaginación.
      </p>
      <label>
        Nombre del proyecto
        <input
          name="name"
          placeholder="Ej. Una historia que conecta"
          required
          maxLength={80}
          pattern=".*\S.*"
          autoFocus
        />
      </label>
      <label>
        Marca
        <select name="brand" required defaultValue={brands[0]?.id ?? ""}>
          <option value="" disabled>
            Selecciona una marca
          </option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </label>
      {!brands.length && (
        <p role="alert">Registra una marca antes de crear un proyecto.</p>
      )}
      <label>
        Formato
        <select name="format">
          <option value="9:16">Vertical · 9:16 · Reels y Shorts</option>
          <option value="16:9">Horizontal · 16:9 · Video</option>
          <option value="1:1">Cuadrado · 1:1 · Feed</option>
        </select>
      </label>
      <div className="form-note">
        <FolderOpen size={16} /> Se guardará en este navegador como borrador.
      </div>
      <div className="form-actions">
        <button type="button" className="secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button className="primary" disabled={!brands.length} type="submit">
          Crear proyecto <ArrowRight size={16} />
        </button>
      </div>
    </form>
  );
}
export function BrandForm({
  brand: b,
  onSave,
  onCancel,
}: {
  brand?: Brand;
  onSave: (b: Brand) => void;
  onCancel: () => void;
}) {
  const [color, setColor] = useState(b?.color ?? "#7971d9");
  const [secondary, setSecondary] = useState(b?.secondaryColor ?? "#eeeafa");
  const [validation, setValidation] = useState("");
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const name = String(d.get("name")).trim();
    if (!name) {
      setValidation("Escribe un nombre de marca.");
      return;
    }
    const logoUrl = String(d.get("logo")).trim();
    if (logoUrl && !logoUrl.startsWith("https://")) {
      setValidation("El logo debe usar una URL HTTPS.");
      return;
    }
    onSave({
      id: b?.id ?? crypto.randomUUID(),
      name,
      initials: name.slice(0, 2).toUpperCase(),
      color,
      secondaryColor: secondary,
      font: String(d.get("font")),
      description: String(d.get("description")).trim(),
      audience: String(d.get("audience")).trim(),
      tone: String(d.get("tone")).trim(),
      platforms: d.getAll("platform").map(String),
      logoUrl,
      demo: false,
    });
  }
  return (
    <form onSubmit={submit}>
      <p className="form-intro">
        Una identidad consistente empieza por sus detalles.
      </p>
      {validation && (
        <p role="alert" className="alert">
          {validation}
        </p>
      )}
      <label>
        Nombre de la marca
        <input
          name="name"
          required
          maxLength={60}
          pattern=".*\S.*"
          defaultValue={b?.name}
          placeholder="Ej. Estudio Aurora"
          autoFocus
        />
      </label>
      <label>
        Logo · URL HTTPS (opcional)
        <input
          name="logo"
          type="url"
          maxLength={1000}
          defaultValue={b?.logoUrl}
          placeholder="https://tu-sitio.com/logo.png"
        />
        <small>
          Guardamos la referencia. Por ahora se muestran las iniciales.
        </small>
      </label>
      <div className="form-two">
        <label>
          Color principal
          <div className="color-input">
            <input
              type="color"
              aria-label="Color principal"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
            <span>{color}</span>
          </div>
        </label>
        <label>
          Color secundario
          <div className="color-input">
            <input
              type="color"
              aria-label="Color secundario"
              value={secondary}
              onChange={(e) => setSecondary(e.target.value)}
            />
            <span>{secondary}</span>
          </div>
        </label>
      </div>
      <label>
        Tipografía
        <select name="font" defaultValue={b?.font ?? "Arial"}>
          <option>Arial</option>
          <option>Georgia</option>
          <option>Verdana</option>
          <option>Trebuchet MS</option>
        </select>
      </label>
      <label>
        Descripción
        <textarea
          name="description"
          maxLength={500}
          defaultValue={b?.description}
          placeholder="¿Qué hace especial a esta marca?"
        />
      </label>
      <div className="form-two">
        <label>
          Público objetivo
          <input
            name="audience"
            maxLength={200}
            defaultValue={b?.audience}
            placeholder="¿A quién le hablas?"
          />
        </label>
        <label>
          Tono de comunicación
          <input
            name="tone"
            maxLength={120}
            defaultValue={b?.tone}
            placeholder="Ej. Cercano y creativo"
          />
        </label>
      </div>
      <fieldset>
        <legend>Plataformas futuras</legend>
        <div className="checkboxes">
          {["Instagram", "TikTok", "YouTube", "Facebook", "LinkedIn"].map(
            (p) => (
              <label key={p}>
                <input
                  type="checkbox"
                  name="platform"
                  value={p}
                  defaultChecked={b?.platforms.includes(p)}
                />
                {p}
              </label>
            ),
          )}
        </div>
        <small>Solo preferencias. No se conectarán cuentas.</small>
      </fieldset>
      <div className="form-actions">
        <button type="button" className="secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button className="primary" type="submit">
          Guardar marca <Check size={16} />
        </button>
      </div>
    </form>
  );
}
