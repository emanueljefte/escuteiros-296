import { z } from 'zod';

function enumOpcional<T extends [string, ...string[]]>(valores: T) {
  return z
    .union([z.enum(valores), z.literal('')])
    .optional()
    .transform((val) => (val === '' ? undefined : val));
}

export const escuteiroSchema = z.object({
  nome_completo: z.string().min(3, 'Nome obrigatório'),
  filho_de: z.string().optional(),
  e_de: z.string().optional(),
  tipo_documento: enumOpcional(['Bilhete de Identidade n°', 'Cédula n°']),
  numero_documento: z.string().optional(),
  provincia: enumOpcional(['Luanda', 'Kwnza Sul', 'Bengo', 'Malanje', 'Cunene', 'Moxico', 'UIge', 'Zaire', 'Namibe', 'Kuando Kubango']),
  data_nascimento: z.string().min(1, 'Data de nascimento obrigatória'),
  nome_encarregado_1: z.string().min(3, 'Nome do encarregado obrigatório'),
  contacto_encarregado_1: z.string().min(9, 'Contacto do encarregado inválido'),
  estado_civil: enumOpcional(['Solteiro', 'Casado']),
  sexo: enumOpcional(['Masculino', 'Feminino']),
  morada: z.string().optional(),
  contacto_pessoal: z.string().max(9, 'Máximo 9 dígitos').optional(),
  nome_encarregado_2: z.string().optional(),
  parentesco_1: enumOpcional(['Pai', 'Mãe', 'Tio', 'Avó', 'Tia', 'Avô']),
  parentesco_2: enumOpcional(['Pai', 'Mãe', 'Tio', 'Avó', 'Tia', 'Avô']),
  whatsapp_pessoal: z.string().max(9, 'Máximo 9 dígitos').optional(),
  whatsapp_encarregado_1: z.string().max(9, 'Máximo 9 dígitos').optional(),
  contacto_encarregado_2: z.string().max(9, 'Máximo 9 dígitos').optional(),
  whatsapp_encarregado_2: z.string().max(9, 'Máximo 9 dígitos').optional(),

  habilitacao_literaria: enumOpcional(['Ensino Primário 1ª à 6ª classe', 'I Ciclo do Ensino Secundário 7ª à 9ª classe', 'II Ciclo do Ensino Secundário 10ª à 12ª classe', 'Licenciatura', 'Mestrado', 'Doutoramento']),
  nome_instituicao: z.string().optional(),
  local_escola: z.string().optional(),
  profissao: z.string().optional(),
  local_trabalho: z.string().optional(),
  outras_ocupacao: z.string().optional(),

  seccao: enumOpcional(['Iª Secção  ', 'IIª Secção  ', 'IIIª Secção  ', 'IVª Secção  ', 'Dirigente']),
  categoria: enumOpcional(['Aspirante', 'Noviço', 'Investido', 'Candidato']),
  patrulha_bando_equipe: z.string().optional(),
  cargo_funcao: enumOpcional(['Guia ', 'Sub Guia', 'Secretário', 'Financeiro', 'Guarda Material', 'Cozinheiro', 'Socorrista', 'Animador']),
  data_promessa: z.string().optional(),
  situacao: enumOpcional(['Activo', 'Inactivo', 'Transferido', 'Desligado']),

  igreja: z.string().optional(),
  baptizado: z.boolean().default(false),
  pertence_outro_grupo: z.boolean().default(false),
  pertence_outro_grupo_qual: z.string().optional(),
  sofre_doenca: z.boolean().default(false),
  sofre_doenca_qual: z.string().optional(),
  obs: z.string().optional(),

  termo_aceite: z.boolean().refine((v) => v === true, 'Precisa de aceitar o termo'),
});

export type EscuteiroForm = z.infer<typeof escuteiroSchema>;
export type EscuteiroFormInput = z.input<typeof escuteiroSchema>;