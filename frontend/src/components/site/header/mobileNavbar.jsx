"use client";

import { ArrowUpRight } from "@phosphor-icons/react";
import { useLayoutEffect, useRef, useState } from "react";

import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Link, useRouter } from "@/i18n/navigation";

import Brand from "./brand";
import LanguageMenu from "./languageMenu";

function usePageScrollLock(locked) {
  useLayoutEffect(() => {
    if (!locked) {
      return undefined;
    }

    const html = document.documentElement;
    const body = document.body;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyStyles = {
      left: body.style.left,
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    };

    html.style.overflow = "hidden";
    Object.assign(body.style, {
      left: `-${scrollX}px`,
      overflow: "hidden",
      position: "fixed",
      top: `-${scrollY}px`,
      width: "100%",
    });

    return () => {
      html.style.overflow = previousHtmlOverflow;
      Object.assign(body.style, previousBodyStyles);

      const previousScrollBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      window.scrollTo(scrollX, scrollY);
      html.style.scrollBehavior = previousScrollBehavior;
    };
  }, [locked]);
}

function MenuGlyph({ open }) {
  return (
    <span aria-hidden="true" className="relative block h-4 w-5">
      <span className={`absolute start-0 top-[0.3rem] h-px w-5 bg-current transition-transform duration-300 ease-[cubic-bezier(.4,0,.2,1)] ${open ? "translate-y-[0.2rem] rotate-45" : ""}`} />
      <span className={`absolute start-0 bottom-[0.3rem] h-px w-5 bg-current transition-transform duration-300 ease-[cubic-bezier(.4,0,.2,1)] ${open ? "-translate-y-[0.2rem] -rotate-45" : ""}`} />
      <span className={`absolute start-0 bottom-[0rem] h-px w-5 bg-current transition-transform duration-300 ease-[cubic-bezier(.4,0,.2,1)] ${open ? "opacity-0" : ""}`} />
    </span>
  );
}

export default function MobileNavbar({
  currentLocale,
  hasAuthorizationDocument,
  labels,
  phone,
}) {
  const router = useRouter();
  const pendingHrefRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [scrollLocked, setScrollLocked] = useState(false);

  usePageScrollLock(scrollLocked);

  function handleOpenChange(nextOpen) {
    if (nextOpen) {
      pendingHrefRef.current = null;
      setScrollLocked(true);
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
    if (isOpen) {
      return;
    }

    setScrollLocked(false);

    if (!pendingHrefRef.current) {
      return;
    }

    const href = pendingHrefRef.current;
    pendingHrefRef.current = null;
    router.push(href);
  }

  return (
    <Dialog
      modal="trap-focus"
      open={open}
      onOpenChange={handleOpenChange}
      onOpenChangeComplete={handleOpenChangeComplete}
    >
      <DialogTrigger className="flex h-full min-h-14 w-[4.5rem] items-center justify-end text-ink transition-colors duration-200 hover:text-primary lg:hidden">
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
            <div data-mobile-nav-item className="mb-4 text-[0.62rem] font-semibold tracking-[0.16em] text-ink/40 uppercase" style={{ "--mobile-nav-delay": "35ms" }}>
              <span>{labels.menu}</span>
            </div>

            <div data-mobile-nav-item className="border-t border-ink/12" style={{ "--mobile-nav-delay": "55ms" }}>
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
                href="/doctors"
                onClick={(event) => closeThenNavigate(event, "/doctors")}
                className="group flex min-h-14 items-center justify-between border-b border-ink/12 text-xl font-medium tracking-[-0.04em] transition-colors duration-200 hover:text-primary sm:text-2xl"
              >
                {labels.doctors}
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 text-ink/30 transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                  weight="light"
                />
              </Link>
              {hasAuthorizationDocument ? (
                <Link
                  href="/authorization-document"
                  onClick={(event) => closeThenNavigate(event, "/authorization-document")}
                  className="group flex min-h-14 items-center justify-between border-b border-ink/12 text-xl font-medium tracking-[-0.04em] transition-colors duration-200 hover:text-primary sm:text-2xl"
                >
                  {labels.authorization}
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 text-ink/30 transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                    weight="light"
                  />
                </Link>
              ) : null}
            </div>

          </div>

          <div data-mobile-nav-item className="mt-auto grid gap-5 border-t border-ink/12 pt-5" style={{ "--mobile-nav-delay": "165ms" }}>
            <div className="text-sm text-ink/58">
              <Link href="/privacy-notice" onClick={(event) => closeThenNavigate(event, "/privacy-notice")}>
                {labels.privacy}
              </Link>
            </div>
            <div className="flex items-center justify-between gap-3">
              <LanguageMenu currentLocale={currentLocale} label={labels.languages} align="start" variant="mobile" />
              <a href={phone.href} className="group inline-flex min-h-11 items-center gap-3 bg-primary px-4 text-sm font-medium text-primary-foreground">
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
