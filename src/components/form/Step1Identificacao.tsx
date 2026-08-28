import { useFormContext } from 'react-hook-form';
import type { EscuteiroFormInput } from '../../lib/schema';

export default function Step1Identificacao() {
  const { register, formState: { errors } } = useFormContext<EscuteiroFormInput>();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">1. Identificação do Escuteiro</h2>

      <div>
        <label className="block text-sm">Nome completo</label>
        <input {...register('nome_completo')} className="w-full border rounded p-2" />
        {errors.nome_completo && (
          <p className="text-red-600 text-sm">{errors.nome_completo.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm">Filho de</label>
          <input {...register('filho_de')} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm">E de</label>
          <input {...register('e_de')} className="w-full border rounded p-2" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm">B.I. Nº</label>
          <input {...register('bi_numero')} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm">Cédula Nº</label>
          <input {...register('cedula_numero')} className="w-full border rounded p-2" />
        </div>
      </div>

      <div>
        <label className="block text-sm">Morada</label>
        <input {...register('morada')} className="w-full border rounded p-2" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm">Província</label>
          <input {...register('provincia')} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm">Município</label>
          <input {...register('municipio')} className="w-full border rounded p-2" />
        </div>
      </div>

      <div>
        <label className="block text-sm">Estado civil</label>
        <input {...register('estado_civil')} className="w-full border rounded p-2" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm">Telefone</label>
          <input {...register('telefone')} className="w-full border rounded p-2" />
          {errors.telefone && (
            <p className="text-red-600 text-sm">{errors.telefone.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm">WhatsApp</label>
          <input {...register('whatsapp')} className="w-full border rounded p-2" />
        </div>
      </div>

      <div>
        <label className="block text-sm">Contacto do Encarregado</label>
        <input {...register('contacto_encarregado')} className="w-full border rounded p-2" />
      </div>

      <div>
        <label className="block text-sm">Data de nascimento</label>
        <input type="date" {...register('data_nascimento')} className="w-full border rounded p-2" />
      </div>
    </div>
  );
}