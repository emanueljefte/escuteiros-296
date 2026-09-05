import { useFormContext } from 'react-hook-form';
import { AlertCircle } from 'lucide-react';
import type { EscuteiroFormInput } from '../../lib/schema';
import { inputClass, selectClass, labelClass } from './estilos';
import { formatarNomeProprio } from '../../util/format-name';

// Expressão regular que permite letras, acentos, espaços, hífens e apóstrofos (bloqueia números)
const REGEX_APENAS_TEXTO = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;

const HABILITACOES = [
  'Ensino Primário 1ª à 6ª classe',
  'I Ciclo do Ensino Secundário 7ª à 9ª classe',
  'II Ciclo do Ensino Secundário 10ª à 12ª classe',
  'Licenciatura',
  'Mestrado',
  'Doutoramento',
];

export default function Step2Habilitacoes() {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<EscuteiroFormInput>();

  // Funções auxiliares para feedback visual de erro nas bordas
  const getInputClass = (fieldName: keyof EscuteiroFormInput) =>
    `${inputClass} ${errors[fieldName]
      ? '!border-red-500 !ring-red-200 focus:!ring-red-300 bg-red-50/20'
      : 'focus:ring-purple-200 focus:border-purple-600'
    }`;

  const getSelectClass = (fieldName: keyof EscuteiroFormInput) =>
    `${selectClass} ${errors[fieldName]
      ? '!border-red-500 !ring-red-200 focus:!ring-red-300 bg-red-50/20'
      : 'focus:ring-purple-200 focus:border-purple-600'
    }`;

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6 flex items-center gap-3 border-b border-aea-cinza/30 pb-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-aea-roxo text-sm font-bold text-white">
          2
        </span>
        <h2 className="text-base font-semibold text-aea-roxo">
          Habilitações Literárias e Profissionais
        </h2>
      </div>

      <div className="space-y-4">
        {/* Habilitação Literária */}
        <div>
          <label className={labelClass}>Habilitação Literária</label>
          <select
            {...register('habilitacao_literaria')}
            className={getSelectClass('habilitacao_literaria')}
          >
            <option value="">Escolha um item.</option>
            {HABILITACOES.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
          {errors.habilitacao_literaria && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
              <AlertCircle size={12} />
              {errors.habilitacao_literaria.message}
            </p>
          )}
        </div>

        {/* Instituição e Local da Escola */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Nome da Instituição</label>
            <input
              {...register('nome_instituicao')}
              placeholder="Ex: Escola Primária nº 123"
              onBlur={(e) => {
                const nomeFormatado = formatarNomeProprio(e.target.value);
                setValue('nome_instituicao', nomeFormatado, { shouldValidate: true });
              }}
              className={`${getInputClass('nome_instituicao')} capitalize`}
            />
            {errors.nome_instituicao && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
                <AlertCircle size={12} />
                {errors.nome_instituicao.message}
              </p>
            )}

          </div>

          <div>
            <label className={labelClass}>Local da Escola</label>
            <input
              {...register('local_escola')}
              onBlur={(e) => {
                const nomeFormatado = formatarNomeProprio(e.target.value);
                setValue('local_escola', nomeFormatado, { shouldValidate: true });
              }}
              className={`${getInputClass('local_escola')} capitalize`}
              placeholder="Ex: Luanda"
            />
            {errors.local_escola && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
                <AlertCircle size={12} />
                {errors.local_escola.message}
              </p>
            )}
          </div>
        </div>

        {/* Profissão e Local de Trabalho */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Profissão</label>
            <input
              {...register('profissao', {
                pattern: {
                  value: REGEX_APENAS_TEXTO,
                  message: 'A profissão não pode conter números.',
                },
              })}
              onBlur={(e) => {
                const nomeFormatado = formatarNomeProprio(e.target.value);
                setValue('profissao', nomeFormatado, { shouldValidate: true });
              }}
              className={`${getInputClass('profissao')} capitalize`}
              placeholder="Ex: Estudante, Professor, Engenheiro"
            />
            {errors.profissao && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
                <AlertCircle size={12} />
                {errors.profissao.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Local de Trabalho</label>
            <input
              {...register('local_trabalho')}
              onBlur={(e) => {
                const nomeFormatado = formatarNomeProprio(e.target.value);
                setValue('local_trabalho', nomeFormatado, { shouldValidate: true });
              }}
              className={`${getInputClass('local_trabalho')} capitalize`}
              placeholder="Ex: Empresa X, Ministério..."
            />
            {errors.local_trabalho && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
                <AlertCircle size={12} />
                {errors.local_trabalho.message}
              </p>
            )}
          </div>
        </div>

        {/* Outra Ocupação */}
        <div>
          <label className={labelClass}>Outra Ocupação</label>
          <input
            {...register('outras_ocupacao', {
              pattern: {
                value: REGEX_APENAS_TEXTO,
                message: 'A ocupação não pode conter números.',
              },
            })}
            className={getInputClass('outras_ocupacao')}
            onBlur={(e) => {
              const nomeFormatado = formatarNomeProprio(e.target.value);
              setValue('outras_ocupacao', nomeFormatado, { shouldValidate: true });
            }}
            placeholder="Ex: Voluntário"
          />
          {errors.outras_ocupacao && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
              <AlertCircle size={12} />
              {errors.outras_ocupacao.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}