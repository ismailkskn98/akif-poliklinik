import AuthPage from "@/components/admin/authPage";
import AdminLoginForm from "@/components/admin/loginForm";

export const metadata = {
  title: "Yönetim paneli girişi | Akif Poliklinik",
};

export default function AdminLoginPage() {
  return (
    <AuthPage
      description="Site ayarlarını yönetmek için yönetici hesabınızla giriş yapın."
      title="Yönetim paneline giriş"
    >
      <AdminLoginForm />
    </AuthPage>
  );
}
