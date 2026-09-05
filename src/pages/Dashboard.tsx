import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  Users, Stethoscope, Search, Pencil, LogOut, FileText, CheckCircle2, Download,
  GraduationCap, Heart, Calendar, ShieldCheck, UserCheck, Eye
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ModalDetalhesEscuteiro, type EscuteiroCompleto,  } from './ModalDetalhesEscuteiro';

const CORES_DONUT = ['#651F65', '#8A3D8A', '#B57AB5', '#D9B8D9', '#EBE0EB'];

export default function Dashboard() {
  const [registos, setRegistos] = useState<EscuteiroCompleto[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtroSeccao, setFiltroSeccao] = useState('TODAS');
  const [filtroSituacao, setFiltroSituacao] = useState('TODOS');
  const [exportando, setExportando] = useState(false);
  const [escuteiroSelecionado, setEscuteiroSelecionado] = useState<EscuteiroCompleto | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    let ativo = true;

    async function carregarDados() {
      const { data, error } = await supabase
        .from('escuteiros')
        .select('*') // Procura TODOS os campos
        .order('created_at', { ascending: false });

      if (!ativo) return;
      if (!error && data) setRegistos(data as EscuteiroCompleto[]);
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

  // --- ANALYTICS ---
  const total = registos.length;
  const comDoenca = useMemo(() => registos.filter((r) => r.sofre_doenca).length, [registos]);
  const baptizados = useMemo(() => registos.filter((r) => r.baptizado).length, [registos]);
  const activos = useMemo(() => registos.filter((r) => (r.situacao || '').trim() === 'Activo').length, [registos]);

  const mediaIdade = useMemo(() => {
    if (!registos.length) return 0;
    const hoje = new Date();
    const idades = registos.map((r) => {
      if (!r.data_nascimento) return 0;
      const nasc = new Date(r.data_nascimento);
      let idade = hoje.getFullYear() - nasc.getFullYear();
      const m = hoje.getMonth() - nasc.getMonth();
      if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
      return idade > 0 && idade < 100 ? idade : 0;
    }).filter(i => i > 0);

    return idades.length ? Math.round(idades.reduce((a, b) => a + b, 0) / idades.length) : 0;
  }, [registos]);

  const porSeccao = useMemo(() => Object.entries(
    registos.reduce<Record<string, number>>((acc, r) => {
      const s = (r.seccao || 'Não definida').trim();
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, total]) => ({ name, total })), [registos]);

  const porCategoria = useMemo(() => Object.entries(
    registos.reduce<Record<string, number>>((acc, r) => {
      const c = (r.categoria || 'Não definida').trim();
      acc[c] = (acc[c] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value })), [registos]);

  const porEscolaridade = useMemo(() => Object.entries(
    registos.reduce<Record<string, number>>((acc, r) => {
      const h = (r.habilitacao_literaria || 'Não informada').trim();
      let label = h;
      if (h.includes('Primário')) label = 'E. Primário';
      if (h.includes('I Ciclo')) label = 'Iº Ciclo Sec.';
      if (h.includes('II Ciclo')) label = 'IIº Ciclo Sec.';
      acc[label] = (acc[label] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, total]) => ({ name, total })), [registos]);

  const registosFiltrados = useMemo(() => {
    return registos.filter((r) => {
      const bateNome = r.nome_completo!.toLowerCase().includes(busca.toLowerCase());
      const seccaoLimpa = (r.seccao || '').trim();
      const situacaoLimpa = (r.situacao || '').trim();

      const bateSeccao = filtroSeccao === 'TODAS' || seccaoLimpa === filtroSeccao;
      const bateSituacao = filtroSituacao === 'TODOS' || situacaoLimpa === filtroSituacao;

      return bateNome && bateSeccao && bateSituacao;
    });
  }, [registos, busca, filtroSeccao, filtroSituacao]);

  async function sair() {
    await supabase.auth.signOut();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Cabeçalho */}
      <header className="sticky top-0 z-30 bg-gradient-to-r from-[#651F65] via-[#7B277B] to-[#8A3D8A] px-4 py-4 text-white shadow-lg sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md text-base font-extrabold text-white ring-1 ring-white/20 shadow-inner">
              296
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight sm:text-lg">
                Agrupamento Nº296 — Sábios do Oriente
              </h1>
              <p className="text-xs text-purple-200">Painel de Análise e Cadastramento de Escuteiros</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportarExcel}
              disabled={exportando}
              className="flex items-center gap-2 rounded-lg bg-white/10 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Download size={15} />
              <span className="hidden sm:inline">{exportando ? 'A exportar...' : 'Exportar Excel'}</span>
            </button>
            <button
              onClick={sair}
              className="flex items-center gap-2 rounded-lg bg-red-500/20 px-3.5 py-2 text-xs font-semibold text-red-200 border border-red-500/30 transition hover:bg-red-500/30 active:scale-95 cursor-pointer"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-8">
        {/* KPI Cards */}
        <section>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
            <KpiCard icon={<Users size={20} />} label="Total de Inscritos" valor={total} cor="purple" loading={loading} />
            <KpiCard icon={<UserCheck size={20} />} label="Efetivo Activo" valor={activos} subtexto={total ? `${Math.round((activos / total) * 100)}% do total` : ''} cor="blue" loading={loading} />
            <KpiCard icon={<Stethoscope size={20} />} label="Atenção Médica" valor={comDoenca} subtexto="Requerem cuidados" cor="amber" loading={loading} />
            <KpiCard icon={<ShieldCheck size={20} />} label="Baptizados" valor={baptizados} subtexto={total ? `${Math.round((baptizados / total) * 100)}% de cobertura` : ''} cor="emerald" loading={loading} />
            <KpiCard icon={<Calendar size={20} />} label="Média de Idade" valor={mediaIdade ? `${mediaIdade} anos` : '—'} cor="indigo" loading={loading} />
          </div>
        </section>

        {/* Gráficos */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Análise Demográfica e Estrutural</h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-md">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-700">Membros por Secção</h3>
                <span className="rounded-md bg-purple-50 px-2 py-1 text-[10px] font-semibold text-[#651F65]">Unidades</span>
              </div>
              {loading ? <SkeletonChart /> : porSeccao.length === 0 ? <EstadoVazio texto="Sem dados de secção" /> : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={porSeccao}>
                    <XAxis dataKey="name" fontSize={11} tickLine={false} stroke="#949495" />
                    <YAxis allowDecimals={false} fontSize={11} tickLine={false} stroke="#949495" />
                    <Tooltip cursor={{ fill: '#F3E8F3' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="total" fill="#651F65" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-md">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-700">Progresso (Categoria)</h3>
                <span className="rounded-md bg-purple-50 px-2 py-1 text-[10px] font-semibold text-[#651F65]">Estatuto</span>
              </div>
              {loading ? <SkeletonChart /> : porCategoria.length === 0 ? <EstadoVazio texto="Sem dados de categoria" /> : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={porCategoria} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={4}>
                      {porCategoria.map((_, i) => (
                        <Cell key={i} fill={CORES_DONUT[i % CORES_DONUT.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-md md:col-span-2 lg:col-span-1">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-700">Escolaridade</h3>
                <GraduationCap size={18} className="text-purple-600" />
              </div>
              {loading ? <SkeletonChart /> : porEscolaridade.length === 0 ? <EstadoVazio texto="Sem dados de escolaridade" /> : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={porEscolaridade} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" fontSize={10} width={90} tickLine={false} stroke="#64748B" />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="total" fill="#8A3D8A" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </section>

        {/* Tabela de Registos */}
        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Efetivo Cadastrado</h2>
              {!loading && (
                <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                  {registosFiltrados.length}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar por nome..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs focus:border-[#651F65] focus:outline-none focus:ring-2 focus:ring-[#651F65]/20 shadow-xs"
                />
              </div>

              <select
                value={filtroSeccao}
                onChange={(e) => setFiltroSeccao(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 focus:border-[#651F65] focus:outline-none shadow-xs"
              >
                <option value="TODAS">Todas Secções</option>
                <option value="Iª Secção">Iª Secção</option>
                <option value="IIª Secção">IIª Secção</option>
                <option value="IIIª Secção">IIIª Secção</option>
                <option value="IVª Secção">IVª Secção</option>
                <option value="Dirigente">Dirigente</option>
              </select>

              <select
                value={filtroSituacao}
                onChange={(e) => setFiltroSituacao(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 focus:border-[#651F65] focus:outline-none shadow-xs"
              >
                <option value="TODOS">Todos Estados</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
                <option value="Transferido">Transferido</option>
                <option value="Desligado">Desligado</option>
              </select>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
            {loading ? (
              <SkeletonTabela />
            ) : registosFiltrados.length === 0 ? (
              <EstadoVazio
                texto={busca || filtroSeccao !== 'TODAS' ? 'Nenhum escuteiro encontrado com os filtros aplicados.' : 'Ainda não existem cadastros.'}
                className="py-16"
              />
            ) : (
              <>
                {/* VISTA DESKTOP */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/80 font-bold uppercase tracking-wider text-slate-500">
                        <th className="px-5 py-3.5">Escuteiro</th>
                        <th className="px-4 py-3.5">Secção & Categoria</th>
                        <th className="px-4 py-3.5">Província</th>
                        <th className="px-4 py-3.5">Condição / Saúde</th>
                        <th className="px-4 py-3.5">Situação</th>
                        <th className="px-5 py-3.5 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {registosFiltrados.map((r) => (
                        <tr key={r.id} className="transition hover:bg-purple-50/30">
                          <td className="px-5 py-4">
                            <div className="font-semibold text-slate-800">{r.nome_completo}</div>
                            {r.cargo_funcao && (
                              <div className="text-[10px] text-slate-400">{r.cargo_funcao.trim()}</div>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-col gap-1 items-start">
                              <span className="rounded-md bg-purple-100/80 px-2 py-0.5 text-[11px] font-semibold text-[#651F65]">
                                {(r.seccao || '—').trim()}
                              </span>
                              {r.categoria && (
                                <span className="text-[10px] text-slate-500">{r.categoria.trim()}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-slate-600 font-medium">{r.provincia || '—'}</td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {r.sofre_doenca ? (
                                <span
                                  title={r.sofre_doenca_qual || 'Atenção Médica'}
                                  className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800"
                                >
                                  <Heart size={10} className="fill-amber-600" />
                                  {r.sofre_doenca_qual ? r.sofre_doenca_qual : 'Doença'}
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400">Saudável</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <BadgeSituacao situacao={(r.situacao || 'Activo').trim()} />
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {r.pdf_gerado && (
                                <span title={`PDF emitido em ${new Date(r.pdf_gerado_em || '').toLocaleDateString('pt-PT')}`}>
                                  <CheckCircle2 size={16} className="text-emerald-600 mr-1" />
                                </span>
                              )}
                              <button
                                onClick={() => setEscuteiroSelecionado(r)}
                                className="inline-flex items-center gap-1 rounded-lg border border-purple-200 bg-purple-50/50 px-2.5 py-1.5 font-medium text-[#651F65] hover:bg-purple-100 transition cursor-pointer"
                                title="Ver Todos os Dados"
                              >
                                <Eye size={13} /> Ver Detalhes
                              </button>
                              <a
                                href={`/pdf/${r.id}`}
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 font-medium text-slate-600 hover:border-[#651F65] hover:text-[#651F65] transition"
                              >
                                <FileText size={13} /> Ficha
                              </a>
                              <a
                                href={`/editar/${r.id}`}
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 font-medium text-slate-600 hover:border-[#651F65] hover:text-[#651F65] transition"
                              >
                                <Pencil size={13} /> Editar
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* VISTA MOBILE */}
                <div className="grid gap-3 p-3 md:hidden">
                  {registosFiltrados.map((r) => (
                    <div key={r.id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-3 transition active:bg-slate-100/80">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-sm text-slate-800 leading-snug">{r.nome_completo}</h4>
                          <p className="text-[11px] text-slate-500">{r.provincia || 'Província N/I'}</p>
                        </div>
                        <BadgeSituacao situacao={(r.situacao || 'Activo').trim()} />
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-[#651F65]">
                          {(r.seccao || 'Sem secção').trim()}
                        </span>
                        {r.categoria && (
                          <span className="rounded-md bg-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                            {r.categoria.trim()}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                        <button
                          onClick={() => setEscuteiroSelecionado(r)}
                          className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-purple-50 border border-purple-200 py-2 text-xs font-semibold text-[#651F65] active:bg-purple-100"
                        >
                          <Eye size={14} /> Ver
                        </button>
                        <a
                          href={`/pdf/${r.id}`}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-white border border-slate-200 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
                        >
                          <FileText size={14} className="text-purple-700" /> Ficha
                        </a>
                        <a
                          href={`/editar/${r.id}`}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-white border border-slate-200 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
                        >
                          <Pencil size={14} className="text-purple-700" /> Editar
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      {/* MODAL AUTÓNOMO */}
      {escuteiroSelecionado && (
        <ModalDetalhesEscuteiro
          escuteiro={escuteiroSelecionado}
          onClose={() => setEscuteiroSelecionado(null)}
        />
      )}
    </div>
  );
}

// COMPONENTES AUXILIARES
function KpiCard({
  icon, label, valor, subtexto, cor, loading,
}: {
  icon: React.ReactNode;
  label: string;
  valor: string | number;
  subtexto?: string;
  cor: 'purple' | 'amber' | 'emerald' | 'blue' | 'indigo';
  loading: boolean;
}) {
  const estilosCor = {
    purple: 'bg-purple-50 text-[#651F65] border-purple-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition hover:shadow-md flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-slate-500">{label}</span>
        <div className={`p-2 rounded-xl border ${estilosCor[cor]}`}>
          {icon}
        </div>
      </div>
      <div>
        {loading ? (
          <div className="h-8 w-16 animate-pulse rounded-lg bg-slate-100" />
        ) : (
          <div className="text-2xl font-extrabold text-slate-800 tracking-tight">{valor}</div>
        )}
        {subtexto && <p className="mt-1 text-[10px] font-medium text-slate-400">{subtexto}</p>}
      </div>
    </div>
  );
}

function BadgeSituacao({ situacao }: { situacao: string }) {
  const estilos: Record<string, string> = {
    Activo: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Inactivo: 'bg-slate-100 text-slate-600 border-slate-200',
    Transferido: 'bg-blue-100 text-blue-800 border-blue-200',
    Desligado: 'bg-rose-100 text-rose-800 border-rose-200',
  };

  const estilo = estilos[situacao] || 'bg-slate-100 text-slate-600 border-slate-200';

  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold ${estilo}`}>
      {situacao}
    </span>
  );
}

function EstadoVazio({ texto, className = '' }: { texto: string; className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center text-center text-xs font-medium text-slate-400 ${className}`}>
      <Search size={28} className="mb-2 text-slate-300 stroke-[1.5]" />
      <p>{texto}</p>
    </div>
  );
}

function SkeletonChart() {
  return <div className="h-52 w-full animate-pulse rounded-xl bg-slate-100" />;
}

function SkeletonTabela() {
  return (
    <div className="space-y-3 p-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-12 w-full animate-pulse rounded-xl bg-slate-100" />
      ))}
    </div>
  );
}