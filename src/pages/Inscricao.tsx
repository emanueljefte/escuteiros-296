import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Loader2, X, ShieldCheck } from 'lucide-react';

import { supabase } from '../lib/supabase';
import { escuteiroSchema, type EscuteiroFormInput } from '../lib/schema';
import { db } from '../lib/db-local';
import { enviarFicheiro } from '../lib/upload';

import Step1Identificacao from '../components/form/Step1Identificacao';
import Step2Habilitacoes from '../components/form/Step2Habilitacoes';
import Step3SaudeReligiao from '../components/form/Step3SaudeReligiao';
import FotoCaptura from '../components/form/FotoCaptura';
import Assinatura from '../components/form/Assinatura';
import TermoAceitacao from '../components/form/TermoAceitacao';
import TelaBoasVindas from '../components/form/TelaBoasVindas';
import TelaConcluido from '../components/form/TelaConcluido';

type Feedback = { tipo: 'sucesso' | 'aviso' | 'erro'; texto: string };
type Tela = 'boas-vindas' | 'formulario' | 'concluido';

const steps = [
  { componente: Step1Identificacao, titulo: 'Identificação', sub: 'Dados pessoais do escuteiro e encarregado' },
  { componente: Step2Habilitacoes, titulo: 'Habilitações e Cargo', sub: 'Escolaridade, ocupação e função na secção' },
  { componente: Step3SaudeReligiao, titulo: 'Saúde e Vida Cristã', sub: 'Histórico de saúde e dados sacramentais' },
  { componente: FotoCaptura, titulo: 'Fotografia', sub: 'Fotografia tipo passe para o registo (Opcional)' },
  { componente: Assinatura, titulo: 'Assinatura', sub: 'Assinatura digital do encarregado/membro (Opcional)' },
  { componente: TermoAceitacao, titulo: 'Termos e Conclusão', sub: 'Confirmação e aceitação dos regulamentos' },
];

export default function Inscricao() {
  const [tela, setTela] = useState<Tela>('boas-vindas');
  const [step, setStep] = useState(0);
  const [foto, setFoto] = useState<Blob | undefined>();
  const [assinatura, setAssinatura] = useState<Blob | undefined>();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [submetendo, setSubmetendo] = useState(false);

  const defaultValues: EscuteiroFormInput = {
    nome_completo: '',
    filho_de: '',
    e_de: '',
    tipo_documento: undefined,
    numero_documento: '',
    provincia: undefined,
    data_nascimento: '', // Garantir validação no schema (e.g. z.string().min(1, 'Data obrigatória'))
    nome_encarregado_1: '',
    contacto_encarregado_1: '',
    estado_civil: undefined,
    sexo: undefined, // Inicializado como undefined para forçar a seleção
    morada: '',
    contacto_pessoal: '',
    whatsapp_pessoal: '',
    nome_encarregado_2: '',
    parentesco_1: undefined, // Inicializado como undefined para forçar a seleção
    parentesco_2: undefined,
    contacto_encarregado_2: '',
    whatsapp_encarregado_1: '',
    whatsapp_encarregado_2: '',
    habilitacao_literaria: undefined,
    nome_instituicao: '',
    local_escola: '',
    profissao: '',
    local_trabalho: '',
    outras_ocupacao: '',
    seccao: undefined,
    categoria: undefined,
    patrulha_bando_equipe: '',
    cargo_funcao: undefined,
    data_promessa: '',
    situacao: undefined,
    igreja: '',
    baptizado: false,
    pertence_outro_grupo: false,
    pertence_outro_grupo_qual: '',
    sofre_doenca: false,
    sofre_doenca_qual: '',
    obs: '',
    termo_aceite: false,
  };

  const methods = useForm<EscuteiroFormInput>({
    resolver: zodResolver(escuteiroSchema),
    mode: 'all', // 'all' aciona validação tanto no onChange/blur quanto no trigger
    defaultValues,
  });

  // Temporizador para fechar alertas automaticamente
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const StepComponent = steps[step].componente;
  const isLast = step === steps.length - 1;
  const progressoPercentual = Math.round(((step + 1) / steps.length) * 100);

  // Mapeamento exato dos campos por etapa
  const camposPorStep: (keyof EscuteiroFormInput)[][] = [
    // Step 1: Identificação (Valida estritamente data_nascimento, sexo e parentesco_1)
    [
      'nome_completo',
      'filho_de',
      'e_de',
      'tipo_documento',
      'numero_documento',
      'provincia',
      'data_nascimento',
      'sexo',
      'estado_civil',
      'morada',
      'contacto_pessoal',
      'whatsapp_pessoal',
      'nome_encarregado_1',
      'parentesco_1',
      'contacto_encarregado_1',
      'whatsapp_encarregado_1',
      'nome_encarregado_2',
      'parentesco_2',
      'contacto_encarregado_2',
      'whatsapp_encarregado_2',
    ],

    // Step 2: Habilitações e Cargo
    [
      // 'habilitacao_literaria',
      // 'nome_instituicao',
      // 'local_escola',
      // 'profissao',
      // 'local_trabalho',
      // 'outras_ocupacao',
    ],

    [
      'seccao',
      'categoria',
      'patrulha_bando_equipe',
      'cargo_funcao',
      'data_promessa',
      'situacao',
    ],

    // Step 3: Saúde e Vida Cristã
    [
      'igreja',
      'baptizado',
      'sofre_doenca',
      'sofre_doenca_qual',
      'pertence_outro_grupo',
      'pertence_outro_grupo_qual',
      'obs',
    ],

    // Step 4: Fotografia (Opcional)
    [],

    // Step 5: Assinatura (Opcional)
    [],

    // Step 6: Termos e Conclusão
    ['termo_aceite'],
  ];

  async function avancar() {
    const campos = camposPorStep[step];

    if (campos && campos.length > 0) {
    // Valida apenas os campos da etapa atual
    const valido = await methods.trigger(campos, { shouldFocus: true });

    if (!valido) {
      // Podes buscar a primeira mensagem de erro real da etapa atual
      const errosDaEtapa = Object.keys(methods.formState.errors).filter((campo) =>
        campos.includes(campo as keyof EscuteiroFormInput)
      );

      if (errosDaEtapa.length > 0) {
        setFeedback({
          tipo: 'aviso',
          texto: 'Por favor, preencha corretamente os campos obrigatórios desta etapa.',
        });
        return;
      }
    }
  }

    setFeedback(null);
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function voltar() {
    if (step > 0) {
      setStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  async function onSubmit(dados: EscuteiroFormInput) {
    setSubmetendo(true);
    setFeedback(null);

    const registoBase = {
      ...dados,
      baptizado: dados.baptizado ?? false,
      pertence_outro_grupo: dados.pertence_outro_grupo ?? false,
      sofre_doenca: dados.sofre_doenca ?? false,
      local_id: uuidv4(),
      created_at: new Date().toISOString(),
    };

    try {
      if (!navigator.onLine) throw new Error('offline');

      const foto_url = foto ? await enviarFicheiro('fotos', registoBase.local_id, foto) : null;
      const assinatura_url = assinatura ? await enviarFicheiro('assinaturas', registoBase.local_id, assinatura) : null;

      const { error } = await supabase.from('escuteiros').insert({
        ...registoBase,
        foto_url,
        assinatura_url,
      });

      if (error) throw error;
      concluirInscricao();
    } catch {
      try {
        await db.escuteiros.add({
          ...registoBase,
          foto_blob: foto,
          assinatura_blob: assinatura,
          sync_status: 'pendente',
        });
        concluirInscricao();
      } catch (erroLocal) {
        console.error(erroLocal);
        setFeedback({
          tipo: 'erro',
          texto: 'Não foi possível guardar a inscrição. Verifica a ligação e tenta novamente.',
        });
      }
    } finally {
      setSubmetendo(false);
    }
  }

  function concluirInscricao() {
    methods.reset(defaultValues);
    setFoto(undefined);
    setAssinatura(undefined);
    setStep(0);
    setTela('concluido');
  }

  if (tela === 'boas-vindas') {
    return <TelaBoasVindas onComecar={() => setTela('formulario')} />;
  }

  if (tela === 'concluido') {
    return <TelaConcluido onCadastrarOutro={() => setTela('formulario')} />;
  }

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-slate-100/70 py-6 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
        {/* Notificação / Feedback Toast */}
        {feedback && (
          <div
            className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 max-w-md w-full mx-4 p-4 rounded-2xl shadow-xl text-white backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
              feedback.tipo === 'erro'
                ? 'bg-red-600/95 ring-1 ring-red-400'
                : feedback.tipo === 'aviso'
                ? 'bg-amber-600/95 ring-1 ring-amber-400'
                : 'bg-emerald-600/95 ring-1 ring-emerald-400'
            }`}
          >
            {feedback.tipo === 'erro' ? (
              <AlertCircle size={20} className="shrink-0 text-red-200" />
            ) : (
              <CheckCircle2 size={20} className="shrink-0 text-emerald-200" />
            )}
            <p className="text-xs sm:text-sm font-medium flex-1">{feedback.texto}</p>
            <button
              onClick={() => setFeedback(null)}
              className="p-1 hover:bg-white/20 rounded-lg transition"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Cartão Principal do Formulário */}
        <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 overflow-hidden flex flex-col">
          {/* Cabeçalho */}
          <div className="bg-gradient-to-r from-[#651F65] via-[#7B277B] to-[#8A3D8A] p-6 text-white relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md text-xs font-black text-white ring-1 ring-white/20">
                  296
                </div>
                <div>
                  <h1 className="text-sm font-bold leading-none">Agrupamento Nº 296</h1>
                  <p className="text-[11px] text-purple-200 mt-0.5">Ficha Oficial de Inscrição</p>
                </div>
              </div>
              <span className="text-[11px] font-bold bg-white/15 px-3 py-1 rounded-full border border-white/20">
                Etapa {step + 1} de {steps.length}
              </span>
            </div>

            {/* Título da Etapa Atual */}
            <div className="mt-2">
              <h2 className="text-lg font-extrabold tracking-tight">{steps[step].titulo}</h2>
              <p className="text-xs text-purple-200/90 mt-0.5">{steps[step].sub}</p>
            </div>

            {/* Barra de Progresso */}
            <div className="mt-5 h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progressoPercentual}%` }}
              />
            </div>
          </div>

          {/* Corpo do Formulário */}
          <form
            onSubmit={methods.handleSubmit(onSubmit, () => {
              setFeedback({
                tipo: 'aviso',
                texto: 'Por favor, preencha corretamente os campos obrigatórios assinalados.',
              });
            })}
            className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6"
          >
            {/* Componente Dinâmico da Etapa */}
            <div className="min-h-[280px]">
              <StepComponent
                fotoProps={{ foto, setFoto }}
                assinaturaProps={{ assinatura, setAssinatura }}
              />
            </div>

            {/* Controlos de Navegação */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={voltar}
                  disabled={submetendo}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition active:scale-95 disabled:opacity-50"
                >
                  <ArrowLeft size={16} />
                  Voltar
                </button>
              ) : (
                <div />
              )}

              {!isLast ? (
                <button
                  type="button"
                  onClick={avancar}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#651F65] hover:bg-[#521852] text-white text-xs font-bold shadow-md shadow-purple-900/10 transition active:scale-95"
                >
                  Seguinte
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submetendo}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-900/10 transition active:scale-95 disabled:opacity-50"
                >
                  {submetendo ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      A submeter...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={16} />
                      Concluir Inscrição
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </FormProvider>
  );
}