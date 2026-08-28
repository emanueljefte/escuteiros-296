import { useFormContext } from 'react-hook-form';
import type { EscuteiroForm } from '../../lib/schema';

export default function TermoAceitacao() {
  const { register, formState: { errors } } = useFormContext<EscuteiroForm>();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Termo de Aceitação do(a) Escuteiro(a)</h2>

      <div className="border rounded p-4 text-sm text-gray-700 bg-gray-50">
        Declaro aceitar todas as condições referentes ao agrupamento, constantes no
        Regulamento Geral da Associação de Escuteiros de Angola.
      </div>

      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" {...register('termo_aceite')} className="mt-1" />
        Li e aceito os termos acima
      </label>
      {errors.termo_aceite && (
        <p className="text-red-600 text-sm">{errors.termo_aceite.message}</p>
      )}
    </div>
  );
}