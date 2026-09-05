import { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { PenTool, Trash2, CheckCircle2, FileCheck } from 'lucide-react';

interface Props {
  assinaturaProps: {
    assinatura?: Blob;
    setAssinatura: (blob?: Blob) => void;
  };
}

export default function Assinatura({ assinaturaProps }: Props) {
  const { assinatura, setAssinatura } = assinaturaProps;
  const padRef = useRef<SignatureCanvas>(null);

  // Guarda a assinatura como Blob PNG sempre que o utilizador termina de desenhar um traço
  const salvar = () => {
    if (!padRef.current || padRef.current.isEmpty()) return;
    padRef.current.getCanvas().toBlob((blob) => {
      if (blob) setAssinatura(blob);
    }, 'image/png');
  };

  // Limpa o Canvas e limpa o valor no estado global
  const limpar = () => {
    padRef.current?.clear();
    setAssinatura(undefined);
  };

  return (
    <div className="animate-in fade-in duration-300 space-y-4">
      {/* Indicador de Cabeçalho */}
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#651F65]">
        <PenTool size={16} />
        <span>Assinatura Digital (Opcional)</span>
      </div>

      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
        Assine no painel abaixo utilizando o dedo (no telemóvel) ou o rato. Se preferir, pode deixar em branco e assinar manualmente a ficha impressa mais tarde.
      </p>

      {/* Área de Assinatura (Canvas) */}
      <div className="relative rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-2 transition-colors hover:border-purple-300 focus-within:border-purple-500">
        <SignatureCanvas
          ref={padRef}
          penColor="#1e1b4b" // Cor tom roxo/azul escuro profissional
          canvasProps={{
            className: 'w-full h-44 rounded-xl bg-white cursor-crosshair shadow-inner touch-none',
          }}
          onEnd={salvar}
        />

        {/* Marca de água / Orientação textual de fundo no Canvas */}
        {!assinatura && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-slate-300/60 text-xs font-medium">
            Assine no espaço delimitado
          </div>
        )}
      </div>

      {/* Controlo do Canvas & Indicador de Validação */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={limpar}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 active:bg-red-100 transition cursor-pointer"
        >
          <Trash2 size={14} />
          <span>Limpar Assinatura</span>
        </button>

        {assinatura ? (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200/80 animate-in fade-in duration-200">
            <CheckCircle2 size={14} className="text-emerald-600" />
            <span>Assinatura gravada</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 text-xs text-slate-400">
            <FileCheck size={14} />
            <span>Pendente ou para assinar no papel</span>
          </div>
        )}
      </div>
    </div>
  );
}