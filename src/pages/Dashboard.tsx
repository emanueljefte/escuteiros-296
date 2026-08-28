import { useEffect, useState } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import { supabase } from '../lib/supabase';

interface Escuteiro {
  id: string;
  nome_completo: string;
  municipio: string;
  seccao: string;
  doenca: boolean;
  alergia: boolean;
  deficiencia: boolean;
  created_at: string;
}

const CORES = ['#1F4E78', '#2E75B6', '#9DC3E6', '#BDD7EE', '#548235'];

export default function Dashboard() {
  const [registos, setRegistos] = useState<Escuteiro[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  let ativo = true;

  async function carregarDados() {
    const { data, error } = await supabase
      .from('escuteiros')
      .select('id, nome_completo, municipio, seccao, doenca, alergia, deficiencia, created_at')
      .order('created_at', { ascending: false });

    if (!ativo) return;
    if (!error && data) setRegistos(data);
    setLoading(false);
  }

  carregarDados();

  const canal = supabase
    .channel('escuteiros-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'escuteiros' }, carregarDados)
    .subscribe();

  return () => {
    ativo = false;
    supabase.removeChannel(canal);
  };
}, []);

  if (loading) return <p className="p-6 text-sm text-gray-500">A carregar...</p>;

  const total = registos.length;
  const comDoenca = registos.filter((r) => r.doenca).length;
  const comAlergia = registos.filter((r) => r.alergia).length;
  const comDeficiencia = registos.filter((r) => r.deficiencia).length;

  const porSeccao = Object.entries(
    registos.reduce<Record<string, number>>((acc, r) => {
      const s = r.seccao || 'Não definida';
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, total]) => ({ name, total }));

  const porMunicipio = Object.entries(
    registos.reduce<Record<string, number>>((acc, r) => {
      const m = r.municipio || 'Não definido';
      acc[m] = (acc[m] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="p-4 space-y-6 max-w-5xl mx-auto">
      <h1 className="text-xl font-bold text-[#1F4E78]">Dashboard — Agrupamento 296</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Total de Inscritos" valor={total} />
        <KpiCard label="Com Doença" valor={comDoenca} />
        <KpiCard label="Com Alergia" valor={comAlergia} />
        <KpiCard label="Com Deficiência" valor={comDeficiencia} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="border rounded p-3">
          <h2 className="text-sm font-semibold mb-2">Por Secção</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={porSeccao}>
              <XAxis dataKey="name" fontSize={11} />
              <YAxis allowDecimals={false} fontSize={11} />
              <Tooltip />
              <Bar dataKey="total" fill="#1F4E78" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="border rounded p-3">
          <h2 className="text-sm font-semibold mb-2">Por Município</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={porMunicipio} dataKey="value" nameKey="name" outerRadius={80} label>
                {porMunicipio.map((_, i) => (
                  <Cell key={i} fill={CORES[i % CORES.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="border rounded overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#1F4E78] text-white">
            <tr>
              <th className="p-2 text-left">Nome</th>
              <th className="p-2 text-left">Secção</th>
              <th className="p-2 text-left">Município</th>
              <th className="p-2 text-left">Saúde</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {registos.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-2">{r.nome_completo}</td>
                <td className="p-2">{r.seccao}</td>
                <td className="p-2">{r.municipio}</td>
                <td className="p-2">
                  {r.doenca && '🩺 '}
                  {r.alergia && '⚠️ '}
                  {r.deficiencia && '♿'}
                </td>
                <td className="p-2">
                  <a href={`/editar/${r.id}`} className="text-blue-600 text-xs">
                    Editar
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KpiCard({ label, valor }: { label: string; valor: number }) {
  return (
    <div className="border rounded p-3 text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-[#1F4E78]">{valor}</p>
    </div>
  );
}