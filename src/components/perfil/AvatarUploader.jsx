import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AvatarUploader({
  avatarUrl,
  inicialAvatar,
  subiendoAvatar,
  onUpload,
  nombreUsuario,
  setNombreUsuario,
  limpiarMensajes,
  email,
}) {
  return (
    <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center">
      {/* Avatar */}
      <div className="flex flex-col items-center">
        <label
          htmlFor="avatar-upload"
          className="group relative cursor-pointer"
        >
          <Avatar className="h-28 w-28 border shadow-sm">
            <AvatarImage
              src={avatarUrl || undefined}
              alt="Avatar del usuario"
              className="h-full w-full object-cover"
            />
            <AvatarFallback className="text-3xl font-bold">
              {inicialAvatar}
            </AvatarFallback>
          </Avatar>

          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            {subiendoAvatar ? "Subiendo..." : "Cambiar foto"}
          </div>
        </label>

        <input
          id="avatar-upload"
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onChange={onUpload}
          disabled={subiendoAvatar}
          className="hidden"
        />
      </div>

      {/* Datos usuario */}
      <div className="flex-1 space-y-4">
        {/* Username */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Nombre de usuario
          </label>

          <input
            type="text"
            value={nombreUsuario}
            onChange={(e) => {
              setNombreUsuario(e.target.value);
              limpiarMensajes();
            }}
            placeholder="Ingresa tu nombre de usuario"
            className="w-full rounded-md border px-3 py-2 outline-none"
          />

          <p className="mt-1 text-xs text-muted-foreground">
            Usa solo letras, números, puntos, guiones y guion bajo.
          </p>
        </div>

        {/* Email */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Correo electrónico
          </label>

          <input
            type="email"
            value={email || ""}
            disabled
            className="w-full rounded-md border px-3 py-2 bg-muted/50"
          />
        </div>
      </div>
    </div>
  );
}
