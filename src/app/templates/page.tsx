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
    <div className="min-h-dvh bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Templates</h1>
            <p className="mt-1 text-sm text-slate-400">Pick a sports poster or drop your own image. We’ll open the editor with it as background.</p>
          </div>
          <a href="/dashboard" className="rounded-md bg-slate-800 px-3 py-2 text-sm text-slate-200 ring-1 ring-slate-700 hover:bg-slate-700">Back to Dashboard</a>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 items-start">
          {/* Dropzone / Gallery */}
          <div className="space-y-6">
            <div className="rounded-xl ring-1 ring-slate-800/70 bg-slate-900/50 p-6">
              <div
                className={`h-72 rounded-xl ${isDragging ? 'ring-2 ring-emerald-500 bg-slate-900/50' : 'ring-1 ring-slate-800 bg-slate-950/60'} flex items-center justify-center`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="preview" className="max-h-64 object-contain" />
                ) : (
                  <div className="text-center text-slate-400">
                    <div className="text-sm font-medium">Drag & drop an image</div>
                    <div className="text-[11px]">or paste a URL in the panel</div>
                  </div>
                )}
              </div>
              <div className="mt-3 text-[11px] text-slate-500">Tip: You can also drag & drop directly into the Fabric editor later to replace the background.</div>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Sports Posters</h2>
                <span className="text-[11px] text-slate-400">Curated</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  { url: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=1200&q=80&auto=format&fit=crop', title: 'Football' },
                  { url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&q=80&auto=format&fit=crop', title: 'Basketball' },
                  { url: 'https://images.unsplash.com/photo-1517647366316-0f115a8f3c56?w=1200&q=80&auto=format&fit=crop', title: 'Volleyball' },
                  { url: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=1200&q=80&auto=format&fit=crop', title: 'Tennis' },
                ].map((c, i) => (
                  <a key={`${c.title}-${i}`} href={`/fabric-editor?img=${encodeURIComponent(c.url)}`} className="group block">
                    <div className="overflow-hidden rounded-lg ring-1 ring-slate-800 bg-slate-900">
                      <div className="h-40 w-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105" style={{ backgroundImage: `url(${JSON.stringify(c.url)})` }} />
                    </div>
                    <div className="mt-1 text-xs text-slate-400">{c.title}</div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Side panel */}
          <div className="rounded-xl ring-1 ring-slate-800 bg-slate-900/60 p-4 space-y-3">
            <div>
              <label className="block text-xs text-slate-300 mb-1">Image URL</label>
              <input
                className="w-full rounded bg-slate-800/70 border border-slate-700 px-3 py-2 text-sm text-slate-100"
                placeholder="https://..."
                value={imageUrl}
                onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setImageUrl(e.target.value)}
              />
            </div>
            <button
              onClick={goSelect}
              disabled={!imageUrl.trim()}
              className="w-full px-3 py-2 rounded bg-emerald-600 disabled:bg-slate-700 text-white text-sm"
            >
              Select & Open in Editor
            </button>
            <p className="text-[11px] text-slate-400">We’ll open the Fabric editor and set this image as the background.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

