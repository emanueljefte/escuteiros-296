import { useRef, useState } from 'react';

interface Props {
  fotoProps: {
    foto?: Blob;
    setFoto: (blob?: Blob) => void;
  };
}

export default function FotoCaptura({ fotoProps }: Props) {
  const { foto, setFoto } = fotoProps;
  const [preview, setPreview] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFoto(file);
    setPreview(URL.createObjectURL(file));
  }

  function limpar() {
    setFoto(undefined);
    setPreview(undefined);
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Foto do Escuteiro</h2>

      {!preview && (
        <label className="flex flex-col items-center justify-center border-2 border-dashed rounded p-8 cursor-pointer text-sm text-gray-500">
          Tocar para tirar/escolher foto
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            // capture="user"
            onChange={handleFile}
            className="hidden"
          />
        </label>
      )}

      {preview && (
        <div className="flex flex-col items-center gap-2">
          <img src={preview} alt="Pré-visualização" className="w-40 h-40 object-cover rounded" />
          <button type="button" onClick={limpar} className="text-sm text-red-600">
            Tirar outra foto
          </button>
        </div>
      )}

      {!foto && <p className="text-sm text-gray-500">Foto opcional — pode continuar sem ela.</p>}
    </div>
  );
}