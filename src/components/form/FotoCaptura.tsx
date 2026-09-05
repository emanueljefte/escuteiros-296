import { useRef, useEffect, useMemo } from 'react';
import { Camera, Trash2, ImagePlus, CheckCircle2, User } from 'lucide-react';

interface Props {
  fotoProps: {
    foto?: Blob;
    setFoto: (blob?: Blob) => void;
  };
}

export default function FotoCaptura({ fotoProps }: Props) {
  const { foto, setFoto } = fotoProps;
  // const [preview, setPreview] = useState<string | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  // Deriva a URL diretamente sem necessitar de setState ou useEffect
const preview = useMemo(() => {
  if (!foto) return undefined;

  const objectUrl = URL.createObjectURL(foto);

  // A limpeza ocorre automaticamente quando foto muda ou o componente desmonta
  return objectUrl;
}, [foto]);

// Lembra-te de revogar a URL para evitar fugas de memória se o componente desmontar
useEffect(() => {
  return () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
  };
}, [preview]);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFoto(file);
  }

  function limpar() {
    setFoto(undefined);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }

  return (
    <div className="animate-in fade-in duration-300 space-y-4">
      {/* Indicador de Cabeçalho */}
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#651F65]">
        <Camera size={16} />
        <span>Fotografia do Escuteiro (Opcional)</span>
      </div>

      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
        Carregue uma foto de rosto (estilo passe) ou tire uma fotografia no momento com o seu dispositivo.
      </p>

      {/* Opção sem Foto Selecionada: Dropzone / Seleção */}
      {!preview && (
        <div className="space-y-3">
          <label className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/60 p-6 text-center cursor-pointer transition-all duration-200 hover:border-purple-400 hover:bg-purple-50/30 active:scale-[0.99]">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100/80 text-purple-700 transition-transform duration-300 group-hover:scale-110">
              <ImagePlus size={26} />
            </div>

            <p className="text-xs sm:text-sm font-semibold text-slate-700">
              Tocar para carregar ou tirar foto
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Formatos suportados: PNG, JPG ou WEBP
            </p>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
          </label>

          {/* Botão rápido para câmara em dispositivos móveis */}
          <button
            type="button"
            onClick={() => {
              if (inputRef.current) {
                inputRef.current.setAttribute('capture', 'user');
                inputRef.current.click();
              }
            }}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
          >
            <Camera size={16} className="text-[#651F65]" />
            <span>Usar Câmara Direta</span>
          </button>
        </div>
      )}

      {/* Opção com Foto Selecionada: Pré-visualização */}
      {preview && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center shadow-2xs animate-in zoom-in-95 duration-200">
          <div className="relative mb-3">
            <img
              src={preview}
              alt="Pré-visualização do Escuteiro"
              className="h-36 w-36 rounded-2xl object-cover shadow-md border-2 border-white ring-2 ring-purple-500/20"
            />
            <div className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
              <CheckCircle2 size={16} />
            </div>
          </div>

          <p className="text-xs font-semibold text-slate-700 mb-3">
            Fotografia associada com sucesso
          </p>

          <button
            type="button"
            onClick={limpar}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 active:bg-red-100 transition cursor-pointer"
          >
            <Trash2 size={14} />
            <span>Remover ou tirar outra foto</span>
          </button>
        </div>
      )}

      {/* Indicador de foto opcional */}
      {!foto && (
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
          <User size={13} />
          <span>Caso não adicione agora, poderá colar a fotografia na ficha impressa.</span>
        </div>
      )}
    </div>
  );
}