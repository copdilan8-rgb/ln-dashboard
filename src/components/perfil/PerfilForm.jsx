export default function PerfilForm({
  nombreCompleto,
  setNombreCompleto,
  limpiarMensajes,
  rol,
  guardando,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium">
          Nombre completo
        </label>
        <input
          type="text"
          value={nombreCompleto}
          onChange={(e) => {
            setNombreCompleto(e.target.value);
            limpiarMensajes();
          }}
          placeholder="Ingresa tu nombre completo"
          className="w-full rounded-md border px-3 py-2 outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Rol</label>
        <input
          type="text"
          value={rol || "usuario"}
          disabled
          className="w-full rounded-md border px-3 py-2 bg-muted/50"
        />
      </div>

      <button
        type="submit"
        disabled={guardando}
        className="w-full rounded-md border px-4 py-2 font-medium disabled:opacity-50"
      >
        {guardando ? "Guardando cambios..." : "Guardar cambios"}
      </button>
    </form>
  );
}