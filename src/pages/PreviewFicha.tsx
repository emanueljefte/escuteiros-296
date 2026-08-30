import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { escuteiroSchema, type EscuteiroFormInput } from '../lib/schema';
import { supabase } from '../lib/supabase';
import Step1Identificacao from '../components/form/Step1Identificacao';
import Step2Habilitacoes from '../components/form/Step2Habilitacoes';
import Step3SaudeReligiao from '../components/form/Step3SaudeReligiao';

export default function PreviewFicha() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [aGerar, setAGerar] = useState(false);
  const [loading, setLoading] = useState(true);

  const methods = useForm<EscuteiroFormInput>({ resolver: zodResolver(escuteiroSchema) });

  useEffect(() => {
    supabase.from('escuteiros').select('*').eq('id', id).single().then(({ data }) => {
      if (data) methods.reset(data);
      setLoading(false);
    });
  }, [id, methods]);

  async function gerarPreview(guardar: boolean) {
    setAGerar(true);
    const overrides = methods.getValues();

    if (guardar) {
      await supabase.from('escuteiros').update(overrides).eq('id', id);
    }

    const { data: sessao } = await supabase.auth.getSession();
    const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gerar-ficha`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessao.session?.access_token}`,
      },
      body: JSON.stringify({ id, overrides, apenasPreview: !guardar }),
    });

    const blob = await resp.blob();
    setPdfUrl(URL.createObjectURL(blob));
    setAGerar(false);
  }

  if (loading) return <p className="p-6 text-sm text-gray-500">A carregar...</p>;

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      {/* Coluna de edição */}
      <div className="overflow-y-auto border-r border-gray-200 p-6">
        <button onClick={() => navigate('/dashboard')} className="mb-4 text-xs text-gray-500">
          ← Voltar ao Dashboard
        </button>
        <h1 className="mb-4 text-lg font-bold text-aea-roxo">Editar antes de exportar</h1>

        <FormProvider {...methods}>
          <div className="space-y-8">
            <Step1Identificacao />
            <Step2Habilitacoes />
            <Step3SaudeReligiao />
          </div>
        </FormProvider>

        <div className="mt-6 flex gap-2">
          <button
            onClick={() => gerarPreview(false)}
            disabled={aGerar}
            className="flex-1 rounded-lg border border-aea-roxo px-4 py-2.5 text-sm font-medium text-aea-roxo disabled:opacity-50"
          >
            {aGerar ? 'A gerar...' : 'Pré-visualizar'}
          </button>
          <button
            onClick={() => gerarPreview(true)}
            disabled={aGerar}
            className="flex-1 rounded-lg bg-aea-roxo px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
          >
            Guardar e Exportar PDF
          </button>
        </div>
      </div>

      {/* Coluna de preview visual */}
      <div className="flex items-center justify-center bg-gray-100 p-4">
        {pdfUrl ? (
          <iframe src={pdfUrl} title="Pré-visualização da ficha" className="h-full w-full rounded-lg border" />
        ) : (
          <p className="text-sm text-gray-400">Clica em "Pré-visualizar" para ver a ficha</p>
        )}
      </div>
    </div>
  );
}