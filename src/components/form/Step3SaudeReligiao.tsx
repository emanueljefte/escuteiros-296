import { useFormContext } from 'react-hook-form';
import { AlertCircle, ChevronDown } from 'lucide-react';
import type { EscuteiroFormInput } from '../../lib/schema';
import { inputClass, selectClass, labelClass } from './estilos';

const REGEX_APENAS_TEXTO = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;

export default function Step3SaudeReligiao() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<EscuteiroFormInput>();

  const pertenceOutroGrupo = watch('pertence_outro_grupo');
  const sofreDoenca = watch('sofre_doenca');

  // Calcula o dia de ontem no formato YYYY-MM-DD para bloquear hoje e datas futuras
  const getOntemFormatted = () => {
    const ontem = new Date();
    ontem.setDate(ontem.getDate() - 1);
    return ontem.toISOString().split('T')[0];
  };

  // Função para capitalizar a primeira letra de cada palavra
  const handleCapitalize = (
    fieldName: keyof EscuteiroFormInput,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    const formatted = value.replace(/\b\w/g, (l) => l.toUpperCase());
    setValue(fieldName, formatted, { shouldValidate: true });
  };

  const getInputClass = (fieldName: keyof EscuteiroFormInput) =>
    `${inputClass} ${
      errors[fieldName]
        ? '!border-red-500 !ring-red-200 focus:!ring-red-300 bg-red-50/20'
        : 'focus:ring-purple-200 focus:border-purple-600'
    }`;

  const getSelectClass = (fieldName: keyof EscuteiroFormInput) =>
    `${selectClass} appearance-none pr-10 ${
      errors[fieldName]
        ? '!border-red-500 !ring-red-200 focus:!ring-red-300 bg-red-50/20'
        : 'focus:ring-purple-200 focus:border-purple-600'
    }`;

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6 flex items-center gap-3 border-b border-aea-cinza/30 pb-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-aea-roxo text-sm font-bold text-white">
          3
        </span>
        <h2 className="text-base font-semibold text-aea-roxo">Dados Escutistas e Especiais</h2>
      </div>

      <div className="space-y-4">
        {/* Unidade / Secção e Categoria */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Unidade / Secção</label>
            <div className="relative">
              <select {...register('seccao')} className={getSelectClass('seccao')}>
                <option value="">Escolha um item.</option>
                {['Iª Secção', 'IIª Secção', 'IIIª Secção', 'IVª Secção', 'Dirigente'].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
            </div>
            {errors.seccao && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
                <AlertCircle size={12} />
                {errors.seccao.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Categoria</label>
            <div className="relative">
              <select {...register('categoria')} className={getSelectClass('categoria')}>
                <option value="">Escolha um item.</option>
                {['Aspirante', 'Noviço', 'Investido', 'Candidato'].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
            </div>
            {errors.categoria && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
                <AlertCircle size={12} />
                {errors.categoria.message}
              </p>
            )}
          </div>
        </div>

        {/* Patrulha/Bando/Equipe e Cargo/Função */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Patrulha / Bando / Equipe</label>
            <input
              {...register('patrulha_bando_equipe', {
                pattern: {
                  value: REGEX_APENAS_TEXTO,
                  message: 'O nome não pode conter números.',
                },
                onChange: (e) => handleCapitalize('patrulha_bando_equipe', e),
              })}
              className={getInputClass('patrulha_bando_equipe')}
              placeholder="Ex: Leão, Águia, Lobos"
            />
            {errors.patrulha_bando_equipe && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
                <AlertCircle size={12} />
                {errors.patrulha_bando_equipe.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Cargo / Função</label>
            <div className="relative">
              <select {...register('cargo_funcao')} className={getSelectClass('cargo_funcao')}>
                <option value="">Escolha um item.</option>
                {[
                  'Guia',
                  'Sub Guia',
                  'Secretário',
                  'Financeiro',
                  'Guarda Material',
                  'Cozinheiro',
                  'Socorrista',
                  'Animador',
                ].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
            </div>
            {errors.cargo_funcao && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
                <AlertCircle size={12} />
                {errors.cargo_funcao.message}
              </p>
            )}
          </div>
        </div>

        {/* Data da Promessa e Situação */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Data da Promessa</label>
            <input
              type="date"
              max={getOntemFormatted()}
              {...register('data_promessa', {
                validate: (value) => {
                  if (!value) return true;
                  const dataSel = new Date(`${value}T00:00:00`);
                  const hoje = new Date();
                  hoje.setHours(0, 0, 0, 0);

                  if (dataSel >= hoje) {
                    return 'A data da promessa deve ser anterior ao dia de hoje.';
                  }
                  return true;
                },
              })}
              className={getInputClass('data_promessa')}
            />
            {errors.data_promessa && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
                <AlertCircle size={12} />
                {errors.data_promessa.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Situação</label>
            <div className="relative">
              <select {...register('situacao')} className={getSelectClass('situacao')}>
                <option value="">Escolha um item.</option>
                {['Activo', 'Inactivo', 'Transferido', 'Desligado'].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
            </div>
            {errors.situacao && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
                <AlertCircle size={12} />
                {errors.situacao.message}
              </p>
            )}
          </div>
        </div>

        {/* Igreja */}
        <div>
          <label className={labelClass}>Igreja / Paróquia</label>
          <input
            {...register('igreja', {
              pattern: {
                value: REGEX_APENAS_TEXTO,
                message: 'O nome da igreja não pode conter números.',
              },
              onChange: (e) => handleCapitalize('igreja', e),
            })}
            className={getInputClass('igreja')}
            placeholder="Ex: Paróquia de São Paulo"
          />
          {errors.igreja && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
              <AlertCircle size={12} />
              {errors.igreja.message}
            </p>
          )}
        </div>

        {/* Checkbox: Baptizado */}
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
          <input
            type="checkbox"
            {...register('baptizado')}
            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 h-4 w-4"
          />
          Baptizado?
        </label>

        {/* Checkbox & Condicional: Outro Grupo */}
        <div className="space-y-1">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
            <input
              type="checkbox"
              {...register('pertence_outro_grupo')}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 h-4 w-4"
            />
            Pertence a um outro grupo?
          </label>
          {pertenceOutroGrupo && (
            <div className="pt-1">
              <input
                {...register('pertence_outro_grupo_qual', {
                  pattern: {
                    value: REGEX_APENAS_TEXTO,
                    message: 'O nome do grupo não pode conter números.',
                  },
                  onChange: (e) => handleCapitalize('pertence_outro_grupo_qual', e),
                })}
                placeholder="Qual grupo?"
                className={getInputClass('pertence_outro_grupo_qual')}
              />
              {errors.pertence_outro_grupo_qual && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
                  <AlertCircle size={12} />
                  {errors.pertence_outro_grupo_qual.message}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Checkbox & Condicional: Doença / Restrição */}
        <div className="space-y-1">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
            <input
              type="checkbox"
              {...register('sofre_doenca')}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 h-4 w-4"
            />
            Sofre de alguma doença específica ou restrição de saúde?
          </label>
          {sofreDoenca && (
            <div className="pt-1">
              <input
                {...register('sofre_doenca_qual', {
                  onChange: (e) => handleCapitalize('sofre_doenca_qual', e),
                })}
                className={getInputClass('sofre_doenca_qual')}
                placeholder="Qual doença ou restrição?"
              />
              {errors.sofre_doenca_qual && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
                  <AlertCircle size={12} />
                  {errors.sofre_doenca_qual.message}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Observações */}
        <div>
          <label className={labelClass}>Observações (OBS)</label>
          <textarea
            {...register('obs', {
              onChange: (e) => handleCapitalize('obs', e),
            })}
            rows={2}
            className={getInputClass('obs')}
            placeholder="Informações adicionais relevantes..."
          />
          {errors.obs && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
              <AlertCircle size={12} />
              {errors.obs.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}