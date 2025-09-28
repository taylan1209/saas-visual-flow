'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-light dark:text-text-dark">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="bg-white dark:bg-background-dark border-b border-border-light dark:border-border-dark">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <svg 
              className="h-6 w-6 text-text-light dark:text-text-dark" 
              fill="none" 
              viewBox="0 0 48 48" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" 
                fill="currentColor"
              />
            </svg>
            <h1 className="text-xl font-bold text-text-light dark:text-text-dark">
              VisualFlow
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-subtle-light dark:text-subtle-dark">
              Welcome, {user.name}
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-2">
            Dashboard
          </h2>
          <p className="text-subtle-light dark:text-subtle-dark">
            Manage your social media graphics and templates
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-background-dark p-6 rounded-lg border border-border-light dark:border-border-dark">
            <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-2">
              Templates
            </h3>
            <p className="text-3xl font-bold text-primary">12</p>
            <p className="text-sm text-subtle-light dark:text-subtle-dark">
              Available templates
            </p>
          </div>
          
          <div className="bg-white dark:bg-background-dark p-6 rounded-lg border border-border-light dark:border-border-dark">
            <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-2">
              Projects
            </h3>
            <p className="text-3xl font-bold text-primary">5</p>
            <p className="text-sm text-subtle-light dark:text-subtle-dark">
              Active projects
            </p>
          </div>
          
          <div className="bg-white dark:bg-background-dark p-6 rounded-lg border border-border-light dark:border-border-dark">
            <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-2">
              Exports
            </h3>
            <p className="text-3xl font-bold text-primary">28</p>
            <p className="text-sm text-subtle-light dark:text-subtle-dark">
              This month
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-background-dark p-6 rounded-lg border border-border-light dark:border-border-dark mb-8">
          <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 border border-border-light dark:border-border-dark rounded-lg hover:bg-background-light dark:hover:bg-background-light/10 transition-colors">
              <div className="text-primary mb-2">
                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="text-sm font-medium text-text-light dark:text-text-dark">
                New Project
              </p>
            </button>
            
            <button className="p-4 border border-border-light dark:border-border-dark rounded-lg hover:bg-background-light dark:hover:bg-background-light/10 transition-colors">
              <div className="text-primary mb-2">
                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-text-light dark:text-text-dark">
                Browse Templates
              </p>
            </button>
            
            <button className="p-4 border border-border-light dark:border-border-dark rounded-lg hover:bg-background-light dark:hover:bg-background-light/10 transition-colors">
              <div className="text-primary mb-2">
                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <p className="text-sm font-medium text-text-light dark:text-text-dark">
                Upload Template
              </p>
            </button>
            
            <button className="p-4 border border-border-light dark:border-border-dark rounded-lg hover:bg-background-light dark:hover:bg-background-light/10 transition-colors">
              <div className="text-primary mb-2">
                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-text-light dark:text-text-dark">
                Analytics
              </p>
            </button>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white dark:bg-background-dark p-6 rounded-lg border border-border-light dark:border-border-dark">
          <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4">
            Recent Projects
          </h3>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between p-4 border border-border-light dark:border-border-dark rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-text-light dark:text-text-dark">
                      Project {item}
                    </h4>
                    <p className="text-sm text-subtle-light dark:text-subtle-dark">
                      Last edited 2 days ago
                    </p>
                  </div>
                </div>
                <button className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                  Edit
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
