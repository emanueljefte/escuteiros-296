export async function exportarExcel() {
  const res = await fetch('/api/exportar-excel');
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Cadastramento_Agrupamento_296.xlsx';
  a.click();
}