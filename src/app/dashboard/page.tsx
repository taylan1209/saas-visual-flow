export default function Dashboard() {
  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <aside className="flex w-64 flex-col border-r border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Saas Design</h1>
        </div>
        <nav className="mt-8 flex flex-1 flex-col">
          <ul className="flex flex-col gap-2">
            <li>
              <a className="flex items-center gap-3 rounded-lg bg-blue-600/10 px-3 py-2 text-blue-600 dark:bg-blue-600/20" href="#">
                <svg className="fill-current" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z"></path>
                </svg>
                <span className="text-sm font-medium">Home</span>
              </a>
            </li>
            <li>
              <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-blue-600/10 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-blue-600/20 dark:hover:text-blue-600" href="/templates">
                <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M104,40H56A16,16,0,0,0,40,56v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,104,40Zm0,64H56V56h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,64H152V56h48v48Zm-96,32H56a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,104,136Zm0,64H56V152h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,200,136Zm0,64H152V152h48v48Z"></path>
                </svg>
                <span className="text-sm font-medium">Templates</span>
              </a>
            </li>
            <li>
              <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-blue-600/10 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-blue-600/20 dark:hover:text-blue-600" href="/my-designs">
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
              <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-blue-600/10 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-blue-600/20 dark:hover:text-blue-600" href="/settings">
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

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Welcome back, Alex! Here's an overview of your recent activity and key metrics.</p>
          </header>

          <section>
            <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">Recent Designs</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[{
                url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSLQgsGBNJMSzo0HtYnGPk7pqx-RfzITE0VIXMEUedYpAKHGCwDORfS911WWtJleOZUYPUrv-FJn77Uot-D7Pt29IGzYsdWamzj0qbfKkK5ECaPW1VxO_es37gq4_CmVhofOBIiUsAyYuGy6sqQuxHoPhRDvS8WH9dWBC9QWLkwwYQJ95u9u2egKb5dsvZSQNElhohXR2YDooO3spBx_S91e0waLjuBLv79P8DixO8tZukNRa0mq-lQgl70CkvzbjipRW0mSHAopc7',
                title: 'Social Media Post - Campaign Launch',
                date: 'Created 2 days ago',
              }, {
                url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDf3n9RKKgMMuhjFXDKhu0B77jr9KHx2_pun0yfcEAPPlTOvg83UupTZkeu_mgaTwJdEkjF2nxZ7RGZS07BsVlfCvDGssVnJisn7TbeLNHqNK1WQBXnXVyRIQ105Sjyj3AiJCMFpwRyvWu77Y-7uYcq4HBND0zA_g30cKUKX7elZSJzvdrGmID5em1bb1BFgTFBVqlfZsx0hf5fDyYdXj9Bkzpvjd_CVb9F5byF0SeupMOlIaEfKwDPE00sRJpa7K3ja1BSHeg5VznC',
                title: 'Instagram Story - Product Feature',
                date: 'Created 5 days ago',
              }, {
                url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEXCjibzOaKpQkqC9gDkZ6aHYjtOlxAW-hKBgFoQ_2xoXYW8RWW8uKufakaaqZRQ7pjKVbo281lGzGrCGCSwnN9H0zJ3zRjCM-ryB6ruFdFcba-4zEQ6je7ZlxIlW3ld98uJK1z21dFOhE9mSY10C08XxgyRt9M1R4g2p_odqGBfwCl-DuaL1QplyzSu-0RKA99hewTnn4UBXyyHrApHyadJ-oVR63nikjc9RFpa3_LuGJPNto6LdLrBn9ltoz2vueYYtkYQSG9Snv',
                title: 'Twitter Header - Event Announcement',
                date: 'Created 1 week ago',
              }, {
                url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAR5l4o6w2z_M88kGbzpVrz66Q3ChajCKuCzQYRAFjhCPKs0vAaB1tOi2_oq58-AMjkBYpUaUNX1US3ZyEFgE6zb_45_oTfk5wKAuapwN7wlL36gdp0YcrdsEdEa6Bwr-56P9JuA2X66Ij3lRs7v6e6l0HaOjxT23afz-ZaIZ7l5_GMHYnYNbZQcvY7HIU2S3R4XxFHiPxUgU_C8I48e9N8_Qf73usUr1bwAR8KWjyaEijb6Jy3qq9T0g73NgRmS-MqKdViEHdkMXMp',
                title: 'Facebook Ad - Special Offer',
                date: 'Created 2 weeks ago',
              }].map((card) => (
                <div className="group" key={card.title}>
                  <div className="mb-3 w-full overflow-hidden rounded-lg">
                    <div
                      className="h-48 w-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                      style={{ backgroundImage: `url("${card.url}")` }}
                    />
                  </div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200">{card.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{card.date}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10">
            <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              <button className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600/90">Browse Templates</button>
              <button className="rounded-lg bg-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">View All Designs</button>
            </div>
          </section>

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
