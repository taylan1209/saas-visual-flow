"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";

// Tip: We avoid importing fabric at module top-level to prevent SSR issues.
// We'll dynamically require it inside useEffect where window is available.

type FabricNS = typeof import("fabric");

type Props = {
  imageUrl: string;
  width?: number; // canvas pixel width
  height?: number; // canvas pixel height
  backgroundColor?: string;
};

export default function FabricEditor({ imageUrl, width = 1200, height = 800, backgroundColor = "#000" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<FabricNS | null>(null);
  const fcanvasRef = useRef<any>(null);
  const bgImageRef = useRef<any>(null);

  // Filters state
  const [brightness, setBrightness] = useState(0); // -1..1
  const [contrast, setContrast] = useState(0); // -1..1
  const [saturation, setSaturation] = useState(0); // -1..1
  const [blur, setBlur] = useState(0); // 0..1 (roughly)
  const [opacity, setOpacity] = useState(1); // 0..1

  // Helpers
  const applyBgFilters = useCallback(() => {
    const fabric = fabricRef.current;
    const bgImg = bgImageRef.current;
    if (!fabric || !bgImg) return;

    const filters: any[] = [];
    if (brightness !== 0) filters.push(new fabric.Image.filters.Brightness({ brightness }));
    if (contrast !== 0) filters.push(new fabric.Image.filters.Contrast({ contrast }));
    if (saturation !== 0) filters.push(new fabric.Image.filters.Saturation({ saturation }));
    if (blur > 0) filters.push(new fabric.Image.filters.Blur({ blur }));
    bgImg.set({ opacity });
    bgImg.filters = filters;
    bgImg.applyFilters();
    fcanvasRef.current?.requestRenderAll();
  }, [brightness, contrast, saturation, blur, opacity]);

  // Initialize canvas
  useEffect(() => {
    let disposed = false;
    (async () => {
      const fabric: FabricNS = (await import("fabric")).fabric;
      fabricRef.current = fabric;
      if (disposed) return;

      const c = new fabric.Canvas(canvasRef.current!, {
        width,
        height,
        backgroundColor,
        selection: true,
        preserveObjectStacking: true,
      });
      fcanvasRef.current = c;

      // Load background image
      if (imageUrl) {
        fabric.Image.fromURL(imageUrl, (img) => {
          if (!img) return;
          // Fit image into canvas while preserving aspect ratio
          const scale = Math.min(width / img.width!, height / img.height!);
          img.set({
            selectable: false,
            evented: false,
            left: (width - img.width! * scale) / 2,
            top: (height - img.height! * scale) / 2,
            scaleX: scale,
            scaleY: scale,
          });
          bgImageRef.current = img;
          c.add(img);
          c.sendToBack(img);
          c.requestRenderAll();
        }, { crossOrigin: "anonymous" });
      }

      // Basic keyboard shortcuts
      const handleKey = (e: KeyboardEvent) => {
        const active = c.getActiveObjects();
        if (e.key === "Delete" || e.key === "Backspace") {
          if (active.length) {
            active.forEach((o) => c.remove(o));
            c.discardActiveObject();
            c.requestRenderAll();
            e.preventDefault();
          }
        }
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "g") {
          if (active.length > 1) {
            const group = new fabric.Group(active);
            active.forEach((o) => c.remove(o));
            c.add(group);
            c.setActiveObject(group);
            c.requestRenderAll();
            e.preventDefault();
          }
        }
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
          const obj = c.getActiveObject();
          if (obj) {
            c.sendToBack(obj);
            c.requestRenderAll();
            e.preventDefault();
          }
        }
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
          const obj = c.getActiveObject();
          if (obj) {
            c.bringToFront(obj);
            c.requestRenderAll();
            e.preventDefault();
          }
        }
      };
      window.addEventListener("keydown", handleKey);

      return () => {
        window.removeEventListener("keydown", handleKey);
        c.dispose();
      };
    })();
    return () => {
      disposed = true;
    };
  }, [imageUrl, width, height, backgroundColor]);

  useEffect(() => {
    applyBgFilters();
  }, [applyBgFilters]);

  // Actions
  const addText = () => {
    const fabric = fabricRef.current!;
    const c = fcanvasRef.current as any;
    const text = new fabric.IText("Yeni Metin", {
      left: c.getWidth() / 2 - 50,
      top: c.getHeight() / 2 - 20,
      fill: "#ffffff",
      fontFamily: "Inter, ui-sans-serif, system-ui",
      fontSize: 48,
      textAlign: "center",
      shadow: undefined,
    });
    c.add(text);
    c.setActiveObject(text);
    c.requestRenderAll();
  };

  const addRect = () => {
    const fabric = fabricRef.current!;
    const c = fcanvasRef.current as any;
    const r = new fabric.Rect({
      left: 100,
      top: 100,
      width: 240,
      height: 120,
      rx: 12,
      ry: 12,
      fill: "rgba(255,255,255,0.1)",
      stroke: "#ffffff",
      strokeWidth: 2,
    });
    c.add(r);
    c.setActiveObject(r);
    c.requestRenderAll();
  };

  const addCircle = () => {
    const fabric = fabricRef.current!;
    const c = fcanvasRef.current as any;
    const circ = new fabric.Circle({
      left: 140,
      top: 140,
      radius: 80,
      fill: "rgba(0,0,0,0.2)",
      stroke: "#ffffff",
      strokeWidth: 2,
    });
    c.add(circ);
    c.setActiveObject(circ);
    c.requestRenderAll();
  };

  const bringForward = () => {
    const c = fcanvasRef.current as any;
    const obj = c.getActiveObject();
    if (obj) {
      c.bringForward(obj);
      c.requestRenderAll();
    }
  };
  const sendBackwards = () => {
    const c = fcanvasRef.current as any;
    const obj = c.getActiveObject();
    if (obj) {
      c.sendBackwards(obj);
      c.requestRenderAll();
    }
  };
  const lockUnlock = () => {
    const c = fcanvasRef.current as any;
    const obj = c.getActiveObject();
    if (obj) {
      const locked = !!obj.lockMovementX;
      obj.set({
        lockMovementX: !locked,
        lockMovementY: !locked,
        hasControls: locked,
        selectable: locked,
        evented: locked,
      });
      c.requestRenderAll();
    }
  };

  const exportPNG = async () => {
    const c = fcanvasRef.current as any;
    const data = c.toDataURL({ format: "png", multiplier: 1 });
    const a = document.createElement("a");
    a.href = data;
    a.download = "design.png";
    a.click();
  };

  const handleOverlayUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      const fabric = fabricRef.current!;
      const c = fcanvasRef.current as any;
      fabric.Image.fromURL(url, (img) => {
        if (!img) return;
        img.set({ left: c.getWidth() / 2 - 100, top: c.getHeight() / 2 - 100, selectable: true, evented: true });
        const maxScale = Math.min(600 / (img.width || 1), 600 / (img.height || 1));
        if (isFinite(maxScale) && maxScale > 0) {
          img.scale(maxScale);
        }
        c.add(img);
        c.setActiveObject(img);
        c.requestRenderAll();
      }, { crossOrigin: "anonymous" });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={addText} className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm">Metin Ekle</button>
        <button onClick={addRect} className="px-3 py-1.5 rounded bg-slate-700 text-white text-sm">Dikdörtgen</button>
        <button onClick={addCircle} className="px-3 py-1.5 rounded bg-slate-700 text-white text-sm">Daire</button>
        <button onClick={bringForward} className="px-3 py-1.5 rounded bg-slate-700 text-white text-sm">Öne Getir</button>
        <button onClick={sendBackwards} className="px-3 py-1.5 rounded bg-slate-700 text-white text-sm">Geri Gönder</button>
        <button onClick={lockUnlock} className="px-3 py-1.5 rounded bg-slate-700 text-white text-sm">Kilitle/Aç</button>
        <label className="px-3 py-1.5 rounded bg-slate-700 text-white text-sm cursor-pointer">
          Görsel Yükle
          <input type="file" accept="image/*" className="hidden" onChange={handleOverlayUpload} />
        </label>
        <div className="ml-auto" />
        <button onClick={exportPNG} className="px-3 py-1.5 rounded bg-emerald-600 text-white text-sm">PNG İndir</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-4">
        <div className="rounded border border-slate-700 overflow-hidden bg-black/40">
          <div className="overflow-auto p-2">
            <canvas ref={canvasRef} />
          </div>
        </div>
        <div className="rounded border border-slate-700 p-3 space-y-3 bg-slate-900/40">
          <h3 className="font-medium text-slate-100">Arka Plan Filtreleri</h3>
          <div className="space-y-2">
            <label className="block text-xs text-slate-300">Parlaklık: {brightness.toFixed(2)}</label>
            <input type="range" min={-1} max={1} step={0.01} value={brightness} onChange={(e)=>setBrightness(parseFloat(e.target.value))} />
          </div>
          <div className="space-y-2">
            <label className="block text-xs text-slate-300">Kontrast: {contrast.toFixed(2)}</label>
            <input type="range" min={-1} max={1} step={0.01} value={contrast} onChange={(e)=>setContrast(parseFloat(e.target.value))} />
          </div>
          <div className="space-y-2">
            <label className="block text-xs text-slate-300">Doygunluk: {saturation.toFixed(2)}</label>
            <input type="range" min={-1} max={1} step={0.01} value={saturation} onChange={(e)=>setSaturation(parseFloat(e.target.value))} />
          </div>
          <div className="space-y-2">
            <label className="block text-xs text-slate-300">Bulanıklık: {blur.toFixed(2)}</label>
            <input type="range" min={0} max={1} step={0.01} value={blur} onChange={(e)=>setBlur(parseFloat(e.target.value))} />
          </div>
          <div className="space-y-2">
            <label className="block text-xs text-slate-300">Arka Plan Opaklık: {opacity.toFixed(2)}</label>
            <input type="range" min={0} max={1} step={0.01} value={opacity} onChange={(e)=>setOpacity(parseFloat(e.target.value))} />
          </div>
          <p className="text-[11px] text-slate-400">İpucu: Seçili nesneleri Delete ile silebilirsiniz. ⌘/Ctrl+G ile gruplama, ⌘/Ctrl+F öne, ⌘/Ctrl+B arkaya gönderir.</p>
        </div>
      </div>
    </div>
  );
}
