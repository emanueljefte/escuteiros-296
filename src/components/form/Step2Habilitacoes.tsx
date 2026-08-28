import { useFormContext } from 'react-hook-form';
import type { EscuteiroFormInput } from '../../lib/schema';

export default function Step2Habilitacoes() {
  const { register } = useFormContext<EscuteiroFormInput>();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">2. Habilitações Literárias e Profissionais</h2>

      <div>
        <label className="block text-sm">Habilitação literária</label>
        <input {...register('habilitacao_literaria')} className="w-full border rounded p-2" />
      </div>

      <div>
        <label className="block text-sm">Profissão</label>
        <input {...register('profissao')} className="w-full border rounded p-2" />
      </div>

      <div>
        <label className="block text-sm">Escola ou local de trabalho</label>
        <input {...register('escola_local_trabalho')} className="w-full border rounded p-2" />
      </div>

      <div>
        <label className="block text-sm">Outras habilidades</label>
        <textarea {...register('outras_habilidades')} rows={3} className="w-full border rounded p-2" />
      </div>
    </div>
  );
}