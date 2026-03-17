"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const validarCorreo = (correo) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    const emailLimpio = email.trim();

    if (!emailLimpio) {
      setError("Ingresa tu correo electrónico.");
      return;
    }

    if (!validarCorreo(emailLimpio)) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.resetPasswordForEmail(emailLimpio, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setMensaje(
        "Te enviamos un enlace para restablecer tu contraseña. Revisa tu correo."
      );
      setEmail("");
    } catch {
      setError("Ocurrió un error inesperado. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-center mb-2">
          Recuperar contraseña
        </h1>

        <p className="text-sm text-center text-muted-foreground mb-6">
          Ingresa tu correo y te enviaremos un enlace para cambiar tu contraseña.
        </p>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
                if (mensaje) setMensaje("");
              }}
              className="w-full rounded-md border px-3 py-2 outline-none"
              autoComplete="email"
            />
          </div>

          {error && (
            <p className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          {mensaje && (
            <p className="rounded-md border border-green-300 bg-green-50 px-3 py-2 text-sm text-green-600">
              {mensaje}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md border px-4 py-2 font-medium disabled:opacity-50"
          >
            {loading ? "Enviando enlace..." : "Enviar enlace de recuperación"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          <Link href="/login" className="underline underline-offset-4">
            Volver a iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}