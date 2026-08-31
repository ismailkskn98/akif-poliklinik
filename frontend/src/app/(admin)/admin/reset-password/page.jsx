import AuthPage from "@/components/admin/authPage";
import ResetPasswordForm from "@/components/admin/resetPasswordForm";

export const metadata = {
  title: "Yeni parola | Akif Poliklinik Admin",
};

export default async function ResetPasswordPage({ searchParams }) {
  const { token = "" } = await searchParams;

  return (
    <AuthPage
      description="Yönetici hesabınız için güçlü ve yalnızca burada kullandığınız bir parola belirleyin."
      title="Yeni parola oluşturun"
    >
      <ResetPasswordForm token={typeof token === "string" ? token : ""} />
    </AuthPage>
  );
}
