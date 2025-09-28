"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

export default function MyDesignsPage() {
  const search = useSearchParams();
  const img = search.get("img") || "https://lh3.googleusercontent.com/aida-public/AB6AXuBndbq1uS3aC4pzCJhzgXH1RZ1ZX4LWC8wlGGQ2esOe7dLAZQC3lYJAB3xKv4VpW6iTrTYG4d8Mtzu4gu-YooH3m1C53Qsn3r7rFXrPnRrt8qYIwFpcDJNVPzpI370z_6_jYPpyPAdO_jAEfsRJre_48oyusATJNTCOQzbrVjMayHxtKiStDFotP5GtVJpwifDNSfAx6g0wUSfEDo4Z7VeVk7hkZ2FsweqRyctDJchbHcMS6KOjmU3pE5wcOX8UawMPaohSIJsPVbxT";
  const name = (search.get("name") || "design").replace(/[^a-z0-9-_]/gi, "_");
  const exportHref = useMemo(() => {
    const params = new URLSearchParams();
    params.set("img", img);
    params.set("name", name);
    return `/export?${params.toString()}`;
  }, [img, name]);

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
              <a href={exportHref} className="flex h-10 items-center justify-center rounded-lg bg-slate-800 px-4 text-sm font-bold text-white hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600">
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>
                Export
              </a>
            </div>
          </div>

          <div className="flex w-full flex-grow items-center justify-center p-8">
            <div className="aspect-[3/2] w-full overflow-hidden rounded-xl shadow-lg">
              <div className="h-full w-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${JSON.stringify(img)})` }} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

