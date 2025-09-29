"use client";

import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";

type TextLayer = {
  id: string;
  text: string;
  x: number; // percent [0-100]
  y: number; // percent [0-100]
  fontSize: number;
  fontFamily: string;
  color: string;
  bold: boolean;
  italic: boolean;
  align: "left" | "center" | "right";
  letterSpacing: number; // px
  lineHeight: number; // unitless multiplier
  // Effects
  shadowEnabled: boolean;
  shadowColor: string;
  shadowX: number;
  shadowY: number;
  shadowBlur: number;

  outlineEnabled: boolean;
  outlineColor: string;
  outlineWidth: number; // px

  // Layer controls
  visible: boolean;
  locked: boolean;
};

export default function MyDesignsPage() {
  const search = useSearchParams();
  const [img, setImg] = useState<string>(
    (typeof window !== 'undefined' ? (new URLSearchParams(window.location.search).get('img')) : null) ||
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBndbq1uS3aC4pzCJhzgXH1RZ1ZX4LWC8wlGGQ2esOe7dLAZQC3lYJAB3xKv4VpW6iTrTYG4d8Mtzu4gu-YooH3m1C53Qsn3r7rFXrPnRrt8qYIwFpcDJNVPzpI370z_6_jYPpyPAdO_jAEfsRJre_48oyusATJNTCOQzbrVjMayHxtKiStDFotP5GtVJpwifDNSfAx6g0wUSfEDo4Z7VeVk7hkZ2FsweqRyctDJchbHcMS6KOjmU3pE5wcOX8UawMPaohSIJsPVbxT"
  );
  useEffect(() => {
    const uploadKey = search.get('uploadKey');
    if (uploadKey && typeof window !== 'undefined') {
      const val = window.sessionStorage.getItem(uploadKey);
      if (val) setImg(val);
    } else {
      const direct = search.get('img');
      if (direct) setImg(direct);
    }
  }, [search]);
  const name = (search.get("name") || "design").replace(/[^a-z0-9-_]/gi, "_");
  const [bgColor, setBgColor] = useState<string>("#000000");
  const [bgImageOpacity, setBgImageOpacity] = useState<number>(1);
  const [bgBrightness, setBgBrightness] = useState<number>(100);
  const [bgContrast, setBgContrast] = useState<number>(100);
  const [bgSaturation, setBgSaturation] = useState<number>(100);
  const [bgBlur, setBgBlur] = useState<number>(0);


  const [ratio, setRatio] = useState<"1:1" | "4:5" | "16:9" | "3:2">("3:2");
  const [exportWidth, setExportWidth] = useState<number>(1500);
  const ratioParts = useMemo(() => {
    const [rw, rh] = ratio.split(":").map((n) => parseInt(n, 10) || 1);
    return { rw, rh };
  }, [ratio]);

  // Grid & Snap
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [snapEnabled, setSnapEnabled] = useState<boolean>(true);
  const [gridSpacing, setGridSpacing] = useState<number>(32);

  const [layers, setLayers] = useState<TextLayer[]>([
    {
      id: "layer-1",
      text: "Başlık",
      x: 50,
      y: 50,
      fontSize: 64,
      fontFamily: "Inter, ui-sans-serif, system-ui",
      color: "#ffffff",
      bold: true,
      italic: false,
      align: "center",
      letterSpacing: 0,
      lineHeight: 1.2,
      shadowEnabled: false,
      shadowColor: "#000000",
      shadowX: 0,
      shadowY: 2,
      shadowBlur: 6,
      outlineEnabled: false,
      outlineColor: "#000000",
      outlineWidth: 0,
      visible: true,
      locked: false,
    },
  ]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(["layer-1"]));
  const selectedId = useMemo(() => (selectedIds.size === 1 ? Array.from(selectedIds)[0] : null), [selectedIds]);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const dragState = useRef<{ active: boolean; startX: number; startY: number; rectW: number; rectH: number; movingIds: string[]; initial: Record<string,{x:number,y:number}> }>({ active: false, startX: 0, startY: 0, rectW: 0, rectH: 0, movingIds: [], initial: {} });

  const onLayerPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>, id: string) => {
    e.preventDefault();
    const layer = layers.find(l => l.id === id);
    if (!layer || layer.locked === true) return; // ignore locked layers

    const isToggle = e.shiftKey || e.metaKey || e.ctrlKey;
    // compute moving set immediately (setState is async)
    let movingSet = new Set(selectedIds);
    if (isToggle) {
      if (movingSet.has(id)) movingSet.delete(id); else movingSet.add(id);
    } else {
      movingSet = new Set([id]);
    }
    setSelectedIds(movingSet);

    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();

    const initial: Record<string,{x:number,y:number}> = {};
    layers.forEach(l => {
      if (movingSet.has(l.id) && l.locked !== true) initial[l.id] = { x: l.x, y: l.y };
    });

    dragState.current.active = true;
    dragState.current.startX = e.clientX;
    dragState.current.startY = e.clientY;
    dragState.current.rectW = rect.width;
    dragState.current.rectH = rect.height;
    dragState.current.movingIds = Object.keys(initial);
    dragState.current.initial = initial;
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  }, [layers, selectedIds]);

  const onStagePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return;
    const rectW = dragState.current.rectW;
    const rectH = dragState.current.rectH;
    const dxPx = e.clientX - dragState.current.startX;
    const dyPx = e.clientY - dragState.current.startY;
    let dxPct = (dxPx / rectW) * 100;
    let dyPct = (dyPx / rectH) * 100;

    // snap to grid in percent space
    if (snapEnabled) {
      const stepPctX = (gridSpacing / rectW) * 100;
      const stepPctY = (gridSpacing / rectH) * 100;
      dxPct = Math.round(dxPct / stepPctX) * stepPctX;
      dyPct = Math.round(dyPct / stepPctY) * stepPctY;
    }

    const movingIds = dragState.current.movingIds;
    const initial = dragState.current.initial;

    setLayers(prev => prev.map(l => {
      if (!movingIds.includes(l.id)) return l;
      const nx = Math.max(0, Math.min(100, initial[l.id].x + dxPct));
      const ny = Math.max(0, Math.min(100, initial[l.id].y + dyPct));
      return { ...l, x: nx, y: ny };
    }));
  }, [snapEnabled, gridSpacing]);

  const onStagePointerUp = useCallback(() => {
    dragState.current.active = false;
    dragState.current.movingIds = [];
  }, []);

  const addLayer = useCallback((kind: "heading" | "subheading" | "body") => {
    const base: Omit<TextLayer, "id"> = {
      text: kind === "heading" ? "Başlık" : kind === "subheading" ? "Alt Başlık" : "Metin",
      x: 50,
      y: kind === "body" ? 70 : kind === "subheading" ? 60 : 50,
      fontSize: kind === "heading" ? 72 : kind === "subheading" ? 42 : 24,
      fontFamily: "Inter, ui-sans-serif, system-ui",
      color: "#ffffff",
      bold: kind !== "body",
      italic: false,
      align: "center",
      letterSpacing: 0,
      lineHeight: 1.2,
      shadowEnabled: false,
      shadowColor: "#000000",
      shadowX: 0,
      shadowY: 2,
      shadowBlur: 6,
      outlineEnabled: false,
      outlineColor: "#000000",
      outlineWidth: 0,
      visible: true,
      locked: false,
    };
    const id = `layer-${Date.now()}`;
    setLayers((prev) => [...prev, { id, ...base }]);
    setSelectedIds(new Set([id]));
  }, []);

  const handleExport = useCallback(async () => {
    // Basic export for all layers; Step 2 will add shadows/outline/advanced spacing
    const W = exportWidth;
    const H = Math.round((exportWidth * ratioParts.rh) / ratioParts.rw);
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, W, H);

    await new Promise<void>((resolve) => {
      if (!img) return resolve();
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.onload = () => {
        try {
          const scale = Math.max(W / image.width, H / image.height);
          const dw = image.width * scale;
          const dh = image.height * scale;
          const dx = (W - dw) / 2;
          const dy = (H - dh) / 2;
          ctx.save();
          ctx.globalAlpha = bgImageOpacity;
          // apply CSS-like filters for background
          ctx.filter = `brightness(${bgBrightness}%) contrast(${bgContrast}%) saturate(${bgSaturation}%) blur(${bgBlur}px)`;
          ctx.drawImage(image, dx, dy, dw, dh);
          ctx.filter = "none";
          ctx.restore();
        } catch {}
        resolve();
      };
      image.onerror = () => resolve();
      image.src = img;
    });

    ctx.textBaseline = "middle";

    const drawLineWithSpacing = (line: string, x: number, y: number, letterSpacing: number, fill = true, stroke = false) => {
      // Draw per character to emulate letterSpacing
      let totalWidth = 0;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        totalWidth += ctx.measureText(ch).width;
        if (i < line.length - 1) totalWidth += letterSpacing;
      }
      let cursorX = x;
      if (ctx.textAlign === "center") cursorX = x - totalWidth / 2;
      else if (ctx.textAlign === "right" || ctx.textAlign === "end") cursorX = x - totalWidth;

      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (stroke) ctx.strokeText(ch, cursorX, y);
        if (fill) ctx.fillText(ch, cursorX, y);
        cursorX += ctx.measureText(ch).width + (i < line.length - 1 ? letterSpacing : 0);
      }
    };

    const drawLayer = (l: TextLayer) => {
      const tx = (l.x / 100) * W;
      const ty = (l.y / 100) * H;
      ctx.font = `${l.bold ? 700 : 400} ${l.fontSize}px ${l.fontFamily}`;
      ctx.textAlign = l.align as CanvasTextAlign;
      ctx.textBaseline = "middle";

      // Shadow
      ctx.shadowColor = l.shadowEnabled ? l.shadowColor : "transparent";
      ctx.shadowBlur = l.shadowEnabled ? l.shadowBlur : 0;
      ctx.shadowOffsetX = l.shadowEnabled ? l.shadowX : 0;
      ctx.shadowOffsetY = l.shadowEnabled ? l.shadowY : 0;

      const lines = l.text.split("\n");
      const lh = l.fontSize * (l.lineHeight || 1.2);
      for (let i = 0; i < lines.length; i++) {
        const ly = ty + (i - (lines.length - 1) / 2) * lh;
        if (l.outlineEnabled && l.outlineWidth > 0) {
          ctx.lineWidth = l.outlineWidth * 2; // heavier outline
          ctx.strokeStyle = l.outlineColor;
          ctx.fillStyle = l.color;
          drawLineWithSpacing(lines[i], tx, ly, l.letterSpacing, false, true);
        }
        ctx.fillStyle = l.color;
        drawLineWithSpacing(lines[i], tx, ly, l.letterSpacing, true, false);
      }

      // Reset shadow
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    };

    layers.forEach(drawLayer);

    const data = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = data;
    a.download = `${name || "design"}.png`;
    a.click();
  }, [bgColor, img, bgImageOpacity, layers, name, exportWidth, ratio, bgBrightness, bgContrast, bgSaturation, bgBlur]);


  return (
    <div className="relative flex min-h-screen w-full flex-col bg-gray-50 text-slate-800 dark:bg-slate-900 dark:text-slate-200">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-slate-200 px-6 py-3 dark:border-slate-800">
        <div className="flex items-center gap-3 text-slate-900 dark:text-white">
          <div className="h-8 w-8 text-blue-600">
            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.263 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z" />
              <path clipRule="evenodd" d="M10.4485 13.8519C10.4749 13.9271 10.6203 14.246 11.379 14.7361C12.298 15.3298 13.7492 15.9145 15.6717 16.3735C18.0007 16.9296 20.8712 17.2655 24 17.2655C27.1288 17.2655 29.9993 16.9296 32.3283 16.3735C34.2508 15.9145 35.702 15.3298 36.621 14.7361C37.3796 14.246 37.5251 13.9271 37.5515 13.8519C37.5287 13.7876 37.4333 13.5973 37.0635 13.2931C36.5266 12.8516 35.6288 12.3647 34.343 11.9175C31.79 11.0295 28.1333 10.4437 24 10.4437C19.8667 10.4437 16.2099 11.0295 13.657 11.9175C12.3712 12.3647 11.4734 12.8516 10.9365 13.2931C10.5667 13.5973 10.4713 13.7876 10.4485 13.8519ZM37.5563 18.7877C36.3176 19.3925 34.8502 19.8839 33.2571 20.2642C30.5836 20.9025 27.3973 21.2655 24 21.2655C20.6027 21.2655 17.4164 20.9025 14.7429 20.2642C13.1498 19.8839 11.6824 19.3925 10.4436 18.7877V34.1275C10.4515 34.1545 10.5427 34.4867 11.379 35.027C12.298 35.6207 13.7492 36.2054 15.6717 36.6644C18.0007 37.2205 20.8712 37.5564 24 37.5564C27.1288 37.5564 29.9993 37.2205 32.3283 36.6644C34.2508 36.2054 35.702 35.6207 36.621 35.027C37.4573 34.4867 37.5485 34.1546 37.5563 34.1275V18.7877ZM41.5563 13.8546V34.1455C41.5563 36.1078 40.158 37.5042 38.7915 38.3869C37.3498 39.3182 35.4192 40.0389 33.2571 40.5551C30.5836 41.1934 27.3973 41.5564 24 41.5564C20.6027 41.5564 17.4164 41.1934 14.7429 40.5551C12.5808 40.0389 10.6502 39.3182 9.20848 38.3869C7.84205 37.5042 6.44365 36.1078 6.44365 34.1455L6.44365 13.8546C6.44365 12.2684 7.37223 11.0454 8.39581 10.2036C9.43325 9.3505 10.8137 8.67141 12.343 8.13948C15.4203 7.06909 19.5418 6.44366 24 6.44366C28.4582 6.44366 32.5797 7.06909 35.657 8.13948C37.1863 8.67141 38.5667 9.3505 39.6042 10.2036C40.6278 11.0454 41.5563 12.2684 41.5563 13.8546Z" fillRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-bold">Saas Design</h2>
        </div>
        <div className="flex flex-1 justify-end gap-2">
          <button className="flex h-10 w-10 items-center justify-center rounded-full text-slate-900 hover:bg-slate-900/5 dark:text-white dark:hover:bg-white/10" aria-label="Help">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 17v.01"/><path d="M12 13a4 4 0 1 0-4-4"/><path d="M12 17c0-1.5.5-2 2-3"/></svg>
          </button>
          <div className="h-10 w-10 rounded-full bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDkX4tMIEHYQ3vbnLNjq8NIOsly58TWNJTalZ2cYQvo-FpdJh6nJzzWXRyx0CFfDbC2fFTN964R7Wl__HyBher3OI3H6n3y3w-Vfq4iKtNFWAcgXsiknRNDWhLrsRHtyGWtnGf2F0UMZCm4jojprNDz2Te_eGwo--eI5DLetLgC3IRQIGWALhI4kJSC1y8DqXSYzwfoCBLRkzWj8ZDMBAMgI-xx2nuGb2k832HUapAK4rW2n5765REDhYwLiKK1v9nkR7v1umq_ldXh")' }} />
        </div>
      </header>

      <div className="flex flex-1">
        {/* Left panel */}
        <aside className="flex w-80 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="p-4">
            <h3 className="px-2 text-lg font-bold text-slate-900 dark:text-white">Templates</h3>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {[
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCgMMwLo97eBtFI7-9u5r0ChvJp5TRDH5PHtGlBf6GWQwBDFKiJjRhu-SDxdPFCWczirT6XUuwNS22RcvDmHCq6cq3dkFr0wmodRlU3oO0-DcxbwTRfHWGjn7W12NbUzchdkTc1sjxN4cSwKxw45so1zbHliy6voe3Zdu0Vo8ebT8iMAykImMsWBP0uyOrQrkTw7DuIcWOTbGWme-53mJV7NXSPYAjk1kHmqRe98KgP5twWFsuA-y_CfwkRXwoRjjryxA53is3dveGT",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuB0Rro5L2NTgy_K2mktF0ju-YhkwSRpw4a2OWuKnQ1rzta4PleZq6Lguy_xYVaFcUsc58yEaZ9teHnbBMIGZDRVct38TKE-HyRkrWPxRCsRSEOJ5nokL8CafLR9ncUeM5su1s6gH1nC5Dc2V4gRLcq1XhWfzkl6ZwD4Qs4cJwBCbO1kaM0zEKsw3zKeOL9esbZfzg08nGo2wptDflJkxcl0oOjE_-jpyZGIYoprSSZiOHZscicb4r7gYKRMLaiGNrFKbp_T1Yy-H3IB",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuADOy9wUmsGVnmedTylWDBHFI2WP4pvEVbbNDrcvuQlVl5y_uPOgiLjBlxQrLK8tWsdQBjkr6i8o4qrLu-1YHQn_IIObyDVlE9x9UWY_DNn83irsOHXKoxvqVHldeuDme1Q3mwQFDZefWpwsrU-mP4StHQ9NfHSjP3x_9UVXNe-GpVhk_tJzvzQynA5o7HZRc_pdaOkq0HcTqDlKP14wTJbeN2NV4HW_HrIaYUtF0smHVq-f_dnhzSJzRdpFVIkKdGOzOe7qRCUkY_R",
              ].map((u) => (
                <div key={u} className="aspect-square w-full rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${JSON.stringify(u)})` }} />
              ))}
            </div>
          </div>
            <div className="border-t border-slate-200 p-4 dark:border-slate-800">
              <h3 className="mb-2 px-2 text-lg font-bold text-slate-900 dark:text-white">Layers</h3>
              <div className="space-y-2">
                {layers.map((l, idx) => (
                  <div key={l.id} className={`flex items-center justify-between rounded-lg border px-2 py-1 text-sm ${selectedIds.has(l.id) ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                    <button onClick={(e) => { const isToggle = e.shiftKey || e.metaKey || e.ctrlKey; setSelectedIds(prev => { const next = new Set(prev); if (isToggle) { if (next.has(l.id)) next.delete(l.id); else next.add(l.id); } else { next.clear(); next.add(l.id); } return next; }); }} className="flex min-w-0 flex-1 items-center gap-2 truncate text-left">
                      <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: l.color }} />
                      <span className="truncate">{l.text || 'Untitled'}</span>
                    </button>
                    <div className="flex items-center gap-1">
                      <button title="Toggle visibility" onClick={() => setLayers(prev=>prev.map(x=>x.id===l.id?{...x, visible: !(x.visible!==false)}:x))} className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800">
                        {l.visible===false ? (
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 3 18 18"/><path d="M10.584 10.587A2 2 0 0 0 12 14a2 2 0 0 0 1.414-.586"/><path d="M9.88 5.094A10.45 10.45 0 0 1 12 5c7 0 10 7 10 7a17.5 17.5 0 0 1-3.24 4.34"/><path d="M6.16 6.156A17.5 17.5 0 0 0 2 12s3 7 10 7a10.5 10.5 0 0 0 5.5-1.5"/></svg>
                        ) : (
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"/><circle cx="12" cy="12" r="3"/></svg>
                        )}
                      </button>
                      <button title="Toggle lock" onClick={() => setLayers(prev=>prev.map(x=>x.id===l.id?{...x, locked: !x.locked}:x))} className={`rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800 ${l.locked?'text-amber-600':''}`}>
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      </button>
                      <button title="Move up" onClick={() => setLayers(prev=>{const i=prev.findIndex(x=>x.id===l.id); if(i<=0) return prev; const a=[...prev]; [a[i-1],a[i]]=[a[i],a[i-1]]; return a;})} className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800"><svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 15-6-6-6 6"/></svg></button>
                      <button title="Move down" onClick={() => setLayers(prev=>{const i=prev.findIndex(x=>x.id===l.id); if(i<0||i>=prev.length-1) return prev; const a=[...prev]; [a[i],a[i+1]]=[a[i+1],a[i]]; return a;})} className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800"><svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg></button>
                      <button title="Delete" onClick={() => { setLayers(prev=>prev.filter(x=>x.id!==l.id)); setSelectedIds(prev => { const next = new Set(prev); next.delete(l.id); return next; }); }} className="rounded p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"><svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          <div className="flex-grow">
            <h3 className="px-6 text-lg font-bold text-slate-900 dark:text-white">Elements</h3>
            <div className="mt-2 border-b border-slate-200 px-4 dark:border-slate-800">
              <div className="flex gap-4">
                <a className="flex flex-col items-center justify-center border-b-2 border-blue-600 pb-2 pt-2 text-sm font-bold text-blue-600" href="#">Text</a>
                <a className="flex flex-col items-center justify-center border-b-2 border-transparent pb-2 pt-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white" href="#">Images</a>
                <a className="flex flex-col items-center justify-center border-b-2 border-transparent pb-2 pt-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white" href="#">Shapes</a>
              </div>
            </div>
            <div className="p-4">
              <div className="relative">
                <svg className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-3.5-3.5"/></svg>
                <input className="w-full rounded-lg border border-slate-200 bg-gray-50 py-2 pl-10 pr-4 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" placeholder="Search" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 px-4 pb-4">
              <button onClick={() => addLayer("heading")} className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white p-3 hover:border-blue-600 dark:border-slate-700 dark:bg-slate-900">
                <svg className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16"/><path d="M4 12h10"/><path d="M4 17h7"/></svg>
                <span className="font-bold">Heading</span>
              </button>
              <button onClick={() => addLayer("subheading")} className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white p-3 hover:border-blue-600 dark:border-slate-700 dark:bg-slate-900">
                <span className="font-bold">Subheading</span>
              </button>
              <button onClick={() => addLayer("body")} className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white p-3 hover:border-blue-600 dark:border-slate-700 dark:bg-slate-900">
                <span className="font-bold">Body</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main editor area */}
        <main className="flex flex-1 flex-col">
          <div className="flex items-center justify-between gap-2 border-b border-slate-200 p-3 dark:border-slate-800">
            <div className="flex gap-1">
              <button className="flex h-10 w-10 items-center justify-center rounded text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800" aria-label="Undo">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7v6h6"/><path d="M3 13a9 9 0 1 0 3-6.7L3 7"/></svg>
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800" aria-label="Redo">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 7v6h-6"/><path d="M21 13a9 9 0 1 1-3-6.7L21 7"/></svg>
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800" aria-label="Save">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V7l4-4h10l4 4v12a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8"/><path d="M7 3v4h8"/></svg>
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded text-slate-400 cursor-not-allowed dark:text-slate-500" aria-label="Lock">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800" aria-label="Delete">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-600/90">
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V7l4-4h10l4 4v12a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8"/><path d="M7 3v4h8"/></svg>
                Save
              </button>
              <div className="hidden items-center gap-3 md:flex">
                <label className="text-sm text-slate-600 dark:text-slate-300">Ratio</label>
                <select value={ratio} onChange={(e) => setRatio(e.target.value as any)} className="rounded border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800">
                  <option value="1:1">1:1</option>
                  <option value="4:5">4:5</option>
                  <option value="16:9">16:9</option>
                  <option value="3:2">3:2</option>
                </select>
                <label className="text-sm text-slate-600 dark:text-slate-300">Width</label>
                <input type="number" min={256} max={4096} step={64} value={exportWidth} onChange={(e) => setExportWidth(parseInt(e.target.value) || 1024)} className="w-24 rounded border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800" />
                <span className="text-sm text-slate-500">x {Math.round((exportWidth * ratioParts.rh) / ratioParts.rw)} px</span>
                <div className="mx-2 h-6 w-px bg-slate-300 dark:bg-slate-700" />
                <label className="text-sm text-slate-600 dark:text-slate-300">Grid</label>
                <input type="checkbox" checked={showGrid} onChange={(e)=>setShowGrid(e.target.checked)} />
                <label className="text-sm text-slate-600 dark:text-slate-300">Snap</label>
                <input type="checkbox" checked={snapEnabled} onChange={(e)=>setSnapEnabled(e.target.checked)} />
                <label className="text-sm text-slate-600 dark:text-slate-300">Spacing</label>
                <input type="number" min={8} max={128} step={4} value={gridSpacing} onChange={(e)=>setGridSpacing(parseInt(e.target.value)||32)} className="w-20 rounded border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800" />
              </div>
              <button onClick={handleExport} className="flex h-10 items-center justify-center rounded-lg bg-slate-800 px-4 text-sm font-bold text-white hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600">
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>
                Export
              </button>
            </div>
          </div>

          <div className="flex w-full flex-grow items-center justify-center p-8">
            <div
              ref={stageRef}
              onPointerMove={onStagePointerMove}
              onPointerUp={onStagePointerUp}
              className="relative w-full overflow-hidden rounded-xl shadow-lg touch-none"
              style={{ backgroundColor: bgColor, aspectRatio: `${ratioParts.rw} / ${ratioParts.rh}` }}
            >
              <img src={img} crossOrigin="anonymous" alt="" className="absolute inset-0 h-full w-full object-cover" style={{ opacity: bgImageOpacity, filter: `brightness(${bgBrightness}%) contrast(${bgContrast}%) saturate(${bgSaturation}%) blur(${bgBlur}px)` }} />
              {showGrid && (
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent ${gridSpacing - 1}px, rgba(255,255,255,0.08) ${gridSpacing - 1}px, rgba(255,255,255,0.08) ${gridSpacing}px), repeating-linear-gradient(90deg, transparent, transparent ${gridSpacing - 1}px, rgba(255,255,255,0.08) ${gridSpacing - 1}px, rgba(255,255,255,0.08) ${gridSpacing}px)`
                  }}
                />
              )}

              {layers.filter(l => l.visible !== false).map((l) => (
                <div
                  key={l.id}
                  onPointerDown={(e) => onLayerPointerDown(e, l.id)}
                  onClick={(e)=>{ const isToggle = e.shiftKey || e.metaKey || e.ctrlKey; setSelectedIds(prev=>{ const next = new Set(prev); if (isToggle) { if (next.has(l.id)) next.delete(l.id); else next.add(l.id);} else { next.clear(); next.add(l.id);} return next; }); }}
                  className={`absolute select-none ${l.locked ? 'cursor-not-allowed opacity-80' : 'cursor-move'} ${selectedIds.has(l.id) ? 'outline outline-2 outline-blue-500/70' : ''}`}
                  style={{
                    left: `${l.x}%`,
                    top: `${l.y}%`,
                    color: l.color,
                    fontFamily: l.fontFamily,
                    fontSize: `${l.fontSize}px`,
                    fontWeight: l.bold ? 700 : 400,
                    fontStyle: l.italic ? 'italic' : 'normal',
                    transform: 'translate(-50%, -50%)',
                    whiteSpace: 'pre-wrap',
                    textAlign: l.align as any,
                    letterSpacing: `${l.letterSpacing}px`,
                    lineHeight: l.lineHeight,
                    textShadow: `${l.outlineEnabled && l.outlineWidth > 0 ? `0 ${l.outlineWidth}px 0 ${l.outlineColor}, 0 -${l.outlineWidth}px 0 ${l.outlineColor}, ${l.outlineWidth}px 0 0 ${l.outlineColor}, -${l.outlineWidth}px 0 0 ${l.outlineColor}, ${l.outlineWidth}px ${l.outlineWidth}px 0 ${l.outlineColor}, -${l.outlineWidth}px ${l.outlineWidth}px 0 ${l.outlineColor}, ${l.outlineWidth}px -${l.outlineWidth}px 0 ${l.outlineColor}, -${l.outlineWidth}px -${l.outlineWidth}px 0 ${l.outlineColor}` : ''}${(l.shadowEnabled ? (l.outlineEnabled && l.outlineWidth > 0 ? ', ' : '') + `${l.shadowX}px ${l.shadowY}px ${l.shadowBlur}px ${l.shadowColor}` : '')}`,
                  }}
                >
                  {l.text}
                </div>
              ))}
            </div>
          </div>
        </main>
        {/* Right properties panel */}
        <aside className="w-80 border-l border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Design</h3>
          <div className="mt-4 space-y-4">
            {/* Canvas settings */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium mb-1">Canvas bg</label>
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 dark:border-slate-700" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image opacity</label>
                <input type="range" min={0} max={1} step={0.05} value={bgImageOpacity} onChange={(e) => setBgImageOpacity(parseFloat(e.target.value))} className="w-full" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium mb-1">Brightness</label>
                <input type="range" min={50} max={150} step={1} value={bgBrightness} onChange={(e)=>setBgBrightness(parseInt(e.target.value))} className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contrast</label>
                <input type="range" min={50} max={150} step={1} value={bgContrast} onChange={(e)=>setBgContrast(parseInt(e.target.value))} className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Saturation</label>
                <input type="range" min={0} max={200} step={1} value={bgSaturation} onChange={(e)=>setBgSaturation(parseInt(e.target.value))} className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Blur</label>
                <input type="range" min={0} max={20} step={1} value={bgBlur} onChange={(e)=>setBgBlur(parseInt(e.target.value))} className="w-full" />
              </div>
            </div>

            {/* Selected layer settings */}
            {selectedId ? (
              (() => {
                const layer = layers.find((l) => l.id === selectedId)!;
                const update = (patch: Partial<TextLayer>) => setLayers(prev => prev.map(l => l.id === selectedId ? { ...l, ...patch } : l));
                return (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Text</label>
                      <textarea value={layer.text} onChange={(e) => update({ text: e.target.value })} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium mb-1">Font size</label>
                        <input type="range" min={12} max={144} value={layer.fontSize} onChange={(e) => update({ fontSize: parseInt(e.target.value) || 12 })} className="w-full" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Font family</label>
                        <select value={layer.fontFamily} onChange={(e) => update({ fontFamily: e.target.value })} className="w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
                          <option value="Inter, ui-sans-serif, system-ui">Inter</option>
                          <option value="Noto Sans, ui-sans-serif, system-ui">Noto Sans</option>
                          <option value="ui-serif, Georgia, Cambria, Times New Roman, Times, serif">Serif</option>
                          <option value="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace">Monospace</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium mb-1">Text color</label>
                        <input type="color" value={layer.color} onChange={(e) => update({ color: e.target.value })} className="h-10 w-full rounded-lg border border-slate-200 dark:border-slate-700" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Align</label>
                        <select value={layer.align} onChange={(e) => update({ align: e.target.value as any })} className="w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
                          <option value="left">Left</option>
                          <option value="center">Center</option>
                          <option value="right">Right</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium mb-1">Letter spacing</label>
                        <input type="range" min={-2} max={10} step={0.5} value={layer.letterSpacing} onChange={(e) => update({ letterSpacing: parseFloat(e.target.value) })} className="w-full" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Line height</label>
                        <input type="range" min={0.8} max={2} step={0.05} value={layer.lineHeight} onChange={(e) => update({ lineHeight: parseFloat(e.target.value) })} className="w-full" />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button onClick={() => update({ bold: !layer.bold })} className={`rounded px-2 py-1 text-sm font-semibold ${layer.bold ? 'bg-slate-900 text-white dark:bg-slate-700' : 'bg-slate-100 dark:bg-slate-800'}`}>B</button>
                      <button onClick={() => update({ italic: !layer.italic })} className={`rounded px-2 py-1 text-sm italic ${layer.italic ? 'bg-slate-900 text-white dark:bg-slate-700' : 'bg-slate-100 dark:bg-slate-800'}`}>I</button>
                    </div>

                    <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Shadow</label>
                        <input type="checkbox" checked={layer.shadowEnabled} onChange={(e) => update({ shadowEnabled: e.target.checked })} />
                      </div>
                      {layer.shadowEnabled && (
                        <div className="mt-2 grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-xs mb-1">Offset X</label>
                            <input type="number" className="w-full rounded border bg-white px-2 py-1 text-sm dark:bg-slate-800" value={layer.shadowX} onChange={(e) => update({ shadowX: parseFloat(e.target.value) || 0 })} />
                          </div>
                          <div>
                            <label className="block text-xs mb-1">Offset Y</label>
                            <input type="number" className="w-full rounded border bg-white px-2 py-1 text-sm dark:bg-slate-800" value={layer.shadowY} onChange={(e) => update({ shadowY: parseFloat(e.target.value) || 0 })} />
                          </div>
                          <div>
                            <label className="block text-xs mb-1">Blur</label>
                            <input type="number" className="w-full rounded border bg-white px-2 py-1 text-sm dark:bg-slate-800" value={layer.shadowBlur} onChange={(e) => update({ shadowBlur: parseFloat(e.target.value) || 0 })} />
                          </div>
                          <div className="col-span-3">
                            <label className="block text-xs mb-1">Color</label>
                            <input type="color" className="h-10 w-full rounded border dark:border-slate-700" value={layer.shadowColor} onChange={(e) => update({ shadowColor: e.target.value })} />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Outline</label>
                        <input type="checkbox" checked={layer.outlineEnabled} onChange={(e) => update({ outlineEnabled: e.target.checked })} />
                      </div>
                      {layer.outlineEnabled && (
                        <div className="mt-2 grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-xs mb-1">Width</label>
                            <input type="number" min={0} max={10} className="w-full rounded border bg-white px-2 py-1 text-sm dark:bg-slate-800" value={layer.outlineWidth} onChange={(e) => update({ outlineWidth: parseFloat(e.target.value) || 0 })} />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-xs mb-1">Color</label>
                            <input type="color" className="h-10 w-full rounded border dark:border-slate-700" value={layer.outlineColor} onChange={(e) => update({ outlineColor: e.target.value })} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()
            ) : selectedIds.size > 1 ? (
                (() => {
                  const updateAll = (patch: Partial<TextLayer>) => setLayers(prev => prev.map(l => selectedIds.has(l.id) ? { ...l, ...patch } : l));
                  return (
                    <div className="space-y-4">
                      <div className="rounded-md bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs text-slate-600 dark:text-slate-300">{selectedIds.size} katman seçili – toplu stil uygula</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm font-medium mb-1">Font size</label>
                          <input type="range" min={12} max={144} onChange={(e) => updateAll({ fontSize: parseInt(e.target.value) || 12 })} className="w-full" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Font family</label>
                          <select onChange={(e) => updateAll({ fontFamily: e.target.value })} className="w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
                            <option value="Inter, ui-sans-serif, system-ui">Inter</option>
                            <option value="Noto Sans, ui-sans-serif, system-ui">Noto Sans</option>
                            <option value="ui-serif, Georgia, Cambria, Times New Roman, Times, serif">Serif</option>
                            <option value="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace">Monospace</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm font-medium mb-1">Text color</label>
                          <input type="color" onChange={(e) => updateAll({ color: e.target.value })} className="h-10 w-full rounded-lg border border-slate-200 dark:border-slate-700" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Align</label>
                          <select onChange={(e) => updateAll({ align: e.target.value as any })} className="w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
                            <option value="left">Left</option>
                            <option value="center">Center</option>
                            <option value="right">Right</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm font-medium mb-1">Letter spacing</label>
                          <input type="range" min={-2} max={10} step={0.5} onChange={(e) => updateAll({ letterSpacing: parseFloat(e.target.value) })} className="w-full" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Line height</label>
                          <input type="range" min={0.8} max={2} step={0.05} onChange={(e) => updateAll({ lineHeight: parseFloat(e.target.value) })} className="w-full" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateAll({ bold: true })} className="rounded px-2 py-1 text-sm font-semibold bg-slate-100 dark:bg-slate-800">B</button>
                        <button onClick={() => updateAll({ italic: true })} className="rounded px-2 py-1 text-sm italic bg-slate-100 dark:bg-slate-800">I</button>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <p className="text-sm text-slate-500">Düzenlemek için bir metin katmanı seçin.</p>
              )}
          </div>
        </aside>
      </div>
    </div>
  );
}

