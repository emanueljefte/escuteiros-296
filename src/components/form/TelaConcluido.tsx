export default function TelaConcluido({ onCadastrarOutro }: { onCadastrarOutro: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-aea-roxo to-aea-roxo-claro px-6 text-center text-white">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg">
        <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="mb-2 text-xl font-bold">Inscrição concluída!</h1>
      <p className="mb-8 max-w-xs text-sm text-white/85">
        Obrigado por te inscreveres no Agrupamento Nº296 Sábios do Oriente.
        Bem-vindo(a) à nossa família escutista.
      </p>

      <button
        onClick={onCadastrarOutro}
        className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-aea-roxo shadow-lg transition hover:scale-105"
      >
        Cadastrar outra pessoa
      </button>
    </div>
  );
}