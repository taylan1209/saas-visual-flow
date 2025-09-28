"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ExportPage() {
  const search = useSearchParams();
  const imgParam = search.get("img") || "https://lh3.googleusercontent.com/aida-public/AB6AXuDJ0mCryla5IQF59QTpsXnJ8HQmPK2zDe3c-XpS2E7BTJAXxW8b81aHsBGeosTNR-T1AlvAFUrWNgVrIpU3hR_i-y2mqJo27iNwA0MBvLXrkvzf_4FhyC0IEbecVfgs_qW6pTnb9R692yS8xmueNWETN394Yw-1mRikdp6b_-cnz-pjFLdw3YBr7o0M-tOssIb2zcHLiQ_z1bXRR0OyWKCrEkMrSob3FfqZfkdgn4yGTLrd6TY7lm_gf3-AS3u1bFQZFLSTgbh_6Znb";

  const [fileType, setFileType] = useState<"jpg" | "png">("jpg");
  const [resolution, setResolution] = useState<"standard" | "high" | "maximum">("standard");
  const [downloading, setDownloading] = useState(false);

  const targetWidth = useMemo(() => {
    switch (resolution) {
      case "high":
        return 2000;
      case "maximum":
        return 3000;
      default:
        return 1000;
    }
  }, [resolution]);

  async function handleDownload() {
    try {
      setDownloading(true);
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imgParam;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Image load failed"));
      });

      const scale = targetWidth / img.width;
      const width = Math.round(img.width * scale);
      const height = Math.round(img.height * scale);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");
      ctx.drawImage(img, 0, 0, width, height);

      const mime = fileType === "png" ? "image/png" : "image/jpeg";
      const dataUrl = canvas.toDataURL(mime, 0.92);

      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `design.${fileType}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      console.error(e);
      alert("Export sırasında bir sorun oluştu. Lütfen tekrar deneyin.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 font-sans text-slate-800 dark:bg-slate-900 dark:text-slate-200">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-200 px-6 py-3 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 text-blue-600">
            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold">Creative Studio</h2>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex size-10 items-center justify-center rounded-full bg-slate-100 transition-colors hover:bg-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-700/50" aria-label="Help">
            <svg className="h-6 w-6 text-slate-600 dark:text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 17v.01"/><path d="M12 13a4 4 0 1 0-4-4"/><path d="M12 17c0-1.5.5-2 2-3"/></svg>
          </button>
          <div className="size-10 rounded-full bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCSZ-UEOGj3pfzICZg3-fWCb-tZalAeQd5UjQNkfSShK1K_R0oVHpkL4ZFhwZ4WKzTbdOcGNMSvqT1YPgUmErPbKVtXOvi0mzTVuPuft-NvI0R06PsrulEa--w-rhfkq2r7rqf6NA46TJojesBui_EWjBAhJWWlJjqeixM7iA1ihwEG3jrrmuFeP3rJCfQz9-5RN74XgpIGlzu3seQ0dWMSbho_hl-ziCoz4SToZ_WcVKl1Pqz33KkvPOg2peRAWRy08FJIkR0HWwc0")' }} />
        </div>
      </header>

      {/* Body */}
      <main className="flex flex-1 items-center justify-center py-10">
        <div className="mx-auto w-full max-w-xl px-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Export your design</h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">Select your preferred format and options to export your creative.</p>
          </div>

          <div className="space-y-8">
            {/* File type */}
            <section>
              <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">File type</h3>
              <div className="flex flex-wrap gap-3">
                <label className="flex-1 cursor-pointer">
                  <input className="peer sr-only" name="file-type" type="radio" value="jpg" checked={fileType === "jpg"} onChange={() => setFileType("jpg")} />
                  <div className="rounded-lg border border-slate-300 bg-white py-2 text-center peer-checked:border-blue-600 peer-checked:ring-2 peer-checked:ring-blue-600/30 dark:border-slate-700 dark:bg-slate-900 dark:peer-checked:bg-blue-600/20">JPG</div>
                </label>
                <label className="flex-1 cursor-pointer">
                  <input className="peer sr-only" name="file-type" type="radio" value="png" checked={fileType === "png"} onChange={() => setFileType("png")} />
                  <div className="rounded-lg border border-slate-300 bg-white py-2 text-center peer-checked:border-blue-600 peer-checked:ring-2 peer-checked:ring-blue-600/30 dark:border-slate-700 dark:bg-slate-900 dark:peer-checked:bg-blue-600/20">PNG</div>
                </label>
              </div>
            </section>

            {/* Resolution */}
            <section>
              <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">Resolution</h3>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { key: "standard", label: "Standard" },
                  { key: "high", label: "High" },
                  { key: "maximum", label: "Maximum" },
                ] as const).map((opt) => (
                  <label key={opt.key} className="cursor-pointer">
                    <input className="peer sr-only" name="resolution" type="radio" value={opt.key} checked={resolution === opt.key} onChange={() => setResolution(opt.key)} />
                    <div className="rounded-lg border border-slate-300 bg-white py-2 text-center peer-checked:border-blue-600 peer-checked:ring-2 peer-checked:ring-blue-600/30 dark:border-slate-700 dark:bg-slate-900 dark:peer-checked:bg-blue-600/20">{opt.label}</div>
                  </label>
                ))}
              </div>
            </section>

            {/* Preview */}
            <section>
              <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">Preview</h3>
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                <div className="aspect-[4/3] w-full bg-cover bg-center" style={{ backgroundImage: `url(${JSON.stringify(imgParam)})` }} />
              </div>
            </section>

            {/* Actions */}
            <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 dark:border-slate-800 sm:flex-row">
              <button onClick={handleDownload} disabled={downloading} className="flex-1 rounded-lg bg-slate-200 py-3 text-center font-semibold text-slate-800 hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-700/60 dark:text-slate-200 dark:hover:bg-slate-600/60">
                {downloading ? "Preparing..." : "Download"}
              </button>
              <button onClick={() => { navigator.clipboard.writeText(window.location.href); }} className="flex-1 rounded-lg bg-blue-600 py-3 text-center font-semibold text-white hover:bg-blue-600/90">
                Share
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

