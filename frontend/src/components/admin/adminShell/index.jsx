"use client";

import {
  ArrowSquareOut,
  GearSix,
  SignOut,
  Stethoscope,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { adminSessionKey } from "@/lib/adminApi";

const AdminSessionContext = createContext(null);
const authRoutes = new Set([
  "/admin/login",
  "/admin/forgot-password",
  "/admin/reset-password",
]);
const navigationItems = [
  { href: "/admin", label: "Site ayarları", icon: GearSix },
  { href: "/admin/doctors", label: "Doktorlar", icon: Stethoscope },
];

export function useAdminSession() {
  const session = useContext(AdminSessionContext);

  if (!session) {
    throw new Error("useAdminSession must be used inside AdminShell.");
  }

  return session;
}

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthRoute = authRoutes.has(pathname);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    sessionStorage.removeItem(adminSessionKey);
    setSession(null);
    setIsLoading(true);
    router.replace("/admin/login");
  }, [router]);

  useEffect(() => {
    if (isAuthRoute) {
      return;
    }

    let isActive = true;

    Promise.resolve().then(() => {
      if (!isActive) {
        return;
      }

      const storedSession = sessionStorage.getItem(adminSessionKey);

      if (!storedSession) {
        router.replace("/admin/login");
        return;
      }

      try {
        const parsedSession = JSON.parse(storedSession);

        if (!parsedSession?.token) {
          throw new Error("Invalid admin session.");
        }

        setSession(parsedSession);
        setIsLoading(false);
      } catch {
        sessionStorage.removeItem(adminSessionKey);
        router.replace("/admin/login");
      }
    });

    return () => {
      isActive = false;
    };
  }, [isAuthRoute, router]);

  const contextValue = useMemo(
    () => ({
      session,
      token: session?.token || "",
      logout,
    }),
    [logout, session],
  );

  if (isAuthRoute) {
    return children;
  }

  if (isLoading || !session) {
    return (
      <main className="grid min-h-dvh place-items-center px-5 text-sm text-black/50">
        Yönetim paneli yükleniyor…
      </main>
    );
  }

  return (
    <AdminSessionContext.Provider value={contextValue}>
      <div className="min-h-dvh bg-[#fafafa]">
        <header className="sticky top-0 z-30 border-b border-black/[.08] bg-white/95 backdrop-blur-md supports-[not(backdrop-filter:blur(1px))]:bg-white">
          <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-5">
            <Link
              aria-label="Akif Poliklinik yönetim paneli"
              className="group flex min-w-0 shrink-0 items-center gap-3"
              href="/admin"
            >
              <Image
                alt=""
                className="h-auto w-[5.25rem] object-contain transition-opacity duration-180 group-hover:opacity-75 sm:w-[5.75rem]"
                height={468}
                priority
                sizes="(min-width: 640px) 92px, 84px"
                src="/images/logo/akif-wordmark-primary.png"
                width={953}
              />
              <span className="hidden border-s border-black/10 ps-3 text-xs font-medium text-black/55 sm:block">
                Yönetim
              </span>
            </Link>

            <nav
              aria-label="Yönetim bölümleri"
              className="hidden items-center gap-1 md:flex"
            >
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/admin"
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    aria-current={isActive ? "page" : undefined}
                    className={`inline-flex h-9 items-center gap-2 rounded-md px-3 text-[0.78rem] font-medium transition-[background-color,color] duration-180 ease-out ${
                      isActive
                        ? "bg-black/[.055] text-black"
                        : "text-black/52 hover:bg-black/[.035] hover:text-black/80"
                    }`}
                    href={item.href}
                    key={item.href}
                  >
                    <Icon aria-hidden="true" className="size-4" weight="regular" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="ms-auto flex items-center gap-1.5">
              <a
                className="inline-flex h-9 items-center gap-2 rounded-md px-2.5 text-xs font-medium text-black/52 transition-[background-color,color] duration-180 hover:bg-black/[.035] hover:text-black/80 sm:px-3"
                href="/"
                rel="noreferrer"
                target="_blank"
              >
                <ArrowSquareOut aria-hidden="true" className="size-4" />
                <span className="hidden sm:inline">Siteyi görüntüle</span>
              </a>
              <span aria-hidden="true" className="h-5 w-px bg-black/10" />
              <button
                className="inline-flex h-9 items-center gap-2 rounded-md px-2.5 text-xs font-medium text-black/52 transition-[background-color,color] duration-180 hover:bg-red-50 hover:text-red-700 sm:px-3"
                onClick={logout}
                type="button"
              >
                <SignOut aria-hidden="true" className="size-4" />
                <span className="hidden sm:inline">Çıkış</span>
              </button>
            </div>
          </div>

          <nav
            aria-label="Mobil yönetim bölümleri"
            className="mx-auto flex h-11 max-w-6xl items-end gap-6 overflow-x-auto px-5 md:hidden"
          >
            {navigationItems.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

              return (
                <Link
                  aria-current={isActive ? "page" : undefined}
                  className={`inline-flex h-11 shrink-0 items-center border-b-2 text-xs font-medium transition-colors duration-180 ${
                    isActive
                      ? "border-[#516fc9] text-black"
                      : "border-transparent text-black/45 hover:text-black/75"
                  }`}
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>
        {children}
      </div>
    </AdminSessionContext.Provider>
  );
}
