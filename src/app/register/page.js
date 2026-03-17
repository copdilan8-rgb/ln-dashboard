"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function RegisterPage() {
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const validarCorreo = (correo) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
  };

  const limpiarMensajes = () => {
    if (error) setError("");
    if (mensaje) setMensaje("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    const nombreLimpio = nombreCompleto.trim();
    const emailLimpio = email.trim();

    if (!nombreLimpio || !emailLimpio || !password || !confirmarPassword) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (!validarCorreo(emailLimpio)) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmarPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email: emailLimpio,
        password,
        options: {
          data: {
            nombre_completo: nombreLimpio,
          },
          emailRedirectTo: "https://ln-dashboard-six.vercel.app/email-confirmado",
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (!data?.user) {
        setError("No se pudo completar el registro.");
        return;
      }

      setMensaje(
        "Cuenta creada correctamente. Revisa tu correo para confirmar tu registro."
      );

      setNombreCompleto("");
      setEmail("");
      setPassword("");
      setConfirmarPassword("");
    } catch {
      setError("Ocurrió un error inesperado. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-center mb-2">Crear cuenta</h1>
        <p className="text-sm text-center text-muted-foreground mb-6">
          Regístrate para acceder a la plataforma
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label
              htmlFor="nombreCompleto"
              className="block text-sm font-medium mb-1"
            >
              Nombre completo
            </label>
            <input
              id="nombreCompleto"
              type="text"
              placeholder="Tu nombre completo"
              value={nombreCompleto}
              onChange={(e) => {
                setNombreCompleto(e.target.value);
                limpiarMensajes();
              }}
              className="w-full rounded-md border px-3 py-2 outline-none"
              autoComplete="name"
            />
          </div>

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
                limpiarMensajes();
              }}
              className="w-full rounded-md border px-3 py-2 outline-none"
              autoComplete="email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                limpiarMensajes();
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
              Confirmar contraseña
            </label>
            <input
              id="confirmarPassword"
              type="password"
              placeholder="Repite tu contraseña"
              value={confirmarPassword}
              onChange={(e) => {
                setConfirmarPassword(e.target.value);
                limpiarMensajes();
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
            {loading ? "Creando cuenta..." : "Registrarse"}
          </button>

          <p className="text-xs text-center text-muted-foreground">
            Después de registrarte, deberás confirmar tu correo electrónico.
          </p>
        </form>

        <p className="mt-6 text-center text-sm">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="underline underline-offset-4">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}