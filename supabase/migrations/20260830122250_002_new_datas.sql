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