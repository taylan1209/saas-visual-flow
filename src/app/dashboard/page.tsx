"use client";
import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [uploads, setUploads] = useState<Array<{ url: string; name: string }>>([]);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    const accepted = files.filter(f => /image\/(jpeg|jpg|png)/i.test(f.type) || /\.(jpe?g|png)$/i.test(f.name));
    if (accepted.length === 0) return;
    accepted.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setUploads(prev => [...prev, { url: String(reader.result || ""), name: file.name }]);
      reader.readAsDataURL(file);
    });
  }, []);
  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); }, []);

  const selectAndGo = (url: string) => {
    try {
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
    <div className="flex min-h-dvh w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-200" onDrop={onDrop} onDragOver={onDragOver}>
      <aside className="flex w-64 flex-col border-r border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Saas Design</h1>
        </div>
        <nav className="mt-8 flex flex-1 flex-col">
          <ul className="flex flex-col gap-2">
            <li>
              <a className="flex items-center gap-3 rounded-lg bg-blue-600/10 px-3 py-2 text-blue-600 dark:bg-blue-600/20" href="#">
                <svg className="fill-current" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z"/></svg>
                <span className="text-sm font-medium">Home</span>
              </a>
            </li>
            <li>
              <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-blue-600/10 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-blue-600/20 dark:hover:text-blue-600" href="/templates">
                <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M104,40H56A16,16,0,0,0,40,56v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,104,40Zm0,64H56V56h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,64H152V56h48v48Zm-96,32H56a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,104,136Zm0,64H56V152h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,200,136Zm0,64H152V152h48v48Z"/></svg>
                <span className="text-sm font-medium">Templates</span>
              </a>
            </li>
            <li>
              <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-blue-600/10 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-blue-600/20 dark:hover:text-blue-600" href="#">
                <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216V176ZM104,120v24a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm32-16v40a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm32-16v56a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Z"/></svg>
                <span className="text-sm font-medium">Analytics</span>
              </a>
            </li>
            <li>
              <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-blue-600/10 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-blue-600/20 dark:hover:text-blue-600" href="/settings">
                <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Z"/></svg>
                <span className="text-sm font-medium">Settings</span>
              </a>
            </li>
          </ul>
        </nav>
        <div className="mt-auto">
          <button className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600/90">New Design</button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <header className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">Dashboard</h1>
                <p className="mt-2 text-slate-400">Drag & drop an image anywhere to add it to Your Uploads. Click any card to open in the editor as background.</p>
              </div>
              <a href="/templates" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500">Create new</a>
            </div>
          </header>

          <section>
            <h2 className="mb-4 text-xl font-bold text-white">Recent Designs</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { url: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=1200&q=80&auto=format&fit=crop', title: 'Football Match Poster', date: '2 days ago' },
                { url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&q=80&auto=format&fit=crop', title: 'Basketball Derby Night', date: '5 days ago' },
                { url: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=1200&q=80&auto=format&fit=crop', title: 'Tennis Open Finals', date: '2 weeks ago' },
              ].map((card) => (
                <a className="group block" key={card.title} href={`/fabric-editor?img=${encodeURIComponent(card.url)}`}>
                  <div className="mb-3 w-full overflow-hidden rounded-xl ring-1 ring-slate-800/70 bg-slate-900">
                    <div className="h-48 w-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105" style={{ backgroundImage: `url("${card.url}")` }} />
                  </div>
                  <h3 className="font-semibold text-white">{card.title}</h3>
                  <p className="text-sm text-slate-400">{card.date}</p>
                </a>
              ))}
            </div>
          </section>

          {uploads.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-4 text-xl font-bold text-white">Your Uploads</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {uploads.map((u, idx) => (
                  <button key={`${u.name}-${idx}`} className="group block text-left" onClick={() => selectAndGo(u.url)}>
                    <div className="mb-3 w-full overflow-hidden rounded-xl ring-1 ring-slate-800/70 bg-slate-900">
                      <div className="h-40 w-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105" style={{ backgroundImage: `url(${JSON.stringify(u.url)})` }} />
                    </div>
                    <div className="text-xs text-slate-400 truncate">{u.name || 'Upload'}</div>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-slate-500">Tip: Drag & drop images anywhere on the page.</p>
            </section>
          )}

          <section className="mt-10">
            <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">Usage Analytics</h2>
            <div className="grid auto-rows-min grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Designs</p>
                <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">125</p>
                <p className="mt-1 text-sm font-medium text-green-500">+10%</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Templates</p>
                <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">32</p>
                <p className="mt-1 text-sm font-medium text-green-500">+5%</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Exports</p>
                <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">540</p>
                <p className="mt-1 text-sm font-medium text-green-500">+15%</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
