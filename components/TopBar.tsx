'use client';

import React, { useEffect, useState } from 'react';
import { Search, Bell, Settings, Menu } from 'lucide-react';
import Image from 'next/image';

interface TopBarProps {
  onMenuClick?: () => void;
}

interface User {
  name: string;
  email: string;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
      }
    };
    fetchUser();
  }, []);

  return (
    <header className="flex justify-between items-center h-16 px-4 md:px-8 w-full sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-outline-variant/15">
      <div className="flex items-center gap-4 md:gap-6">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 hover:bg-surface-container-low rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 text-on-surface-variant" />
        </button>
        <span className="text-lg md:text-xl font-bold font-headline text-on-surface tracking-tighter hidden xs:block">Risk Intel</span>
        <div className="relative group hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Pesquisar registro..." 
            className="bg-surface-container-high border-none rounded-md pl-10 pr-4 py-1.5 w-48 lg:w-64 text-xs focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-surface-container-low rounded-full transition-colors relative">
          <Bell className="w-5 h-5 text-on-surface-variant" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
        </button>
        <button className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
          <Settings className="w-5 h-5 text-on-surface-variant" />
        </button>
        
        <div className="h-8 w-px bg-outline-variant/30 mx-2"></div>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[11px] font-bold leading-none">{user?.name || 'Carregando...'}</p>
            <p className="text-[10px] opacity-60">Gestor de Riscos</p>
          </div>
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-outline-variant/20">
            <Image 
              src="https://picsum.photos/seed/avatar/100/100" 
              alt="Avatar do usuário" 
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
