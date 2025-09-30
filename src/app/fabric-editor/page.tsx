"use client";
import React, { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";

const FabricEditor = dynamic(() => import("@/components/FabricEditor"), { ssr: false });

type Template = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  width: number;
  height: number;
};

export default function FabricEditorPage() {
  const templates: Template[] = useMemo(() => [
    {
      id: "football-classic",
      title: "Match Day",
      subtitle: "Football • Poster",
      imageUrl:
        "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=1600&q=80&auto=format&fit=crop",
      width: 1200,
      height: 800,
    },
    {
      id: "basketball-derby",
      title: "Derby Night",
      subtitle: "Basketball • Poster",
      imageUrl:
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1600&q=80&auto=format&fit=crop",
      width: 1200,
      height: 800,
    },
    {
      id: "volleyball-cup",
      title: "Cup Final",
      subtitle: "Volleyball • Poster",
      imageUrl:
        "https://images.unsplash.com/photo-1517647366316-0f115a8f3c56?w=1600&q=80&auto=format&fit=crop",
      width: 1200,
      height: 800,
    },
    {
      id: "tennis-open",
      title: "Open Finals",
      subtitle: "Tennis • Poster",
      imageUrl:
        "https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=1600&q=80&auto=format&fit=crop",
      width: 1200,
      height: 800,
    },
  ], []);

  const [selected, setSelected] = useState<Template>(templates[0]);

  // If coming from /templates with an uploadKey, resolve it to a data URL
  useEffect(() => {
    try {
      const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : "");
      const uploadKey = params.get('uploadKey');
      const directImg = params.get('img');
      if (uploadKey && typeof window !== 'undefined') {
        const dataUrl = window.sessionStorage.getItem(uploadKey);
        if (dataUrl) {
          setSelected((prev) => ({ ...prev, imageUrl: dataUrl }));
        }
      } else if (directImg) {
        setSelected((prev) => ({ ...prev, imageUrl: directImg }));
      }
    } catch {}
  }, []);

  return (
    <div className="min-h-dvh grid grid-cols-1 md:grid-cols-[280px_1fr] bg-slate-950 text-slate-100">
      {/* Left Sidebar - Templates */}
      <aside className="border-r border-slate-800 p-3 md:p-4 space-y-4 bg-slate-950/60">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-wide">Templates</h2>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Sports</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">Sports match posters: quickly edit team logos, date & time, stadium and league.</p>
        <div className="grid grid-cols-1 gap-3">
          {templates.map(t => (
            <button
              key={t.id}
              onClick={() => setSelected(t)}
              className={`text-left rounded overflow-hidden border ${selected.id === t.id ? 'border-emerald-500 ring-1 ring-emerald-500/30' : 'border-slate-800'} hover:border-slate-700 transition`}
            >
              <div className="aspect-[3/2] w-full bg-slate-900 overflow-hidden">
                <img src={t.imageUrl} alt={t.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-2">
                <div className="text-[13px] font-medium">{t.title}</div>
                <div className="text-[11px] text-slate-400">{t.subtitle}</div>
              </div>
            </button>
          ))}
        </div>
        <div className="pt-2 text-[11px] text-slate-500">A focused set of templates: football, basketball, volleyball and tennis.</div>
      </aside>

      {/* Main - Editor */}
      <main className="p-3 md:p-5 space-y-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <h1 className="text-base md:text-lg font-semibold">Sports Poster Editor</h1>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Beta</span>
          </div>
          <div className="flex items-center gap-2">
            <a className="text-xs text-blue-400 underline" href="/app/my-designs">My Designs</a>
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/30">
          <FabricEditor imageUrl={selected.imageUrl} width={selected.width} height={selected.height} />
        </div>

        <div className="text-[11px] text-slate-400">Click a template to change the background. Edit team names, match date and extras from the right panel.</div>
      </main>
    </div>
  );
}
