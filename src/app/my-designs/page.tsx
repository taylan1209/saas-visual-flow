"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export default function MyDesignsPage() {
  const bgImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuBndbq1uS3aC4pzCJhzgXH1RZ1ZX4LWC8wlGGQ2esOe7dLAZQC3lYJAB3xKv4VpW6iTrTYG4d8Mtzu4gu-YooH3m1C53Qsn3r7rFXrPnRrt8qYIwFpcDJNVPzpI370z_6_jYPpyPAdO_jAEfsRJre_48oyusATJNTCOQzbrVjMayHxtKiStDFotP5GtVJpwifDNSfAx6g0wUSfEDo4Z7VeVk7hkZ2FsweqRyctDJchbHcMS6KOjmU3pE5wcOX8UawMPaohSIJsPVbxT";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [projectName, setProjectName] = useState("Saas Design Project");
  const [showExport, setShowExport] = useState(false);
  const [fileType, setFileType] = useState<"jpg" | "png">("jpg");
  const [resolution, setResolution] = useState<"standard" | "high" | "maximum">("standard");
  const [downloading, setDownloading] = useState(false);

  function drawToCanvas(width = 960, height = 640) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = imgRef.current;
    if (img && img.complete) {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
    }
  }

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = bgImage;
    img.onload = () => {
      imgRef.current = img;
      drawToCanvas();
    };
    return () => {
      imgRef.current = null;
    };
  }, []);

  const previewDataUrl = useMemo(() => {
    const c = canvasRef.current;
    return c ? c.toDataURL("image/png") : "";
  }, [showExport]);

  function slugify(name: string) {
    return name.trim().toLowerCase().replace(/[^a-z0-9-_]+/g, "_").replace(/^_|_$/g, "") || "design";
  }

  function handleSave() {
    try {
      const c = canvasRef.current;
      if (!c) return;
      const dataUrl = c.toDataURL("image/png");
      const payload = { name: projectName, preview: dataUrl, updatedAt: Date.now() };
      localStorage.setItem("currentDesign", JSON.stringify(payload));
      alert("Design saved.");
    } catch (_) {
      alert("Save failed.");
    }
  }

  async function handleExportDownload() {
    try {
      setDownloading(true);
      const img = imgRef.current;
      if (!img) throw new Error("image not ready");
      const targetWidth = resolution === "maximum" ? 3000 : resolution === "high" ? 2000 : 1000;
      const scale = targetWidth / img.width;
      const width = Math.round(img.width * scale);
      const height = Math.round(img.height * scale);
      const tmp = document.createElement("canvas");
      tmp.width = width;
      tmp.height = height;
      const ctx = tmp.getContext("2d");
      if (!ctx) throw new Error("canvas ctx");
      ctx.drawImage(img, 0, 0, width, height);
      const mime = fileType === "png" ? "image/png" : "image/jpeg";
      const dataUrl = tmp.toDataURL(mime, 0.92);
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${slugify(projectName)}.${fileType}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      console.error(e);
      alert("Export failed.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50 text-slate-800 dark:bg-slate-900 dark:text-slate-200">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-200 px-6 py-3 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold">Saas Design</h2>
        </div>
        <div className="flex flex-1 justify-end gap-2">
          <button className="flex h-10 w-10 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800" aria-label="Help">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 17v.01"/><path d="M12 13a4 4 0 1 0-4-4"/><path d="M12 17c0-1.5.5-2 2-3"/></svg>
          </button>
          <div
            className="h-10 w-10 rounded-full bg-cover bg-center"
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDkX4tMIEHYQ3vbnLNjq8NIOsly58TWNJTalZ2cYQvo-FpdJh6nJzzWXRyx0CFfDbC2fFTN964R7Wl__HyBher3OI3H6n3y3w-Vfq4iKtNFWAcgXsiknRNDWhLrsRHtyGWtnGf2F0UMZCm4jojprNDz2Te_eGwo--eI5DLetLgC3IRQIGWALhI4kJSC1y8DqXSYzwfoCBLRkzWj8ZDMBAMgI-xx2nuGb2k832HUapAK4rW2n5765REDhYwLiKK1v9nkR7v1umq_ldXh")' }}
          />
        </div>
      </header>

      <div className="flex flex-1">
        {/* Left panel */}
        <aside className="flex w-80 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="p-4">
            <h3 className="px-2 text-lg font-bold">Templates</h3>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {["https://lh3.googleusercontent.com/aida-public/AB6AXuCgMMwLo97eBtFI7-9u5r0ChvJp5TRDH5PHtGlBf6GWQwBDFKiJjRhu-SDxdPFCWczirT6XUuwNS22RcvDmHCq6cq3dkFr0wmodRlU3oO0-DcxbwTRfHWGjn7W12NbUzchdkTc1sjxN4cSwKxw45so1zbHliy6voe3Zdu0Vo8ebT8iMAykImMsWBP0uyOrQrkTw7DuIcWOTbGWme-53mJV7NXSPYAjk1kHmqRe98KgP5twWFsuA-y_CfwkRXwoRjjryxA53is3dveGT",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuB0Rro5L2NTgy_K2mktF0ju-YhkwSRpw4a2OWuKnQ1rzta4PleZq6Lguy_xYVaFcUsc58yEaZ9teHnbBMIGZDRVct38TKE-HyRkrWPxRCsRSEOJ5nokL8CafLR9ncUeM5su1s6gH1nC5Dc2V4gRLcq1XhWfzkl6ZwD4Qs4cJwBCbO1kaM0zEKsw3zKeOL9esbZfzg08nGo2wptDflJkxcl0oOjE_-jpyZGIYoprSSZiOHZscicb4r7gYKRMLaiGNrFKbp_T1Yy-H3IB",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuADOy9wUmsGVnmedTylWDBHFI2WP4pvEVbbNDrcvuQlVl5y_uPOgiLjBlxQrLK8tWsdQBjkr6i8o4qrLu-1YHQn_IIObyDVlE9x9UWY_DNn83irsOHXKoxvqVHldeuDme1Q3mwQFDZefWpwsrU-mP4StHQ9NfHSjP3x_9UVXNe-GpVhk_tJzvzQynA5o7HZRc_pdaOkq0HcTqDlKP14wTJbeN2NV4HW_HrIaYUtF0smHVq-f_dnhzSJzRdpFVIkKdGOzOe7qRCUkY_R"].map((u) => (
                <div key={u} className="aspect-square w-full rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${JSON.stringify(u)})` }} />
              ))}
            </div>
          </div>
          <div className="flex-grow">
            <h3 className="px-6 text-lg font-bold">Elements</h3>
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
              <div className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white p-3 hover:border-blue-600 dark:border-slate-700 dark:bg-slate-900">
                <svg className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16"/><path d="M4 12h10"/><path d="M4 17h7"/></svg>
                <h2 className="font-bold">Heading</h2>
              </div>
              <div className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white p-3 hover:border-blue-600 dark:border-slate-700 dark:bg-slate-900">
                <h2 className="font-bold">Subheading</h2>
              </div>
              <div className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white p-3 hover:border-blue-600 dark:border-slate-700 dark:bg-slate-900">
                <h2 className="font-bold">Body</h2>
              </div>
            </div>
          </div>
        </aside>

        {/* Main editor area */}
        <main className="flex flex-1 flex-col">
          <div className="flex items-center justify-between gap-2 border-b border-slate-200 p-3 dark:border-slate-800">
            <div className="flex gap-1">
              {[
                { label: 'Undo', path: <path d="M3 7v6h6"/>, extra:<path d="M3 13a9 9 0 1 0 3-6.7L3 7"/> },
              ].map(() => null)}
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
              <input
                className="h-10 w-48 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800"
                placeholder="Project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
              <button onClick={handleSave} className="flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-600/90">
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V7l4-4h10l4 4v12a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8"/><path d="M7 3v4h8"/></svg>
                Save
              </button>
              <button onClick={() => setShowExport(true)} className="flex h-10 items-center justify-center rounded-lg bg-slate-200 px-4 text-sm font-semibold text-slate-900 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600">
                Export
              </button>
            </div>
          </div>

          <div className="flex w-full flex-grow items-center justify-center p-8">
            <div className="w-full max-w-5xl overflow-hidden rounded-xl shadow-lg">
              <canvas ref={canvasRef} className="h-[480px] w-full" />
            </div>
          </div>
        </main>
          {showExport && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowExport(false)} />
              <div className="relative z-10 w-full max-w-xl rounded-xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Export</h3>
                  <button onClick={() => setShowExport(false)} className="h-8 w-8 rounded hover:bg-slate-100 dark:hover:bg-slate-800">✕</button>
                </div>
                <div className="mb-4 grid grid-cols-3 gap-3">
                  <label className="cursor-pointer text-center">
                    <input className="peer sr-only" type="radio" name="filetype" checked={fileType === 'jpg'} onChange={() => setFileType('jpg')} />
                    <div className="rounded-lg border border-slate-300 bg-white py-2 peer-checked:border-blue-600 peer-checked:ring-2 peer-checked:ring-blue-600/30 dark:border-slate-700 dark:bg-slate-900 dark:peer-checked:bg-blue-600/20">JPG</div>
                  </label>
                  <label className="cursor-pointer text-center">
                    <input className="peer sr-only" type="radio" name="filetype" checked={fileType === 'png'} onChange={() => setFileType('png')} />
                    <div className="rounded-lg border border-slate-300 bg-white py-2 peer-checked:border-blue-600 peer-checked:ring-2 peer-checked:ring-blue-600/30 dark:border-slate-700 dark:bg-slate-900 dark:peer-checked:bg-blue-600/20">PNG</div>
                  </label>
                </div>
                <div className="mb-4 grid grid-cols-3 gap-3">
                  {(['standard','high','maximum'] as const).map((opt) => (
                    <label key={opt} className="cursor-pointer text-center">
                      <input className="peer sr-only" type="radio" name="res" checked={resolution===opt} onChange={() => setResolution(opt)} />
                      <div className="rounded-lg border border-slate-300 bg-white py-2 capitalize peer-checked:border-blue-600 peer-checked:ring-2 peer-checked:ring-blue-600/30 dark:border-slate-700 dark:bg-slate-900 dark:peer-checked:bg-blue-600/20">{opt}</div>
                    </label>
                  ))}
                </div>
                <div className="mb-4 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="aspect-[4/3] w-full bg-cover bg-center" style={{ backgroundImage: `url(${JSON.stringify(previewDataUrl)})` }} />
                </div>
                <div className="flex gap-3">
                  <button onClick={handleExportDownload} disabled={downloading} className="flex-1 rounded-lg bg-slate-200 py-2 font-semibold hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-700/60 dark:hover:bg-slate-600/60">{downloading? 'Preparing…':'Download'}</button>
                  <button onClick={() => { navigator.clipboard.writeText(window.location.href); }} className="flex-1 rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-600/90">Share</button>
                </div>
              </div>
            </div>
          )}

      </div>
    </div>
  );
}

