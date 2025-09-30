"use client";
import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

export default function TemplatesPage() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const dt = e.dataTransfer;
    if (!dt) return;
    const file = dt.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setImageUrl(String(reader.result || ""));
      reader.readAsDataURL(file);
      return;
    }
    const url = dt.getData("text/uri-list") || dt.getData("text/plain");
    if (url) setImageUrl(url.trim());
  }, []);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback(() => setIsDragging(false), []);

  const goSelect = () => {
    const url = imageUrl.trim();
    if (!url) return;
    try {
      // If data URL, store in sessionStorage to avoid extremely long URLs
      if (typeof window !== 'undefined' && url.startsWith('data:')) {
        const key = `upload-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
        window.sessionStorage.setItem(key, url);
        router.push(`/fabric-editor?uploadKey=${encodeURIComponent(key)}`);
      } else {
        router.push(`/fabric-editor?img=${encodeURIComponent(url)}`);
      }
    } catch {
      router.push(`/fabric-editor?img=${encodeURIComponent(url)}`);
    }
  };

  return (
    <div className="min-h-dvh p-6 text-slate-100 bg-slate-950">
      <h1 className="text-xl font-semibold mb-4">Templates</h1>
      <div className="grid md:grid-cols-[1fr_360px] gap-6">
        <div className="rounded-lg border border-slate-800 p-6 bg-slate-900/40">
          <div
            className={`h-72 rounded border-2 ${isDragging ? 'border-emerald-500' : 'border-dashed border-slate-700'} flex items-center justify-center bg-slate-950/50`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="preview" className="max-h-64 object-contain" />
            ) : (
              <div className="text-center text-slate-400">
                <div className="text-sm">Drag & drop an image here</div>
                <div className="text-xs">or paste a URL below</div>
            </div>
          )}
          </div>
                </div>
        <div className="space-y-3">
          <label className="block text-xs text-slate-300">Image URL</label>
          <input
            className="w-full rounded bg-slate-800/70 border border-slate-700 px-3 py-2 text-sm text-slate-100"
            placeholder="https://..."
            value={imageUrl}
            onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setImageUrl(e.target.value)}
          />
          <button
            onClick={goSelect}
            disabled={!imageUrl.trim()}
            className="px-3 py-2 rounded bg-emerald-600 disabled:bg-slate-700 text-white text-sm"
          >
            Select
            </button>
          <p className="text-[11px] text-slate-400">Select will open the editor and set this image as the background.</p>
        </div>
      </div>
    </div>
  );
}

