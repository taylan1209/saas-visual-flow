"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function TemplatesPage() {
  const cards = [
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhjjpqrylXlIimWSvjsobc48plVkrwWeFc7dNkbhWGur03d3Jb8ZgLVPtrZb7L4YiaCRfIhaEywRFPTjMQsBE7TxZUPmvdgLYdKmFp3Qyw0YpIKF3nqTNYhqqT1Uq7hAVR5kGBCEku9JqrE6pRV0sWPJQO0StpXGkggY7QwxiXdMdkFCWEsCA_9dpUTBkBV7G_dA4lC9645XLEEq_BLYnEdcD_rNkmaBtduKb07WHaLvv_aIyrbAE3CGSEoF9pmBAiIp-jwuiKxI3-",
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_l-oeCo9xJnIiEdJ5-wUuPEkllsDheiII_u0jjiG1RfEMrcgF0WfabcAGGymYeGhECo1YlhIyJhACo34s8J-74tMP68XfOZQTgvkKhQkjg0ILb9IhUAD_Eq8KO-hOk8TVLZfhYMb8rudtV0Rv5B-o67fP-uUrry59gr2IOzG3DvLHzd7sPaGaiYHmB7iKEqwxHjN343DGPx0xbcUUHxyoVzA-Td2p_2sfkfcUkkUTE0mxXo_QaUtd2rQKOP2HdWLFnngoIWMhSe5H",
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHcWq6Iy8CoF9LDqz9nOWMlrHKoBPszrLFiT5BUJEFop1IGAgxILyVTSWc8U7XNOJHVo4d9y_fiPtwIcpRs_AY-hJk5c_5G7sRPwOUEe6tzGSW4vWmS7NYw3k0us65Ez0VKQZ6GSX-Lc91KDDMdG41iFQSNw7jZRGnwnSy_M3JCcxfpwflP3uLTdTRD2udE5MIp_x7-soO4pNHOv_dKC5WdITu2b6dpi6s8zXlwL0lWtMR08v2ZupMx7GeeHGKxQLp3N2OSFYAg11s",
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWhYNL4Y3uyJbP7RwMO4tNWT2kB5sAYN7yqREDLLhEk_TWEEmN7HmcwjW-jm37pT2D1tDNTI48RN6cySjm980F6VW-pNNqeGCALYz5OMl6vKmu6NuuRadzBaAsKzpgkifPun33TyGydwgxOk1ZVtDOhmATIxaflYgYSBCIesG4gLGqt39ynMqp_dK5fuXsJsOGW8deIWapw4QuMWoGuIUbASb0dnBautjO8Bu8jUVtUgU83E559ii7Zrk1-ZQ1zPSx787u83IKedcn",
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCqyc9bVWxTFTpIp80IGo-aLFCKf43ihOClDXYe2tNCVX0M2c995mavBmxx-EE6b3_6E_FTbXN4xWyA4jov2bEbx5yb8CP6CFrurE4nyTB-y5E5Shs2jrtUho2ihUQuUhtTCPyTJI7y3cmSvQ1ASORroiQcZb82TQvhuun1aPnnKZOM-WJ9VwRhWP0AqJA1KJ3TzRJN_lkWJQgyTAzmsbZb-9BALoz8M-TZChYmBVf43KBQmvtj4st3jXameN_ZJzIseQUOPYIN860C",
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBRjhBlBzF41G4pkoe6DRPuAdhw_Xb_QqW-S0lw2DCdWT3pFgXCp-sinKVLnGxnHgTUrF62hjD_dk3vFJgqo9sxIVd9KCmPca8rjy5X5rgVPid8CQdESF9V9GOnBx4butfQubegqwyMI2aFCW-0bq1DVf3J-Ia394SCHvf98XtG1xY1sAOLfDsVwWdfAoBhbPRPaLVdDvqz2dWoJXAT6QtzcxteVxdtshc2Ir_njxRyy9DgpodUj2HOVQICtWwZZE3EY3Z5gl0XhGV5",
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdiXrP39E3zZ-GAPASA9ujw6M6cKq2WL3iVwVxQ9IKc4nK8MAnFXbA-1Tbg-D4q0-EWEU4zne-KcUtADxFCqhqGcig06XOFQyTFHF2ei-XKZD-QK6PfzK-tDr9XrqEg8H2frW5ykPcwag6Mupas5m_AaCmK4qTuXd8bWbFfDMcUCG4Tyc9mI6SQT14IDCnV4SM-Vdnp6TWnatcUukDKCL99-vO9DVFWErFqcDuOjzhS9UMo8UdZEvRmhEl2PCI9dkj6be-vinw4_wz",
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBnoveaAiy_HQtfcaJAMQZjAr_emCoeME355IeIrRvAQisyPyIbn3L8ycphiTLqdyFOAm2U-GvKPwuPbH0Teh-XbUTCXSkCcissxmH1_j5Rv7OTfgcO0l6sOVh6zA_8JjAvfLKauR95YBgAJT6MAVXptkQcQHuRSNLa5E27msN_DhYT4lOR7Uev5B8I6Z-RhbfVbpKRWvcHPYjwLx5U_DuJG3hulBRC5bxzEdpC5oQPOkpFn6_eAm1XEwqxmVqta781onLrnXFx9zyz",
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD47oSuHxkloeT0L4zUwEC1QNuqhpc3mt-AxuSlkvFaWTcLO9qbskAPy5dWGedzJ5vV4C0DDRS7K2Ky3v4Dl_Y8WjpNdJb1NmAmFHIwJC9IFFYGMugJkGKPOOTa0zdTM_7bRRRIwQNKenrDhFUDPuLIqPGDEgHGZcjY2AG7Q84b5hj6PGd3O_jlxT16k7tYsNudJ83WBgjVzyLr1aFEkB3DVehkdhtNajvCCeK00yTu8wxvW0dGgY25iEdlwVCYQ9YoUkMa-m2oXL88",
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBMC-vbakuG1nmeWTpu_4d7odq-yZTwH40C-Ndn095negqmN1GoggVSwQVgDWIySGm1eyKuOehey1CpmEOTLYkwZsuxNc0xBdz7PRes_BJ2vteuy0axa-sJKSr-Br05JSkiue8k4cK8Rwm_LgqZMwiJ8CfhnCSUuCMUdnlZoYS_3TrGO25IF2wKc6354T8ypVvXssPYXuAfvQCjhiP84dB-iRxUSxEpP6hayx9ot4GAMsagDQLijamXhgPMiQU9ovrNmDlAxmP7Yfrv",
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBeQNVqR1MnqFLkdGypLVRYK7D_zqlHKqavVYZ4hMiT7HRYgEsal3qYGur0pBjWZywrmwMEDRO9j0itJpJUGYH1dTl6m-gqcpmXLArXVuKQzECRceVWQRRk5XQu-8FzJOVyHN4pF7QoMKwcMod4SqndiT62MM5MwUcFuL5xAi5CzRg3iE2hFymLnXuFemW5n0OpGI43BEtSgFHnkO9gfM8zVW-Kf_nVxW6Q8gWZOc0yG1GjGw51dyXDGvnSSU8EP3bAfOR5iPgkAhYh",

    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD72-7w5IxqSY3hi8YOLMzY7uBwdm7DsSEdmujRM5dDkF8lrvCWTyY0egccpRAEQQp0oi3u-2KzMv89Wjyqbp_wON6xQu-g5EGCpyL0FKjqIbeXz55zqiKB_ajvM7F7oMMSniC62qRxdWNBtIXaiZ752dg1xHGGCgk_TwGQoghg6yiaDfwKU1EkRuvfu7yHsznJIJgKFYAl8wQXCI3tzShNuowMkiDK0DMUHirnP-sxTmSkWkrx-l52WzBtfMasZmDl9OzFDpWvqqPf",
    },
  ];
  const router = useRouter();
  const [uploads, setUploads] = useState<Array<{ url: string; name: string }>>([]);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    const accepted = files.filter(f => /image\/(jpeg|jpg|png)/i.test(f.type) || /\.(jpe?g|png)$/i.test(f.name));
    if (accepted.length === 0) return;
    accepted.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const url = String(reader.result || "");
        setUploads(prev => [...prev, { url, name: file.name }]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const accepted = files.filter(f => /image\/(jpeg|jpg|png)/i.test(f.type) || /\.(jpe?g|png)$/i.test(f.name));
    if (accepted.length === 0) return;
    accepted.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const url = String(reader.result || "");
        setUploads(prev => [...prev, { url, name: file.name }]);
      };
      reader.readAsDataURL(file);
    });
    // reset input so same file can be chosen again
    e.currentTarget.value = "";
  }, []);


  function selectAndGo(url: string, name?: string) {
    const params = new URLSearchParams();
    params.set("img", url);
    if (name) params.set("name", name);
    router.push(`/my-designs?${params.toString()}`);
  }


  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Saas Design</h1>
        </div>
        <nav className="mt-8 flex flex-1 flex-col">
          <ul className="flex flex-col gap-2">
            <li>
              <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-blue-600/10 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-blue-600/20 dark:hover:text-blue-600" href="/dashboard">
                <svg className="fill-current" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z"></path>
                </svg>
                <span className="text-sm font-medium">Home</span>
              </a>
            </li>
            <li>
              <a className="flex items-center gap-3 rounded-lg bg-blue-600/10 px-3 py-2 text-blue-600 dark:bg-blue-600/20" href="/templates">
                <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M104,40H56A16,16,0,0,0,40,56v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,104,40Zm0,64H56V56h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,64H152V56h48v48Zm-96,32H56a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,104,136Zm0,64H56V152h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,200,136Zm0,64H152V152h48v48Z"></path>
                </svg>
                <span className="text-sm font-medium">Templates</span>
              </a>
            </li>
            <li>
              <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-blue-600/10 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-blue-600/20 dark:hover:text-blue-600" href="#">

                <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V158.75l-26.07-26.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L40,149.37V56ZM40,172l52-52,80,80H40Zm176,28H194.63l-36-36,20-20L216,181.38V200ZM144,100a12,12,0,1,1,12,12A12,12,0,0,1,144,100Z"></path>
                </svg>
                <span className="text-sm font-medium">My Designs</span>
              </a>
            </li>

            <li>
              <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-blue-600/10 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-blue-600/20 dark:hover:text-blue-600" href="#">
                <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216V176ZM104,120v24a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm32-16v40a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm32-16v56a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Z"></path>
                </svg>
                <span className="text-sm font-medium">Analytics</span>
              </a>
            </li>
            <li>
              <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-blue-600/10 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-blue-600/20 dark:hover:text-blue-600" href="#">
                <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z"></path>
                </svg>
                <span className="text-sm font-medium">Settings</span>
              </a>
            </li>
          </ul>
        </nav>
        <div className="mt-auto">
          <button className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600/90">New Design</button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Templates</h1>
            <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">Browse our library of professionally designed templates to get started.</p>
          </div>

          {/* Search */}
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-3.5-3.5"/></svg>
              <input
                type="search"
                placeholder="Search templates (e.g. 'instagram post', 'birthday card')"
                className="w-full rounded-lg border border-slate-200 bg-white dark:bg-slate-800 shadow-sm py-4 pl-12 pr-4 text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Chips */}
          <div className="flex justify-center flex-wrap gap-2 mb-8">
            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium">All</button>
            {['Social Media','Presentations','Marketing','Documents','Videos'].map((label) => (
              <button key={label} className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-600/10 dark:hover:bg-blue-600/20 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-colors">
                {label}
              </button>
            ))}
          </div>


          {/* Drag & drop upload */}
          <input id="template-upload" type="file" accept="image/png,image/jpeg" multiple className="hidden" onChange={onFileChange} />
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            className="mb-8 flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-white/60 p-8 text-center dark:border-slate-700 dark:bg-slate-800/50"
          >
            <p className="text-sm text-slate-600 dark:text-slate-300">Drag & drop your image here (JPG, JPEG, PNG) or</p>
            <button
              type="button"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600/90"
              onClick={() => (document.getElementById('template-upload') as HTMLInputElement | null)?.click()}
            >
              Browse files
            </button>
          </div>

          {/* Category header + filters */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Social Media</h2>
            <div className="flex gap-2">
              {['All','Instagram','Facebook','Twitter'].map((l) => (
                <button key={l} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-600/10 dark:hover:bg-blue-600/20 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-colors">
                  {l}
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {cards.map((c, idx) => (
              <div key={idx} className="group relative">
                <div className="h-40 w-full rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${JSON.stringify(c.url)})` }} />
                <div className="absolute inset-0 rounded-lg bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button type="button" onClick={() => selectAndGo(c.url, `Template ${idx + 1}`)} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-600/90">Select</button>
                </div>
              </div>
            ))}

          </div>

          {/* Your Uploads */}
          {uploads.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">Your Uploads</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {uploads.map((u, idx) => (
                  <div key={`${u.name}-${idx}`} className="group relative">
                    <div className="h-40 w-full rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${JSON.stringify(u.url)})` }} />
                    <div className="absolute inset-0 rounded-lg bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => selectAndGo(u.url, u.name)}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-600/90"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}


          {/* Pagination */}
          <div className="mt-10 flex items-center justify-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-500 hover:bg-blue-600/10 hover:text-blue-600 transition-colors">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button className="w-10 h-10 rounded-lg bg-blue-600 text-white font-bold text-sm">1</button>
            {[2,3,4,5].map((n) => (
              <button key={n} className="w-10 h-10 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-blue-600/10 hover:text-blue-600 font-medium text-sm transition-colors">{n}</button>
            ))}
            <button className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-500 hover:bg-blue-600/10 hover:text-blue-600 transition-colors">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

