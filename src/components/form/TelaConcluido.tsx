import { CheckCircle2, UserPlus, HeartHandshake, ShieldCheck } from 'lucide-react';

interface TelaConcluidoProps {
  onCadastrarOutro: () => void;
}

export default function TelaConcluido({ onCadastrarOutro }: TelaConcluidoProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-aea-roxo via-[#651F65] to-purple-950 px-4 py-8 text-center text-white overflow-hidden">
      
      {/* Círculos decorativos de fundo */}
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center animate-in fade-in zoom-in-95 duration-500">
        
        {/* Ícone de Sucesso com Anel Pulsante */}
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-2xl shadow-black/30">
            <CheckCircle2 className="h-14 w-14 text-emerald-600" />
          </div>
        </div>

        {/* Mensagem Principal */}
        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-emerald-300 flex items-center gap-1.5 justify-center">
          <ShieldCheck size={16} /> Sucesso
        </p>

        <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          Inscrição Concluída!
        </h1>
        
        <p className="mb-6 max-w-xs text-xs sm:text-sm text-purple-100/90 leading-relaxed">
          Obrigado por te inscreveres no <br />
          <strong className="text-amber-300 font-semibold">Agrupamento Nº 296 Sábios do Oriente</strong>.
        </p>

        {/* Card Informativo com Boas-Vindas */}
        <div className="mb-8 w-full rounded-2xl bg-white/10 p-5 text-xs text-purple-50 backdrop-blur-md border border-white/15 shadow-xl space-y-3 text-left">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
            <HeartHandshake size={18} />
            <span>Bem-vindo(a) à nossa Família Escutista!</span>
          </div>
          <p className="leading-relaxed text-purple-100/90 text-justify">
            Os teus dados foram submetidos com sucesso ao sistema. A chefia do agrupamento irá analisar a ficha de inscrição para validação e atribuição da respectiva unidade/secção.
          </p>
          <div className="pt-2 border-t border-white/10 text-[11px] text-purple-200/70 italic text-center">
            "Sempre Alerta para Servir"
          </div>
        </div>

        {/* Botão de Ação */}
        <button
          onClick={onCadastrarOutro}
          className="group relative flex items-center justify-center gap-2 w-full sm:w-auto rounded-full bg-white px-8 py-4 text-sm font-bold text-[#651F65] shadow-xl shadow-black/20 transition-all duration-300 hover:bg-amber-300 hover:text-purple-950 hover:scale-[1.02] active:scale-95 cursor-pointer"
        >
          <UserPlus size={18} />
          <span>Inscrever outro Escuteiro</span>
        </button>

        {/* Rodapé Informativo */}
        <p className="mt-8 text-[11px] text-purple-300/60">
          © {new Date().getFullYear()} Agrupamento Nº 296 • Associação de Escuteiros de Angola
        </p>

      </div>
    </div>
  );
}