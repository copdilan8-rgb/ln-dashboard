import { supabase } from "@/lib/supabaseClient";

export async function obtenerUsuarioActual() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error("No se pudo obtener el usuario.");
  }

  return user;
}

export async function cerrarSesion() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error("No se pudo cerrar la sesión.");
  }

  return true;
}