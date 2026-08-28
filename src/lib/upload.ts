import { supabase } from './supabase';

export async function enviarFicheiro(bucket: string, id: string, blob?: Blob) {
  if (!blob) return null;
  const path = `${id}.jpg`;
  const { error } = await supabase.storage.from(bucket).upload(path, blob, { upsert: true });
  if (error) throw error;
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}