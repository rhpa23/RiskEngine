'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Filter, RotateCcw, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FilterState {
  risk: string;
  nature: string;
  status: string;
  weight: string;
  severity: string;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  initialFilters: FilterState;
  availableWeights: string[];
}

const natures = ['OPERACIONAL', 'FINANCEIRO', 'COMPLIANCE', 'CYBERSECURITY', 'ESTRATÉGICO'];
const statuses = ['Identificado', 'Análise', 'Mitigando', 'Monitorando', 'Crítico', 'Fechado', 'Rascunho'];
const severities = ['Alta', 'Média', 'Baixa'];

export function FilterModal({ isOpen, onClose, onApply, initialFilters, availableWeights }: FilterModalProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const handleClear = () => {
    const cleared = {
      risk: '',
      nature: '',
      status: '',
      weight: '',
      severity: ''
    };
    setFilters(cleared);
    onApply(cleared);
    onClose();
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/20 overflow-hidden"
          >
            <div className="p-6 border-b border-outline-variant/10 flex items-center justify-between bg-surface-container-low">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Filter className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-headline font-bold text-on-surface">Filtros Avançados</h3>
                  <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest opacity-60">Refine sua busca no registro</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-on-surface-variant/40" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {/* Risk Search */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant ml-1">Descrição do Risco</label>
                <input 
                  type="text" 
                  value={filters.risk}
                  onChange={(e) => setFilters({ ...filters, risk: e.target.value })}
                  placeholder="Pesquisar por texto no risco..." 
                  className="w-full bg-surface-container-high border-none focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 text-sm text-on-surface outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nature */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant ml-1">Natureza</label>
                  <div className="relative">
                    <select 
                      value={filters.nature}
                      onChange={(e) => setFilters({ ...filters, nature: e.target.value })}
                      className="w-full bg-surface-container-high border-none focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 text-sm text-on-surface appearance-none outline-none transition-all"
                    >
                      <option value="">Todas as Naturezas</option>
                      {natures.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant ml-1">Status</label>
                  <div className="relative">
                    <select 
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                      className="w-full bg-surface-container-high border-none focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 text-sm text-on-surface appearance-none outline-none transition-all"
                    >
                      <option value="">Todos os Status</option>
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                  </div>
                </div>

                {/* Weight */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant ml-1">Peso</label>
                  <div className="relative">
                    <select 
                      value={filters.weight}
                      onChange={(e) => setFilters({ ...filters, weight: e.target.value })}
                      className="w-full bg-surface-container-high border-none focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 text-sm text-on-surface appearance-none outline-none transition-all"
                    >
                      <option value="">Todos os Pesos</option>
                      {availableWeights.map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                  </div>
                </div>

                {/* Severity */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant ml-1">Severidade</label>
                  <div className="relative">
                    <select 
                      value={filters.severity}
                      onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                      className="w-full bg-surface-container-high border-none focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 text-sm text-on-surface appearance-none outline-none transition-all"
                    >
                      <option value="">Todas as Severidades</option>
                      {severities.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-low px-6 py-4 flex flex-col sm:flex-row justify-between gap-3 border-t border-outline-variant/10">
              <button
                onClick={handleClear}
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-error hover:bg-error/5 rounded-xl transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Limpar Filtros
              </button>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-6 py-2 text-sm font-bold text-on-surface-variant hover:bg-surface-container-high rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleApply}
                  className="flex-1 sm:flex-none px-8 py-2 text-sm font-bold text-white bg-primary shadow-lg shadow-primary/20 hover:bg-primary-dim rounded-xl transition-all active:scale-95"
                >
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
