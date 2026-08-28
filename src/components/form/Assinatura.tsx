import { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

interface Props {
  assinaturaProps: {
    assinatura?: Blob;
    setAssinatura: (blob?: Blob) => void;
  };
}

export default function Assinatura({ assinaturaProps }: Props) {
  const { assinatura, setAssinatura } = assinaturaProps;
  const padRef = useRef<SignatureCanvas>(null);

  function salvar() {
    if (!padRef.current || padRef.current.isEmpty()) return;
    padRef.current.getCanvas().toBlob((blob) => {
      if (blob) setAssinatura(blob);
    }, 'image/png');
  }

  function limpar() {
    padRef.current?.clear();
    setAssinatura(undefined);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Assinatura</h2>
      <p className="text-sm text-gray-500">
        Assine agora, ou deixe em branco para assinar a ficha impressa depois.
      </p>

      <div className="border rounded">
        <SignatureCanvas
          ref={padRef}
          penColor="black"
          canvasProps={{ className: 'w-full h-48' }}
          onEnd={salvar}
        />
      </div>

      <div className="flex justify-between">
        <button type="button" onClick={limpar} className="text-sm text-red-600">
          Limpar
        </button>
        {assinatura && <span className="text-sm text-green-600">Assinatura guardada</span>}
      </div>
    </div>
  );
}