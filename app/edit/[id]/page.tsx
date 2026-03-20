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
  AlertTriangle,
  ChevronDown,
  BarChart3,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { ConfirmationModal } from '@/components/ConfirmationModal';

export default function EditRiskPage() {
  const router = useRouter();
  const params = useParams();
  const riskId = params.id as string;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    risk: '',
    date: '',
    nature: 'OPERACIONAL',
    status: 'Identificado',
    trigger: '',
    cause: '',
    consequence: '',
    observations: ''
  });
  
  const [probability, setProbability] = useState(3);
  const [impact, setImpact] = useState(4);

  const weight = (probability * impact) / 16;
  const gravity = probability * impact;
  const severity = gravity > 12 ? 'Alta' : gravity > 6 ? 'Média' : 'Baixa';

  useEffect(() => {
    const fetchRisk = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('risks')
          .select('*')
          .eq('risk_id', riskId)
          .single();

        if (error) throw error;

        if (data) {
          setFormData({
            risk: data.risk || '',
            date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
            nature: data.nature || 'OPERACIONAL',
            status: data.status || 'Identificado',
            trigger: data.trigger || '',
            cause: data.cause || '',
            consequence: data.consequence || '',
            observations: data.observations || ''
          });
          setProbability(data.p || 3);
          setImpact(data.i || 4);
        }
      } catch (error) {
        console.error('Erro ao buscar risco:', error);
        alert('Erro ao carregar os dados do risco.');
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    if (riskId) {
      fetchRisk();
    }
  }, [riskId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Você precisa estar autenticado para salvar um risco.');
      }

      const { error } = await supabase
        .from('risks')
        .update({
          date: new Date(formData.date).toISOString(),
          nature: formData.nature,
          risk: formData.risk,
          cause: formData.cause,
          consequence: formData.consequence,
          trigger: formData.trigger,
          status: formData.status,
          p: probability,
          i: impact,
          weight: weight,
          severity: severity,
          updated_at: new Date().toISOString()
        })
        .eq('risk_id', riskId);

      if (error) throw error;

      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Erro ao atualizar risco:', error);
      alert('Erro ao atualizar o risco. Verifique o console para mais detalhes.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const { error } = await supabase
        .from('risks')
        .delete()
        .eq('risk_id', riskId);

      if (error) throw error;

      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Erro ao excluir risco:', error);
      alert('Erro ao excluir o risco.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-on-surface-variant font-medium">Carregando dados do risco...</p>
        </div>
      </div>
    );
  }

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

          <form onSubmit={handleSubmit} className="space-y-8 md:y-12 pb-20">
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
                    required
                    value={formData.risk}
                    onChange={(e) => setFormData({ ...formData, risk: e.target.value })}
                    placeholder="Descreva o evento de risco claramente..." 
                    className="w-full bg-surface-container-high border-none focus:ring-0 focus:bg-surface-container-lowest focus:border-b-2 focus:border-primary rounded-md px-4 py-3 text-on-surface outline-none transition-all"
                  />
                </div>
                <div className="sm:col-span-4 space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant ml-1">Date (Data)</label>
                  <input 
                    type="date" 
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-surface-container-high border-none focus:ring-0 focus:bg-surface-container-lowest focus:border-b-2 focus:border-primary rounded-md px-4 py-3 text-on-surface outline-none transition-all"
                  />
                </div>
                
                <div className="sm:col-span-4 space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant ml-1">Nature (Natureza)</label>
                  <div className="relative">
                    <select 
                      value={formData.nature}
                      onChange={(e) => setFormData({ ...formData, nature: e.target.value })}
                      className="w-full bg-surface-container-high border-none focus:ring-0 focus:bg-surface-container-lowest focus:border-b-2 focus:border-primary rounded-md px-4 py-3 text-on-surface appearance-none outline-none transition-all"
                    >
                      <option value="OPERACIONAL">Operacional</option>
                      <option value="FINANCEIRO">Financeiro</option>
                      <option value="COMPLIANCE">Compliance</option>
                      <option value="CYBERSECURITY">Cybersecurity</option>
                      <option value="ESTRATÉGICO">Estratégico</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                  </div>
                </div>
                
                <div className="sm:col-span-4 space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant ml-1">Status</label>
                  <div className="relative">
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full bg-surface-container-high border-none focus:ring-0 focus:bg-surface-container-lowest focus:border-b-2 focus:border-primary rounded-md px-4 py-3 text-on-surface appearance-none outline-none transition-all"
                    >
                      <option>Identificado</option>
                      <option>Análise</option>
                      <option>Mitigando</option>
                      <option>Monitorando</option>
                      <option>Crítico</option>
                      <option>Fechado</option>
                      <option>Rascunho</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                  </div>
                </div>
                
                <div className="sm:col-span-4 space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant ml-1">Gatilho (Gatilho)</label>
                  <textarea 
                    value={formData.trigger}
                    onChange={(e) => setFormData({ ...formData, trigger: e.target.value })}
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
                    value={formData.cause}
                    onChange={(e) => setFormData({ ...formData, cause: e.target.value })}
                    placeholder="Causa raiz do risco identificado..." 
                    rows={4}
                    className="w-full bg-surface-container-high border-none focus:ring-0 focus:bg-surface-container-lowest focus:border-b-2 focus:border-primary rounded-md px-4 py-3 text-on-surface outline-none transition-all resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant ml-1">Consequência (Consequência)</label>
                  <textarea 
                    value={formData.consequence}
                    onChange={(e) => setFormData({ ...formData, consequence: e.target.value })}
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
                      {[1, 2, 3, 4, 5].map((val) => (
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
                          {val === 1 ? 'Muito Baixa (1)' : val === 2 ? 'Baixa (2)' : val === 3 ? 'Média (3)' : val === 4 ? 'Alta (4)' : 'Muito Alta (5)'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/15 flex flex-col justify-between">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-4">Impacto (Impacto)</label>
                    <div className="flex flex-col gap-2">
                      {[1, 2, 3, 4, 5].map((val) => (
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
                          {val === 1 ? 'Mínimo (1)' : val === 2 ? 'Menor (2)' : val === 3 ? 'Moderado (3)' : val === 4 ? 'Maior (4)' : 'Catastrófico (5)'}
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
                          type="text" 
                          readOnly 
                          value={weight.toFixed(2)}
                          className="bg-white/5 border-b border-white/10 hover:bg-white/10 focus:bg-white/10 transition-all p-2 -ml-2 text-2xl md:text-3xl font-headline font-extrabold text-on-primary outline-none w-full rounded-t-lg"
                        />
                        <p className="text-[10px] text-outline-variant mt-1 uppercase font-bold tracking-wider">Peso (Peso)</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            readOnly 
                            value={gravity}
                            className="bg-white/5 border-b border-error/30 hover:bg-white/10 focus:bg-white/10 transition-all p-2 -ml-2 text-2xl md:text-3xl font-headline font-extrabold text-error-container outline-none w-24 md:w-28 rounded-t-lg"
                          />
                          <AlertTriangle className="w-5 md:w-6 h-5 md:h-6 text-error-container" />
                        </div>
                        <p className="text-[10px] text-outline-variant mt-1 uppercase font-bold tracking-wider">Gravidade (Gravidade)</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 md:mt-8">
                    <span className={cn(
                      "inline-flex items-center px-4 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest",
                      severity === 'Alta' ? "bg-error/20 text-error-container" : 
                      severity === 'Média' ? "bg-secondary/20 text-secondary" : 
                      "bg-primary/20 text-primary"
                    )}>
                      Prioridade: {severity}
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
                    value={formData.observations}
                    onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                    placeholder="Quaisquer detalhes extras, documentos relacionados ou partes interessadas envolvidas..." 
                    rows={3}
                    className="w-full bg-surface-container-high border-none focus:ring-0 focus:bg-surface-container-lowest focus:border-b-2 focus:border-primary rounded-md px-4 py-3 text-on-surface outline-none transition-all resize-none"
                  />
                </div>
              </div>
            </section>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-outline-variant/20">
              <button 
                type="button" 
                onClick={() => setIsDeleteModalOpen(true)}
                className="w-full sm:w-auto text-error font-bold px-6 py-3 rounded-xl hover:bg-error/10 transition-colors"
              >
                Excluir Registro
              </button>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto">
                <button 
                  type="button" 
                  onClick={() => router.push('/')}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-on-surface border border-outline-variant transition-all hover:bg-surface-container-high"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="w-full sm:w-auto px-10 py-3 rounded-xl font-bold bg-primary text-on-primary shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Atualizar Registro de Risco
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Excluir Registro"
        description={`Tem certeza que deseja excluir o risco ${riskId}? Esta ação não pode ser desfeita.`}
        confirmText={deleting ? "Excluindo..." : "Excluir"}
        type="danger"
      />
    </div>
  );
}
