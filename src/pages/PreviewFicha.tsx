import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function PreviewFicha() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [aGerar, setAGerar] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregarEGerarPDF() {
      if (!id) return;

      try {
        setAGerar(true);
        setErro(null);

        const { data: sessao } = await supabase.auth.getSession();

        const resp = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gerar-ficha`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${sessao.session?.access_token}`,
            },
            body: JSON.stringify({ id, apenasPreview: true }),
          }
        );

        if (!resp.ok) {
          throw new Error('Falha ao gerar o documento PDF.');
        }

        const blob = await resp.blob();
        setPdfUrl(URL.createObjectURL(blob));
      } catch (err) {
        console.error('Erro ao gerar preview:', err);
        setErro('Não foi possível carregar a pré-visualização da ficha.');
      } finally {
        setAGerar(false);
      }
    }

    carregarEGerarPDF();
  }, [id]);

  return (
    <div className="flex flex-col h-screen bg-slate-100">
      {/* Barra Superior / Ações */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1"
          >
            ← Voltar ao Dashboard
          </button>
          <span className="text-slate-300">|</span>
          <h1 className="text-base font-bold text-slate-800">
            Pré-visualização da Ficha de Inscrição
          </h1>
        </div>

        {pdfUrl && (
          <a
            href={pdfUrl}
            download={`ficha_escuteiro_${id}.pdf`}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all flex items-center gap-2"
          >
             Descarregar PDF
          </a>
        )}
      </header>

      {/* Área Central de Exibição */}
      <main className="flex-1 p-4 md:p-6 flex items-center justify-center overflow-hidden">
        {aGerar && (
          <div className="flex flex-col items-center gap-3 text-slate-500 font-medium text-sm">
            <span className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            A gerar a pré-visualização da ficha...
          </div>
        )}

        {erro && (
          <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-lg text-sm font-medium">
            {erro}
          </div>
        )}

        {!aGerar && !erro && pdfUrl && (
          <iframe
            src={pdfUrl}
            title="Pré-visualização da ficha"
            className="w-full h-full max-w-5xl rounded-xl border border-slate-200 shadow-md bg-white"
          />
        )}
      </main>
    </div>
  );
}