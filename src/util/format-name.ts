export function formatarNomeProprio(nome: string): string {
  if (!nome) return '';

  // Lista de partículas que devem permanecer em minúsculo
  const preposicoes = new Set(['de', 'da', 'do', 'das', 'dos', 'e', 'nº']);

  return nome
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((palavra, index) => {
      if (index > 0 && preposicoes.has(palavra)) {
        return palavra;
      }
      return palavra.charAt(0).toUpperCase() + palavra.slice(1);
    })
    .join(' ');
}