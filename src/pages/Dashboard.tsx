import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  Users, Stethoscope, Search, Pencil, LogOut,
  FileText,
  CheckCircle2,
  Download,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Escuteiro {
  id: string;
  nome_completo: string;
  provincia: string;
  seccao: string;
  categoria: string;
  situacao: string;
  sofre_doenca: boolean;
  baptizado: boolean;
  pdf_gerado: boolean;
  pdf_gerado_em: string;
  created_at: string;
}

const CORES_GRAFICO = ['#651F65', '#8A3D8A', '#B57AB5', '#D9B8D9', '#949495'];

export default function Dashboard() {
  const [registos, setRegistos] = useState<Escuteiro[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [exportando, setExportando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let ativo = true;

    async function carregarDados() {
      const { data: sessao } = await supabase.auth.getSession();
      console.log('sessão:', sessao);
      const { data, error } = await supabase
        .from('escuteiros')
        .select('id, nome_completo, provincia, seccao, categoria, situacao, sofre_doenca, baptizado, created_at, pdf_gerado, pdf_gerado_em')
        .order('created_at', { ascending: false });
      console.log('data:', data, 'error:', error);


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

  async function exportarExcel() {
    setExportando(true);
    try {
      const { data: sessao } = await supabase.auth.getSession();
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/exportar-excel`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${sessao.session?.access_token}` },
      });
      if (!resp.ok) throw new Error(await resp.text());
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Cadastramento_Agrupamento_296.xlsx';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Não foi possível exportar o Excel. Tenta novamente.');
    } finally {
      setExportando(false);
    }
  }

  const total = registos.length;
  const comDoenca = registos.filter((r) => r.sofre_doenca).length;
  const baptizados = registos.filter((r) => r.baptizado).length;
  const activos = registos.filter((r) => r.situacao === 'Activo').length;

  const porSeccao = useMemo(() => Object.entries(
    registos.reduce<Record<string, number>>((acc, r) => {
      const s = (r.seccao || 'Não definida').trim();
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, total]) => ({ name, total })), [registos]);

  const porProvincia = useMemo(() => Object.entries(
    registos.reduce<Record<string, number>>((acc, r) => {
      const p = r.provincia || 'Não definida';
      acc[p] = (acc[p] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value })), [registos]);

  const registosFiltrados = registos.filter((r) =>
    r.nome_completo.toLowerCase().includes(busca.toLowerCase())
  );

  async function sair() {
    await supabase.auth.signOut();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho */}
      <header className="bg-linear-to-r from-aea-roxo to-aea-roxo-claro px-6 py-5 text-white shadow-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-bold text-aea-roxo shadow">
              AEA
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">Agrupamento Nº296 — Sábios do Oriente</h1>
              <p className="text-xs text-white/75">Painel Administrativo de Cadastramento</p>
            </div>
          </div>
          <button
            onClick={exportarExcel}
            disabled={exportando}
            className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-xs font-medium transition hover:bg-white/20 disabled:opacity-50"
          >
            <Download size={14} /> {exportando ? 'A exportar...' : 'Exportar Excel'}
          </button>
          <button
            onClick={sair}
            className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-xs font-medium transition hover:bg-white/20"
          >
            <LogOut size={14} /> Sair
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-6 py-8">
        {/* Secção: Visão Geral */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-aea-cinza">
            Visão Geral
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <KpiCard icon={<Users size={18} />} label="Total de Inscritos" valor={total} cor="aea-roxo" loading={loading} />
            <KpiCard icon={<Stethoscope size={18} />} label="Com Doença" valor={comDoenca} cor="amber-500" loading={loading} />
            <KpiCard icon={<CheckCircle2 size={18} />} label="Activos" valor={activos} cor="blue-500" loading={loading} />
            <KpiCard icon={<Users size={18} />} label="Baptizados" valor={baptizados} cor="green-500" loading={loading} />
          </div>
        </section>

        {/* Secção: Gráficos */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-aea-cinza">
            Distribuição dos Inscritos
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="mb-3 text-sm font-semibold text-gray-700">Por Secção</p>
              {loading ? (
                <SkeletonChart />
              ) : porSeccao.length === 0 ? (
                <EstadoVazio texto="Sem dados de secção ainda" />
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={porSeccao}>
                    <XAxis dataKey="name" fontSize={11} stroke="#949495" />
                    <YAxis allowDecimals={false} fontSize={11} stroke="#949495" />
                    <Tooltip />
                    <Bar dataKey="total" fill="#651F65" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="mb-3 text-sm font-semibold text-gray-700">Por Província</p>
              {loading ? (
                <SkeletonChart />
              ) : porProvincia.length === 0 ? (
                <EstadoVazio texto="Sem dados de província ainda" />
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={porProvincia} dataKey="value" nameKey="name" outerRadius={80} label>
                      {porProvincia.map((_, i) => (
                        <Cell key={i} fill={CORES_GRAFICO[i % CORES_GRAFICO.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </section>

        {/* Secção: Lista */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-aea-cinza">
              Lista de Inscritos {!loading && <span className="text-gray-400">({registosFiltrados.length})</span>}
            </h2>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Pesquisar por nome..."
                className="w-56 rounded-lg border border-gray-200 bg-white py-2 pl-8 pr-3 text-sm focus:border-aea-roxo focus:outline-none focus:ring-2 focus:ring-aea-roxo/20"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {loading ? (
              <SkeletonTabela />
            ) : registosFiltrados.length === 0 ? (
              <EstadoVazio texto={busca ? 'Nenhum resultado para essa pesquisa' : 'Ainda não há inscrições'} className="py-12" />
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th className="px-4 py-3">Nome</th>
                    <th className="px-4 py-3">Secção</th>
                    <th className="px-4 py-3">Província</th>
                    <th className="px-4 py-3">Saúde</th>
                    <th className="px-4 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {registosFiltrados.map((r) => (
                    <tr key={r.id} className="border-b border-gray-50 transition hover:bg-gray-50/80">
                      <td className="px-4 py-3 font-medium text-gray-800">{r.nome_completo}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-aea-roxo/10 px-2.5 py-1 text-xs font-medium text-aea-roxo">
                          {r.seccao || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{r.provincia || '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {r.sofre_doenca && <Selo cor="amber" texto="Doença" />}
                          {r.situacao && <Selo cor="blue" texto={r.situacao} />}
                          {!r.sofre_doenca && !r.situacao && <span className="text-xs text-gray-400">—</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {r.pdf_gerado && (
                            <span title={`PDF gerado em ${new Date(r.pdf_gerado_em).toLocaleDateString('pt-PT')}`}>
                              <CheckCircle2 size={14} className="text-green-600" />
                            </span>
                          )}
                          <a href={`/pdf/${r.id}`} className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:border-aea-roxo hover:text-aea-roxo">
                            <FileText size={12} /> Ficha
                          </a>
                          <a href={`/editar/${r.id}`} className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:border-aea-roxo hover:text-aea-roxo">
                            <Pencil size={12} /> Editar
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function KpiCard({
  icon, label, valor, cor, loading,
}: { icon: React.ReactNode; label: string; valor: number; cor: string; loading: boolean }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className={`mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-${cor}/10 text-${cor}`}>
        {icon}
      </div>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      {loading ? (
        <div className="mt-1 h-7 w-12 animate-pulse rounded bg-gray-200" />
      ) : (
        <p className="text-2xl font-bold text-gray-800">{valor}</p>
      )}
    </div>
  );
}

function Selo({ cor, texto }: { cor: 'amber' | 'red' | 'blue'; texto: string }) {
  const estilos = {
    amber: 'bg-amber-100 text-amber-700',
    red: 'bg-red-100 text-red-700',
    blue: 'bg-blue-100 text-blue-700',
  };
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${estilos[cor]}`}>{texto}</span>;
}

function EstadoVazio({ texto, className = '' }: { texto: string; className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center text-center text-sm text-gray-400 ${className}`}>
      <p>{texto}</p>
    </div>
  );
}

function SkeletonChart() {
  return <div className="h-55 w-full animate-pulse rounded-lg bg-gray-100" />;
}

function SkeletonTabela() {
  return (
    <div className="space-y-3 p-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-10 w-full animate-pulse rounded bg-gray-100" />
      ))}
    </div>
  );
}