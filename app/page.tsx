'use client';

import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { RiskTable } from '@/components/RiskTable';
import { Filter, Download, AlertTriangle, Clock, BarChart3, ShieldCheck, ArrowRight, Zap, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

const metrics = [
  { label: 'Riscos Críticos', value: '12', icon: AlertTriangle, color: 'border-error', iconColor: 'text-error' },
  { label: 'Mitigações Abertas', value: '28', icon: Clock, color: 'border-secondary', iconColor: 'text-secondary' },
  { label: 'Gravidade Média', value: '6.4', icon: BarChart3, color: 'border-primary', iconColor: 'text-primary' },
  { label: 'Pontuação de Compliance', value: '94%', icon: ShieldCheck, color: 'border-outline-variant', iconColor: 'text-outline-variant' },
];

export default function RegistryPage() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="md:ml-64 min-h-screen flex flex-col transition-all duration-300">
        <TopBar onMenuClick={() => setIsSidebarOpen(true)} />
        
        <div className="p-4 md:p-8 flex-1">
          <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-0">
              <div className="space-y-1">
                <span className="text-[10px] font-bold tracking-widest text-primary uppercase">Visão Geral do Registro</span>
                <h2 className="text-2xl md:text-3xl font-headline font-extrabold text-on-surface tracking-tight">Registro de Riscos Empresariais</h2>
              </div>
              <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant rounded-lg text-xs font-semibold transition-all">
                  <Filter className="w-3.5 h-3.5" />
                  Filtros
                </button>
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant rounded-lg text-xs font-semibold transition-all">
                  <Download className="w-3.5 h-3.5" />
                  Exportar
                </button>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {metrics.map((m) => (
                <div key={m.label} className={cn("bg-surface-container-low p-6 rounded-xl border-l-4 relative overflow-hidden group", m.color)}>
                  <div className="relative z-10">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">{m.label}</p>
                    <h3 className="text-3xl font-headline font-bold text-on-surface">{m.value}</h3>
                  </div>
                  <m.icon className={cn("absolute -right-4 -bottom-4 w-24 h-24 opacity-5 group-hover:scale-110 transition-transform", m.iconColor)} />
                </div>
              ))}
            </div>

            {/* Table */}
            <RiskTable />

            {/* Bento Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-surface-container-high/40 p-6 rounded-xl border border-outline-variant/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-headline font-bold">Pontuação de Saúde do Registro</h4>
                  <p className="text-xs text-on-surface-variant max-w-sm">
                    A qualidade da avaliação atual é alta. 98% dos riscos críticos possuem planos de mitigação ativos. 2 riscos estão pendentes de verificação de gatilho.
                  </p>
                  <button className="text-xs font-bold text-primary flex items-center gap-1 group">
                    Ver diagnóstico completo 
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                <div className="relative w-24 h-24 flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle className="text-outline-variant/20" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
                    <circle className="text-primary" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="30" strokeWidth="8"></circle>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-headline font-extrabold text-xl text-primary">88</div>
                </div>
              </div>

              <div className="bg-primary-container/20 p-6 rounded-xl border border-primary/10 relative overflow-hidden">
                <h4 className="text-sm font-headline font-bold mb-2">Alerta Automatizado</h4>
                <p className="text-xs opacity-80 leading-relaxed mb-4">
                  A probabilidade de riscos de &quot;Cibersegurança&quot; aumentou em 14% com base nos logs recentes do IDS.
                </p>
                <button className="w-full py-2 bg-primary text-on-primary rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-md">
                  Revisar Agora
                </button>
                <Zap className="absolute -right-6 -bottom-6 w-32 h-32 text-primary opacity-5" />
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-auto px-8 py-6 text-[10px] font-bold text-on-surface-variant/40 flex justify-between border-t border-outline-variant/5">
          <span>© 2024 PLATAFORMA RISK ENGINE • TODOS OS DIREITOS RESERVADOS</span>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-primary transition-colors">POLÍTICA DE PRIVACIDADE</Link>
            <Link href="#" className="hover:text-primary transition-colors">CENTRO DE SEGURANÇA</Link>
            <Link href="#" className="hover:text-primary transition-colors">DOCS DA API</Link>
          </div>
        </footer>
      </main>

      {/* FAB */}
      <Link href="/new">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center group z-50"
        >
          <Plus className="w-8 h-8" />
          <span className="absolute right-full mr-4 bg-on-surface text-surface px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Adicionar Risco Rápido
          </span>
        </motion.button>
      </Link>
    </div>
  );
}

import { cn } from '@/lib/utils';
