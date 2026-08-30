create table escuteiros (
  id uuid primary key default gen_random_uuid(),
  local_id text unique,             
  numero_inscricao text,
  nome_completo text not null,
  filho_de text,
  e_de text,
  bi_numero text,
  cedula_numero text,
  morada text,
  provincia text,
  municipio text,
  estado_civil text,
  telefone text,
  whatsapp text,
  contacto_encarregado text,
  data_nascimento date,
  habilitacao_literaria text,
  profissao text,
  escola_local_trabalho text,
  outras_habilidades text,
  data_local_investidura text,
  seccao text,
  bando text,
  patrulha text,
  equipe text,
  cargo text,
  baptizado boolean,
  baptizado_detalhe text,
  doenca boolean,
  doenca_qual text,
  alergia boolean,
  alergia_qual text,
  deficiencia boolean,
  deficiencia_qual text,
  termo_aceite boolean default false,
  foto_url text,
  assinatura_url text,
  created_at timestamptz default now()
);

-- RLS
alter table escuteiros enable row level security;

create policy "insercao publica"
  on escuteiros for insert
  with check (true);

create policy "update apenas autenticado"
  on escuteiros for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

insert into storage.buckets (id, name, public) values ('fotos', 'fotos', true);
insert into storage.buckets (id, name, public) values ('assinaturas', 'assinaturas', true);
insert into storage.buckets (id, name, public) values ('templates', 'templates', false);

create policy "upload publico fotos"
  on storage.objects for insert
  with check (bucket_id = 'fotos');

create policy "upload publico assinaturas"
  on storage.objects for insert
  with check (bucket_id = 'assinaturas');

alter table escuteiros add column pdf_gerado boolean default false;
alter table escuteiros add column pdf_gerado_em timestamptz;

alter table escuteiros
  add column tipo_documento text,
  add column numero_documento text,
  add column sexo text,
  add column nome_instituicao text,
  add column local_escola text,
  add column local_trabalho text,
  add column categoria text,
  add column situacao text,
  add column igreja text,
  add column pertence_outro_grupo boolean,
  add column pertence_outro_grupo_qual text,
  add column obs text;
  add column nome_encarregado_1 text;
  add column nome_encarregado_2 text;
  add column contacto_encarregado_1 text;
  add column contacto_encarregado_2 text;
  add column parentesco_1 text;
  add column parentesco_2 text;


alter table escuteiros rename column doenca to sofre_doenca;
alter table escuteiros rename column doenca_qual to sofre_doenca_qual;
alter table escuteiros rename column contacto_pessoal to contacto_pessoal; 