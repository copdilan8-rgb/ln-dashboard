import Link from "next/link";

export default function EmailConfirmadoPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-lg text-center transition-all duration-300 hover:shadow-xl">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-green-600"
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

        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Cuenta verificada correctamente
        </h1>

        <p className="text-sm text-muted-foreground leading-6 mb-2">
          Tu correo electrónico fue confirmado con éxito.
        </p>

        <p className="text-sm text-muted-foreground leading-6 mb-8">
          Ahora ya puedes iniciar sesión y acceder a tu cuenta.
        </p>

        <Link
          href="/login"
          className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
        >
          Ir a iniciar sesión
        </Link>

        <p className="mt-5 text-xs text-muted-foreground">
          Ya puedes continuar con el acceso a la plataforma.
        </p>
      </div>
    </div>
  );
}