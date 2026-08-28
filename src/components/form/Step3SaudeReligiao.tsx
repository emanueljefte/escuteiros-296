import { useFormContext } from 'react-hook-form';
import type { EscuteiroFormInput } from '../../lib/schema';

export default function Step3SaudeReligiao() {
  const { register, watch } = useFormContext<EscuteiroFormInput>();

  const baptizado = watch('baptizado');
  const doenca = watch('doenca');
  const alergia = watch('alergia');
  const deficiencia = watch('deficiencia');

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">3. Dados Escutista e Religioso / Saúde e Bem Estar</h2>

      <div>
        <label className="block text-sm">Data e local de investidura</label>
        <input {...register('data_local_investidura')} className="w-full border rounded p-2" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm">Secção</label>
          <input {...register('seccao')} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm">Bando</label>
          <input {...register('bando')} className="w-full border rounded p-2" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm">Patrulha</label>
          <input {...register('patrulha')} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm">Equipe</label>
          <input {...register('equipe')} className="w-full border rounded p-2" />
        </div>
      </div>

      <div>
        <label className="block text-sm">Cargo</label>
        <input {...register('cargo')} className="w-full border rounded p-2" />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register('baptizado')} />
          Baptizado?
        </label>
        {baptizado && (
          <input
            {...register('baptizado_detalhe')}
            placeholder="Por quê?"
            className="w-full border rounded p-2 mt-1"
          />
        )}
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register('doenca')} />
          Sofre de alguma doença específica?
        </label>
        {doenca && (
          <input
            {...register('doenca_qual')}
            placeholder="Qual?"
            className="w-full border rounded p-2 mt-1"
          />
        )}
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register('alergia')} />
          É alérgico a alguma comida ou medicamento?
        </label>
        {alergia && (
          <input
            {...register('alergia_qual')}
            placeholder="Qual?"
            className="w-full border rounded p-2 mt-1"
          />
        )}
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register('deficiencia')} />
          Tem alguma deficiência física ou psicológica?
        </label>
        {deficiencia && (
          <input
            {...register('deficiencia_qual')}
            placeholder="Qual?"
            className="w-full border rounded p-2 mt-1"
          />
        )}
      </div>
    </div>
  );
}