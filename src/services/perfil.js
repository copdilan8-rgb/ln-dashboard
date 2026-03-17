import { supabase } from "@/lib/supabaseClient";

export async function obtenerPerfil(userId) {
  const { data, error } = await supabase
    .from("perfiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    throw new Error("No se pudo cargar el perfil.");
  }

  return data;
}

export async function actualizarPerfil(userId, datos) {
  const { error } = await supabase
    .from("perfiles")
    .update(datos)
    .eq("id", userId);

  if (error) {
    if (error.code === "23505") {
      throw new Error("Ese nombre de usuario ya está en uso.");
    }

    throw new Error("No se pudo actualizar el perfil.");
  }

  return true;
}