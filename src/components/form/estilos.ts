export const inputClass =
  'w-full rounded-lg border border-aea-cinza/40 bg-white px-3 py-2.5 text-sm text-gray-800 ' +
  'placeholder:text-gray-400 transition focus:border-aea-roxo focus:outline-none focus:ring-2 focus:ring-aea-roxo/20';

export const selectClass = inputClass + ' appearance-none bg-white';

export const labelClass = 'mb-1 block text-xs font-semibold uppercase tracking-wide text-aea-roxo/80';

export function badgeHeader(numero: number, titulo: string) {
  return { numero, titulo };
}