import { Phone } from "@phosphor-icons/react/dist/ssr";

import Brand from "./brand";
import DesktopNavbar from "./desktopNavbar";
import LanguageMenu from "./languageMenu";
import MobileNavbar from "./mobileNavbar";

export default function NavigationShell({ currentLocale, groups, labels, settings }) {
  return (
    <header
      data-motion-header
      className="relative z-40 border-b border-ink/10 bg-[#fafbfe]"
    >
      <div className="grid-container">
        <div className="hidden justify-center py-5 lg:flex xl:py-6">
          <Brand variant="display" />
        </div>

        <div className="grid min-h-[4.5rem] w-full grid-cols-[1fr_3.5rem] items-stretch lg:min-h-14 lg:grid-cols-[1fr_auto_1fr] lg:border-t lg:border-ink/10">
          <div className="flex items-center py-2.5 ps-1 sm:ps-2 lg:py-0">
            <div className="lg:hidden">
              <Brand />
            </div>
          </div>

          <DesktopNavbar groups={groups} labels={labels} />

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

          <MobileNavbar
            currentLocale={currentLocale}
            groups={groups}
            labels={labels}
            phone={settings.phones[0]}
          />
        </div>
      </div>
    </header>
  );
}
