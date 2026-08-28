import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { escuteiroSchema, type EscuteiroFormInput } from '../lib/schema';
import { supabase } from '../lib/supabase';
import Step1Identificacao from '../components/form/Step1Identificacao';
import Step2Habilitacoes from '../components/form/Step2Habilitacoes';
import Step3SaudeReligiao from '../components/form/Step3SaudeReligiao';

const steps = [Step1Identificacao, Step2Habilitacoes, Step3SaudeReligiao];

export default function Editar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const methods = useForm<EscuteiroFormInput>({
  resolver: zodResolver(escuteiroSchema),
});

  useEffect(() => {
    async function carregar() {
      const { data, error } = await supabase
        .from('escuteiros')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        methods.reset(data);
      }
      setLoading(false);
    }
    carregar();
  }, [id, methods]);

  async function onSubmit(dados: EscuteiroFormInput) {
    setSalvando(true);
    const { error } = await supabase
      .from('escuteiros')
      .update({
        ...dados,
        editado_em: new Date().toISOString(),
      })
      .eq('id', id);
    setSalvando(false);

    if (!error) navigate('/dashboard');
  }

  if (loading) return <p className="p-6 text-sm text-gray-500">A carregar registo...</p>;

  const StepComponent = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="max-w-md mx-auto p-4">
        <p className="text-xs text-gray-500 mb-2">Editar inscrição</p>
        <StepComponent />

        <div className="flex justify-between mt-6">
          {step > 0 && (
            <button type="button" onClick={() => setStep((s) => s - 1)} className="px-4 py-2">
              Voltar
            </button>
          )}
          {!isLast && (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Seguinte
            </button>
          )}
          {isLast && (
            <button
              type="submit"
              disabled={salvando}
              className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
            >
              {salvando ? 'A guardar...' : 'Guardar alterações'}
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}