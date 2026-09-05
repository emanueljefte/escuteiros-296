import { useFormContext } from 'react-hook-form';
import { FileText, AlertCircle, ShieldCheck } from 'lucide-react';
import type { EscuteiroFormInput } from '../../lib/schema';
import { labelClass } from './estilos';

export default function TermoAceitacao() {
  const {
    register,
    formState: { errors },
  } = useFormContext<EscuteiroFormInput>();

  const temErro = Boolean(errors.termo_aceite);

  return (
    <div className="animate-in fade-in duration-300 space-y-5">
      {/* Cabeçalho da Secção */}
      <div className="flex items-center gap-3 border-b border-aea-cinza/30 pb-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-aea-roxo text-sm font-bold text-white">
          4
        </span>
        <h2 className="text-base font-semibold text-aea-roxo">
          Termo de Aceitação e Compromisso
        </h2>
      </div>

      {/* Cartão Informativo / Texto do Termo */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#651F65]">
          <FileText size={16} />
          <span>Declaração de Compromisso Escutista</span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-4 text-xs sm:text-sm text-slate-700 leading-relaxed shadow-inner max-h-48 overflow-y-auto">
          <p>
            Declaro, para os devidos efeitos, aceitar integralmente todas as normas, deveres e condições referentes ao agrupamento, constantes no <strong>Regulamento Geral da Associação de Escuteiros de Angola (AEA)</strong> e nas diretrizes internas do Agrupamento Nº 296 Sábios do Oriente.
          </p>
          <p className="mt-2 text-slate-500 text-[11px] italic">
            Comprometo-me a respeitar os valores do escutismo, zelando pela fraternidade, disciplina, conservação do material e participação ativa nas atividades.
          </p>
        </div>
      </div>

      {/* Campo Checkbox com feedback de validação */}
      <div
        className={`p-4 rounded-2xl border transition-all duration-200 ${
          temErro
            ? 'border-red-300 bg-red-50/40'
            : 'border-slate-200/80 bg-white hover:border-purple-200'
        }`}
      >
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            {...register('termo_aceite', {
              required: 'É necessário aceitar os termos para concluir a inscrição.',
            })}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-purple-700 focus:ring-purple-500 focus:ring-offset-0 transition cursor-pointer"
          />
          <div className="space-y-0.5">
            <span className={labelClass}>
              Li e aceito expressamente o Termo de Aceitação <span className="text-red-500">*</span>
            </span>
            <p className="text-[11px] text-slate-500">
              Ao assinalar esta caixa, confirma que as informações prestadas neste formulário são verdadeiras.
            </p>
          </div>
        </label>

        {errors.termo_aceite && (
          <p className="mt-3 text-xs text-red-600 flex items-center gap-1.5 font-medium border-t border-red-200/60 pt-2">
            <AlertCircle size={14} className="shrink-0 text-red-500" />
            {errors.termo_aceite.message}
          </p>
        )}
      </div>

      {/* Nota de Segurança e Privacidade */}
      <div className="flex items-center gap-2 text-[11px] text-slate-400 justify-center pt-1">
        <ShieldCheck size={14} className="text-emerald-600" />
        <span>Dados protegidos e mantidos sob estrita confidencialidade</span>
      </div>
    </div>
  );
}