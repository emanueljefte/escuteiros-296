import { supabase } from '../lib/supabase';
import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';
import { escuteiroSchema, type EscuteiroFormInput } from '../lib/schema';
import { db } from '../lib/db-local';
import Step1Identificacao from '../components/form/Step1Identificacao';
import Step2Habilitacoes from '../components/form/Step2Habilitacoes';
import Step3SaudeReligiao from '../components/form/Step3SaudeReligiao';
import FotoCaptura from '../components/form/FotoCaptura';
import Assinatura from '../components/form/Assinatura';
import TermoAceitacao from '../components/form/TermoAceitacao';
import { enviarFicheiro } from '../lib/upload';

const steps = [
  Step1Identificacao,
  Step2Habilitacoes,
  Step3SaudeReligiao,
  FotoCaptura,
  Assinatura,
  TermoAceitacao,
];

type Feedback = { tipo: 'sucesso' | 'aviso' | 'erro'; texto: string };

const cores: Record<Feedback['tipo'], string> = {
  sucesso: 'bg-green-600',
  aviso: 'bg-amber-500',
  erro: 'bg-red-600',
};

export default function Inscricao() {
  const [step, setStep] = useState(0);
  const [foto, setFoto] = useState<Blob>();
  const [assinatura, setAssinatura] = useState<Blob>();
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const methods = useForm<EscuteiroFormInput>({
    resolver: zodResolver(escuteiroSchema),
    defaultValues: { termo_aceite: false, baptizado: false, doenca: false, alergia: false, deficiencia: false },
  });

  const StepComponent = steps[step];
  const isLast = step === steps.length - 1;

const camposPorStep: (keyof EscuteiroFormInput)[][] = [
  ['nome_completo', 'telefone'],                    // Step1 (só os obrigatórios)
  [],                                                 // Step2 — sem obrigatórios
  [],                                                 // Step3 — sem obrigatórios
  [],                                                 // FotoCaptura — opcional
  [],                                                 // Assinatura — opcional
  ['termo_aceite'],                                   // TermoAceitacao
];

async function avancar() {
  const campos = camposPorStep[step];
  const valido = campos.length === 0 ? true : await methods.trigger(campos);
  if (valido) setStep((s) => s + 1);
}

  async function onSubmit(dados: EscuteiroFormInput) {
    const registoBase = {
      ...dados,
      baptizado: dados.baptizado ?? false,
      doenca: dados.doenca ?? false,
      alergia: dados.alergia ?? false,
      deficiencia: dados.deficiencia ?? false,
      local_id: uuidv4(),
      created_at: new Date().toISOString(),
    };

    try {
      if (!navigator.onLine) throw new Error('offline');

      const foto_url = await enviarFicheiro('fotos', registoBase.local_id, foto);
      const assinatura_url = await enviarFicheiro('assinaturas', registoBase.local_id, assinatura);

      const { error } = await supabase.from('escuteiros').insert({
        ...registoBase,
        foto_url,
        assinatura_url,
      });

      if (error) throw error;

      setFeedback({ tipo: 'sucesso', texto: 'Inscrição submetida com sucesso!' });
    } catch {
      // sem rede ou falha no Supabase — guarda localmente para sincronizar depois
      await db.escuteiros.add({
        ...registoBase,
        foto_blob: foto,
        assinatura_blob: assinatura,
        sync_status: 'pendente',
      });
      setFeedback({ tipo: 'aviso', texto: 'Sem ligação — inscrição guardada e será enviada automaticamente.' });
    }

    setStep(0);
    methods.reset();
    setFoto(undefined);
    setAssinatura(undefined);
    setTimeout(() => setFeedback(null), 5000);
  }

  return (
    <FormProvider {...methods}>
      {feedback && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${cores[feedback.tipo]}`}>
          {feedback.texto}
        </div>
      )}
      <form onSubmit={methods.handleSubmit(onSubmit, (errors) => console.log('Erros de validação:', errors))} className="max-w-md mx-auto p-4">
        <StepComponent
          fotoProps={{ foto, setFoto }}
          assinaturaProps={{ assinatura, setAssinatura }}
        />

        <div className="flex justify-between mt-6">
          {step > 0 && (
            <button type="button" onClick={() => setStep((s) => s - 1)} className="px-4 py-2">
              Voltar
            </button>
          )}
          {!isLast && (
            <button type="button" onClick={avancar} className="px-4 py-2 bg-blue-600 text-white rounded">
              Seguinte
            </button>
          )}
          {isLast && (
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
              Concluir Inscrição
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}