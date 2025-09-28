export default function SettingsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50 text-slate-800 dark:bg-slate-900 dark:text-slate-200">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Saas Design</h1>
        </div>
        <div className="hidden items-center gap-6 md:flex">
          <a className="text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-500" href="/dashboard">Dashboard</a>
          <a className="text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-500" href="/templates">Templates</a>
          <a className="text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-500" href="/my-designs">My Designs</a>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-blue-100 hover:text-blue-600 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-700/60" aria-label="Help">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 17v.01"/><path d="M12 13a4 4 0 1 0-4-4"/><path d="M12 17c0-1.5.5-2 2-3"/></svg>
          </button>
          <div className="size-10 rounded-full bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCUXFWgBcU07q7-2rf-zwizbf-QbiRVttLstJ_tFDjAhLgcIRhGAaI-r6iEAFhk8lxcWeHKJJRef2Oo4NIXbVJA-GGVAb9jUIdCJnQUjiyIme7svn7Oet4nPbNmlz4MOGT9g4pRc8BuIW84Ui4MIMjjosKemJht40LBIoj_K1CRdV9wCfWzhx5MgVICTTg-y_6oCd8gxBhb-h8sTQkE1kCabhQRG2otMFpRCTXfr9wJcjq3VR_HAsw-t8cowjP4-6rsFUDxOy4HUNDX")' }} />
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Account Settings</h1>

          <div className="mt-8 grid grid-cols-1 gap-12">
            <div className="space-y-8">
              {/* Personal Information */}
              <section className="rounded-lg border border-slate-200/70 bg-white p-6 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/40">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Personal Information</h2>
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="full-name">Full Name</label>
                    <input className="mt-1 block w-full rounded-lg border-slate-300 bg-slate-50 p-3 text-slate-900 focus:border-blue-600 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" id="full-name" placeholder="Jane Doe" type="text" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="email">Email Address</label>
                    <input className="mt-1 block w-full rounded-lg border-slate-300 bg-slate-50 p-3 text-slate-900 focus:border-blue-600 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" id="email" placeholder="jane.doe@example.com" type="email" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="password">Password</label>
                    <input className="mt-1 block w-full rounded-lg border-slate-300 bg-slate-50 p-3 text-slate-900 focus:border-blue-600 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" id="password" placeholder="••••••••" type="password" />
                  </div>
                </div>
                <div className="mt-6">
                  <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600/90">Update Personal Info</button>
                </div>
              </section>

              {/* Company Details */}
              <section className="rounded-lg border border-slate-200/70 bg-white p-6 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/40">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Company Details</h2>
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="company-name">Company Name</label>
                    <input className="mt-1 block w-full rounded-lg border-slate-300 bg-slate-50 p-3 text-slate-900 focus:border-blue-600 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" id="company-name" placeholder="Creative Inc." type="text" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="company-size">Company Size</label>
                    <input className="mt-1 block w-full rounded-lg border-slate-300 bg-slate-50 p-3 text-slate-900 focus:border-blue-600 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" id="company-size" placeholder="11-50 employees" type="text" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="industry">Industry</label>
                    <input className="mt-1 block w-full rounded-lg border-slate-300 bg-slate-50 p-3 text-slate-900 focus:border-blue-600 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" id="industry" placeholder="Marketing & Advertising" type="text" />
                  </div>
                </div>
                <div className="mt-6">
                  <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600/90">Update Company Details</button>
                </div>
              </section>

              {/* Subscription Plan */}
              <section className="rounded-lg border border-slate-200/70 bg-white p-6 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/40">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Subscription Plan</h2>
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Current Plan</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">Pro Plan</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Billing Cycle</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">Monthly</p>
                  </div>
                </div>
                <div className="mt-6">
                  <button className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">Manage Subscription</button>
                </div>
              </section>

              {/* Notifications */}
              <section className="rounded-lg border border-slate-200/70 bg-white p-6 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/40">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Notifications</h2>
                <div className="mt-6 space-y-4">
                  <label className="flex items-center">
                    <input defaultChecked className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600" type="checkbox" />
                    <span className="ml-3 text-sm text-slate-700 dark:text-slate-300">Email notifications for new features</span>
                  </label>
                  <label className="flex items-center">
                    <input defaultChecked className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600" type="checkbox" />
                    <span className="ml-3 text-sm text-slate-700 dark:text-slate-300">Email notifications for account updates</span>
                  </label>
                  <label className="flex items-center">
                    <input className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600" type="checkbox" />
                    <span className="ml-3 text-sm text-slate-700 dark:text-slate-300">In-app notifications for team activity</span>
                  </label>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

