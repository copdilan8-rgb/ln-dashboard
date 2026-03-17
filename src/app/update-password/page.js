"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmarPassword) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (password.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmarPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setPassword("");
      setConfirmarPassword("");
      setMostrarModal(true);
    } catch {
      setError("Ocurrió un error inesperado. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="w-full max-w-md rounded-lg border p-6 shadow-sm bg-background">
        <h1 className="text-2xl font-bold text-center mb-2">
          Nueva contraseña
        </h1>

        <p className="text-sm text-center text-muted-foreground mb-6">
          Ingresa tu nueva contraseña para recuperar el acceso a tu cuenta.
        </p>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Nueva contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              className="w-full rounded-md border px-3 py-2 outline-none"
              autoComplete="new-password"
            />
          </div>

          <div>
            <label
              htmlFor="confirmarPassword"
              className="block text-sm font-medium mb-1"
            >
              Confirmar nueva contraseña
            </label>
            <input
              id="confirmarPassword"
              type="password"
              placeholder="Repite tu nueva contraseña"
              value={confirmarPassword}
              onChange={(e) => {
                setConfirmarPassword(e.target.value);
                if (error) setError("");
              }}
              className="w-full rounded-md border px-3 py-2 outline-none"
              autoComplete="new-password"
            />
          </div>

          {error && (
            <p className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md border px-4 py-2 font-medium disabled:opacity-50"
          >
            {loading ? "Actualizando contraseña..." : "Guardar nueva contraseña"}
          </button>
        </form>
      </div>

      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-2xl border bg-background p-6 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 animate-pulse">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>

            <h2 className="text-xl font-bold mb-2">
              Contraseña actualizada
            </h2>

            <p className="text-sm text-muted-foreground mb-6">
              Tu contraseña se actualizó correctamente. Ya puedes iniciar sesión con tus nuevos datos.
            </p>

            <Link
              href="/login"
              className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            >
              Ir a iniciar sesión
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}