import { useFormContext } from 'react-hook-form';
import type { EscuteiroFormInput } from '../../lib/schema';
import { inputClass, selectClass, labelClass } from './estilos';

const HABILITACOES = [
  'Ensino Primário 1ª à 6ª classe',
  'I Ciclo do Ensino Secundário 7ª à 9ª classe',
  'II Ciclo do Ensino Secundário 10ª à 12ª classe',
  'Licenciatura', 'Mestrado', 'Doutoramento',
];

export default function Step2Habilitacoes() {
  const { register } = useFormContext<EscuteiroFormInput>();

  return (
    <div>
      <div className="mb-6 flex items-center gap-3 border-b border-aea-cinza/30 pb-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-aea-roxo text-sm font-bold text-white">2</span>
        <h2 className="text-base font-semibold text-aea-roxo">Habilitações Literárias e Profissionais</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className={labelClass}>Habilitação Literária</label>
          <select {...register('habilitacao_literaria')} className={selectClass}>
            <option value="">Escolha um item.</option>
            {HABILITACOES.map((h) => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Nome da Instituição</label>
            <input {...register('nome_instituicao')} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Local da Escola</label>
            <input {...register('local_escola')} className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Profissão</label>
            <input {...register('profissao')} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Local de Trabalho</label>
            <input {...register('local_trabalho')} className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Outras Ocupação</label>
          <input {...register('outras_ocupacao')} className={inputClass} />
        </div>
      </div>
    </div>
  );
}