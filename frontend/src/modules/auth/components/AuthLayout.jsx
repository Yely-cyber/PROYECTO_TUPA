export const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#f6f1ec] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#8f0810] text-white shadow-[0_8px_30px_rgba(127,0,0,0.25)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-red-100/80">UNSAAC</p>
            <h1 className="text-lg font-semibold leading-none sm:text-xl">TUPA Digital</h1>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <span className="text-sm text-red-100/80">Portal UNSAAC</span>
            <a
              href="/admin/login"
              className="rounded-md bg-[#d7a320] px-4 py-2 text-sm font-semibold text-[#4a2d00] transition hover:bg-[#e2b73b]"
            >
              Administrar
            </a>
          </div>
        </div>
      </header>

      <main className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(143,8,16,0.08),_transparent_38%),radial-gradient(circle_at_top_right,_rgba(215,163,32,0.08),_transparent_34%),linear-gradient(180deg,_#f7f1eb_0%,_#f5f4f2_100%)]" />
        <div className="absolute left-[-10%] top-20 h-72 w-72 rounded-full bg-[#8f0810]/5 blur-3xl" />
        <div className="absolute bottom-10 right-[-8%] h-96 w-96 rounded-full bg-[#d7a320]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
};