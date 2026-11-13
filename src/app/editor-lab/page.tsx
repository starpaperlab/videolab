"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Overlay = { id: string; text: string; x: number; y: number; size: number; color: string; start: number; end: number };
const KEY = "videolab.editor.fase1";
const initial: Overlay[] = [{ id: "demo", text: "Tu próximo gran video", x: 50, y: 35, size: 34, color: "#ffffff", start: 0, end: 9999 }];
export default function EditorLab() {
  const [overlays, setOverlays] = useState<Overlay[]>(initial);
  const [selected, setSelected] = useState("demo");
  const [source, setSource] = useState("");
  const [fileName, setFileName] = useState("");
  const [duration, setDuration] = useState(0);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [notice, setNotice] = useState("");
  const video = useRef<HTMLVideoElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const dragging = useRef<string | null>(null);
  const selectedItem = overlays.find(x => x.id === selected);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (Array.isArray(saved.overlays)) {
          const safe = saved.overlays.filter((o: Overlay) => typeof o.id === "string" && typeof o.text === "string" && Number.isFinite(o.x) && Number.isFinite(o.y) && Number.isFinite(o.size) && typeof o.color === "string" && Number.isFinite(o.start) && Number.isFinite(o.end));
          setOverlays(safe);
          setSelected(safe[0]?.id ?? "");
        }
      }
    } catch { setNotice("No fue posible recuperar los textos guardados."); }
  }, []);
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify({ overlays })); }
    catch { /* browser storage may be disabled */ }
  }, [overlays]);
  useEffect(() => () => { if (source) URL.revokeObjectURL(source); }, [source]);
  function importVideo(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("video/")) { setNotice("Selecciona un archivo de video compatible."); return; }
    if (source) URL.revokeObjectURL(source);
    setSource(URL.createObjectURL(file));
    setFileName(file.name);
    setTime(0); setPlaying(false); setDuration(0); setNotice("");
  }
  function update(id: string, patch: Partial<Overlay>) { setOverlays(items => items.map(o => o.id === id ? { ...o, ...patch } : o)); }
  function move(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging.current || !stage.current) return;
    const bounds = stage.current.getBoundingClientRect();
    const x = Math.max(5, Math.min(95, (e.clientX - bounds.left) / bounds.width * 100));
    const y = Math.max(5, Math.min(95, (e.clientY - bounds.top) / bounds.height * 100));
    update(dragging.current, { x, y });
  }
  function toggle() {
    if (!video.current) return;
    if (video.current.paused) { video.current.play().catch(() => setNotice("El navegador no pudo reproducir este archivo.")); }
    else video.current.pause();
  }
  function exportJson() {
    const data = JSON.stringify({ version: 1, video: { fileName, note: "El video original debe adjuntarse por separado" }, overlays }, null, 2);
    const url = URL.createObjectURL(new Blob([data], { type: "application/json" }));
    const a = document.createElement("a"); a.href = url; a.download = "videolab-proyecto.json"; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <div className="vl-root">
    <header className="vl-top"><Link href="/editor" className="vl-back">← Video Lab</Link><strong>Editor visual <span>FASE 1</span></strong><div className="vl-top-actions"><button onClick={exportJson}>Exportar proyecto JSON</button><button disabled title="El renderizado MP4 se integrará en una fase posterior">Exportar MP4 · Próximamente</button></div></header>
    <div className="vl-layout">
      <aside className="vl-side"><h2>Recursos</h2><label className="vl-upload">＋ Importar video<input type="file" accept="video/*" onChange={e => importVideo(e.target.files?.[0])} /></label><p className="vl-hint">El archivo se mantiene en esta pestaña. Los textos se guardan en este navegador.</p><h3>Capas de texto</h3><button className="vl-add" onClick={() => { const id = crypto.randomUUID(); setOverlays(p => [...p, { id, text: "Nuevo texto", x: 50, y: 50, size: 32, color: "#ffffff", start: 0, end: duration || 9999 }]); setSelected(id); }}>＋ Añadir texto</button>{overlays.map(o => <button key={o.id} className={"vl-layer " + (selected === o.id ? "active" : "")} onClick={() => setSelected(o.id)}>{o.text || "Texto sin contenido"}</button>)}</aside>
      <main className="vl-main"><div className="vl-heading"><div><h1>Tu estudio creativo</h1><p>Importa, reproduce y edita textos directamente sobre el video.</p></div><span>Vista 9:16</span></div>
      <div className="vl-stage-wrap"><div ref={stage} className="vl-stage" onPointerMove={move} onPointerUp={() => dragging.current = null} onPointerCancel={() => dragging.current = null}>
        {source ? <video ref={video} src={source} playsInline onLoadedMetadata={e => setDuration(e.currentTarget.duration || 0)} onTimeUpdate={e => setTime(e.currentTarget.currentTime)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} /> : <div className="vl-placeholder"><span>▶</span><p>Importa un video para empezar</p></div>}
        {overlays.filter(o => time >= o.start && time <= o.end).map(o => <div key={o.id} role="button" tabIndex={0} aria-label={"Mover texto: " + o.text} onKeyDown={e => { if(e.key==="ArrowLeft") update(o.id,{x:Math.max(0,o.x-1)}); if(e.key==="ArrowRight") update(o.id,{x:Math.min(100,o.x+1)}); if(e.key==="ArrowUp") update(o.id,{y:Math.max(0,o.y-1)}); if(e.key==="ArrowDown") update(o.id,{y:Math.min(100,o.y+1)}); }} onPointerDown={e => { e.preventDefault(); setSelected(o.id); dragging.current = o.id; e.currentTarget.setPointerCapture(e.pointerId); }} onPointerUp={() => dragging.current = null} className={"vl-text " + (selected === o.id ? "selected" : "")} style={{left:o.x+"%",top:o.y+"%",fontSize:o.size+"px",color:o.color}}>{o.text}</div>)}
      </div></div>
      <div className="vl-player"><button onClick={toggle} disabled={!source}>{playing ? "❚❚ Pausar" : "▶ Reproducir"}</button><input aria-label="Posición del video" type="range" min="0" max={duration || 1} step="0.05" value={Math.min(time,duration || 1)} disabled={!source} onChange={e => { if(video.current) video.current.currentTime=Number(e.target.value); setTime(Number(e.target.value)); }}/><span>{time.toFixed(1)} / {duration.toFixed(1)} s</span></div>
      <section className="vl-timeline"><h2>Línea de tiempo</h2><div className="vl-track"><span>VIDEO</span><div className="vl-bar video">{fileName || "Sin video importado"}</div></div>{overlays.map(o => <div className="vl-track" key={o.id}><span>TEXTO</span><button className={"vl-bar text " + (selected===o.id?"active":"")} onClick={() => setSelected(o.id)}>{o.text}</button></div>)}<p className="vl-hint">Primera versión: las capas se seleccionan aquí y sus tiempos se editan a la derecha.</p></section>
      {notice && <p role="status" className="vl-notice">{notice}</p>}</main>
      <aside className="vl-side vl-inspector"><h2>Propiedades</h2>{selectedItem ? <><label>Texto<textarea value={selectedItem.text} onChange={e => update(selected,{text:e.target.value})}/></label><label>Tamaño <input type="range" min="12" max="72" value={selectedItem.size} onChange={e=>update(selected,{size:Number(e.target.value)})}/><span>{selectedItem.size}px</span></label><label>Color <input type="color" value={selectedItem.color} onChange={e=>update(selected,{color:e.target.value})}/></label><label>Inicio (segundos)<input type="number" min="0" step="0.1" value={selectedItem.start} onChange={e=>update(selected,{start:Math.max(0,Number(e.target.value))})}/></label><label>Final (segundos)<input type="number" min="0" step="0.1" value={selectedItem.end} onChange={e=>update(selected,{end:Math.max(0,Number(e.target.value))})}/></label><p className="vl-hint">Arrastra el texto en la vista previa para moverlo.</p><button className="vl-delete" onClick={() => {setOverlays(p=>p.filter(o=>o.id!==selected));setSelected("");}}>Eliminar texto</button></> : <p>Selecciona una capa para editarla.</p>}<div className="vl-ai"><h3>✦ Director IA</h3><p>Conexión con Claude y ChatGPT en una próxima fase.</p></div></aside>
    </div>
    <style jsx global>{`
      *{box-sizing:border-box}.vl-root{min-height:100vh;background:#141521;color:#f3f1ff;font-family:Arial,sans-serif}.vl-root button,.vl-root input,.vl-root textarea{font:inherit}.vl-root button{cursor:pointer}.vl-root button:disabled{opacity:.4;cursor:not-allowed}.vl-top{display:flex;align-items:center;justify-content:space-between;gap:15px;padding:15px 22px;border-bottom:1px solid #353449;background:#1d1d2b}.vl-top span{font-size:11px;color:#bcaaff}.vl-back{color:#c4b5fd;text-decoration:none}.vl-top-actions{display:flex;gap:8px}.vl-top-actions button,.vl-player button{background:#7857e7;color:white;border:0;border-radius:9px;padding:10px}.vl-layout{display:grid;grid-template-columns:230px minmax(0,1fr) 240px;min-height:calc(100vh - 68px)}.vl-side{background:#202131;padding:20px;border-right:1px solid #36374b;display:flex;flex-direction:column;gap:12px}.vl-inspector{border-right:0;border-left:1px solid #36374b}.vl-side h2,.vl-timeline h2{font-size:17px;margin:0 0 10px}.vl-side h3{font-size:13px;color:#c8c4dd;margin:14px 0 0}.vl-upload,.vl-add{background:#7857e7;color:white;border:0;border-radius:10px;padding:12px;display:block;text-align:center;cursor:pointer}.vl-upload input{display:none}.vl-hint{font-size:12px;color:#b0aec6;line-height:1.5}.vl-layer{background:#303246;border:1px solid #42445c;color:#eee;border-radius:8px;text-align:left;padding:11px;overflow:hidden;text-overflow:ellipsis}.vl-layer.active,.vl-bar.active{border-color:#eaa4c7}.vl-main{padding:20px;min-width:0}.vl-heading{display:flex;justify-content:space-between;align-items:center;gap:12px}.vl-heading h1{font-size:23px;margin:0}.vl-heading p{color:#aaa9c0;font-size:13px}.vl-heading span{font-size:12px;color:#c6b5ff}.vl-stage-wrap{display:flex;justify-content:center;background:#10111b;border-radius:14px;padding:16px;min-height:430px}.vl-stage{position:relative;aspect-ratio:9/16;width:min(100%,280px);background:linear-gradient(145deg,#6b49bc,#f4a2b9);overflow:hidden;touch-action:none;border-radius:6px}.vl-stage video{width:100%;height:100%;object-fit:contain;background:#050505}.vl-placeholder{height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff}.vl-placeholder span{font-size:55px}.vl-text{position:absolute;transform:translate(-50%,-50%);font-weight:800;text-align:center;text-shadow:0 2px 9px #0008;max-width:95%;min-width:50px;white-space:pre-wrap;overflow-wrap:anywhere;cursor:grab;user-select:none;touch-action:none;line-height:1.1;padding:4px}.vl-text.selected{outline:2px dashed #fff9}.vl-player{display:flex;gap:12px;align-items:center;margin:15px 0}.vl-player input{flex:1;min-width:40px;accent-color:#a98aff}.vl-player span{font-size:12px;white-space:nowrap}.vl-timeline{background:#202131;border:1px solid #39394c;border-radius:12px;padding:16px}.vl-track{display:flex;gap:10px;align-items:center;margin:9px 0}.vl-track span{width:50px;font-size:11px;color:#bbb}.vl-bar{flex:1;min-width:0;text-align:left;padding:10px;border-radius:6px;color:white;font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.vl-bar.video{background:#5769ba}.vl-bar.text{background:#a44f82;border:1px solid transparent}.vl-inspector label{display:flex;flex-direction:column;gap:7px;font-size:13px}.vl-inspector input,.vl-inspector textarea{width:100%;background:#303246;color:white;border:1px solid #56576d;border-radius:7px;padding:8px}.vl-inspector input[type=color]{height:42px;padding:3px}.vl-inspector input[type=range]{padding:0;accent-color:#a98aff}.vl-delete{border:1px solid #a95c77;background:transparent;color:#ffb3c7;border-radius:8px;padding:10px}.vl-ai{margin-top:24px;background:#34284d;border-radius:12px;padding:14px}.vl-ai h3{color:#e2c6ff}.vl-notice{color:#ffcbdd}@media(max-width:1000px){.vl-layout{grid-template-columns:190px minmax(0,1fr)}.vl-inspector{grid-column:1/-1;border-left:0;border-top:1px solid #36374b}.vl-inspector label{max-width:480px}}@media(max-width:650px){.vl-top{flex-wrap:wrap}.vl-layout{display:flex;flex-direction:column}.vl-side{border-right:0;border-bottom:1px solid #36374b}.vl-main{padding:12px}.vl-stage-wrap{min-height:300px}.vl-stage{width:min(100%,245px)}.vl-top-actions{width:100%}.vl-top-actions button{font-size:12px}.vl-player{flex-wrap:wrap}.vl-player input{flex-basis:55%}}
    `}</style>
  </div>;
}
