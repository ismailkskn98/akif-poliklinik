const dashboardItems = [
  { label: "İletişim talepleri", description: "Yeni form kayıtlarını yönetin." },
  { label: "Site içeriği", description: "Dil bazlı yayın içeriklerini düzenleyin." },
  { label: "Yasal belgeler", description: "KVKK ve yetki belgesi sürümlerini yönetin." },
];

export default function AdminPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-black/8 bg-white">
        <div className="mx-auto flex min-h-14 max-w-6xl items-center justify-between px-5">
          <p className="text-sm font-semibold">Akif Poliklinik</p>
          <span className="text-xs text-black/50">Admin paneli</span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10">
        <div className="mb-8 max-w-xl">
          <p className="mb-2 text-xs font-medium tracking-[0.16em] text-black/45 uppercase">
            Genel bakış
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Yönetim merkezi</h1>
          <p className="mt-3 text-sm leading-6 text-black/55">
            İlk kurulum tamamlandı. Modüller geliştirme aşamalarında API ile bağlanacak.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {dashboardItems.map((dashboardItem) => (
            <section
              key={dashboardItem.label}
              className="rounded-xl border border-black/8 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
            >
              <h2 className="text-sm font-semibold">{dashboardItem.label}</h2>
              <p className="mt-2 text-sm leading-6 text-black/50">
                {dashboardItem.description}
              </p>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
