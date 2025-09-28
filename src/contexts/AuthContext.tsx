'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Basit credential kontrolü için sabit kullanıcılar
const DEMO_USERS = [
  { id: '1', email: 'demo@visualflow.com', password: 'demo123', name: 'Demo User' },
  { id: '2', email: 'admin@visualflow.com', password: 'admin123', name: 'Admin User' },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Sayfa yüklendiğinde localStorage'dan kullanıcı bilgilerini kontrol et
    const savedUser = localStorage.getItem('visualflow_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Basit credential kontrolü
    const foundUser = DEMO_USERS.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userInfo = { id: foundUser.id, email: foundUser.email, name: foundUser.name };
      setUser(userInfo);
      localStorage.setItem('visualflow_user', JSON.stringify(userInfo));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const signup = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Basit signup - gerçek uygulamada bu backend'e gönderilir
    // Şimdilik sadece demo kullanıcıları kabul ediyoruz
    const existingUser = DEMO_USERS.find(u => u.email === email);
    
    if (!existingUser) {
      // Yeni kullanıcı oluştur (demo için)
      const newUser = { 
        id: Date.now().toString(), 
        email, 
        name: email.split('@')[0] 
      };
      setUser(newUser);
      localStorage.setItem('visualflow_user', JSON.stringify(newUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('visualflow_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
