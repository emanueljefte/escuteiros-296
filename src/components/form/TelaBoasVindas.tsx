export default function TelaBoasVindas({ onComecar }: { onComecar: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-aea-roxo to-aea-roxo-claro px-6 text-center text-white">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-lg">
        <span className="text-3xl font-bold text-aea-roxo">AEA</span>
      </div>

      <p className="mb-1 text-sm uppercase tracking-widest text-white/70">
        Associação de Escuteiros de Angola
      </p>
      <h1 className="mb-2 text-xl font-bold">
        Agrupamento Nº296 Sábios do Oriente
      </h1>
      <p className="mb-8 max-w-xs text-sm italic text-white/80">
        "Juntos para a comunidade e com a comunidade"
      </p>

      <div className="mb-8 max-w-sm rounded-xl bg-white/10 p-4 text-sm text-white/90 backdrop-blur">
        Esta ficha deverá ser preenchida com os teus dados de forma legível.
        As informações são confidenciais e usadas apenas pelo Chefe de Clã e Instrutores.
      </div>

      <button
        onClick={onComecar}
        className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-aea-roxo shadow-lg transition hover:scale-105"
      >
        Começar Inscrição
      </button>
    </div>
  );
}