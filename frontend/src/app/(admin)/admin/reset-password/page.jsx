import ResetPasswordForm from "@/components/admin/resetPasswordForm";

export const metadata = {
  title: "Yeni parola | Akif Poliklinik Admin",
};

export default async function ResetPasswordPage({ searchParams }) {
  const { token = "" } = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center px-5 py-12">
      <section className="w-full max-w-sm rounded-xl border border-black/8 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
        <p className="text-xs font-medium tracking-[0.16em] text-black/45 uppercase">
          Akif Poliklinik
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">Yeni parola</h1>
        <p className="mt-2 text-sm leading-6 text-black/50">
          Admin hesabınız için yeni ve yalnızca burada kullandığınız bir parola
          belirleyin.
        </p>
        <ResetPasswordForm token={typeof token === "string" ? token : ""} />
      </section>
    </main>
  );
}
