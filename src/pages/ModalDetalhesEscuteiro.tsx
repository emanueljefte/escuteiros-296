import React from 'react';
import { X, User, Phone, Users, Shield, HeartPulse, Edit3, FileText, } from 'lucide-react';

export interface EscuteiroCompleto {
  id: string;
  created_at?: string;
  // Pessoais
  nome_completo?: string;
  filho_de?: string;
  e_de?: string;
  tipo_documento?: string;
  numero_documento?: string;
  provincia?: string;
  data_nascimento?: string;
  sexo?: string;
  estado_civil?: string;
  morada?: string;

  // Contactos
  contacto_pessoal?: string;
  whatsapp_pessoal?: string;

  // Encarregados
  nome_encarregado_1?: string;
  parentesco_1?: string;
  contacto_encarregado_1?: string;
  whatsapp_encarregado_1?: string;
  nome_encarregado_2?: string;
  parentesco_2?: string;
  contacto_encarregado_2?: string;
  whatsapp_encarregado_2?: string;

  // Habilitações, Ocupação e Cargo
  habilitacao_literaria?: string;
  nome_instituicao?: string;
  local_escola?: string;
  profissao?: string;
  local_trabalho?: string;
  outras_ocupacao?: string;

  // Escutistas
  seccao?: string;
  categoria?: string;
  patrulha_bando_equipe?: string;
  cargo_funcao?: string;
  data_promessa?: string;
  situacao?: string;

  // Saúde e Vida Cristã
  igreja?: string;
  baptizado?: boolean | string;
  sofre_doenca?: boolean | string;
  sofre_doenca_qual?: string;
  pertence_outro_grupo?: boolean | string;
  pertence_outro_grupo_qual?: string;
  obs?: string;

  pdf_gerado?: boolean | null;
  pdf_gerado_em?: string | null;
}

interface ModalDetalhesEscuteiroProps {
  escuteiro: EscuteiroCompleto;
  onClose: () => void;
}

export const ModalDetalhesEscuteiro: React.FC<ModalDetalhesEscuteiroProps> = ({
  escuteiro,
  onClose,
}) => {
  if (!escuteiro) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden my-auto border border-slate-200">
        
        {/* Cabeçalho na cor institucional (#651F65) */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#651F65] via-[#7B277B] to-[#8A3D8A] text-white">
          <div>
            <h2 className="text-xl font-bold leading-tight">
              {escuteiro.nome_completo || 'Detalhes do Escuteiro'}
            </h2>
            <p className="text-xs text-purple-200">
              Ficha de registo do Agrupamento Nº 296
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <a
              href={`/editar/${escuteiro.id}`}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium transition backdrop-blur-xs"
            >
              <Edit3 size={14} /> Editar
            </a>
            <a
              href={`/pdf/${escuteiro.id}`}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-[#651F65] hover:bg-purple-50 rounded-lg text-xs font-semibold transition shadow-xs"
            >
              <FileText size={14} /> Gerar PDF
            </a>
            <button
              onClick={onClose}
              className="p-1.5 text-purple-200 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Corpo do Modal */}
        <div className="p-6 overflow-y-auto space-y-8 bg-slate-50/50">
          
          {/* 1. Dados Pessoais e Identificação */}
          <section className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-2 mb-4 text-[#651F65] border-b pb-2 border-slate-100">
              <User className="w-5 h-5" />
              <h3 className="font-bold text-base text-slate-800">Dados Pessoais & Identificação</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <ItemDetalhe label="Nome Completo" value={escuteiro.nome_completo} className="md:col-span-2" />
              <ItemDetalhe label="Data de Nascimento" value={escuteiro.data_nascimento} />
              <ItemDetalhe label="Pai (Filho de)" value={escuteiro.filho_de} />
              <ItemDetalhe label="Mãe (E de)" value={escuteiro.e_de} />
              <ItemDetalhe label="Sexo" value={escuteiro.sexo} />
              <ItemDetalhe label="Estado Civil" value={escuteiro.estado_civil} />
              <ItemDetalhe label="Tipo de Documento" value={escuteiro.tipo_documento} />
              <ItemDetalhe label="Nº do Documento" value={escuteiro.numero_documento} />
              <ItemDetalhe label="Província" value={escuteiro.provincia} />
              <ItemDetalhe label="Morada" value={escuteiro.morada} className="md:col-span-2 lg:col-span-3" />
            </div>
          </section>

          {/* 2. Contactos Pessoais */}
          <section className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-2 mb-4 text-[#651F65] border-b pb-2 border-slate-100">
              <Phone className="w-5 h-5" />
              <h3 className="font-bold text-base text-slate-800">Contactos Pessoais</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <ItemDetalhe label="Contacto Principal" value={escuteiro.contacto_pessoal} />
              <ItemDetalhe label="WhatsApp" value={escuteiro.whatsapp_pessoal} />
            </div>
          </section>

          {/* 3. Encarregados de Educação */}
          <section className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-2 mb-4 text-[#651F65] border-b pb-2 border-slate-100">
              <Users className="w-5 h-5" />
              <h3 className="font-bold text-base text-slate-800">Encarregados de Educação</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Encarregado 1 */}
              <div className="p-4 bg-purple-50/50 rounded-xl space-y-3 border border-purple-100">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#651F65]">1º Encarregado</span>
                <ItemDetalhe label="Nome" value={escuteiro.nome_encarregado_1} />
                <ItemDetalhe label="Parentesco" value={escuteiro.parentesco_1} />
                <ItemDetalhe label="Contacto" value={escuteiro.contacto_encarregado_1} />
                <ItemDetalhe label="WhatsApp" value={escuteiro.whatsapp_encarregado_1} />
              </div>

              {/* Encarregado 2 */}
              <div className="p-4 bg-purple-50/50 rounded-xl space-y-3 border border-purple-100">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#651F65]">2º Encarregado</span>
                <ItemDetalhe label="Nome" value={escuteiro.nome_encarregado_2} />
                <ItemDetalhe label="Parentesco" value={escuteiro.parentesco_2} />
                <ItemDetalhe label="Contacto" value={escuteiro.contacto_encarregado_2} />
                <ItemDetalhe label="WhatsApp" value={escuteiro.whatsapp_encarregado_2} />
              </div>
            </div>
          </section>

          {/* 4. Dados Escutistas */}
          <section className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-2 mb-4 text-[#651F65] border-b pb-2 border-slate-100">
              <Shield className="w-5 h-5" />
              <h3 className="font-bold text-base text-slate-800">Informações Escutistas</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <ItemDetalhe label="Secção" value={escuteiro.seccao} />
              <ItemDetalhe label="Categoria" value={escuteiro.categoria} />
              <ItemDetalhe label="Patrulha / Bando / Equipa" value={escuteiro.patrulha_bando_equipe} />
              <ItemDetalhe label="Cargo / Função" value={escuteiro.cargo_funcao} />
              <ItemDetalhe label="Data de Promessa" value={escuteiro.data_promessa} />
              <ItemDetalhe label="Situação" value={escuteiro.situacao} />
            </div>
          </section>

          {/* 5. Saúde e Vida Cristã */}
          <section className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-2 mb-4 text-[#651F65] border-b pb-2 border-slate-100">
              <HeartPulse className="w-5 h-5" />
              <h3 className="font-bold text-base text-slate-800">Saúde e Vida Cristã</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <ItemDetalhe label="Igreja" value={escuteiro.igreja} />
              <ItemDetalhe label="Baptizado(a)?" value={formatBoolean(escuteiro.baptizado)} />
              <ItemDetalhe label="Pertence a outro grupo?" value={formatBoolean(escuteiro.pertence_outro_grupo)} />
              {escuteiro.pertence_outro_grupo_qual && (
                <ItemDetalhe label="Qual outro grupo?" value={escuteiro.pertence_outro_grupo_qual} />
              )}
              <ItemDetalhe label="Sofre de alguma doença?" value={formatBoolean(escuteiro.sofre_doenca)} />
              {escuteiro.sofre_doenca_qual && (
                <ItemDetalhe label="Qual doença?" value={escuteiro.sofre_doenca_qual} />
              )}
              <ItemDetalhe label="Observações / Anotações" value={escuteiro.obs} className="md:col-span-2 lg:col-span-3" />
            </div>
          </section>

        </div>

        {/* Rodapé com Ações Principais */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-6 py-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={`/editar/${escuteiro.id}`}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-purple-50 border border-purple-200 text-[#651F65] hover:bg-purple-100 font-semibold rounded-xl text-xs transition"
            >
              <Edit3 size={15} /> Editar Dados
            </a>
            <a
              href={`/pdf/${escuteiro.id}`}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#651F65] hover:bg-[#7B277B] text-white font-semibold rounded-xl text-xs transition shadow-xs"
            >
              <FileText size={15} /> Gerar PDF / Ficha
            </a>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl text-xs transition cursor-pointer"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};

// Componente auxiliar para cada item
interface ItemDetalheProps {
  label: string;
  value?: string | number | boolean | null;
  className?: string;
}

const ItemDetalhe: React.FC<ItemDetalheProps> = ({ label, value, className = '' }) => (
  <div className={`flex flex-col ${className}`}>
    <span className="text-[11px] text-slate-400 font-medium">{label}</span>
    <span className="text-xs font-semibold text-slate-800 mt-0.5">
      {value !== undefined && value !== null && value !== '' ? String(value) : '—'}
    </span>
  </div>
);

// Auxiliar para booleanos
const formatBoolean = (val?: boolean | string) => {
  if (val === true || val === 'sim' || val === 'Sim') return 'Sim';
  if (val === false || val === 'nao' || val === 'Não') return 'Não';
  return val || '—';
};