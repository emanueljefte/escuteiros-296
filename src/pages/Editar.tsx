import { useState, useEffect } from 'react';
import { useParams, } from 'react-router-dom';
import { useNavigate as useReactNavigate } from 'react-router-dom';
import { useForm, FormProvider, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import Step1Identificacao from '../components/form/Step1Identificacao';
import Step2Habilitacoes from '../components/form/Step2Habilitacoes';
import Step3SaudeReligiao from '../components/form/Step3SaudeReligiao';
import { escuteiroSchema, type EscuteiroFormInput } from '../lib/schema';
import { supabase } from '../lib/supabase';

// Etapas ativas no formulário
const STEPS = [
  { id: 0, titulo: 'Identificação', componente: Step1Identificacao },
  { id: 1, titulo: 'Habilitações', componente: Step2Habilitacoes },
  { id: 2, titulo: 'Saúde & Vida Cristã', componente: Step3SaudeReligiao },
];

// Mapeamento EXATO dos campos pelas 3 etapas ativas
const camposPorStep: (keyof EscuteiroFormInput)[][] = [
  // Step 0: Identificação
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

  // Step 1: Habilitações, Ocupação e Cargo
  [
    'habilitacao_literaria',
    'nome_instituicao',
    'local_escola',
    'profissao',
    'local_trabalho',
    'outras_ocupacao',
    'seccao',
    'categoria',
    'patrulha_bando_equipe',
    'cargo_funcao',
    'data_promessa',
    'situacao',
  ],

  // Step 2: Saúde e Vida Cristã
  [
    'igreja',
    'baptizado',
    'sofre_doenca',
    'sofre_doenca_qual',
    'pertence_outro_grupo',
    'pertence_outro_grupo_qual',
    'obs',
  ],
];

export default function Editar() {
  const { id } = useParams();
  const navigate = useReactNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mostrarModalDescarte, setMostrarModalDescarte] = useState(false);
  const [feedback, setFeedback] = useState<{ tipo: 'aviso' | 'erro'; texto: string } | null>(null);

  const methods = useForm<EscuteiroFormInput>({
    resolver: zodResolver(escuteiroSchema),
    mode: 'onTouched',
  });

  const { formState: { isDirty } } = methods;

  // Carrega os dados do Supabase
  useEffect(() => {
    async function carregar() {
      if (!id) return;

      const { data, error } = await supabase
        .from('escuteiros')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        const dadosLimpos = Object.fromEntries(
          Object.entries(data).map(([k, v]) => [k, v === null ? '' : v])
        );
        methods.reset(dadosLimpos as EscuteiroFormInput);
      } else {
        console.error('Erro ao carregar registo:', error);
        setFeedback({
          tipo: 'erro',
          texto: 'Não foi possível carregar os dados do escuteiro.',
        });
      }
      setLoading(false);
    }

    carregar();
  }, [id]);

  // Função para tratar o clique no botão "Voltar ao Dashboard"
  function handleVoltarDashboard() {
    if (isDirty) {
      setMostrarModalDescarte(true);
    } else {
      navigate('/dashboard');
    }
  }

  // Valida e avança de etapa
  async function avancar(e?: React.MouseEvent<HTMLButtonElement>) {
    if (e) e.preventDefault();

    const campos = camposPorStep[step];

    if (campos && campos.length > 0) {
      const valido = await methods.trigger(campos, { shouldFocus: true });

      if (!valido) {
        setFeedback({
          tipo: 'aviso',
          texto: 'Por favor, corrija os erros assinalados na etapa atual antes de continuar.',
        });
        return;
      }
    }

    setFeedback(null);
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function voltar() {
    setFeedback(null);
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Identifica erros em etapas anteriores e redireciona automaticamente
  function lidarComErroSubmissao(errs: FieldErrors<EscuteiroFormInput>) {
    console.log('Validação falhou na submissão:', errs);
    const camposComErro = Object.keys(errs) as (keyof EscuteiroFormInput)[];

    const primeiroStepComErro = camposPorStep.findIndex((camposDaEtapa) =>
      camposDaEtapa.some((campo) => camposComErro.includes(campo))
    );

    if (primeiroStepComErro !== -1 && primeiroStepComErro !== step) {
      setStep(primeiroStepComErro);
      setFeedback({
        tipo: 'aviso',
        texto: `Existem campos com erro na etapa "${STEPS[primeiroStepComErro].titulo}". Redirecionamos você até lá.`,
      });
    } else {
      setFeedback({
        tipo: 'aviso',
        texto: 'Por favor, verifique os campos destacados com erros antes de guardar.',
      });
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function onSubmit(dados: EscuteiroFormInput) {
    setSalvando(true);
    setFeedback(null);

    const { error } = await supabase
      .from('escuteiros')
      .update({
        ...dados,
        baptizado: dados.baptizado ?? false,
        pertence_outro_grupo: dados.pertence_outro_grupo ?? false,
        sofre_doenca: dados.sofre_doenca ?? false,
        editado_em: new Date().toISOString(),
      })
      .eq('id', id);

    setSalvando(false);

    if (error) {
      console.error('Erro ao guardar:', error);
      setFeedback({
        tipo: 'erro',
        texto: 'Ocorreu um erro ao atualizar os dados no servidor. Tente novamente.',
      });
      return;
    }

    navigate('/dashboard');
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="flex items-center gap-3 text-slate-500 font-medium text-sm">
          <span className="w-5 h-5 border-2 border-[#651F65] border-t-transparent rounded-full animate-spin" />
          A carregar registo...
        </div>
      </div>
    );
  }

  const StepComponent = STEPS[step].componente;
  const isLast = step === STEPS.length - 1;

  return (
    <FormProvider {...methods}>
      <div className="max-w-xl mx-auto my-8 px-4">
        
        {/* Botão Superior para Voltar ao Dashboard */}
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={handleVoltarDashboard}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-100 hover:text-[#651F65] border border-slate-200 rounded-lg transition-all shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Dashboard
          </button>

          {isDirty && (
            <span className="text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Alterações pendentes
            </span>
          )}
        </div>

        <form
          onSubmit={methods.handleSubmit(onSubmit, lidarComErroSubmissao)}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
          noValidate
        >
          {/* Cabeçalho */}
          <div className="mb-6 border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold tracking-wider uppercase text-[#651F65] bg-purple-50 border border-purple-100 px-2.5 py-1 rounded-full">
                Edição de Ficha
              </span>
              <h1 className="text-xl font-bold text-slate-800 mt-2">Editar Inscrição</h1>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              Passo {step + 1} de {STEPS.length}
            </span>
          </div>

          {/* Stepper Visual */}
          <nav aria-label="Progresso da edição" className="mb-8">
            <ol className="flex items-center justify-between w-full relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -z-0 -translate-y-1/2" />

              {STEPS.map((s, index) => {
                const isCurrent = index === step;
                const isCompleted = index < step;

                return (
                  <li key={s.id} className="relative z-10 flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => {
                        if (index < step) setStep(index);
                      }}
                      disabled={index > step}
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200 cursor-pointer ${
                        isCurrent
                          ? 'bg-[#651F65] text-white ring-4 ring-purple-100'
                          : isCompleted
                          ? 'bg-purple-800 text-white hover:bg-[#651F65]'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {isCompleted ? '✓' : index + 1}
                    </button>
                    <span
                      className={`text-xs font-medium mt-2 hidden sm:block ${
                        isCurrent ? 'text-[#651F65] font-semibold' : 'text-slate-500'
                      }`}
                    >
                      {s.titulo}
                    </span>
                  </li>
                );
              })}
            </ol>
          </nav>

          {/* Alertas / Mensagens de Feedback */}
          {feedback && (
            <div
              role="alert"
              className={`mb-6 p-4 rounded-xl text-sm font-medium flex items-start gap-3 transition-all ${
                feedback.tipo === 'erro'
                  ? 'bg-red-50 text-red-800 border border-red-200'
                  : 'bg-amber-50 text-amber-900 border border-amber-200'
              }`}
            >
              <span className="text-base leading-none">
                {feedback.tipo === 'erro' ? '⚠️' : '💡'}
              </span>
              <div className="flex-1 text-xs leading-relaxed">{feedback.texto}</div>
              <button
                type="button"
                onClick={() => setFeedback(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Componente Ativo */}
          <div className="min-h-[280px]">
            <StepComponent />
          </div>

          {/* Controles do Formulário */}
          <div className="flex items-center justify-between pt-6 mt-8 border-t border-slate-100">
            {step > 0 ? (
              <button
                type="button"
                onClick={voltar}
                className="px-5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
              >
                ← Voltar
              </button>
            ) : (
              <div />
            )}

            {!isLast ? (
              <button
                type="button"
                onClick={(e) => avancar(e)}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-[#651F65] hover:bg-[#7B277B] rounded-xl shadow-xs transition-all ml-auto flex items-center gap-2 cursor-pointer"
              >
                Seguinte →
              </button>
            ) : (
              <button
                type="submit"
                disabled={salvando}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-[#651F65] hover:bg-[#7B277B] rounded-xl shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed ml-auto flex items-center gap-2 cursor-pointer"
              >
                {salvando ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    A guardar...
                  </>
                ) : (
                  'Guardar alterações'
                )}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Modal de Confirmação de Descarte de Alterações */}
      {mostrarModalDescarte && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="p-2 bg-amber-100 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Descartar alterações?
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Existem modificações não guardadas no formulário. Se voltar ao Dashboard agora, todas as edições efetuadas serão perdidas.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setMostrarModalDescarte(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
              >
                Continuar a Editar
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition cursor-pointer"
              >
                Descartar e Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </FormProvider>
  );
}