import { useFormContext } from 'react-hook-form';
import type { EscuteiroFormInput } from '../../lib/schema';
import { inputClass, selectClass, labelClass } from './estilos';

export default function Step1Identificacao() {
  const { register, formState: { errors } } = useFormContext<EscuteiroFormInput>();

  return (
    <div>
      <div className="mb-6 flex items-center gap-3 border-b border-aea-cinza/30 pb-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-aea-roxo text-sm font-bold text-white">1</span>
        <h2 className="text-base font-semibold text-aea-roxo">Dados Pessoais</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className={labelClass}>Nome completo</label>
          <input {...register('nome_completo')} className={inputClass} />
          {errors.nome_completo && <p className="mt-1 text-xs text-red-600">{errors.nome_completo.message}</p>}
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
            <label className={labelClass}>Tipo de Documento</label>
            <select {...register('tipo_documento')} className={selectClass}>
              <option value="">Escolha um item.</option>
              <option value="Bilhete de Identidade n°">Bilhete de Identidade n°</option>
              <option value="Cédula n°">Cédula n°</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Número do Documento</label>
            <input {...register('numero_documento')} className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Província</label>
          <select {...register('provincia')} className={selectClass}>
            <option value="">Escolha um item.</option>
            {['Luanda','Kwnza Sul','Bengo','Malanje','Cunene','Moxico','UIge','Zaire','Namibe','Kuando Kubango'].map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>Data de Nascimento</label>
            <input type="date" {...register('data_nascimento')} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Estado Civil</label>
            <select {...register('estado_civil')} className={selectClass}>
              <option value="">Escolha um item.</option>
              <option value="Solteiro">Solteiro</option>
              <option value="Casado">Casado</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Sexo</label>
            <select {...register('sexo')} className={selectClass}>
              <option value="">Escolha um item.</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Morada</label>
          <input {...register('morada')} className={inputClass} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Contacto Pessoal</label>
            <input {...register('contacto_pessoal')} className={inputClass} placeholder="9XX XXX XXX" />
            {errors.contacto_pessoal && <p className="mt-1 text-xs text-red-600">{errors.contacto_pessoal.message}</p>}
          </div>
          <div>
            <label className={labelClass}>WhatsApp</label>
            <input {...register('whatsapp_pessoal')} className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Nome do 1º Encarregado</label>
            <input {...register('nome_encarregado_1')} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Parentesco</label>
            <select {...register('parentesco_1')} className={selectClass}>
              <option value="">Escolha um item.</option>
              {['Pai','Mãe','Tio','Avó','Tia', 'Avô'].map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Contacto do 1º Encarregado</label>
            <input {...register('contacto_encarregado_1')} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>WhatsApp</label>
            <input {...register('whatsapp_encarregado_1')} className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Nome do 2º Encarregado</label>
            <input {...register('nome_encarregado_2')} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Parentesco</label>
            <select {...register('parentesco_2')} className={selectClass}>
              <option value="">Escolha um item.</option>
              {['Pai','Mãe','Tio','Avó','Tia', 'Avô'].map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Contacto do 2º Encarregado</label>
            <input {...register('contacto_encarregado_2')} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>WhatsApp</label>
            <input {...register('whatsapp_encarregado_2')} className={inputClass} />
          </div>
        </div>
      </div>
    </div>
  );
}