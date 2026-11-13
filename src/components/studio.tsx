"use client";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Activity,
  ArrowRight,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  Clapperboard,
  Command,
  Film,
  FolderOpen,
  Image as ImageIcon,
  LayoutDashboard,
  Menu,
  Palette,
  Play,
  Plus,
  Search,
  Settings,
  SlidersHorizontal,
  Sparkles,
  WandSparkles,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  IconButton,
  Modal,
  Artwork,
  BrandMark,
  PageHeading,
  Empty,
  ProjectCard,
} from "./ui";
import { ProjectForm, BrandForm } from "./forms";
import type { Brand, Project } from "@/lib/models";
import { useWorkspace } from "@/lib/use-workspace";
const navigation: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "proyectos", label: "Mis proyectos", icon: FolderOpen },
  { id: "editor", label: "Editor", icon: Clapperboard },
  { id: "biblioteca", label: "Biblioteca multimedia", icon: ImageIcon },
  { id: "marcas", label: "Marcas", icon: Palette },
  { id: "calendario", label: "Calendario", icon: CalendarDays },
  { id: "automatizaciones", label: "Automatizaciones", icon: Zap },
  { id: "configuracion", label: "Configuración", icon: Settings },
];
export function Studio({ section }: { section: string }) {
  const { workspace, ready, error, save } = useWorkspace();
  const [modal, setModal] = useState<
    "project" | "brand" | "notifications" | null
  >(null);
  const [editBrand, setEditBrand] = useState<Brand | undefined>();
  const [brandFilter, setBrandFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [menu, setMenu] = useState(false);
  const [notice, setNotice] = useState("");
  const params = useSearchParams();
  function openBrand(brand?: Brand) {
    setEditBrand(brand);
    setModal("brand");
  }
  const filtered = workspace.projects.filter(
    (p) =>
      (brandFilter === "all" || p.brandId === brandFilter) &&
      (statusFilter === "all" || p.status === statusFilter) &&
      p.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
  );
  const current = workspace.projects.find(
    (p) => p.id === params.get("project"),
  );
  const title = navigation.find((n) => n.id === section)?.label;
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Saltar al contenido
      </a>
      <aside className={`sidebar ${menu ? "is-open" : ""}`}>
        <Link href="/" className="wordmark">
          <span className="logo">
            <Clapperboard size={22} />
          </span>
          video<span>lab</span>
          <span className="logo-dot" />
        </Link>
        <button
          className="workspace-switch"
          onClick={() =>
            setNotice(
              "Estás en tu espacio local de demostración. Los equipos estarán disponibles en una próxima fase.",
            )
          }
        >
          <span className="workspace-avatar">S</span>
          <span>
            Studio workspace<small>Espacio personal</small>
          </span>
          <ChevronDown size={15} />
        </button>
        <span className="nav-caption">WORKSPACE</span>
        <nav aria-label="Navegación principal">
          {navigation.map(({ id, label, icon: Icon }, index) => (
            <Link
              key={id}
              href={id === "dashboard" ? "/" : `/${id}`}
              onClick={() => setMenu(false)}
              className={`${section === id ? "active" : ""} ${index === 4 ? "nav-divider" : ""}`}
              aria-current={section === id ? "page" : undefined}
            >
              <Icon size={19} />
              {label}
              {id === "editor" && <span className="nav-tag">BETA</span>}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="idea-card">
            <span className="tiny-spark">
              <Sparkles size={17} />
            </span>
            <strong>
              Grandes ideas.
              <br />
              Un solo lugar.
            </strong>
            <p>
              Tu próximo contenido
              <br />
              empieza aquí.
            </p>
            <button onClick={() => setModal("project")}>
              Crear un proyecto <ArrowRight size={14} />
            </button>
          </div>
          <div className="account">
            <span className="user-avatar">SC</span>
            <span>
              Studio Creator<small>Cuenta local · Demo</small>
            </span>
            <span className="online-dot" />
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="mobile-menu icon-button"
              aria-label="Abrir navegación"
              onClick={() => setMenu(!menu)}
            >
              <Menu size={20} />
            </button>
            <span>Workspace</span>
            <ChevronRight size={14} />
            <strong>{title}</strong>
          </div>
          <div className="topbar-actions">
            <span className="demo-label">
              <span /> Modo demostración
            </span>
            <IconButton
              label="Notificaciones"
              onClick={() => setModal("notifications")}
            >
              <Bell size={18} />
            </IconButton>
            <span className="topbar-separator" />
            <span className="user-avatar small">SC</span>
          </div>
        </header>
        <main id="main">
          <div className="local-banner">
            <span>
              <span className="status-dot" /> Espacio de demostración
            </span>
            <span>
              Datos de ejemplo y cambios guardados solo en este navegador.
            </span>
          </div>
          {error && (
            <div role="alert" className="alert">
              {error}
            </div>
          )}
          {notice && (
            <div className="notice" role="status">
              {notice}
              <IconButton label="Cerrar aviso" onClick={() => setNotice("")}>
                <X size={16} />
              </IconButton>
            </div>
          )}
          {section === "dashboard" && (
            <>
              <div className="page-heading">
                <div>
                  <div className="eyebrow">TU ESPACIO CREATIVO</div>
                  <h1>
                    Hagamos algo extraordinario
                    <span className="purple-dot">.</span>
                  </h1>
                  <p>
                    Todas tus marcas, ideas y contenido. En perfecta sintonía.
                  </p>
                </div>
                <button
                  className="primary"
                  disabled={!ready}
                  onClick={() => setModal("project")}
                >
                  <Plus size={18} /> Nuevo proyecto
                </button>
              </div>
              <section className="hero">
                <div className="hero-content">
                  <span className="hero-label">
                    <Sparkles size={14} /> DE LA IDEA A LA PANTALLA
                  </span>
                  <h2>
                    Tu próxima gran historia
                    <br />
                    empieza con una idea.
                  </h2>
                  <p>
                    Dale forma a tu contenido en un espacio
                    <br className="desktop-break" /> diseñado para crear sin
                    límites.
                  </p>
                  <button
                    className="hero-button"
                    onClick={() => setModal("project")}
                  >
                    Empezar a crear <ArrowRight size={16} />
                  </button>
                  <span className="hero-footnote">
                    Tu creatividad. Un nuevo punto de partida.
                  </span>
                </div>
                <div className="hero-visual" aria-hidden="true">
                  <div className="orbit-line" />
                  <div className="floating-pill">
                    <span className="pill-dot" /> Un espacio. Infinitas
                    posibilidades.
                  </div>
                  <div className="visual-card back">
                    <div className="mini-wave" />
                    <span>
                      MAKE IT
                      <br />
                      <b>MATTER.</b>
                    </span>
                  </div>
                  <div className="visual-card front">
                    <span className="visual-card-label">
                      NATURA · BRAND STORY
                    </span>
                    <div className="sculpture" />
                    <strong>
                      Menos ruido.
                      <br />
                      <i>Más esencia.</i>
                    </strong>
                    <div className="fake-player">
                      <Play size={10} fill="currentColor" />
                      <span />
                      <small>00:18</small>
                    </div>
                  </div>
                  <div className="floating-tool">
                    <WandSparkles size={20} />
                  </div>
                  <div className="floating-frame">
                    <Film size={16} />
                    <span>Hecho para tus ideas</span>
                    <Sparkles size={13} />
                  </div>
                </div>
              </section>
              <section className="stats" aria-label="Resumen del espacio">
                {[
                  {
                    label: "Proyectos totales",
                    value: workspace.projects.length,
                    icon: FolderOpen,
                    extra: "Tu universo creativo",
                    color: "violet",
                  },
                  {
                    label: "Marcas activas",
                    value: workspace.brands.length,
                    icon: Palette,
                    extra: "Identidades, bien organizadas",
                    color: "peach",
                  },
                  {
                    label: "En borrador",
                    value: workspace.projects.filter(
                      (p) => p.status === "Borrador",
                    ).length,
                    icon: Film,
                    extra: "Ideas esperando su momento",
                    color: "blue",
                  },
                  {
                    label: "Programados",
                    value: workspace.projects.filter(
                      (p) => p.status === "Programado",
                    ).length,
                    icon: CalendarDays,
                    extra: "Ejemplos · sin publicación real",
                    color: "green",
                  },
                ].map(({ label, value, icon: Icon, extra, color }) => (
                  <div className="stat-card" key={label}>
                    <div>
                      <span>{label}</span>
                      <div className="stat-number">
                        {value.toString().padStart(2, "0")}
                      </div>
                      <small>{extra}</small>
                    </div>
                    <span className={`stat-icon ${color}`}>
                      <Icon size={20} />
                    </span>
                  </div>
                ))}
              </section>
              <div className="dashboard-columns">
                <section className="recent-section">
                  <div className="section-heading">
                    <div>
                      <h2>
                        Proyectos recientes{" "}
                        <span className="count">
                          {workspace.projects.length}
                        </span>
                      </h2>
                      <p>Retoma donde dejaste tu última idea.</p>
                    </div>
                    <Link href="/proyectos" className="text-link">
                      Ver todos <ArrowRight size={15} />
                    </Link>
                  </div>
                  <div className="project-grid">
                    {[...workspace.projects]
                      .sort(
                        (a, b) =>
                          Date.parse(b.updatedAt) - Date.parse(a.updatedAt),
                      )
                      .slice(0, 3)
                      .map((p) => (
                        <ProjectCard
                          key={p.id}
                          project={p}
                          brand={workspace.brands.find(
                            (b) => b.id === p.brandId,
                          )}
                        />
                      ))}
                    {!workspace.projects.length && (
                      <Empty
                        icon={FolderOpen}
                        title="Tu primera historia está por comenzar"
                        text="Crea un proyecto y dale un lugar a tu próxima idea."
                        action={() => setModal("project")}
                        actionLabel="Crear proyecto"
                      />
                    )}
                  </div>
                </section>
                <section className="brands-preview">
                  <div className="section-heading">
                    <div>
                      <h2>Tus marcas</h2>
                      <p>Cada identidad, su propio espacio.</p>
                    </div>
                    <Link
                      href="/marcas"
                      aria-label="Ver marcas"
                      className="icon-button"
                    >
                      <ArrowRight size={17} />
                    </Link>
                  </div>
                  <div className="brand-list">
                    {workspace.brands.slice(0, 3).map((b) => (
                      <button
                        key={b.id}
                        className="brand-row"
                        onClick={() => openBrand(b)}
                      >
                        <BrandMark brand={b} />
                        <span>
                          <strong>{b.name}</strong>
                          <small>
                            {
                              workspace.projects.filter(
                                (p) => p.brandId === b.id,
                              ).length
                            }{" "}
                            proyectos
                          </small>
                        </span>
                        <ChevronRight size={16} />
                      </button>
                    ))}
                    <button className="add-brand" onClick={() => openBrand()}>
                      <Plus size={15} /> Añadir una marca
                    </button>
                  </div>
                </section>
              </div>
              <section className="quick-section">
                <div className="section-heading">
                  <h2>Un atajo a tu creatividad</h2>
                  <span className="subtle">MENOS CLICS, MÁS IDEAS</span>
                </div>
                <div className="quick-grid">
                  {[
                    {
                      title: "Desde cero",
                      text: "Un lienzo en blanco para tu idea.",
                      icon: Plus,
                      action: () => setModal("project"),
                    },
                    {
                      title: "Explora el editor",
                      text: "Conoce tu futuro espacio de edición.",
                      icon: Clapperboard,
                      href: "/editor",
                    },
                    {
                      title: "Organiza tus recursos",
                      text: "Todo tu material, en un solo lugar.",
                      icon: ImageIcon,
                      href: "/biblioteca",
                    },
                  ].map(({ title, text, icon: Icon, href, action }) =>
                    href ? (
                      <Link className="quick-card" href={href} key={title}>
                        <span>
                          <Icon size={20} />
                        </span>
                        <div>
                          <strong>{title}</strong>
                          <p>{text}</p>
                        </div>
                        <ArrowRight size={17} />
                      </Link>
                    ) : (
                      <button
                        className="quick-card"
                        key={title}
                        onClick={action}
                      >
                        <span>
                          <Icon size={20} />
                        </span>
                        <div>
                          <strong>{title}</strong>
                          <p>{text}</p>
                        </div>
                        <ArrowRight size={17} />
                      </button>
                    ),
                  )}
                </div>
              </section>
            </>
          )}
          {section === "proyectos" && (
            <>
              <PageHeading
                eyebrow="DE LA IDEA AL PROYECTO"
                title="Mis proyectos"
                text="Un espacio para cada historia que quieres contar."
                action={() => setModal("project")}
                label="Nuevo proyecto"
              />
              <div className="filters">
                <label className="search">
                  <Search size={17} />
                  <input
                    aria-label="Buscar proyectos"
                    placeholder="Buscar un proyecto…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
                <label className="select-filter">
                  <Palette size={16} />
                  <select
                    aria-label="Filtrar por marca"
                    value={brandFilter}
                    onChange={(e) => setBrandFilter(e.target.value)}
                  >
                    <option value="all">Todas las marcas</option>
                    {workspace.brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="select-filter">
                  <SlidersHorizontal size={16} />
                  <select
                    aria-label="Filtrar por estado"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">Todos los estados</option>
                    <option>Borrador</option>
                    <option>En progreso</option>
                    <option>Programado</option>
                  </select>
                </label>
                <span className="results-count">
                  {filtered.length} proyectos
                </span>
              </div>
              <div className="project-grid full">
                {filtered.map((p) => (
                  <ProjectCard
                    key={p.id}
                    project={p}
                    brand={workspace.brands.find((b) => b.id === p.brandId)}
                  />
                ))}
              </div>
              {!filtered.length && (
                <Empty
                  icon={Search}
                  title="Ningún proyecto por aquí"
                  text="Prueba otra búsqueda o crea un nuevo proyecto."
                  action={() => setModal("project")}
                  actionLabel="Crear proyecto"
                />
              )}
            </>
          )}
          {section === "marcas" && (
            <>
              <PageHeading
                eyebrow="IDENTIDADES CON PERSONALIDAD"
                title="Tus marcas"
                text="Distintas voces. Un mismo espacio para hacerlas crecer."
                action={() => openBrand()}
                label="Añadir marca"
              />
              <div className="brand-grid">
                {workspace.brands.map((b) => (
                  <article className="brand-card" key={b.id}>
                    <div
                      className="brand-cover"
                      style={{
                        background: `linear-gradient(130deg, ${b.color}25, ${b.secondaryColor})`,
                      }}
                    >
                      <BrandMark brand={b} />
                      <span className="brand-source">
                        {b.demo ? "Demostración" : "Local"}
                      </span>
                    </div>
                    <div className="brand-card-body">
                      <h2>{b.name}</h2>
                      <p>
                        {b.description ||
                          "Una nueva identidad lista para crear."}
                      </p>
                      <div className="brand-swatches">
                        <span style={{ background: b.color }} />
                        <span style={{ background: b.secondaryColor }} />
                        <small>{b.font}</small>
                      </div>
                      <div className="brand-platforms">
                        {b.platforms.length
                          ? b.platforms.join(" · ")
                          : "Sin plataformas seleccionadas"}
                      </div>
                      <button
                        className="secondary"
                        onClick={() => openBrand(b)}
                      >
                        Administrar marca <ArrowRight size={15} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
              {!workspace.brands.length && (
                <Empty
                  icon={Palette}
                  title="Dale un hogar a tu marca"
                  text="Registra su identidad para comenzar a crear proyectos."
                  action={() => openBrand()}
                  actionLabel="Añadir marca"
                />
              )}
            </>
          )}
          {section === "editor" && (
            <>
              <div style={{ marginBottom: 18, padding: 16, background: "#ede8ff", borderRadius: 12, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}><strong>Nuevo editor visual · Fase 1</strong><span>Importa videos, reprodúcelos y edita textos sobre el lienzo.</span><Link href="/editor-lab" style={{ marginLeft: "auto", background: "#7356d9", color: "white", borderRadius: 8, padding: "10px 14px", textDecoration: "none" }}>Abrir editor funcional →</Link></div>
              <div className="editor-heading">
                <div>
                  <span className="eyebrow">EDITOR · ESTRUCTURA INICIAL</span>
                  <h1>{current?.name ?? "Tu próximo lienzo"}</h1>
                </div>
                <button
                  className="secondary"
                  onClick={() => setModal("project")}
                >
                  <Plus size={16} /> Nuevo proyecto
                </button>
              </div>
              <div className="editor-warning">
                <Clapperboard size={16} /> Vista preliminar: edición,
                reproducción y exportación aún no están implementadas.
              </div>
              {params.get("project") && !current && (
                <div role="alert" className="alert">
                  El proyecto no existe en este navegador. Selecciona uno desde
                  Mis proyectos.
                </div>
              )}
              <div className="editor-layout">
                <aside className="editor-panel">
                  <h2>
                    <FolderOpen size={16} /> Recursos
                  </h2>
                  <div className="panel-tabs">
                    <span>Marca</span>
                    <span>Multimedia</span>
                  </div>
                  {current ? (
                    <>
                      <BrandMark
                        brand={workspace.brands.find(
                          (b) => b.id === current.brandId,
                        )}
                      />
                      <h3>
                        {
                          workspace.brands.find((b) => b.id === current.brandId)
                            ?.name
                        }
                      </h3>
                      <p>Identidad del proyecto</p>
                    </>
                  ) : (
                    <p>
                      Selecciona un proyecto para ver su identidad de marca.
                    </p>
                  )}
                  <div className="resource-placeholder">
                    <ImageIcon size={28} />
                    <strong>Recursos del proyecto</strong>
                    <p>
                      La importación de archivos estará disponible en la próxima
                      fase.
                    </p>
                  </div>
                </aside>
                <section
                  className="preview-area"
                  aria-label="Previsualización del proyecto"
                >
                  <div className="preview-toolbar">
                    <span>Previsualización estática</span>
                    <span>{current?.format ?? "16:9"} · Demo</span>
                  </div>
                  <div
                    className={`preview-canvas ${current?.format === "9:16" ? "portrait" : current?.format === "1:1" ? "square" : ""}`}
                  >
                    <Artwork style={current?.style ?? "abstract"} large />
                  </div>
                  <div className="preview-controls">
                    <button disabled aria-label="Reproducir (próximamente)">
                      <Play size={17} />
                    </button>
                    <span>00:00 / --:--</span>
                    <span className="preview-note">
                      Motor Remotion pendiente
                    </span>
                  </div>
                </section>
                <aside className="editor-panel properties">
                  <h2>
                    <SlidersHorizontal size={16} /> Propiedades
                  </h2>
                  {current ? (
                    <>
                      <label>
                        Nombre
                        <input
                          key={current.id}
                          defaultValue={current.name}
                          maxLength={80}
                          onBlur={(e) => {
                            const name = e.target.value.trim();
                            if (name && name !== current.name)
                              save({
                                ...workspace,
                                projects: workspace.projects.map((p) =>
                                  p.id === current.id
                                    ? {
                                        ...p,
                                        name,
                                        updatedAt: new Date().toISOString(),
                                      }
                                    : p,
                                ),
                              });
                            else if (!name) e.target.value = current.name;
                          }}
                        />
                      </label>
                      <label>
                        Estado
                        <select
                          value={current.status}
                          onChange={(e) =>
                            save({
                              ...workspace,
                              projects: workspace.projects.map((p) =>
                                p.id === current.id
                                  ? {
                                      ...p,
                                      status: e.target
                                        .value as Project["status"],
                                      updatedAt: new Date().toISOString(),
                                    }
                                  : p,
                              ),
                            })
                          }
                        >
                          <option>Borrador</option>
                          <option>En progreso</option>
                          {current.status === "Programado" && (
                            <option>Programado</option>
                          )}
                        </select>
                      </label>
                      <div className="property-line">
                        <span>Formato</span>
                        <strong>{current.format}</strong>
                      </div>
                      <p>
                        Nombre y estado se guardan localmente. La programación
                        real aún no está disponible.
                      </p>
                    </>
                  ) : (
                    <p>
                      <Link href="/proyectos" className="text-link">
                        Abre un proyecto <ArrowRight size={14} />
                      </Link>{" "}
                      para editar sus datos.
                    </p>
                  )}
                  <button className="secondary" disabled>
                    Exportar · Próximamente
                  </button>
                </aside>
                <section className="timeline">
                  <div>
                    <Film size={17} />
                    <strong>Línea de tiempo</strong>
                    <span>Próximamente</span>
                  </div>
                  <div className="timeline-ruler">
                    00:00 <span>00:05</span>
                    <span>00:10</span>
                    <span>00:15</span>
                    <span>00:20</span>
                  </div>
                  <div className="timeline-track">
                    Aquí vivirán tus clips, audio y composiciones de Remotion.
                  </div>
                </section>
              </div>
            </>
          )}
          {section === "biblioteca" && (
            <>
              <PageHeading
                eyebrow="CADA RECURSO, EN SU LUGAR"
                title="Biblioteca multimedia"
                text="El futuro hogar de tus videos, imágenes y archivos de audio."
              />
              <Empty
                icon={ImageIcon}
                title="Tu biblioteca está esperando inspiración"
                text="La carga de archivos y el almacenamiento multimedia se integrarán en la próxima fase. Las ilustraciones de proyectos son composiciones CSS de demostración."
              />
              <div className="info-strip">
                <FolderOpen size={18} />
                <span>
                  Preparada para Supabase Storage. Sin archivos cargados ni
                  conexión activa.
                </span>
              </div>
            </>
          )}
          {section === "calendario" && (
            <>
              <PageHeading
                eyebrow="UNA VISIÓN DE LO QUE VIENE"
                title="Calendario de contenido"
                text="Planifica tus historias. La publicación automática aún no está disponible."
              />
              <section className="schedule-card">
                <div className="section-heading">
                  <h2>Publicaciones de demostración</h2>
                  <span className="demo-label">Sin conexión a redes</span>
                </div>
                {workspace.projects
                  .filter((p) => p.status === "Programado")
                  .map((p) => (
                    <div className="schedule-row" key={p.id}>
                      <div className="date-tile">
                        <strong>
                          {p.scheduledAt
                            ? new Date(p.scheduledAt).toLocaleDateString("es", {
                                day: "2-digit",
                                timeZone: "America/Santo_Domingo",
                              })
                            : "—"}
                        </strong>
                        <small>
                          {p.scheduledAt
                            ? new Date(p.scheduledAt).toLocaleDateString("es", {
                                month: "short",
                                timeZone: "America/Santo_Domingo",
                              })
                            : "Sin fecha"}
                        </small>
                      </div>
                      <div>
                        <h3>{p.name}</h3>
                        <p>
                          {
                            workspace.brands.find((b) => b.id === p.brandId)
                              ?.name
                          }{" "}
                          ·{" "}
                          {p.scheduledAt
                            ? new Date(p.scheduledAt).toLocaleString("es", {
                                timeZone: "America/Santo_Domingo",
                              })
                            : "Fecha pendiente"}{" "}
                          (Santo Domingo)
                        </p>
                        <span className="subtle">Ejemplo, no se publicará</span>
                      </div>
                      <Link
                        className="secondary"
                        href={`/editor?project=${p.id}`}
                      >
                        Ver proyecto <ArrowRight size={15} />
                      </Link>
                    </div>
                  ))}
                {!workspace.projects.some((p) => p.status === "Programado") && (
                  <Empty
                    icon={CalendarDays}
                    title="Sin contenido programado"
                    text="Aquí aparecerán tus publicaciones cuando se implemente la programación."
                  />
                )}
              </section>
            </>
          )}
          {section === "automatizaciones" && (
            <>
              <PageHeading
                eyebrow="MÁS TIEMPO PARA CREAR"
                title="Automatizaciones"
                text="Tu flujo creativo, con menos tareas repetitivas."
              />
              <Empty
                icon={Zap}
                title="El siguiente paso de tu estudio"
                text="Los flujos con IA, las adaptaciones por marca y las integraciones sociales están previstos para futuras fases. No hay automatizaciones ni APIs conectadas."
              />
              <div className="feature-grid">
                {[
                  "Adaptación de formatos",
                  "Asistencia creativa con IA",
                  "Flujos por marca",
                ].map((t) => (
                  <div className="feature-card" key={t}>
                    <Sparkles size={20} />
                    <h3>{t}</h3>
                    <span className="subtle">Próximamente</span>
                  </div>
                ))}
              </div>
            </>
          )}
          {section === "configuracion" && (
            <>
              <PageHeading
                eyebrow="A TU MANERA"
                title="Configuración"
                text="Conoce el estado de tu espacio de trabajo."
              />
              <div className="settings-grid">
                <section className="settings-card">
                  <h2>
                    <Command size={18} /> Espacio de trabajo
                  </h2>
                  <dl>
                    <div>
                      <dt>Nombre</dt>
                      <dd>Studio workspace</dd>
                    </div>
                    <div>
                      <dt>Almacenamiento</dt>
                      <dd>Local en este navegador</dd>
                    </div>
                    <div>
                      <dt>Versión</dt>
                      <dd>0.1 · Fundamentos</dd>
                    </div>
                  </dl>
                  <p>
                    Los datos no se sincronizan entre dispositivos. Evita
                    almacenar información sensible.
                  </p>
                </section>
                <section className="settings-card">
                  <h2>
                    <Activity size={18} /> Integraciones
                  </h2>
                  {[
                    "Supabase · Datos y autenticación",
                    "Remotion · Motor de video",
                    "Redes sociales · Publicación",
                  ].map((t) => (
                    <div className="integration-row" key={t}>
                      <span>{t}</span>
                      <span className="pending">Pendiente</span>
                    </div>
                  ))}
                  <p>Esta versión no requiere claves ni servicios externos.</p>
                </section>
              </div>
            </>
          )}
          <footer className="footer">
            <span>
              <span className="footer-logo">video lab</span> Un espacio para lo
              que imaginas.
            </span>
            <span>
              Fase 1 <span className="footer-dot">·</span> Hecho para crear{" "}
              <Sparkles size={12} />
            </span>
          </footer>
        </main>
      </div>
      {modal === "project" && (
        <Modal title="Una nueva historia" onClose={() => setModal(null)}>
          <ProjectForm
            brands={workspace.brands}
            onCancel={() => setModal(null)}
            onSave={(p) => {
              if (
                save({ ...workspace, projects: [p, ...workspace.projects] })
              ) {
                setModal(null);
                setNotice(
                  "Proyecto creado. Puedes abrirlo en el editor desde Mis proyectos.",
                );
              }
            }}
          />
        </Modal>
      )}
      {modal === "brand" && (
        <Modal
          title={editBrand ? "Identidad de marca" : "Dale vida a tu marca"}
          onClose={() => setModal(null)}
        >
          <BrandForm
            brand={editBrand}
            onCancel={() => setModal(null)}
            onSave={(b) => {
              if (
                save({
                  ...workspace,
                  brands: editBrand
                    ? workspace.brands.map((x) => (x.id === b.id ? b : x))
                    : [...workspace.brands, b],
                })
              ) {
                setModal(null);
                setNotice("Identidad de marca guardada en este navegador.");
              }
            }}
          />
        </Modal>
      )}
      {modal === "notifications" && (
        <Modal title="Todo al día" onClose={() => setModal(null)}>
          <div className="notification-empty">
            <Bell size={32} />
            <h3>No tienes notificaciones</h3>
            <p>Este espacio local no está conectado a servicios externos.</p>
          </div>
          <button className="primary" onClick={() => setModal(null)}>
            Entendido <Check size={16} />
          </button>
        </Modal>
      )}
    </div>
  );
}
