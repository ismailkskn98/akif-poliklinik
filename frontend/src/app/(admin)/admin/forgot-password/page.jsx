import AuthPage from "@/components/admin/authPage";
import ForgotPasswordForm from "@/components/admin/forgotPasswordForm";

export const metadata = {
  title: "Parolamı unuttum | Akif Poliklinik Admin",
};

export default function ForgotPasswordPage() {
  return (
    <AuthPage
      description="Yönetici e-postanızı girin. Hesap aktifse sıfırlama bağlantısını e-postayla göndereceğiz."
      title="Parolanızı sıfırlayın"
    >
      <ForgotPasswordForm />
    </AuthPage>
  );
}
