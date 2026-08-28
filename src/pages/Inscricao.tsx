import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';
import { escuteiroSchema, type EscuteiroForm } from '../lib/schema';
import { db } from '../lib/db-local';
import Step1Identificacao from '../components/form/Step1Identificacao';
import Step2Habilitacoes from '../components/form/Step2Habilitacoes';
import Step3SaudeReligiao from '../components/form/Step3SaudeReligiao';
import FotoCaptura from '../components/form/FotoCaptura';
import Assinatura from '../components/form/Assinatura';
import TermoAceitacao from '../components/form/TermoAceitacao';

const steps = [
  Step1Identificacao,
  Step2Habilitacoes,
  Step3SaudeReligiao,
  FotoCaptura,
  Assinatura,
  TermoAceitacao,
];

export default function Inscricao() {
  const [step, setStep] = useState(0);
  const [foto, setFoto] = useState<Blob>();
  const [assinatura, setAssinatura] = useState<Blob>();

  const methods = useForm<EscuteiroForm>({
    resolver: zodResolver(escuteiroSchema),
    defaultValues: { termo_aceite: false, baptizado: false, doenca: false, alergia: false, deficiencia: false },
  });

  const StepComponent = steps[step];
  const isLast = step === steps.length - 1;

  async function onSubmit(dados: EscuteiroForm) {
    await db.escuteiros.add({
      ...dados,
      local_id: uuidv4(),
      foto_blob: foto,
      assinatura_blob: assinatura,
      sync_status: 'pendente',
      created_at: new Date().toISOString(),
    });
    setStep(0);
    methods.reset();
    setFoto(undefined);
    setAssinatura(undefined);
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="max-w-md mx-auto p-4">
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
            <button type="button" onClick={() => setStep((s) => s + 1)} className="px-4 py-2 bg-blue-600 text-white rounded">
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