import { z } from 'zod';

export const escuteiroSchema = z.object({
  nome_completo: z.string().min(3, 'Nome obrigatório'),
  filho_de: z.string().optional(),
  e_de: z.string().optional(),
  bi_numero: z.string().optional(),
  cedula_numero: z.string().optional(),
  morada: z.string().optional(),
  provincia: z.string().optional(),
  municipio: z.string().optional(),
  estado_civil: z.string().optional(),
  telefone: z.string().min(9, 'Telefone inválido'),
  whatsapp: z.string().optional(),
  contacto_encarregado: z.string().optional(),
  data_nascimento: z.string().optional(),

  habilitacao_literaria: z.string().optional(),
  profissao: z.string().optional(),
  escola_local_trabalho: z.string().optional(),
  outras_habilidades: z.string().optional(),

  data_local_investidura: z.string().optional(),
  seccao: z.string().optional(),
  bando: z.string().optional(),
  patrulha: z.string().optional(),
  equipe: z.string().optional(),
  cargo: z.string().optional(),
  baptizado: z.boolean().default(false),
  baptizado_detalhe: z.string().optional(),
  doenca: z.boolean().default(false),
  doenca_qual: z.string().optional(),
  alergia: z.boolean().default(false),
  alergia_qual: z.string().optional(),
  deficiencia: z.boolean().default(false),
  deficiencia_qual: z.string().optional(),

  termo_aceite: z.boolean().refine((v) => v === true, 'Precisa de aceitar o termo'),
});

export type EscuteiroForm = z.infer<typeof escuteiroSchema>;
export type EscuteiroFormInput = z.input<typeof escuteiroSchema>;