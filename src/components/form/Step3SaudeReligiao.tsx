import { useFormContext } from 'react-hook-form';
import type { EscuteiroFormInput } from '../../lib/schema';
import { inputClass, selectClass, labelClass } from './estilos';

export default function Step3SaudeReligiao() {
  const { register, watch } = useFormContext<EscuteiroFormInput>();

  const pertenceOutroGrupo = watch('pertence_outro_grupo');
  const sofreDoenca = watch('sofre_doenca');

  return (
    <div>
      <div className="mb-6 flex items-center gap-3 border-b border-aea-cinza/30 pb-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-aea-roxo text-sm font-bold text-white">3</span>
        <h2 className="text-base font-semibold text-aea-roxo">Dados Escutista e Especiais</h2>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Unidade / Secção</label>
            <select {...register('seccao')} className={selectClass}>
              <option value="">Escolha um item.</option>
              {['Iª Secção  ','IIª Secção  ','IIIª Secção  ','IVª Secção  ','Dirigente'].map((s) => (
                <option key={s} value={s}>{s.trim()}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Categoria</label>
            <select {...register('categoria')} className={selectClass}>
              <option value="">Escolha um item.</option>
              {['Aspirante','Noviço','Investido','Candidato'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Patrulha / Bando / Equipe</label>
            <input {...register('patrulha_bando_equipe')} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Cargo / Função</label>
            <select {...register('cargo_funcao')} className={selectClass}>
              <option value="">Escolha um item.</option>
              {['Guia ','Sub Guia','Secretário','Financeiro','Guarda Material','Cozinheiro','Socorrista','Animador'].map((c) => (
                <option key={c} value={c}>{c.trim()}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Data da Promessa</label>
            <input type="date" {...register('data_promessa')} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Situação</label>
            <select {...register('situacao')} className={selectClass}>
              <option value="">Escolha um item.</option>
              {['Activo','Inactivo','Transferido','Desligado'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Igreja</label>
          <input {...register('igreja')} className={inputClass} />
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" {...register('baptizado')} />
          Baptizado?
        </label>

        <div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" {...register('pertence_outro_grupo')} />
            Pertence a um outro grupo?
          </label>
          {pertenceOutroGrupo && (
            <input {...register('pertence_outro_grupo_qual')} placeholder="Qual?" className={`${inputClass} mt-1`} />
          )}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" {...register('sofre_doenca')} />
            Sofre de alguma doença específica ou restrição que causa problema de saúde?
          </label>
          {sofreDoenca && (
            <input {...register('sofre_doenca_qual')} placeholder="Qual?" className={`${inputClass} mt-1`} />
          )}
        </div>

        <div>
          <label className={labelClass}>OBS</label>
          <textarea {...register('obs')} rows={2} className={inputClass} />
        </div>
      </div>
    </div>
  );
}