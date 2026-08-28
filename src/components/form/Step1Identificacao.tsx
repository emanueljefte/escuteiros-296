import { useFormContext } from 'react-hook-form';
import type { EscuteiroFormInput } from '../../lib/schema';

const inputClass =
  'w-full rounded-lg border border-aea-cinza/40 bg-white px-3 py-2.5 text-sm text-gray-800 ' +
  'placeholder:text-gray-400 transition focus:border-aea-roxo focus:outline-none focus:ring-2 focus:ring-aea-roxo/20';

const labelClass = 'mb-1 block text-xs font-semibold uppercase tracking-wide text-aea-roxo/80';

export default function Step1Identificacao() {
  const { register, formState: { errors } } = useFormContext<EscuteiroFormInput>();

  return (
    <div>
      <div className="mb-6 flex items-center gap-3 border-b border-aea-cinza/30 pb-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-aea-roxo text-sm font-bold text-white">
          1
        </span>
        <h2 className="text-base font-semibold text-aea-roxo">
          Identificação do Escuteiro
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className={labelClass}>Nome completo</label>
          <input {...register('nome_completo')} className={inputClass} placeholder="Nome e apelido" />
          {errors.nome_completo && (
            <p className="mt-1 text-xs text-red-600">{errors.nome_completo.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Filho de</label>
            <input {...register('filho_de')} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>E de</label>
            <input {...register('e_de')} className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>B.I. Nº</label>
            <input {...register('bi_numero')} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Cédula Nº</label>
            <input {...register('cedula_numero')} className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Morada</label>
          <input {...register('morada')} className={inputClass} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Província</label>
            <input {...register('provincia')} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Município</label>
            <input {...register('municipio')} className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Estado civil</label>
          <input {...register('estado_civil')} className={inputClass} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Telefone</label>
            <input {...register('telefone')} className={inputClass} placeholder="9XX XXX XXX" />
            {errors.telefone && (
              <p className="mt-1 text-xs text-red-600">{errors.telefone.message}</p>
            )}
          </div>
          <div>
            <label className={labelClass}>WhatsApp</label>
            <input {...register('whatsapp')} className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Contacto do Encarregado</label>
          <input {...register('contacto_encarregado')} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Data de nascimento</label>
          <input type="date" {...register('data_nascimento')} className={inputClass} />
        </div>
      </div>
    </div>
  );
}