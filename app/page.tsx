'use client';

import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { RiskTable } from '@/components/RiskTable';
import { FilterModal, FilterState } from '@/components/FilterModal';
import { Filter, Download, AlertTriangle, Clock, BarChart3, ShieldCheck, ArrowRight, Zap, Plus, X, FileJson, FileText as FilePdf } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';

interface Risk {
  id: string;
  risk_id: string;
  date: string;
  nature: string;
  risk: string;
  cause: string;
  consequence: string;
  trigger: string;
  status: string;
  p: number;
  i: number;
  weight: number;
  severity: string;
}

export default function RegistryPage() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = React.useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = React.useState(false);
  const [availableWeights, setAvailableWeights] = React.useState<string[]>([]);
  const [filteredRisks, setFilteredRisks] = React.useState<Risk[]>([]);
  const [filters, setFilters] = React.useState<FilterState>({
    risk: '',
    nature: '',
    status: '',
    weight: '',
    severity: ''
  });

  const metrics = React.useMemo(() => {
    const criticalCount = filteredRisks.filter(r => r.status === 'Crítico').length;
    const mitigatingCount = filteredRisks.filter(r => r.status === 'Mitigando').length;
    
    const totalWeight = filteredRisks.reduce((acc, r) => acc + Number(r.weight), 0);
    const avgWeight = filteredRisks.length > 0 ? (totalWeight / filteredRisks.length).toFixed(1) : '0.0';
    
    // Compliance Score: Percentage of risks that are NOT critical
    const complianceScore = filteredRisks.length > 0 
      ? Math.round(((filteredRisks.length - criticalCount) / filteredRisks.length) * 100) 
      : 100;

    return [
      { label: 'Riscos Críticos', value: criticalCount.toString(), icon: AlertTriangle, color: 'border-error', iconColor: 'text-error' },
      { label: 'Mitigações Abertas', value: mitigatingCount.toString(), icon: Clock, color: 'border-secondary', iconColor: 'text-secondary' },
      { label: 'Gravidade Média', value: avgWeight, icon: BarChart3, color: 'border-primary', iconColor: 'text-primary' },
      { label: 'Pontuação de Compliance', value: `${complianceScore}%`, icon: ShieldCheck, color: 'border-outline-variant', iconColor: 'text-outline-variant' },
    ];
  }, [filteredRisks]);

  const activeFilterCount = Object.values(filters).filter(v => v !== '').length;

  const clearFilters = () => {
    setFilters({
      risk: '',
      nature: '',
      status: '',
      weight: '',
      severity: ''
    });
  };

  const exportToCSV = () => {
    if (filteredRisks.length === 0) return;
    
    const headers = ['ID', 'Data', 'Natureza', 'Risco', 'Causa', 'Consequência', 'Gatilho', 'Status', 'Probabilidade', 'Impacto', 'Peso', 'Severidade'];
    const csvContent = [
      headers.join(','),
      ...filteredRisks.map(r => [
        r.risk_id,
        new Date(r.date).toLocaleDateString('pt-BR'),
        r.nature,
        `"${r.risk.replace(/"/g, '""')}"`,
        `"${r.cause.replace(/"/g, '""')}"`,
        `"${r.consequence.replace(/"/g, '""')}"`,
        `"${r.trigger.replace(/"/g, '""')}"`,
        r.status,
        r.p,
        r.i,
        r.weight.toFixed(2),
        r.severity
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `registro-de-riscos-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExportMenuOpen(false);
  };

  const exportToPDF = async () => {
    if (filteredRisks.length === 0) return;
    
    // @ts-ignore
    const { default: jsPDF } = await import('jspdf');
    // @ts-ignore
    const { default: autoTable } = await import('jspdf-autotable');
    
    const doc = new jsPDF('l', 'mm', 'a4');
    
    doc.setFontSize(18);
    doc.text('Registro de Riscos', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Exportado em: ${new Date().toLocaleString('pt-BR')}`, 14, 30);
    
    const tableColumn = ['ID', 'Data', 'Natureza', 'Risco', 'Status', 'P', 'I', 'Peso', 'Severidade'];
    const tableRows = filteredRisks.map(r => [
      r.risk_id,
      new Date(r.date).toLocaleDateString('pt-BR'),
      r.nature,
      r.risk,
      r.status,
      r.p,
      r.i,
      r.weight.toFixed(2),
      r.severity
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [0, 102, 204], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    doc.save(`registro-de-riscos-${new Date().toISOString().split('T')[0]}.pdf`);
    setIsExportMenuOpen(false);
  };

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
                <span className="text-[10px] font-bold tracking-widest text-primary uppercase">Visão Geral</span>
                <h2 className="text-2xl md:text-3xl font-headline font-extrabold text-on-surface tracking-tight">Registro de Riscos</h2>
              </div>
              <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
                  <button 
                    onClick={() => setIsFilterModalOpen(true)}
                    className={cn(
                      "flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 md:px-4 py-2 rounded-lg text-xs font-semibold transition-all relative",
                      activeFilterCount > 0 
                        ? "bg-primary text-on-primary shadow-md shadow-primary/20" 
                        : "bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant"
                    )}
                  >
                    <Filter className="w-3.5 h-3.5" />
                    Filtros
                    {activeFilterCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-error text-white text-[8px] flex items-center justify-center rounded-full border border-surface">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                  <div className="relative flex-1 sm:flex-none">
                    <button 
                      onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                      className="w-full flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant rounded-lg text-xs font-semibold transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Exportar
                    </button>
                    
                    <AnimatePresence>
                      {isExportMenuOpen && (
                        <>
                          <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setIsExportMenuOpen(false)}
                          />
                          <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 top-full mt-2 w-40 bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-2xl z-50 py-2 overflow-hidden"
                          >
                            <button 
                              onClick={exportToCSV}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors"
                            >
                              <FileJson className="w-4 h-4" />
                              Formato CSV
                            </button>
                            <button 
                              onClick={exportToPDF}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors"
                            >
                              <FilePdf className="w-4 h-4" />
                              Formato PDF
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                {activeFilterCount > 0 && (
                  <button 
                    onClick={clearFilters}
                    className="text-[10px] font-bold text-error flex items-center gap-1 hover:underline"
                  >
                    <X className="w-3 h-3" />
                    Limpar Filtros
                  </button>
                )}
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
            <RiskTable 
              filters={filters} 
              onWeightsUpdate={setAvailableWeights}
              onFilteredDataUpdate={setFilteredRisks}
            />

            {/* Bento Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-surface-container-high/40 p-6 rounded-xl border border-outline-variant/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-headline font-bold">Pontuação de Saúde do Registro</h4>
                  <p className="text-xs text-on-surface-variant max-w-sm">
                    {filteredRisks.length > 0 ? (
                      `A saúde do registro é baseada na criticidade dos riscos. Atualmente, ${metrics[3].value} dos riscos estão sob controle ou em mitigação.`
                    ) : (
                      'Nenhum dado disponível para calcular a saúde do registro.'
                    )}
                  </p>
                  <button className="text-xs font-bold text-primary flex items-center gap-1 group">
                    Ver diagnóstico completo 
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                <div className="relative w-24 h-24 flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle className="text-outline-variant/20" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
                    <circle 
                      className="text-primary transition-all duration-500 ease-in-out" 
                      cx="48" 
                      cy="48" 
                      fill="transparent" 
                      r="40" 
                      stroke="currentColor" 
                      strokeDasharray="251.2" 
                      strokeDashoffset={251.2 - (251.2 * parseInt(metrics[3].value)) / 100} 
                      strokeWidth="8"
                    ></circle>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-headline font-extrabold text-xl text-primary">
                    {metrics[3].value.replace('%', '')}
                  </div>
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
      
      <FilterModal 
        key={isFilterModalOpen ? 'open' : 'closed'}
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={setFilters}
        initialFilters={filters}
        availableWeights={availableWeights}
      />
    </div>
  );
}

import { cn } from '@/lib/utils';
