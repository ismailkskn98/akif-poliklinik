import { Phone } from "@phosphor-icons/react/dist/ssr";

import Brand from "./brand";
import DesktopNavbar from "./desktopNavbar";
import LanguageMenu from "./languageMenu";
import MobileNavbar from "./mobileNavbar";

export default function NavigationShell({ currentLocale, labels, settings }) {
  return (
    <header data-motion-header className="relative z-40 border-b border-ink/10 bg-[#fafbfe]">
      <div className="grid-container">
        <div className="lg:hidden">
          <div className="flex min-h-14 items-stretch justify-between border-b border-ink/10">
            <div className="flex items-center gap-2">
              <LanguageMenu currentLocale={currentLocale} label={labels.languages} align="start" variant="mobile-header" />
            </div>
          <MobileNavbar
            currentLocale={currentLocale}
            hasAuthorizationDocument={Boolean(settings.authorizationDocumentUrl)}
            labels={labels}
            phone={settings.phones[0]}
          />
          </div>
          <div className="flex justify-center py-5 sm:py-6">
            <Brand variant="display" />
          </div>
        </div>

        <div className="hidden justify-center py-6 lg:flex xl:py-7">
          <Brand variant="display" />
        </div>

        <div className="hidden min-h-14 w-full grid-cols-[1fr_auto_1fr] items-stretch border-t border-ink/10 lg:grid">
          <div aria-hidden="true" />

          <DesktopNavbar
            hasAuthorizationDocument={Boolean(settings.authorizationDocumentUrl)}
            labels={labels}
          />

          <div className="hidden items-stretch justify-self-end lg:flex">
            <LanguageMenu currentLocale={currentLocale} label={labels.languages} />
            <a
              href={settings.phones[0].href}
              className="flex h-full items-center gap-2 border-s border-ink/10 bg-primary px-4 text-[0.7rem] font-medium text-white transition-colors duration-180 ease-[cubic-bezier(.22,1,.36,1)] hover:bg-primary-dark"
            >
              <Phone aria-hidden="true" className="size-3.5" weight="light" />
              {labels.call}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
