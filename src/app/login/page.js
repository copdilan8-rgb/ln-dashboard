"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const validarCorreo = (correo) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    const emailLimpio = email.trim();

    if (!emailLimpio || !password) {
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

    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email: emailLimpio,
        password,
      });

      if (error) {
        setError("Correo o contraseña incorrectos.");
        return;
      }

      setMensaje("Inicio de sesión exitoso.");

      // Redirigir al perfil después de login
      router.push("/perfil");

    } catch {
      setError("Ocurrió un error inesperado. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError("");
    if (mensaje) setMensaje("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError("");
    if (mensaje) setMensaje("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-center mb-2">Iniciar sesión</h1>
        <p className="text-sm text-center text-muted-foreground mb-6">
          Ingresa tus credenciales para acceder a tu cuenta
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={handleEmailChange}
              className="w-full rounded-md border px-3 py-2 outline-none"
              autoComplete="email"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium">
                Contraseña
              </label>

              <Link
                href="/reset-password"
                className="text-sm underline underline-offset-4"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <input
              id="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={handlePasswordChange}
              className="w-full rounded-md border px-3 py-2 outline-none"
              autoComplete="current-password"
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
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          ¿No tienes una cuenta?{" "}
          <Link href="/register" className="underline underline-offset-4">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}