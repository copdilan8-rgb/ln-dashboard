"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import PerfilHeader from "@/components/perfil/PerfilHeader";
import AvatarUploader from "@/components/perfil/AvatarUploader";
import PerfilForm from "@/components/perfil/PerfilForm";

import { obtenerUsuarioActual, cerrarSesion } from "@/services/auth";
import { obtenerPerfil, actualizarPerfil } from "@/services/perfil";
import { subirAvatar } from "@/services/storage";

import { comprimirImagen } from "@/lib/image";

export default function PerfilPage() {
  const router = useRouter();

  const [usuario, setUsuario] = useState(null);
  const [perfil, setPerfil] = useState(null);

  const [nombreCompleto, setNombreCompleto] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [subiendoAvatar, setSubiendoAvatar] = useState(false);
  const [cerrandoSesion, setCerrandoSesion] = useState(false);

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError("");
        setMensaje("");

        const user = await obtenerUsuarioActual();

        if (!user) {
          router.push("/login");
          return;
        }

        setUsuario(user);

        const dataPerfil = await obtenerPerfil(user.id);
        setPerfil(dataPerfil);
        setNombreCompleto(dataPerfil?.nombre_completo || "");
        setNombreUsuario(dataPerfil?.nombre_usuario || "");
        setAvatarUrl(dataPerfil?.avatar_url || "");
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [router]);

  const inicialAvatar = useMemo(() => {
    if (usuario?.email) {
      return usuario.email.charAt(0).toUpperCase();
    }
    return "U";
  }, [usuario]);

  const limpiarMensajes = () => {
    if (error) setError("");
    if (mensaje) setMensaje("");
  };

  const validarNombreUsuario = (valor) => {
    return /^[a-zA-Z0-9_.-]+$/.test(valor);
  };

  const handleSubirAvatar = async (e) => {
    try {
      limpiarMensajes();

      const archivoOriginal = e.target.files?.[0];
      if (!archivoOriginal) return;

      if (!usuario?.id) {
        setError("No hay usuario autenticado.");
        return;
      }

      if (!archivoOriginal.type.startsWith("image/")) {
        setError("Solo se permiten imágenes.");
        return;
      }

      setSubiendoAvatar(true);

      const archivoComprimido = await comprimirImagen(archivoOriginal);
      const nuevaAvatarUrl = await subirAvatar(usuario.id, archivoComprimido);

      await actualizarPerfil(usuario.id, {
        avatar_url: nuevaAvatarUrl,
      });

      setAvatarUrl(nuevaAvatarUrl);
      setPerfil((prev) => ({
        ...prev,
        avatar_url: nuevaAvatarUrl,
      }));

    
    } catch (err) {
      setError(err.message || "Ocurrió un error al subir la imagen.");
    } finally {
      setSubiendoAvatar(false);
      e.target.value = "";
    }
  };

  const handleGuardarPerfil = async (e) => {
    e.preventDefault();

    try {
      setGuardando(true);
      limpiarMensajes();

      const nombreCompletoLimpio = nombreCompleto.trim();
      const nombreUsuarioLimpio = nombreUsuario.trim();

      if (!nombreCompletoLimpio) {
        setError("El nombre completo es obligatorio.");
        return;
      }

      if (!nombreUsuarioLimpio) {
        setError("El nombre de usuario es obligatorio.");
        return;
      }

      if (nombreUsuarioLimpio.length < 3) {
        setError("El nombre de usuario debe tener al menos 3 caracteres.");
        return;
      }

      if (!validarNombreUsuario(nombreUsuarioLimpio)) {
        setError(
          "El nombre de usuario solo puede contener letras, números, puntos, guiones y guion bajo."
        );
        return;
      }

      await actualizarPerfil(usuario.id, {
        nombre_completo: nombreCompletoLimpio,
        nombre_usuario: nombreUsuarioLimpio,
      });

      setPerfil((prev) => ({
        ...prev,
        nombre_completo: nombreCompletoLimpio,
        nombre_usuario: nombreUsuarioLimpio,
      }));

      
    } catch (err) {
      setError(err.message || "Ocurrió un error al guardar los cambios.");
    } finally {
      setGuardando(false);
    }
  };

  const handleCerrarSesion = async () => {
    try {
      setCerrandoSesion(true);
      limpiarMensajes();

      await cerrarSesion();
      router.push("/login");
    } catch (err) {
      setError(err.message || "No se pudo cerrar la sesión.");
    } finally {
      setCerrandoSesion(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto w-full max-w-2xl rounded-2xl border p-6 shadow-sm">
        <PerfilHeader
          cerrandoSesion={cerrandoSesion}
          onCerrarSesion={handleCerrarSesion}
        />

        {error && (
          <div className="mb-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {mensaje && (
          <div className="mb-4 rounded-md border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-600">
            {mensaje}
          </div>
        )}

        <AvatarUploader
          avatarUrl={avatarUrl}
          inicialAvatar={inicialAvatar}
          subiendoAvatar={subiendoAvatar}
          onUpload={handleSubirAvatar}
          nombreUsuario={nombreUsuario}
          setNombreUsuario={setNombreUsuario}
          limpiarMensajes={limpiarMensajes}
          email={usuario?.email}
        />

        <PerfilForm
          nombreCompleto={nombreCompleto}
          setNombreCompleto={setNombreCompleto}
          limpiarMensajes={limpiarMensajes}
          rol={perfil?.rol}
          guardando={guardando}
          onSubmit={handleGuardarPerfil}
        />
      </div>
    </div>
  );
}