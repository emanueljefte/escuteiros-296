import { Compass, ShieldCheck, ArrowRight, Clock } from 'lucide-react';

interface TelaBoasVindasProps {
  onComecar: () => void;
}

export default function TelaBoasVindas({ onComecar }: TelaBoasVindasProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-aea-roxo via-[#651F65] to-purple-950 px-4 py-8 text-center text-white overflow-hidden">
      
      {/* Círculos decorativos de fundo */}
      <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center animate-in fade-in zoom-in-95 duration-500">
        
        {/* Emblema / Logo Central */}
        <div className="group mb-6 flex h-28 w-28 items-center justify-center rounded-3xl bg-white shadow-2xl shadow-black/30 transition-all duration-300 hover:scale-105 hover:rotate-1">
          <div className="flex flex-col items-center justify-center text-aea-roxo">
            <Compass className="h-10 w-10 text-[#651F65] transition-transform duration-500 group-hover:rotate-45" />
            <span className="mt-1 text-xs font-black tracking-widest text-aea-roxo">AEA</span>
          </div>
        </div>

        {/* Identificação da Organização */}
        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-purple-200/90">
          Associação de Escuteiros de Angola
        </p>
        
        <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          Agrupamento Nº 296 <br />
          <span className="text-amber-300">Sábios do Oriente</span>
        </h1>
        
        <p className="mb-8 max-w-xs text-xs sm:text-sm italic font-medium text-purple-100/80">
          "Juntos para a comunidade e com a comunidade"
        </p>

        {/* Card Informativo de Confidencialidade */}
        <div className="mb-8 w-full rounded-2xl bg-white/10 p-5 text-xs text-purple-50 backdrop-blur-md border border-white/15 shadow-xl space-y-3">
          <div className="flex items-center justify-center gap-2 text-amber-300 font-semibold text-xs">
            <ShieldCheck size={16} />
            <span>Formulário Oficial de Inscrição</span>
          </div>
          <p className="leading-relaxed text-purple-100/90">
            Esta ficha deverá ser preenchida com os teus dados de forma precisa e completa. 
            As informações prestadas são <strong>estritamente confidenciais</strong> e destinam-se exclusivamente ao arquivo e gestão do Agrupamento.
          </p>
          <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-4 text-[11px] text-purple-200/70">
            <span className="flex items-center gap-1">
              <Clock size={12} /> ~5 min de preenchimento
            </span>
          </div>
        </div>

        {/* Botão Principal de Ação */}
        <button
          onClick={onComecar}
          className="group relative flex items-center justify-center gap-3 w-full sm:w-auto rounded-full bg-white px-8 py-4 text-sm font-bold text-[#651F65] shadow-xl shadow-black/20 transition-all duration-300 hover:bg-amber-300 hover:text-purple-950 hover:scale-[1.02] active:scale-95 cursor-pointer"
        >
          <span>Começar Inscrição</span>
          <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
        </button>

        {/* Rodapé Informativo */}
        <p className="mt-8 text-[11px] text-purple-300/60">
          © {new Date().getFullYear()} Agrupamento Nº 296 • Todos os direitos reservados
        </p>

      </div>
    </div>
  );
}