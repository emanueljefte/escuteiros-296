import { supabase } from './supabase';
import { db, type EscuteiroLocal } from './db-local';

async function uploadBlob(bucket: string, localId: string, blob?: Blob) {
  if (!blob) return null;
  const path = `${localId}.jpg`;
  const { error } = await supabase.storage.from(bucket).upload(path, blob, {
    upsert: true,
  });
  if (error) throw error;
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

async function syncRegisto(registo: EscuteiroLocal) {
  const foto_url = await uploadBlob('fotos', registo.local_id, registo.foto_blob);
  const assinatura_url = await uploadBlob(
    'assinaturas',
    registo.local_id,
    registo.assinatura_blob
  );

  const { foto_blob, assinatura_blob, sync_status, ...dados } = registo;

  const { error } = await supabase
    .from('escuteiros')
    .upsert({ ...dados, foto_url, assinatura_url }, { onConflict: 'local_id' });

  if (error) throw error;

  await db.escuteiros.update(registo.local_id, { sync_status: 'sincronizado' });
}

export async function sincronizarPendentes() {
  const pendentes = await db.escuteiros
    .where('sync_status')
    .equals('pendente')
    .toArray();

  for (const registo of pendentes) {
    try {
      await syncRegisto(registo);
    } catch (err) {
      console.error(`Falha ao sincronizar ${registo.local_id}:`, err);
      // permanece pendente, tenta na próxima
    }
  }
}