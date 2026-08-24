import ForgotPasswordForm from "@/components/admin/forgotPasswordForm";

export const metadata = {
  title: "Parolamı unuttum | Akif Poliklinik Admin",
};

export default function ForgotPasswordPage() {
  return (
    <main className="grid min-h-screen place-items-center px-5 py-12">
      <section className="w-full max-w-sm rounded-xl border border-black/8 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
        <p className="text-xs font-medium tracking-[0.16em] text-black/45 uppercase">
          Akif Poliklinik
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          Parolanızı sıfırlayın
        </h1>
        <p className="mt-2 text-sm leading-6 text-black/50">
          Yönetici e-postanızı girin. Hesap aktifse tek kullanımlık bağlantıyı
          e-postayla göndereceğiz.
        </p>
        <ForgotPasswordForm />
      </section>
    </main>
  );
}
