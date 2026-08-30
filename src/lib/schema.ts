import z from "zod";

export const escuteiroSchema = z.object({
  nome_completo: z.string().min(3, 'Nome obrigatório'),
  filho_de: z.string().optional(),
  e_de: z.string().optional(),
  tipo_documento: z.enum(['Bilhete de Identidade n°', 'Cédula n°']).optional(),
  numero_documento: z.string().optional(),
  provincia: z.enum(['Luanda', 'Kwnza Sul', 'Bengo', 'Malanje', 'Cunene', 'Moxico', 'UIge', 'Zaire', 'Namibe', 'Kuando Kubango']).optional(),
  data_nascimento: z.string().min(1, 'Data de nascimento obrigatória'),
  nome_encarregado_1: z.string().min(3, 'Nome do encarregado obrigatório'),
  contacto_encarregado_1: z.string().min(9, 'Contacto do encarregado inválido'),
  estado_civil: z.enum(['Solteiro', 'Casado']).optional(),
  sexo: z.enum(['Masculino', 'Feminino']).optional(),
  morada: z.string().optional(),
  contacto_pessoal: z.string().min(9, 'Contacto inválido'),
  whatsapp_pessoal: z.string().optional(),
  nome_encarregado_2: z.string().optional(),
  parentesco_1: z.enum(['Pai', 'Mãe', 'Tio', 'Avó', 'Tia', 'Avô']).optional(),
  parentesco_2: z.enum(['Pai', 'Mãe', 'Tio', 'Avó', 'Tia', 'Avô']).optional(),
  contacto_encarregado_2: z.string().optional(),
  whatsapp_encarregado_1: z.string().optional(),
  whatsapp_encarregado_2: z.string().optional(),

  habilitacao_literaria: z.enum(['Ensino Primário 1ª à 6ª classe', 'I Ciclo do Ensino Secundário 7ª à 9ª classe', 'II Ciclo do Ensino Secundário 10ª à 12ª classe', 'Licenciatura', 'Mestrado', 'Doutoramento']).optional(),
  nome_instituicao: z.string().optional(),
  local_escola: z.string().optional(),
  profissao: z.string().optional(),
  local_trabalho: z.string().optional(),
  outras_ocupacao: z.string().optional(),

  seccao: z.enum(['Iª Secção  ', 'IIª Secção  ', 'IIIª Secção  ', 'IVª Secção  ', 'Dirigente']).optional(),
  categoria: z.enum(['Aspirante', 'Noviço', 'Investido', 'Candidato']).optional(),
  patrulha_bando_equipe: z.string().optional(),
  cargo_funcao: z.enum(['Guia ', 'Sub Guia', 'Secretário', 'Financeiro', 'Guarda Material', 'Cozinheiro', 'Socorrista', 'Animador']).optional(),
  data_promessa: z.string().optional(),
  situacao: z.enum(['Activo', 'Inactivo', 'Transferido', 'Desligado']).optional(),

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