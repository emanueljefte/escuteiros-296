import { z } from 'zod';

// Helper para tratar enums opcionais que podem vir como string vazia ('') do formulário
function enumOpcional<T extends [string, ...string[]]>(valores: T) {
  return z
    .union([z.enum(valores), z.literal('')])
    .optional()
    .transform((val) => (val === '' ? undefined : val));
}

// 1. RegExs e Validadores Reutilizáveis
const regexNome = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
const regexTelefoneAngola = /^9\d{8}$/;
const regexBI = /^\d{9}[A-Za-z]{2}\d{3}$/;

// Validação de Nome Obrigatório (mínimo 3 letras, sem números/símbolos)
const nomeObrigatorio = z
  .string()
  .trim()
  .min(3, 'Nome obrigatório (mínimo 3 letras)')
  .regex(regexNome, 'O nome não deve conter números ou carateres especiais');

// Validação de Nome Opcional
const nomeOpcional = z
  .string()
  .trim()
  .regex(regexNome, 'O nome não deve conter números ou carateres especiais')
  .or(z.literal(''))
  .optional()
  .transform((val) => (val === '' ? undefined : val));

// Validação de Telefone Obrigatório (começa por 9 e tem 9 dígitos)
const telefoneObrigatorio = z
  .string()
  .trim()
  .min(1, 'Contacto é obrigatório')
  .regex(regexTelefoneAngola, 'Número inválido (deve começar por 9 e ter 9 dígitos)');

// Validação de Telefone Opcional
const telefoneOpcional = z
  .string()
  .trim()
  .regex(regexTelefoneAngola, 'Número inválido (deve começar por 9 e ter 9 dígitos)')
  .or(z.literal(''))
  .optional()
  .transform((val) => (val === '' ? undefined : val));

  const REGEX_APENAS_TEXTO = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;

  const toTitleCase = (val: string) =>
  val
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

// 2. Schema Principal
export const escuteiroSchema = z
  .object({
    // IDENTIFICAÇÃO PESSOAL
    nome_completo: nomeObrigatorio,
    filho_de: nomeOpcional,
    e_de: nomeOpcional,
    tipo_documento: enumOpcional(['Bilhete de Identidade n°', 'Cédula n°']),
    numero_documento: z
      .string()
      .trim()
      .regex(regexBI, 'Formato de BI inválido (ex: 000000000LA000)')
      .or(z.literal(''))
      .optional()
      .transform((val) => (val === '' ? undefined : val)),
    provincia: enumOpcional([
      'Luanda',
      'Kwanza Sul',
      'Bengo',
      'Malanje',
      'Cunene',
      'Moxico',
      'Uíge',
      'Zaire',
      'Namibe',
      'Kuando Kubango',
      'Cabinda',
      'Huambo',
      'Huíla',
      'Bié',
      'Lunda Norte',
      'Lunda Sul',
      'Cuanza Norte',
    ]),
    data_nascimento: z
    .string({ required_error: 'A data de nascimento é obrigatória.' })
    .min(1, 'A data de nascimento é obrigatória.')
    .refine(
      (dataStr) => {
        const data = new Date(dataStr);
        if (isNaN(data.getTime())) return false;
        
        // Garante que a data não está no futuro
        const hoje = new Date();
        hoje.setHours(23, 59, 59, 999); // fim do dia atual
        return data <= hoje;
      },
      { message: 'A data de nascimento não pode estar no futuro.' }
    )
    .refine(
      (dataStr) => {
        const data = new Date(dataStr);
        // Exemplo: Validação para evitar datas irrealistas (ex: antes de 1900)
        return data.getFullYear() >= 1900;
      },
      { message: 'Por favor, insira uma data válida.' }
    ),
    estado_civil: enumOpcional(['Solteiro', 'Casado']),
    sexo: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.enum(['MASCULINO', 'FEMININO'], {
      required_error: 'Por favor, selecione o sexo.',
      invalid_type_error: 'Por favor, selecione o sexo.',
    })
  ),
    morada: z.string().optional(),

    // CONTACTOS E ENCARREGADOS
    nome_encarregado_1: nomeObrigatorio,
    contacto_encarregado_1: telefoneObrigatorio,
    whatsapp_encarregado_1: telefoneOpcional,
    parentesco_1: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.enum(['Pai', 'Mãe', 'Tio', 'Avó', 'Tia', 'Avô', 'Outro'], {
      required_error: 'Por favor, selecione o parentesco.',
      invalid_type_error: 'Por favor, selecione o parentesco.',
    })
  ),

    contacto_pessoal: telefoneOpcional,
    whatsapp_pessoal: telefoneOpcional,

    nome_encarregado_2: nomeOpcional,
    contacto_encarregado_2: telefoneOpcional,
    whatsapp_encarregado_2: telefoneOpcional,
    parentesco_2: enumOpcional(['Pai', 'Mãe', 'Tio', 'Avó', 'Tia', 'Avô', 'Outro']),

    // HABILITAÇÕES E OCUPAÇÃO
    habilitacao_literaria: enumOpcional([
      'Ensino Primário 1ª à 6ª classe',
      'I Ciclo do Ensino Secundário 7ª à 9ª classe',
      'II Ciclo do Ensino Secundário 10ª à 12ª classe',
      'Licenciatura',
      'Mestrado',
      'Doutoramento',
    ]),
    nome_instituicao: z.string().optional(),
    local_escola: z.string().optional(),
    profissao: z.string().optional(),
    local_trabalho: z.string().optional(),
    outras_ocupacao: z.string().optional(),

    // DADOS DE ESCUTISMO
    seccao: enumOpcional([
      'Iª Secção',
      'IIª Secção',
      'IIIª Secção',
      'IVª Secção',
      'Dirigente',
    ]),
    categoria: enumOpcional(['Aspirante', 'Noviço', 'Investido', 'Candidato']),
    patrulha_bando_equipe: z
      .string()
      .transform(toTitleCase)
      .refine(
        (val) => val === '' || REGEX_APENAS_TEXTO.test(val),
        { message: 'O nome não pode conter números.' }
      )
      .optional(),
    cargo_funcao: enumOpcional([
      'Guia',
      'Sub Guia',
      'Secretário',
      'Financeiro',
      'Guarda Material',
      'Cozinheiro',
      'Socorrista',
      'Animador',
    ]),
    data_promessa: z
      .string()
      // .min(1, 'A data da promessa é obrigatória.')
      .refine((dataStr) => {
        if (!dataStr) return false;
        const dataPromessa = new Date(`${dataStr}T00:00:00`);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0); // Zera hora/minuto/segundo para comparação exata

        return dataPromessa < hoje;
      }, {
        message: 'A data da promessa deve ser anterior ao dia de hoje.',
      })
      .refine(
      (dataStr) => {
        const data = new Date(dataStr);
        // Exemplo: Validação para evitar datas irrealistas (ex: antes de 1900)
        return data.getFullYear() >= 2000;
      },
      { message: 'Por favor, insira uma data válida.' }
    ).optional(),
    situacao: enumOpcional(['Activo', 'Inactivo', 'Transferido', 'Desligado']),

   
    // Igreja / Paróquia
    igreja: z
      .string()
      .transform(toTitleCase)
      .refine(
        (val) => val === '' || REGEX_APENAS_TEXTO.test(val),
        { message: 'O nome da igreja não pode conter números.' }
      )
      .optional(),
    baptizado: z.boolean().default(false),
    pertence_outro_grupo: z.boolean().default(false),
    pertence_outro_grupo_qual: z.string().transform(toTitleCase).optional(),
    sofre_doenca: z.boolean().default(false),
    sofre_doenca_qual: z.string().transform(toTitleCase).optional(),
    obs: z.string().optional(),

    // TERMOS E CONDIÇÕES
    termo_aceite: z
      .boolean()
      .refine((v) => v === true, 'Precisa de aceitar o termo de responsabilidade'),
  })
  .superRefine((data, ctx) => {
    if (!data.numero_documento && data.tipo_documento) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Selecione o número do documento.',
        path: ['numero_documento'],
      });
    }
    if (data.numero_documento && !data.tipo_documento) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Selecione o tipo de documento.',
        path: ['tipo_documento'],
      });
    }
    if (!data.nome_encarregado_2?.trim() && data.parentesco_2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Insira o nome do 2º Encarregado.',
        path: ['nome_encarregado_2'],
      });
    }
    if (data.nome_encarregado_2?.trim() && !data.parentesco_2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Selecione o grau de parentesco.',
        path: ['parentesco_2'],
      });
    }
    if (data.sofre_doenca && !data.sofre_doenca_qual?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Especifica a doença ou condição de saúde',
        path: ['sofre_doenca_qual'],
      });
    }

    if (data.pertence_outro_grupo && !data.pertence_outro_grupo_qual?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Especifica o outro grupo a que pertence',
        path: ['pertence_outro_grupo_qual'],
      });
    }
  });

export type EscuteiroForm = z.infer<typeof escuteiroSchema>;
export type EscuteiroFormInput = z.input<typeof escuteiroSchema>;