import Dexie, { type Table } from 'dexie';

export interface EscuteiroLocal {
  local_id: string;          // uuid gerado no cliente, chave de dedup na sync
  numero_inscricao?: string;
  nome_completo: string;
  filho_de?: string;
  e_de?: string;
  bi_numero?: string;
  cedula_numero?: string;
  morada?: string;
  provincia?: string;
  municipio?: string;
  estado_civil?: string;
  telefone?: string;
  whatsapp?: string;
  contacto_encarregado?: string;
  data_nascimento?: string;
  habilitacao_literaria?: string;
  profissao?: string;
  escola_local_trabalho?: string;
  outras_habilidades?: string;
  data_local_investidura?: string;
  seccao?: string;
  bando?: string;
  patrulha?: string;
  equipe?: string;
  cargo?: string;
  baptizado?: boolean;
  baptizado_detalhe?: string;
  doenca?: boolean;
  doenca_qual?: string;
  alergia?: boolean;
  alergia_qual?: string;
  deficiencia?: boolean;
  deficiencia_qual?: string;
  termo_aceite: boolean;
  foto_blob?: Blob;
  assinatura_blob?: Blob;
  sync_status: 'pendente' | 'sincronizado';
  created_at: string;
}

export class EscuteirosDB extends Dexie {
  escuteiros!: Table<EscuteiroLocal, string>;

  constructor() {
    super('escuteiros296');
    this.version(1).stores({
      escuteiros: 'local_id, sync_status, nome_completo, created_at',
    });
  }
}

export const db = new EscuteirosDB();