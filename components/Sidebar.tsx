'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  ShieldAlert, 
  BarChart3, 
  FileText, 
  Plus, 
  HelpCircle, 
  BookOpen,
  X,
  LogOut
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Registro de Riscos', icon: ShieldCheck, href: '/' },
  { name: 'Planos de Mitigação', icon: ShieldAlert, href: '/mitigation' },
  { name: 'Análises', icon: BarChart3, href: '/analytics' },
  { name: 'Relatórios', icon: FileText, href: '/reports' },
];

const bottomNavItems = [
  { name: 'Suporte', icon: HelpCircle, href: '/support' },
  { name: 'Documentação', icon: BookOpen, href: '/docs' },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "fixed left-0 top-0 h-screen w-64 border-r border-outline-variant/15 bg-surface-container-low flex flex-col py-6 z-50 transition-transform duration-300 md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="px-6 mb-8 flex justify-between items-center">
          <div>
            <h1 className="font-headline font-bold text-on-surface text-xl tracking-tight">Risk Engine</h1>
            <p className="text-[10px] opacity-60 font-medium uppercase tracking-widest mt-1">Nível Enterprise</p>
          </div>
          {/* Mobile Close Button */}
          <button onClick={onClose} className="md:hidden p-2 hover:bg-white/50 rounded-lg">
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 py-2.5 px-4 rounded-lg transition-all group",
                isActive 
                  ? "bg-white shadow-sm text-primary font-bold" 
                  : "text-on-surface hover:text-primary hover:bg-white/50"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-on-surface-variant group-hover:text-primary")} />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-4 space-y-1">
        {bottomNavItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 py-2 px-4 rounded-lg text-on-surface hover:text-primary hover:bg-white/50 transition-all"
          >
            <item.icon className="w-4 h-4 text-on-surface-variant" />
            <span className="text-sm">{item.name}</span>
          </Link>
        ))}
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 py-2 px-4 rounded-lg text-error hover:bg-error/5 transition-all mt-2"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Sair</span>
        </button>
      </div>
    </aside>
    </>
  );
}
