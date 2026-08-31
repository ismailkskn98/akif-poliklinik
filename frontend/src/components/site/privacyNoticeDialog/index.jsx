"use client";

import { X } from "@phosphor-icons/react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export default function PrivacyNoticeDialog({
  address,
  className,
  labels,
  notice,
  triggerLabel,
}) {
  return (
    <Dialog>
      <DialogTrigger
        className={cn(
          "text-start font-medium text-primary underline decoration-primary/35 underline-offset-3 transition-colors duration-180 ease-[cubic-bezier(.22,1,.36,1)] hover:text-primary-dark",
          className,
        )}
        type="button"
      >
        {triggerLabel}
      </DialogTrigger>

      <DialogContent
        variant="responsive"
        className="flex flex-col bg-surface-overlay"
      >
        <header className="flex shrink-0 items-start justify-between gap-5 border-b border-ink/12 bg-surface-overlay px-5 py-5 sm:px-8 sm:py-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
              {labels.eyebrow}
            </p>
            <DialogTitle className="mt-2 text-xl font-medium tracking-[-0.035em] text-ink sm:text-2xl">
              {labels.title}
            </DialogTitle>
            <DialogDescription className="mt-2 max-w-xl text-sm leading-6 text-ink/56">
              {notice.effectiveDate}
            </DialogDescription>
          </div>
          <DialogClose
            aria-label={labels.close}
            className="grid size-11 shrink-0 place-items-center border border-ink/12 text-ink/64 transition-[border-color,color,transform] duration-180 ease-[cubic-bezier(.22,1,.36,1)] hover:border-primary/45 hover:text-primary active:scale-[.97]"
          >
            <X aria-hidden="true" className="size-4" weight="light" />
          </DialogClose>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-8 sm:py-7">
          <div className="border-b border-ink/12 pb-6">
            <p className="text-base leading-7 text-ink/68">{notice.intro}</p>
            <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-4 border-t border-ink/10 pt-4 text-sm">
              <dt className="text-ink/58">{notice.controllerLabel}</dt>
              <dd className="font-medium text-ink">{notice.controllerName}</dd>
            </dl>
          </div>

          <div className="divide-y divide-ink/10">
            {notice.sections.map((section) => (
              <section className="grid gap-3 py-6 sm:grid-cols-[11rem_1fr] sm:gap-6" key={section.title}>
                <h3 className="text-base font-medium tracking-[-0.015em] text-ink">
                  {section.title}
                </h3>
                <div className="grid gap-3 text-sm leading-6 text-ink/66">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.items ? (
                    <ul className="grid gap-2 border-s border-primary/30 ps-4">
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </section>
            ))}
          </div>

          <section className="grid gap-4 border-t border-ink/12 bg-ink-deep px-5 py-6 text-white sm:grid-cols-[11rem_1fr] sm:gap-6 sm:px-6">
            <h3 className="text-base font-medium tracking-[-0.025em]">
              {notice.application.title}
            </h3>
            <div className="grid gap-3 text-sm leading-6 text-white/68">
              {notice.application.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <address className="border-t border-white/12 pt-3 not-italic">
                <span className="block text-xs font-semibold tracking-[0.1em] text-white/58 uppercase">
                  {notice.application.addressLabel}
                </span>
                <span className="mt-2 block text-white/78">{address}</span>
              </address>
            </div>
          </section>

          <p className="mt-4 text-xs leading-5 text-ink/58">
            {notice.translationNotice}
          </p>
        </div>

        <div className="shrink-0 border-t border-ink/12 bg-surface-overlay p-4 sm:flex sm:justify-end sm:px-8">
          <DialogClose className="min-h-12 w-full border border-ink/18 px-6 text-base font-medium text-ink transition-[border-color,color,transform] duration-180 ease-[cubic-bezier(.22,1,.36,1)] hover:border-primary/45 hover:text-primary active:scale-[.99] sm:w-auto">
            {labels.close}
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
