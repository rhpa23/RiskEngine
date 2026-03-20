'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { 
  ArrowLeft, 
  Info, 
  Brain, 
  Calculator, 
  MoreHorizontal, 
  MinusCircle, 
  PlusCircle, 
  AlertTriangle,
  ChevronDown,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { useParams } from 'next/navigation';

export default function EditRiskPage() {
  const params = useParams();
  const riskId = params.id as string;

  const [nature, setNature] = useState<'negativo' | 'positivo'>('negativo');
  const [probability, setProbability] = useState(3);
  const [impact, setImpact] = useState(4);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Mock initial data loading
  useEffect(() => {
    // Simulate async fetch
    const timer = setTimeout(() => {
      if (riskId === 'RK-2024-001') {
        setNature('negativo');
        setProbability(4);
        setImpact(4);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [riskId]);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="md:ml-64 min-h-screen flex flex-col transition-all duration-300">
        <TopBar onMenuClick={() => setIsSidebarOpen(true)} />
        
        <div className="flex-1 p-4 md:p-10 max-w-6xl mx-auto w-full">
          <div className="mb-8 md:mb-10">
            <Link href="/" className="flex items-center gap-2 text-primary font-semibold text-sm mb-2 hover:underline">
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao Registro</span>
            </Link>
            <div className="flex items-center gap-3">
              <h2 className="font-headline text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">Editar Registro de Risco</h2>
              <span className="px-3 py-1 bg-surface-container-high text-on-surface-variant rounded-full text-[10px] font-bold uppercase tracking-widest">{riskId}</span>
            </div>
            <p className="text-on-surface-variant mt-2 max-w-2xl text-xs md:text-sm">
              Atualize os parâmetros de risco e as estratégias de mitigação. As alterações serão registradas na trilha de auditoria.
            </p>
          </div>

          <form className="space-y-8 md:y-12 pb-20">
            {/* Section 1: Risk Foundation */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 rounded-xl bg-primary-container flex items-center justify-center text-primary">
                  <Info className="w-5 h-5" />
                </div>
                <h3 className="font-headline text-lg md:text-xl font-bold">Identificação do Risco</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 md:gap-6 bg-surface-container-low p-4 md:p-8 rounded-2xl">
                <div className="sm:col-span-8 space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant ml-1">Descrição do Risco (Risco)</label>
                  <input 
                    type="text" 
                    defaultValue="Falha Crítica no Pipeline de Dados"
                    placeholder="Descreva o evento de risco claramente..." 
                    className="w-full bg-surface-container-high border-none focus:ring-0 focus:bg-surface-container-lowest focus:border-b-2 focus:border-primary rounded-md px-4 py-3 text-on-surface outline-none transition-all"
                  />
                </div>
                <div className="sm:col-span-4 space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant ml-1">Date (Data)</label>
                  <input 
                    type="date" 
                    defaultValue="2024-10-24"
                    className="w-full bg-surface-container-high border-none focus:ring-0 focus:bg-surface-container-lowest focus:border-b-2 focus:border-primary rounded-md px-4 py-3 text-on-surface outline-none transition-all"
                  />
                </div>
                
                <div className="sm:col-span-4 space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant ml-1">Nature (Natureza)</label>
                  <div className="flex gap-2">
                    <button 
                      type="button"
                      onClick={() => setNature('negativo')}
                      className={cn(
                        "flex-1 py-3 px-2 md:px-4 rounded-md font-bold flex items-center justify-center gap-2 transition-all text-xs md:text-sm",
                        nature === 'negativo' 
                          ? "bg-white text-error border-2 border-error/10 shadow-sm" 
                          : "bg-surface-container-high text-on-surface-variant"
                      )}
                    >
                      <MinusCircle className="w-4 h-4" /> Negativo
                    </button>
                    <button 
                      type="button"
                      onClick={() => setNature('positivo')}
                      className={cn(
                        "flex-1 py-3 px-2 md:px-4 rounded-md font-bold flex items-center justify-center gap-2 transition-all text-xs md:text-sm",
                        nature === 'positivo' 
                          ? "bg-white text-primary border-2 border-primary/10 shadow-sm" 
                          : "bg-surface-container-high text-on-surface-variant"
                      )}
                    >
                      <PlusCircle className="w-4 h-4" /> Positivo
                    </button>
                  </div>
                </div>
                
                <div className="sm:col-span-4 space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant ml-1">Status</label>
                  <div className="relative">
                    <select defaultValue="Critical" className="w-full bg-surface-container-high border-none focus:ring-0 focus:bg-surface-container-lowest focus:border-b-2 focus:border-primary rounded-md px-4 py-3 text-on-surface appearance-none outline-none transition-all">
                      <option>Identificado</option>
                      <option>Análise</option>
                      <option>Mitigado</option>
                      <option>Fechado</option>
                      <option>Crítico</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                  </div>
                </div>
                
                <div className="sm:col-span-4 space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant ml-1">Gatilho (Gatilho)</label>
                  <textarea 
                    defaultValue="Uso de CPU > 95%"
                    placeholder="Evento que ativa o risco..." 
                    rows={4}
                    className="w-full bg-surface-container-high border-none focus:ring-0 focus:bg-surface-container-lowest focus:border-b-2 focus:border-primary rounded-md px-4 py-3 text-on-surface outline-none transition-all resize-none"
                  />
                </div>
              </div>
            </section>

            {/* Section 2: Analysis */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 rounded-xl bg-secondary-container flex items-center justify-center text-secondary">
                  <Brain className="w-5 h-5" />
                </div>
                <h3 className="font-headline text-lg md:text-xl font-bold">Análise Causal</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant ml-1">Causa (Causa)</label>
                  <textarea 
                    defaultValue="Latência excessiva no cluster AWS"
                    placeholder="Causa raiz do risco identificado..." 
                    rows={4}
                    className="w-full bg-surface-container-high border-none focus:ring-0 focus:bg-surface-container-lowest focus:border-b-2 focus:border-primary rounded-md px-4 py-3 text-on-surface outline-none transition-all resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant ml-1">Consequência (Consequência)</label>
                  <textarea 
                    defaultValue="Interrupção de serviços e perda de SLA"
                    placeholder="Consequências imediatas e de longo prazo..." 
                    rows={4}
                    className="w-full bg-surface-container-high border-none focus:ring-0 focus:bg-surface-container-lowest focus:border-b-2 focus:border-primary rounded-md px-4 py-3 text-on-surface outline-none transition-all resize-none"
                  />
                </div>
              </div>
            </section>

            {/* Section 3: Scoring */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 rounded-xl bg-tertiary-container flex items-center justify-center text-tertiary">
                  <Calculator className="w-5 h-5" />
                </div>
                <h3 className="font-headline text-lg md:text-xl font-bold">Pontuação de Risco</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/15 flex flex-col justify-between">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-4">Probabilidade (Probabilidade)</label>
                    <div className="flex flex-col gap-2">
                      {[1, 2, 3, 4].map((val) => (
                        <button 
                          key={val}
                          type="button"
                          onClick={() => setProbability(val)}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                            probability === val 
                              ? "bg-primary text-on-primary font-bold shadow-sm" 
                              : "bg-surface-container-high text-on-surface-variant hover:bg-primary-container hover:text-primary"
                          )}
                        >
                          {val === 1 ? 'Muito Baixa (1)' : val === 2 ? 'Baixa (2)' : val === 3 ? 'Média (3)' : 'Alta (4)'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/15 flex flex-col justify-between">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-4">Impacto (Impacto)</label>
                    <div className="flex flex-col gap-2">
                      {[1, 2, 3, 4].map((val) => (
                        <button 
                          key={val}
                          type="button"
                          onClick={() => setImpact(val)}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                            impact === val 
                              ? "bg-primary text-on-primary font-bold shadow-sm" 
                              : "bg-surface-container-high text-on-surface-variant hover:bg-primary-container hover:text-primary"
                          )}
                        >
                          {val === 1 ? 'Mínimo (1)' : val === 2 ? 'Menor (2)' : val === 3 ? 'Moderado (3)' : 'Maior (4)'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2 bg-on-surface rounded-2xl p-6 md:p-8 text-on-primary relative overflow-hidden flex flex-col justify-between border-l-4 border-error">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <BarChart3 className="w-24 md:w-32 h-24 md:h-32" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-outline-variant mb-6">Avaliação Automatizada</p>
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-6 md:gap-8">
                      <div>
                        <input 
                          type="number" 
                          readOnly 
                          value={(probability * impact / 16).toFixed(2)}
                          className="bg-white/5 border-b border-white/10 hover:bg-white/10 focus:bg-white/10 transition-all p-2 -ml-2 text-2xl md:text-3xl font-headline font-extrabold text-on-primary outline-none w-full rounded-t-lg"
                        />
                        <p className="text-[10px] text-outline-variant mt-1 uppercase font-bold tracking-wider">Peso (Peso)</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            readOnly 
                            value={probability * impact}
                            className="bg-white/5 border-b border-error/30 hover:bg-white/10 focus:bg-white/10 transition-all p-2 -ml-2 text-2xl md:text-3xl font-headline font-extrabold text-error-container outline-none w-24 md:w-28 rounded-t-lg"
                          />
                          <AlertTriangle className="w-5 md:w-6 h-5 md:h-6 text-error-container" />
                        </div>
                        <p className="text-[10px] text-outline-variant mt-1 uppercase font-bold tracking-wider">Gravidade (Gravidade)</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 md:mt-8">
                    <span className="inline-flex items-center px-4 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-error/20 text-error-container">
                      {probability * impact > 12 ? 'Crítico de Alta Prioridade' : 'Prioridade Padrão'}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Complementary */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                  <MoreHorizontal className="w-5 h-5" />
                </div>
                <h3 className="font-headline text-lg md:text-xl font-bold">Informações Complementares</h3>
              </div>
              <div className="bg-white p-4 md:p-8 rounded-2xl border border-outline-variant/10">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant ml-1">Contexto Adicional / Observações</label>
                  <textarea 
                    defaultValue="Requires quarterly review of AWS infrastructure limits."
                    placeholder="Quaisquer detalhes extras, documentos relacionados ou partes interessadas envolvidas..." 
                    rows={3}
                    className="w-full bg-surface-container-high border-none focus:ring-0 focus:bg-surface-container-lowest focus:border-b-2 focus:border-primary rounded-md px-4 py-3 text-on-surface outline-none transition-all resize-none"
                  />
                </div>
              </div>
            </section>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-outline-variant/20">
              <button type="button" className="w-full sm:w-auto text-error font-bold px-6 py-3 rounded-xl hover:bg-error/10 transition-colors">
                Excluir Registro
              </button>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto">
                <button type="button" className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-on-surface border border-outline-variant transition-all hover:bg-surface-container-high">
                  Cancelar
                </button>
                <button type="submit" className="w-full sm:w-auto px-10 py-3 rounded-xl font-bold bg-primary text-on-primary shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                  Atualizar Registro de Risco
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
