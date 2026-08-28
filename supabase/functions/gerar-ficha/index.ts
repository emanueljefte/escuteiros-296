import { createClient } from 'npm:@supabase/supabase-js@2';
import PizZip from 'npm:pizzip@3';
import Docxtemplater from 'npm:docxtemplater@3';

Deno.serve(async (req) => {
  const { id } = await req.json();

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const { data: registo, error } = await supabase
    .from('escuteiros')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !registo) {
    return new Response('Registo não encontrado', { status: 404 });
  }

  const templateBuf = await Deno.readFile('./template/ficha_template.docx');
  const zip = new PizZip(templateBuf);
  const doc = new Docxtemplater(zip, {
  paragraphLoop: true,
  linebreaks: true,
  delimiters: { start: '{{', end: '}}' },
});

doc.render({
  numero_inscricao: registo.numero_inscricao,
  ano_2digitos: String(new Date(registo.created_at).getFullYear()).slice(-2),
  nome_completo: registo.nome_completo,
  filho_de: registo.filho_de,
  e_de: registo.e_de,
  bi_numero: registo.bi_numero,
  cedula_numero: registo.cedula_numero,
  morada: registo.morada,
  provincia: registo.provincia,
  municipio: registo.municipio,
  estado_civil: registo.estado_civil,
  telefone: registo.telefone,
  whatsapp: registo.whatsapp,
  contacto_encarregado: registo.contacto_encarregado,
  data_nascimento: registo.data_nascimento,
  habilitacao_literaria: registo.habilitacao_literaria,
  profissao: registo.profissao,
  escola_local_trabalho: registo.escola_local_trabalho,
  outras_habilidades: registo.outras_habilidades,
  data_local_investidura: registo.data_local_investidura,
  bando: registo.bando,
  patrulha: registo.patrulha,
  equipe: registo.equipe,
  cargo: registo.cargo,
  baptizado_nao: registo.baptizado ? '' : 'X',
  baptizado_sim: registo.baptizado ? 'X' : '',
  baptizado_detalhe: registo.baptizado_detalhe,
  doenca_nao: registo.doenca ? '' : 'X',
  doenca_sim: registo.doenca ? 'X' : '',
  doenca_qual: registo.doenca_qual,
  alergia_nao: registo.alergia ? '' : 'X',
  alergia_sim: registo.alergia ? 'X' : '',
  alergia_qual: registo.alergia_qual,
  deficiencia_nao: registo.deficiencia ? '' : 'X',
  deficiencia_sim: registo.deficiencia ? 'X' : '',
  deficiencia_qual: registo.deficiencia_qual,
});

  const outputBuf = doc.getZip().generate({ type: 'uint8array' });

  const resposta = await fetch(Deno.env.get('PDF_SERVICE_URL')!, {
  method: 'POST',
  body: JSON.stringify({
    docxBase64: btoa(String.fromCharCode(...outputBuf)),
    fotoUrl: registo.foto_url,
    assinaturaUrl: registo.assinatura_url,
  }),
});

return new Response(await resposta.arrayBuffer(), {
  headers: {
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="ficha_${registo.nome_completo}.pdf"`,
  },
});
});