"use client";

import { ArrowUpRight, CaretDown } from "@phosphor-icons/react";
import { useRef, useState } from "react";

import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Link, useRouter } from "@/i18n/navigation";

import Brand from "./brand";
import LanguageMenu from "./languageMenu";

function MenuGlyph({ open }) {
  return (
    <span aria-hidden="true" className="relative block h-4 w-5">
      <span className={`absolute start-0 top-[0.3rem] h-px w-5 bg-current transition-transform duration-300 ease-[cubic-bezier(.4,0,.2,1)] ${open ? "translate-y-[0.2rem] rotate-45" : ""}`} />
      <span className={`absolute start-0 bottom-[0.3rem] h-px w-5 bg-current transition-transform duration-300 ease-[cubic-bezier(.4,0,.2,1)] ${open ? "-translate-y-[0.2rem] -rotate-45" : ""}`} />
      <span className={`absolute start-0 bottom-[0rem] h-px w-5 bg-current transition-transform duration-300 ease-[cubic-bezier(.4,0,.2,1)] ${open ? "opacity-0" : ""}`} />
    </span>
  );
}

export default function MobileNavbar({ currentLocale, groups, labels, phone }) {
  const router = useRouter();
  const pendingHrefRef = useRef(null);
  const [open, setOpen] = useState(false);

  function handleOpenChange(nextOpen) {
    if (nextOpen) {
      pendingHrefRef.current = null;
    }

    setOpen(nextOpen);
  }

  function closeThenNavigate(event, href) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();
    pendingHrefRef.current = href;
    setOpen(false);
  }

  function handleOpenChangeComplete(isOpen) {
    if (isOpen || !pendingHrefRef.current) {
      return;
    }

    const href = pendingHrefRef.current;
    pendingHrefRef.current = null;
    router.push(href);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      onOpenChangeComplete={handleOpenChangeComplete}
    >
      <DialogTrigger className="grid h-full min-h-[4.5rem] w-14 place-items-center border-s border-ink/12 text-ink transition-colors duration-200 hover:text-primary lg:hidden">
        <MenuGlyph open={open} />
        <span className="sr-only">{labels.menu}</span>
      </DialogTrigger>

      <DialogContent
        keepMounted
        className="mobile-nav-panel flex min-h-full flex-col sm:max-w-[32rem]"
      >
        <div className="flex min-h-[4.5rem] items-center justify-between border-b border-ink/12 px-5 sm:px-7">
          <Brand />
          <DialogClose className="grid size-11 place-items-center text-ink transition-colors duration-200 hover:text-primary">
            <MenuGlyph open />
            <span className="sr-only">{labels.close}</span>
          </DialogClose>
        </div>

        <DialogTitle className="sr-only">{labels.menu}</DialogTitle>

        <nav aria-label={labels.menu} className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-5 pb-7 pt-6 sm:px-7 sm:pb-9 sm:pt-8">
          <div>
            <div data-mobile-nav-item className="mb-4 text-[0.62rem] font-semibold tracking-[0.16em] text-ink/40 uppercase" style={{ "--mobile-nav-delay": "60ms" }}>
              <span>{labels.menu}</span>
            </div>

            <div data-mobile-nav-item className="border-t border-ink/12" style={{ "--mobile-nav-delay": "90ms" }}>
              <Link
                href="/"
                onClick={(event) => closeThenNavigate(event, "/")}
                className="group flex min-h-14 items-center justify-between border-b border-ink/12 text-xl font-medium tracking-[-0.04em] transition-colors duration-200 hover:text-primary sm:text-2xl"
              >
                {labels.home}
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 text-ink/30 transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                  weight="light"
                />
              </Link>
              <Link
                href="/treatments"
                onClick={(event) => closeThenNavigate(event, "/treatments")}
                className="group flex min-h-14 items-center justify-between border-b border-ink/12 text-xl font-medium tracking-[-0.04em] transition-colors duration-200 hover:text-primary sm:text-2xl"
              >
                {labels.treatments}
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 text-ink/30 transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                  weight="light"
                />
              </Link>
            </div>

            <div className="border-b border-ink/12 py-4">
              {groups.map((group, groupIndex) => (
                <details key={group.key} data-mobile-nav-item className="group border-t border-ink/10 first:border-t-0" style={{ "--mobile-nav-delay": `${140 + groupIndex * 30}ms` }}>
                  <summary className="flex min-h-12 list-none items-center justify-between gap-4 text-[0.68rem] font-semibold tracking-[0.14em] text-ink/66 uppercase transition-colors duration-180 hover:text-primary">
                    <span>{group.label}</span>
                    <CaretDown aria-hidden="true" className="size-3.5 text-primary transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] group-open:rotate-180" weight="light" />
                  </summary>
                  <div className="grid pb-4 ps-3">
                    {group.items.map((item) => (
                      <Link
                        key={item.key}
                        href={item.href}
                        onClick={(event) => closeThenNavigate(event, item.href)}
                        className="border-s border-ink/10 py-1.5 ps-4 text-[0.86rem] leading-5 text-ink/58 transition-[border-color,color] duration-180 ease-[cubic-bezier(.22,1,.36,1)] hover:border-primary hover:text-ink"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>

          <div data-mobile-nav-item className="mt-auto grid gap-5 border-t border-ink/12 pt-5" style={{ "--mobile-nav-delay": "260ms" }}>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink/58">
              <Link href="/privacy-notice" onClick={(event) => closeThenNavigate(event, "/privacy-notice")}>
                {labels.privacy}
              </Link>
              <Link href="/authorization-document" onClick={(event) => closeThenNavigate(event, "/authorization-document")}>
                {labels.authorization}
              </Link>
            </div>
            <div className="flex items-center justify-between gap-3">
              <LanguageMenu currentLocale={currentLocale} label={labels.languages} align="start" variant="mobile" />
              <a href={phone.href} className="group inline-flex min-h-11 items-center gap-3 bg-primary px-4 text-sm font-medium text-white">
                {labels.call}
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-200 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  weight="light"
                />
              </a>
            </div>
          </div>
        </nav>
      </DialogContent>
    </Dialog>
  );
}
