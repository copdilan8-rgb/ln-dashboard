export default function PerfilHeader({
  cerrandoSesion,
  onCerrarSesion,
}) {
  return (
    <div className="mb-8 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold mb-2">Mi perfil</h1>
        <p className="text-sm text-muted-foreground">
          Aquí puedes ver y actualizar tu información personal.
        </p>
      </div>

      <button
        type="button"
        onClick={onCerrarSesion}
        disabled={cerrandoSesion}
        className="rounded-md border px-4 py-2 text-sm font-medium disabled:opacity-50"
      >
        {cerrandoSesion ? "Cerrando..." : "Cerrar sesión"}
      </button>
    </div>
  );
}