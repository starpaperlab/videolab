"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { X, Plus, ArrowRight, type LucideIcon } from "lucide-react";
import type { Brand, Project } from "@/lib/models";
export function IconButton({
  label,
  children,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className="icon-button"
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = dialog.current;
    const previous = document.activeElement as HTMLElement;
    el?.showModal();
    return () => {
      el?.close();
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className="modal"
      aria-labelledby="modal-title"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-heading">
        <div>
          <span className="eyebrow">TU ESTUDIO, TUS IDEAS</span>
          <h2 id="modal-title">{title}</h2>
        </div>
        <IconButton label="Cerrar diálogo" onClick={onClose}>
          <X size={20} />
        </IconButton>
      </div>
      {children}
    </dialog>
  );
}
export function Artwork({
  style,
  large = false,
}: {
  style: Project["style"];
  large?: boolean;
}) {
  return (
    <div
      className={`artwork ${style} ${large ? "large" : ""}`}
      aria-label={`Ilustración de demostración: ${style}`}
      role="img"
    >
      <div className="art-orb" />
      <div className="art-shape" />
      <div className="art-copy">
        {style === "nature" ? (
          <>
            <small>PAUSA. RESPIRA. CONECTA.</small>
            <strong>
              Vuelve
              <br />a lo esencial.
            </strong>
            <span>N A T U R A</span>
          </>
        ) : style === "architecture" ? (
          <>
            <small>FORMA STUDIO · VOL. 02</small>
            <strong>
              El arte de
              <br />
              <i>habitar.</i>
            </strong>
          </>
        ) : style === "product" ? (
          <>
            <small>MEET YOUR NEXT</small>
            <strong>
              Move
              <br />
              different.
            </strong>
            <span>O R B I T ↗</span>
          </>
        ) : (
          <>
            <small>UN MOMENTO PARA TI</small>
            <strong>
              Lo simple
              <br />
              se siente bien.
            </strong>
          </>
        )}
      </div>
    </div>
  );
}
export function BrandMark({ brand }: { brand?: Brand }) {
  return (
    <span
      className="brand-mark"
      style={{ background: brand?.color ?? "#7471db" }}
    >
      {brand?.initials ?? "V"}
    </span>
  );
}
export function PageHeading({
  eyebrow,
  title,
  text,
  action,
  label,
}: {
  eyebrow: string;
  title: string;
  text: string;
  action?: () => void;
  label?: string;
}) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>
          {title}
          <span className="purple-dot">.</span>
        </h1>
        <p>{text}</p>
      </div>
      {action && (
        <button className="primary" onClick={action}>
          <Plus size={18} />
          {label}
        </button>
      )}
    </div>
  );
}
export function Empty({
  icon: Icon,
  title,
  text,
  action,
  actionLabel,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
  action?: () => void;
  actionLabel?: string;
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon size={28} />
      </span>
      <h2 id="modal-title">{title}</h2>
      <p>{text}</p>
      {action && (
        <button className="primary" onClick={action}>
          <Plus size={16} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
export function ProjectCard({
  project: p,
  brand,
}: {
  project: Project;
  brand?: Brand;
}) {
  return (
    <article className="project-card">
      <Link
        href={`/editor?project=${p.id}`}
        className="project-art-link"
        aria-label={`Abrir ${p.name} en el editor`}
      >
        <Artwork style={p.style} />
        <span className="format-badge">{p.format}</span>
        <span className="project-play">
          <ArrowRight size={18} />
        </span>
      </Link>
      <div className="project-card-body">
        <div className="project-brand">
          <span style={{ background: brand?.color }} />
          {brand?.name}
          <small>{p.demo ? "DEMO" : "LOCAL"}</small>
        </div>
        <h3>
          <Link href={`/editor?project=${p.id}`}>{p.name}</Link>
        </h3>
        <div className="project-meta">
          <span
            className={`status ${p.status === "Borrador" ? "draft" : p.status === "Programado" ? "scheduled" : "progress"}`}
          >
            <span />
            {p.status}
          </span>
          <span>
            {new Date(p.updatedAt).toLocaleDateString("es", {
              day: "numeric",
              month: "short",
              timeZone: "America/Santo_Domingo",
            })}
          </span>
        </div>
      </div>
    </article>
  );
}
