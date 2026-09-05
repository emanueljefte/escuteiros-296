import { createClient } from 'npm:@supabase/supabase-js@2';
import PizZip from 'npm:pizzip@3';
import Docxtemplater from 'npm:docxtemplater@3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function uint8ToBase64(bytes: Uint8Array): string {
  const CHUNK_SIZE = 8192;
  let resultado = '';
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    const chunk = bytes.subarray(i, i + CHUNK_SIZE);
    resultado += String.fromCharCode(...chunk);
  }
  return btoa(resultado);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { id, overrides, apenasPreview } = await req.json();

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
      return new Response('Registo não encontrado', { status: 404, headers: corsHeaders });
    }

    const dados = { ...registo, ...(overrides ?? {}) };

    const { data: templateBlob, error: erroTemplate } = await supabase.storage
      .from('templates')
      .download('ficha_template.docx');

    if (erroTemplate || !templateBlob) {
      throw new Error(`Não foi possível obter o template: ${erroTemplate?.message}`);
    }

    const templateBuf = new Uint8Array(await templateBlob.arrayBuffer());
    const zip = new PizZip(templateBuf);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      delimiters: { start: '{{', end: '}}' },
    });

    doc.render({
      numero_inscricao: dados.numero_inscricao,
      nome_completo: dados.nome_completo,
      filho_de: dados.filho_de,
      e_de: dados.e_de,
      tipo_documento: dados.tipo_documento,
      numero_documento: dados.numero_documento,
      provincia: dados.provincia,
      data_nascimento: dados.data_nascimento,
      estado_civil: dados.estado_civil,
      sexo: dados.sexo,
      morada: dados.morada,
      contacto_pessoal: dados.contacto_pessoal,
      whatsapp_pessoal: dados.whatsapp_pessoal,
      nome_encarregado_1: dados.nome_encarregado_1,
      parentesco_1: dados.parentesco_1,
      contacto_encarregado_1: dados.contacto_encarregado_1,
      whatsapp_encarregado_1: dados.whatsapp_encarregado_1,
      nome_encarregado_2: dados.nome_encarregado_2,
      parentesco_2: dados.parentesco_2,
      contacto_encarregado_2: dados.contacto_encarregado_2,
      whatsapp_encarregado_2: dados.whatsapp_encarregado_2,
      habilitacao_literaria: dados.habilitacao_literaria,
      nome_instituicao: dados.nome_instituicao,
      local_escola: dados.local_escola,
      profissao: dados.profissao,
      local_trabalho: dados.local_trabalho,
      outras_ocupacao: dados.outras_ocupacao,
      seccao: dados.seccao,
      categoria: dados.categoria,
      patrulha_bando_equipe: dados.patrulha_bando_equipe,
      cargo_funcao: dados.cargo_funcao,
      data_promessa: dados.data_promessa,
      situacao: dados.situacao,
      igreja: dados.igreja,
      baptizado: dados.baptizado ? 'Sim' : 'Não',
      pertence_outro_grupo: dados.pertence_outro_grupo ? 'Sim' : 'Não',
      pertence_outro_grupo_qual: dados.pertence_outro_grupo_qual,
      sofre_doenca: dados.sofre_doenca ? 'Sim' : 'Não',
      sofre_doenca_qual: dados.sofre_doenca_qual,
      obs: dados.obs,
    });

    const outputBuf = doc.getZip().generate({ type: 'uint8array' });
    const resposta = await fetch(Deno.env.get('PDF_SERVICE_URL')!, {
      method: 'POST',
      body: JSON.stringify({
        docxBase64: uint8ToBase64(outputBuf),
        fotoUrl: dados.foto_url,
        assinaturaUrl: dados.assinatura_url,
      }),
    });

    if (!resposta.ok) {
      const texto = await resposta.text();
      throw new Error(`pdf-service devolveu ${resposta.status}: ${texto}`);
    }

    const pdfBuf = await resposta.arrayBuffer();

    if (!apenasPreview) {
      await supabase.from('escuteiros').update({
        pdf_gerado: true,
        pdf_gerado_em: new Date().toISOString(),
      }).eq('id', id);
    }

    return new Response(pdfBuf, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="ficha_${dados.nome_completo}.pdf"`,
      },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ erro: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});