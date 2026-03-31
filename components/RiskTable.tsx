'use client';

import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, FileText, MoreVertical, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ConfirmationModal } from './ConfirmationModal';
import { supabase } from '@/lib/supabase';
import { FilterState } from './FilterModal';

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

interface RiskTableProps {
  filters?: FilterState;
  onWeightsUpdate?: (weights: string[]) => void;
  onFilteredDataUpdate?: (risks: Risk[]) => void;
}

export function RiskTable({ filters, onWeightsUpdate, onFilteredDataUpdate }: RiskTableProps) {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: 'remove' | 'draft' | null;
    riskId: string | null;
  }>({
    isOpen: false,
    type: null,
    riskId: null
  });

  const fetchRisks = React.useCallback(async () => {
    setLoading(true);
    try {
      // Ensure we have a session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setRisks([]);
        return;
      }

      const { data, error } = await supabase
        .from('risks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      const fetchedRisks = data || [];
      setRisks(fetchedRisks);
      
      // Extract unique weights for filter
      if (onWeightsUpdate) {
        const uniqueWeights = Array.from(new Set(fetchedRisks.map(r => Number(r.weight).toFixed(2))))
          .sort((a, b) => Number(a) - Number(b));
        onWeightsUpdate(uniqueWeights);
      }
    } catch (error) {
      console.error('Erro ao buscar riscos:', error);
    } finally {
      setLoading(false);
    }
  }, [onWeightsUpdate]);

  useEffect(() => {
    fetchRisks();
  }, [fetchRisks]);

  const filteredRisks = React.useMemo(() => {
    return risks.filter(risk => {
      if (!filters) return true;

      const matchesRisk = !filters.risk || risk.risk.toLowerCase().includes(filters.risk.toLowerCase());
      const matchesNature = !filters.nature || risk.nature === filters.nature;
      const matchesStatus = !filters.status || risk.status === filters.status;
      const matchesWeight = !filters.weight || Number(risk.weight).toFixed(2) === filters.weight;
      const matchesSeverity = !filters.severity || risk.severity === filters.severity;

      return matchesRisk && matchesNature && matchesStatus && matchesWeight && matchesSeverity;
    });
  }, [risks, filters]);

  useEffect(() => {
    if (onFilteredDataUpdate) {
      onFilteredDataUpdate(filteredRisks);
    }
  }, [filteredRisks, onFilteredDataUpdate]);

  const openModal = (type: 'remove' | 'draft', riskId: string) => {
    setModalConfig({ isOpen: true, type, riskId });
    setActiveMenu(null);
  };

  const handleConfirmAction = async () => {
    if (modalConfig.type === 'remove' && modalConfig.riskId) {
      try {
        const { error } = await supabase
          .from('risks')
          .delete()
          .eq('risk_id', modalConfig.riskId);

        if (error) throw error;
        setRisks(risks.filter(r => r.risk_id !== modalConfig.riskId));
      } catch (error) {
        console.error('Erro ao remover risco:', error);
      }
    } else if (modalConfig.type === 'draft') {
      console.log(`Alterando para draft: ${modalConfig.riskId}`);
    }
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-surface-container-lowest rounded-xl">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="text-sm text-on-surface-variant font-medium">Carregando registro de riscos...</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-lg shadow-on-surface/[0.03] overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar pb-2">
        <table className="w-full text-left border-collapse min-w-[800px] md:min-w-[1000px] lg:min-w-full">
          <thead>
            <tr className="bg-surface-container-high/50 text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">
              <th className="px-6 py-4 sticky left-0 bg-surface-container-high z-30">ID</th>
              <th className="px-6 py-4">Data</th>
              <th className="px-6 py-4">Natureza</th>
              <th className="px-6 py-4">Risco</th>
              <th className="px-6 py-4 hidden lg:table-cell">Causa</th>
              <th className="px-6 py-4 hidden xl:table-cell">Consequência</th>
              <th className="px-6 py-4 hidden md:table-cell">Gatilho</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center hidden sm:table-cell">Probabilidade</th>
              <th className="px-6 py-4 text-center hidden sm:table-cell">Impacto</th>
              <th className="px-6 py-4 text-center">Peso</th>
              <th className="px-6 py-4">Severidade</th>
              <th className="px-4 py-4 sticky right-0 bg-surface-container-high z-30 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {filteredRisks.length === 0 ? (
              <tr>
                <td colSpan={13} className="px-6 py-12 text-center text-on-surface-variant opacity-60 italic text-sm">
                  {risks.length === 0 ? 'Nenhum risco registrado no sistema.' : 'Nenhum risco corresponde aos filtros aplicados.'}
                </td>
              </tr>
            ) : (
              filteredRisks.map((risk, index) => (
                <tr key={risk.id} className={cn("hover:bg-surface-container-high transition-colors group", index % 2 !== 0 ? "bg-surface-container-low" : "bg-surface-container-lowest")}>
                  <td className="px-6 py-4 font-bold text-xs sticky left-0 bg-inherit z-10">{risk.risk_id}</td>
                  <td className="px-6 py-4 text-xs whitespace-nowrap">{new Date(risk.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-[10px] font-bold py-1 px-2 rounded-full uppercase tracking-tighter",
                      risk.nature === 'OPERACIONAL' && "bg-secondary-container text-on-secondary-container",
                      risk.nature === 'FINANCEIRO' && "bg-tertiary-container text-on-tertiary-container",
                      risk.nature === 'COMPLIANCE' && "bg-primary-container text-on-primary-container",
                      risk.nature === 'CYBERSECURITY' && "bg-error-container text-on-error",
                      risk.nature === 'ESTRATÉGICO' && "bg-outline-variant/30 text-on-surface-variant"
                    )}>
                      {risk.nature}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-xs text-on-surface max-w-[200px] truncate">{risk.risk}</td>
                  <td className="px-6 py-4 text-xs opacity-70 italic truncate max-w-[150px] hidden lg:table-cell">{risk.cause}</td>
                  <td className="px-6 py-4 text-xs opacity-70 truncate max-w-[150px] hidden xl:table-cell">{risk.consequence}</td>
                  <td className="px-6 py-4 text-xs truncate max-w-[120px] hidden md:table-cell">{risk.trigger}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "w-2 h-2 rounded-full",
                        risk.status === 'Crítico' || risk.status === 'Mitigando' ? "bg-error" : 
                        risk.status === 'Monitorando' ? "bg-secondary" : "bg-primary"
                      )}></span>
                      <span className="text-[10px] font-bold uppercase">{risk.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-xs font-bold hidden sm:table-cell">
                    {risk.p === 1 ? 'Muito Baixa' : risk.p === 2 ? 'Baixa' : risk.p === 3 ? 'Média' : risk.p === 4 ? 'Alta' : 'Muito Alta'}
                  </td>
                  <td className="px-6 py-4 text-center text-xs font-bold hidden sm:table-cell">
                    {risk.i === 1 ? 'Mínimo' : risk.i === 2 ? 'Menor' : risk.i === 3 ? 'Moderado' : risk.i === 4 ? 'Maior' : 'Catastrófico'}
                  </td>
                  <td className="px-6 py-4 text-center text-xs">{Number(risk.weight).toFixed(1)}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      risk.severity === 'Alta' ? "bg-error text-on-error" :
                      risk.severity === 'Média' ? "bg-secondary-container text-secondary" :
                      "bg-primary-container text-primary"
                    )}>
                      {risk.severity}
                    </span>
                  </td>
                  <td className="px-4 py-4 sticky right-0 bg-inherit z-20">
                    <div className="relative flex justify-center">
                      <button 
                        onClick={() => setActiveMenu(activeMenu === risk.id ? null : risk.id)}
                        className="p-1.5 text-on-surface-variant hover:bg-surface-container-highest rounded-full transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {activeMenu === risk.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-30" 
                            onClick={() => setActiveMenu(null)}
                          />
                          <div className="absolute right-full mr-2 top-0 w-32 bg-surface-container-lowest border border-outline-variant/20 rounded-lg shadow-xl z-40 py-1 overflow-hidden animate-in fade-in zoom-in duration-200">
                            <Link 
                              href={`/edit/${risk.risk_id}`}
                              className="w-full flex items-center gap-2 px-3 py-2 text-[10px] font-bold uppercase hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-primary"
                            >
                              <Edit2 className="w-3 h-3" />
                              Editar
                            </Link>
                            <button 
                              onClick={() => openModal('remove', risk.risk_id)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-[10px] font-bold uppercase hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-error"
                            >
                              <Trash2 className="w-3 h-3" />
                              Remover
                            </button>
                            <button 
                              onClick={() => openModal('draft', risk.risk_id)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-[10px] font-bold uppercase hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-secondary"
                            >
                              <FileText className="w-3 h-3" />
                              Rascunho
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={handleConfirmAction}
        title={modalConfig.type === 'remove' ? 'Remover Registro' : 'Alterar para Draft'}
        description={
          modalConfig.type === 'remove' 
            ? `Tem certeza que deseja remover o risco ${modalConfig.riskId}? Esta ação não pode ser desfeita.`
            : `Deseja mover o risco ${modalConfig.riskId} para o estado de rascunho? Ele não aparecerá nos relatórios ativos.`
        }
        confirmText={modalConfig.type === 'remove' ? 'Remover' : 'Confirmar'}
        type={modalConfig.type === 'remove' ? 'danger' : 'warning'}
      />
    </div>
  );
}
