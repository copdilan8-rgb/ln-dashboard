import { supabase } from "@/lib/supabaseClient";

export async function subirAvatar(userId, archivo) {
  const rutaArchivo = `${userId}/avatar.jpg`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(rutaArchivo, archivo, {
      upsert: true,
      contentType: "image/jpeg",
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage
    .from("avatars")
    .getPublicUrl(rutaArchivo);

  const avatarUrl = `${data.publicUrl}?t=${Date.now()}`;

  return avatarUrl;
}