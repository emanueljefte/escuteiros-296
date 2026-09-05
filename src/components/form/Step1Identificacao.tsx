import { useFormContext } from 'react-hook-form';
import { User, FileText, Phone, Users, AlertCircle, ChevronDown } from 'lucide-react';
import type { EscuteiroFormInput } from '../../lib/schema';
import { inputClass, selectClass, labelClass } from './estilos';
import { formatarNomeProprio } from '../../util/format-name';

// Expressões Regulares
export const REGEX_TELEFONE_ANGOLA = /^9[1-9][0-9]{8}$|^9[1-9][0-9]{7}$/; // Suporta 9 dígitos (9XX XXX XXX)
export const REGEX_BI_ANGOLA = /^[0-9]{9}[A-Za-z]{2}[0-9]{3}$/;
export const REGEX_APENAS_TEXTO = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]{2,}$/;

const PROVINCIAS_ANGOLA = [
  'Bengo', 'Benguela', 'Bié', 'Cabinda', 'Cunene', 'Huambo',
  'Huíla', 'Kwanza Norte', 'Kwanza Sul', 'Kuando Kubango', 'Luanda',
  'Lunda Norte', 'Lunda Sul', 'Malanje', 'Moxico', 'Namibe', 'Uíge', 'Zaire',
] as const;

const PARENTESCOS = ['Pai', 'Mãe', 'Tio', 'Tia', 'Avô', 'Avó', 'Outro'] as const;

export default function Step1Identificacao() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<EscuteiroFormInput>();

  const tipoDocumento = watch('tipo_documento');
  const nomeEncarregado2 = watch('nome_encarregado_2');

  const getInputClass = (fieldName: keyof EscuteiroFormInput) =>
    `${inputClass} ${errors[fieldName] ? '!border-red-500 !ring-red-200' : ''}`;

  const getSelectClass = (fieldName: keyof EscuteiroFormInput) =>
    `${selectClass} pr-10 ${errors[fieldName] ? '!border-red-500 !ring-red-200' : ''}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Informações Pessoais do Escuteiro */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-aea-roxo uppercase tracking-wider border-b border-slate-100 pb-2">
          <User size={16} />
          <span>Informação Pessoal</span>
        </div>

        <div className="space-y-3">
          <div>
            <label className={labelClass}>
              Nome completo <span className="text-red-500">*</span>
            </label>
            <input
              {...register('nome_completo', {
                required: 'O nome completo é obrigatório.',
                minLength: { value: 3, message: 'O nome deve ter pelo menos 3 caracteres.' },
                pattern: {
                  value: REGEX_APENAS_TEXTO,
                  message: 'O nome não pode conter números ou símbolos especiais.',
                },
              })}
              onBlur={(e) => {
                const nomeFormatado = formatarNomeProprio(e.target.value);
                setValue('nome_completo', nomeFormatado, { shouldValidate: true });
              }}
              className={`${getInputClass('nome_completo')} capitalize`}
              placeholder="Digite o nome completo"
            />
            {errors.nome_completo && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
                <AlertCircle size={12} />
                {errors.nome_completo.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Filho de (Pai)</label>
              <input
                {...register('filho_de', {
                  validate: (val) =>
                    !val || REGEX_APENAS_TEXTO.test(val) || 'O nome não pode conter números.',
                })}
                onBlur={(e) => {
                  const nomeFormatado = formatarNomeProprio(e.target.value);
                  setValue('filho_de', nomeFormatado, { shouldValidate: true });
                }}
                className={`${getInputClass('filho_de')} capitalize`}
                placeholder="Nome do pai"
              />
              {errors.filho_de && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
                  <AlertCircle size={12} />
                  {errors.filho_de.message}
                </p>
              )}
            </div>
            <div>
              <label className={labelClass}>E de (Mãe)</label>
              <input
                {...register('e_de', {
                  validate: (val) =>
                    !val || REGEX_APENAS_TEXTO.test(val) || 'O nome não pode conter números.',
                })}
                onBlur={(e) => {
                  const nomeFormatado = formatarNomeProprio(e.target.value);
                  setValue('e_de', nomeFormatado, { shouldValidate: true });
                }}
                className={`${getInputClass('e_de')} capitalize`}
                placeholder="Nome da mãe"
              />
              {errors.e_de && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
                  <AlertCircle size={12} />
                  {errors.e_de.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* --- DATA DE NASCIMENTO --- */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Data de Nascimento <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                max={new Date().toISOString().split('T')[0]} // Impede seleção no calendário HTML
                {...register('data_nascimento')}
                className={`w-full rounded-xl border p-2.5 text-xs outline-none transition ${errors.data_nascimento
                  ? 'border-red-500 bg-red-50 focus:ring-1 focus:ring-red-500'
                  : 'border-slate-300 focus:border-[#651F65]'
                  }`}
              />
              {errors.data_nascimento && (
                <span className="text-[11px] font-medium text-red-500 mt-1 block">
                  {errors.data_nascimento.message as string}
                </span>
              )}
            </div>

            <div>
              <label className={labelClass}>Estado Civil</label>
              <div className="relative">
                <select {...register('estado_civil')} className={getSelectClass('estado_civil')}>
                  <option value="">Selecione...</option>
                  <option value="Solteiro">Solteiro(a)</option>
                  <option value="Casado">Casado(a)</option>
                  <option value="Outro">Outro</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>
            </div>

            {/* --- SEXO --- */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sexo <span className="text-red-500">*</span>
              </label>
              <select
                {...register('sexo')}
                className={`w-full rounded-xl border p-2.5 text-xs outline-none transition ${errors.sexo
                  ? 'border-red-500 bg-red-50 focus:ring-1 focus:ring-red-500'
                  : 'border-slate-300 focus:border-[#651F65]'
                  }`}
              >
                <option value="">Selecione o sexo</option>
                <option value="MASCULINO">Masculino</option>
                <option value="FEMININO">Feminino</option>
              </select>
              {errors.sexo && (
                <span className="text-[11px] font-medium text-red-500 mt-1 block">
                  {errors.sexo.message as string}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Documentação e Localização */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center gap-2 text-xs font-bold text-aea-roxo uppercase tracking-wider border-b border-slate-100 pb-2">
          <FileText size={16} />
          <span>Documentos e Residência</span>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Tipo de Documento */}
            <div>
              <label className={labelClass}>Tipo de Documento</label>
              <div className="relative">
                <select
                  {...register('tipo_documento', {
                    validate: (val) => {
                      const numDoc = watch('numero_documento');
                      if (numDoc && !val) return 'Selecione o tipo de documento.';
                      return true;
                    }
                  })}
                  className={getSelectClass('tipo_documento')}
                >
                  <option value="">Selecione...</option>
                  <option value="Bilhete de Identidade n°">Bilhete de Identidade (BI)</option>
                  <option value="Cédula n°">Cédula Pessoal</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>
              {errors.tipo_documento && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
                  <AlertCircle size={12} />
                  {errors.tipo_documento.message}
                </p>
              )}
            </div>

            {/* Número do Documento */}
            <div>
              <label className={labelClass}>Número do Documento</label>
              <input
                {...register('numero_documento', {
                  validate: (val) => {
                    if (!val && tipoDocumento) return 'Informe o número do documento selecionado.';
                    if (val && !tipoDocumento) return 'Selecione primeiro o tipo de documento.';

                    // Validação para Bilhete de Identidade
                    if (val && tipoDocumento === 'Bilhete de Identidade n°') {
                      const valUpper = val.toUpperCase();
                      return REGEX_BI_ANGOLA.test(valUpper) || 'Formato de B.I. inválido (Ex: 009876543LA042)';
                    }

                    // Validação para Cédula Pessoal (impede que seja um B.I. ou formato inválido)
                    if (val && tipoDocumento === 'Cédula n°') {
                      if (REGEX_BI_ANGOLA.test(val.toUpperCase())) {
                        return 'O número introduzido é de um B.I., selecione "Bilhete de Identidade".';
                      }
                      if (val.trim().length < 3) {
                        return 'Informe um número de Cédula válido.';
                      }
                    }

                    return true;
                  },
                })}
                className={getInputClass('numero_documento')}
                placeholder={tipoDocumento === 'BI' ? 'Ex: 009876543LA042' : 'Número do documento'}
              />
              {errors.numero_documento && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
                  <AlertCircle size={12} />
                  {errors.numero_documento.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Província</label>
              <div className="relative">
                <select {...register('provincia')} className={getSelectClass('provincia')}>
                  <option value="">Selecione a província...</option>
                  {PROVINCIAS_ANGOLA.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Morada / Residência</label>
              <input
                {...register('morada')}
                className={getInputClass('morada')}
                placeholder="Bairro, Rua, Casa n°"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Contactos do Escuteiro */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center gap-2 text-xs font-bold text-aea-roxo uppercase tracking-wider border-b border-slate-100 pb-2">
          <Phone size={16} />
          <span>Contactos Pessoais</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Contacto Pessoal</label>
            <input
              {...register('contacto_pessoal', {
                validate: (val) =>
                  !val || REGEX_TELEFONE_ANGOLA.test(val) || 'Número inválido (deve ter 9 dígitos e começar por 9).',
              })}
              className={getInputClass('contacto_pessoal')}
              placeholder="9XX XXX XXX"
            />
            {errors.contacto_pessoal && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
                <AlertCircle size={12} />
                {errors.contacto_pessoal.message}
              </p>
            )}
          </div>
          <div>
            <label className={labelClass}>WhatsApp Pessoal</label>
            <input
              {...register('whatsapp_pessoal', {
                validate: (val) =>
                  !val || REGEX_TELEFONE_ANGOLA.test(val) || 'Número inválido (deve ter 9 dígitos e começar por 9).',
              })}
              className={getInputClass('whatsapp_pessoal')}
              placeholder="9XX XXX XXX"
            />
            {errors.whatsapp_pessoal && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
                <AlertCircle size={12} />
                {errors.whatsapp_pessoal.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 4. Encarregados de Educação */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center gap-2 text-xs font-bold text-aea-roxo uppercase tracking-wider border-b border-slate-100 pb-2">
          <Users size={16} />
          <span>Encarregados de Educação</span>
        </div>

        {/* 1º Encarregado */}
        <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/60 space-y-3">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            1º Encarregado de Educação (Obrigatório)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>
                Nome do Encarregado <span className="text-red-500">*</span>
              </label>
              <input
                {...register('nome_encarregado_1', {
                  required: 'Nome do 1º Encarregado é obrigatório.',
                  pattern: {
                    value: REGEX_APENAS_TEXTO,
                    message: 'O nome não pode conter números.',
                  },
                })}
                onBlur={(e) => {
                  const nomeFormatado = formatarNomeProprio(e.target.value);
                  setValue('nome_encarregado_1', nomeFormatado, { shouldValidate: true });
                }}
                className={`${getInputClass('nome_encarregado_1')} capitalize`}
                placeholder="Nome completo do encarregado"
              />
              {errors.nome_encarregado_1 && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
                  <AlertCircle size={12} />
                  {errors.nome_encarregado_1.message}
                </p>
              )}
            </div>
            {/* --- PARENTESCO 1 --- */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Grau de Parentesco <span className="text-red-500">*</span>
              </label>
              <select
                {...register('parentesco_1')}
                className={`w-full rounded-xl border p-2.5 text-xs outline-none transition ${errors.parentesco_1
                  ? 'border-red-500 bg-red-50 focus:ring-1 focus:ring-red-500'
                  : 'border-slate-300 focus:border-[#651F65]'
                  }`}
              >
                <option value="">Selecione o parentesco</option>
                {PARENTESCOS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              {errors.parentesco_1 && (
                <span className="text-[11px] font-medium text-red-500 mt-1 block">
                  {errors.parentesco_1.message as string}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>
                Contacto Telefónico <span className="text-red-500">*</span>
              </label>
              <input
                {...register('contacto_encarregado_1', {
                  required: 'Contacto telefónico é obrigatório.',
                  pattern: {
                    value: REGEX_TELEFONE_ANGOLA,
                    message: 'Número de telefone inválido (deve ter 9 dígitos e começar por 9).',
                  },
                })}
                className={getInputClass('contacto_encarregado_1')}
                placeholder="9XX XXX XXX"
              />
              {errors.contacto_encarregado_1 && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
                  <AlertCircle size={12} />
                  {errors.contacto_encarregado_1.message}
                </p>
              )}
            </div>
            <div>
              <label className={labelClass}>WhatsApp do Encarregado</label>
              <input
                {...register('whatsapp_encarregado_1', {
                  validate: (val) =>
                    !val || REGEX_TELEFONE_ANGOLA.test(val) || 'Número inválido (deve ter 9 dígitos e começar por 9).',
                })}
                className={getInputClass('whatsapp_encarregado_1')}
                placeholder="9XX XXX XXX"
              />
              {errors.whatsapp_encarregado_1 && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
                  <AlertCircle size={12} />
                  {errors.whatsapp_encarregado_1.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 2º Encarregado */}
        <div className="bg-slate-50/40 p-4 rounded-2xl border border-slate-200/40 space-y-3">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            2º Encarregado de Educação (Opcional)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Nome do 2º Encarregado</label>
              <input
                {...register('nome_encarregado_2', {
                  validate: (val) =>
                    !val || REGEX_APENAS_TEXTO.test(val) || 'O nome não pode conter números.',
                })}
                onBlur={(e) => {
                  const nomeFormatado = formatarNomeProprio(e.target.value);
                  setValue('nome_encarregado_2', nomeFormatado, { shouldValidate: true });
                }}
                className={`${getInputClass('nome_encarregado_2')} capitalize`}
                placeholder="Nome completo (opcional)"
              />
              {errors.nome_encarregado_2 && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
                  <AlertCircle size={12} />
                  {errors.nome_encarregado_2.message}
                </p>
              )}
            </div>
            <div>
              <label className={labelClass}>
                Grau de Parentesco {nomeEncarregado2?.trim() && <span className="text-red-500">*</span>}
              </label>
              <div className="relative">
                <select
                  {...register('parentesco_2', {
                    validate: (val) => {
                      if (nomeEncarregado2?.trim() && !val) {
                        return 'Selecione o grau de parentesco do 2º Encarregado.';
                      }
                      return true;
                    },
                  })}
                  className={getSelectClass('parentesco_2')}
                >
                  <option value="">Selecione...</option>
                  {PARENTESCOS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>
              {errors.parentesco_2 && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
                  <AlertCircle size={12} />
                  {errors.parentesco_2.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Contacto Telefónico</label>
              <input
                {...register('contacto_encarregado_2', {
                  validate: (val) =>
                    !val || REGEX_TELEFONE_ANGOLA.test(val) || 'Número de telefone inválido.',
                })}
                className={getInputClass('contacto_encarregado_2')}
                placeholder="9XX XXX XXX"
              />
              {errors.contacto_encarregado_2 && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
                  <AlertCircle size={12} />
                  {errors.contacto_encarregado_2.message}
                </p>
              )}
            </div>
            <div>
              <label className={labelClass}>WhatsApp</label>
              <input
                {...register('whatsapp_encarregado_2', {
                  validate: (val) =>
                    !val || REGEX_TELEFONE_ANGOLA.test(val) || 'Número de telefone inválido.',
                })}
                className={getInputClass('whatsapp_encarregado_2')}
                placeholder="9XX XXX XXX"
              />
              {errors.whatsapp_encarregado_2 && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
                  <AlertCircle size={12} />
                  {errors.whatsapp_encarregado_2.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}