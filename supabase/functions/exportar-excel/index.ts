import { createClient } from 'npm:@supabase/supabase-js@2';
import ExcelJS from 'npm:exceljs@4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const COLUNAS = [
  'nome_completo','filho_de','e_de','tipo_documento','numero_documento','provincia',
  'data_nascimento','estado_civil','sexo','morada','contacto_pessoal','whatsapp_pessoal',
  'nome_encarregado_1','parentesco_1','contacto_encarregado_1','whatsapp_encarregado_1',
  'nome_encarregado_2','parentesco_2','contacto_encarregado_2','whatsapp_encarregado_2',
  'habilitacao_literaria','nome_instituicao','local_escola','profissao','local_trabalho','outras_ocupacao',
  'seccao','categoria','patrulha_bando_equipe','cargo_funcao','data_promessa','situacao',
  'igreja','baptizado','pertence_outro_grupo','pertence_outro_grupo_qual','sofre_doenca','sofre_doenca_qual','obs',
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: registos, error } = await supabase
      .from('escuteiros')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) throw error;

    const { data: templateBlob, error: erroTemplate } = await supabase.storage
      .from('templates')
      .download('dashboard_template.xlsx');
    if (erroTemplate || !templateBlob) throw new Error('Template não encontrado no Storage');

    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(await templateBlob.arrayBuffer());
    const ws = wb.getWorksheet('Dados')!;

    // limpar linhas de exemplo/antigas (mantém só o cabeçalho na linha 1)
    ws.spliceRows(2, ws.rowCount - 1);

    registos.forEach((r, i) => {
      const row = ws.getRow(i + 2);
      COLUNAS.forEach((col, j) => {
        let val = r[col];
        if (typeof val === 'boolean') val = val ? 'Sim' : 'Não';
        row.getCell(j + 1).value = val ?? '';
      });
      row.commit();
    });

    const buffer = await wb.xlsx.writeBuffer();

    return new Response(buffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="Cadastramento_Agrupamento_296.xlsx"',
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