"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

const FabricEditor = dynamic(() => import("@/components/FabricEditor"), { ssr: false });

export default function FabricEditorPage() {
  const search = useSearchParams();
  const img = search.get("img") || "https://images.unsplash.com/photo-1499084732479-de2c02d45fc4?w=1600&q=80&auto=format&fit=crop";
  const w = parseInt(search.get("w") || "1200", 10);
  const h = parseInt(search.get("h") || "800", 10);

  return (
    <div className="min-h-dvh p-4 md:p-6 space-y-4 text-slate-100">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Fabric.js Editor (Beta)</h1>
        <a className="text-sm text-blue-400 underline" href={`/app/my-designs?img=${encodeURIComponent(img)}`}>My Designs'e Dön</a>
      </div>
      <FabricEditor imageUrl={img} width={w} height={h} />
      <div className="text-xs text-slate-400">
        İpucu: URL parametreleri ile boyutları ayarlayabilirsiniz. Örn: /fabric-editor?img=...&w=1500&h=1000
      </div>
    </div>
  );
}
