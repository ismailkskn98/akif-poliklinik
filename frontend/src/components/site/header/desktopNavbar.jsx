"use client";

import { ArrowUpRight, CaretDown } from "@phosphor-icons/react";
import Image from "next/image";
import { useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Link } from "@/i18n/navigation";

export default function DesktopNavbar({ groups, labels }) {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(groups[1]?.items[0] ?? groups[0].items[0]);

  return (
    <nav aria-label={labels.menu} className="hidden items-center lg:flex">
      <Link className="nav-link" href="/">
        {labels.home}
      </Link>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          openOnHover
          delay={70}
          closeDelay={140}
          className="nav-link group flex gap-1.5 data-[popup-open]:text-primary"
        >
          {labels.treatments}
          <CaretDown
            aria-hidden="true"
            className="size-3.5 transition-transform duration-250 ease-[cubic-bezier(.22,1,.36,1)] group-data-[popup-open]:rotate-180"
            weight="light"
          />
        </PopoverTrigger>
        <PopoverContent
          sideOffset={4}
          className="w-[min(76rem,calc(100vw-2.5rem))] overflow-hidden p-0"
        >
          <div className="grid min-h-[23rem] grid-cols-[17rem_1fr]">
            <figure className="relative overflow-hidden bg-[#37332e] text-white">
              <Image
                key={preview.key}
                alt={preview.label}
                className="mega-menu-image object-cover"
                fill
                sizes="17rem"
                src={preview.image}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#27231f] via-[#27231f]/18 to-transparent" />
              <div aria-hidden="true" className="dot-texture absolute inset-0 opacity-[0.14]" />
              <figcaption className="absolute inset-x-0 bottom-0 p-6">
                <span className="text-[0.62rem] font-semibold tracking-[0.17em] text-white/52 uppercase">
                  {labels.treatments}
                </span>
                <p className="mt-2 max-w-48 text-2xl leading-[1.02] font-medium tracking-[-0.045em]">
                  {preview.label}
                </p>
              </figcaption>
            </figure>

            <div className="flex min-w-0 flex-col">
              <div className="flex min-h-16 items-center justify-between gap-6 border-b border-[#27231f]/12 px-6">
                <div>
                  <p className="text-[0.65rem] font-semibold tracking-[0.16em] text-primary uppercase">
                    {labels.treatments}
                  </p>
                  <p className="mt-1 text-xs text-[#27231f]/45">
                    {labels.treatmentsTeaser}
                  </p>
                </div>
                <span className="text-[0.62rem] tracking-[0.16em] text-[#27231f]/28 uppercase">
                  {String(groups.reduce((total, group) => total + group.items.length, 0)).padStart(2, "0")}
                </span>
              </div>

              <div className="grid flex-1 grid-cols-4 divide-x divide-[#27231f]/10 rtl:divide-x-reverse">
                {groups.map((group, groupIndex) => (
                  <section key={group.key} className="p-4 xl:p-5">
                    <div className="flex min-h-10 items-start justify-between gap-3 border-b border-[#27231f]/10 pb-3">
                      <h2 className="text-[0.64rem] leading-4 font-semibold tracking-[0.14em] text-primary uppercase">
                        {group.label}
                      </h2>
                      <span className="text-[0.58rem] text-[#27231f]/26">
                        {String(groupIndex + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="mt-2 grid">
                      {group.items.map((item) => {
                        const isActive = preview.key === item.key;

                        return (
                          <Link
                            key={item.key}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            onFocus={() => setPreview(item)}
                            onPointerEnter={() => setPreview(item)}
                            className={`group/item flex min-h-9 items-center justify-between gap-2 px-2 text-[0.76rem] leading-4 transition-[background-color,color] duration-180 ease-[cubic-bezier(.22,1,.36,1)] ${
                              isActive
                                ? "bg-[#ebe6de] text-[#27231f]"
                                : "text-[#27231f]/56 hover:bg-[#ebe6de]/70 hover:text-[#27231f]"
                            }`}
                          >
                            <span>{item.label}</span>
                            <ArrowUpRight
                              aria-hidden="true"
                              className={`size-3 shrink-0 transition-[transform,opacity] duration-180 ease-[cubic-bezier(.22,1,.36,1)] rtl:rotate-[-90deg] ${
                                isActive
                                  ? "opacity-100"
                                  : "-translate-x-1 translate-y-1 opacity-0 group-hover/item:translate-x-0 group-hover/item:translate-y-0 group-hover/item:opacity-100"
                              }`}
                              weight="light"
                            />
                          </Link>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>

              <Link
                href="/treatments"
                onClick={() => setOpen(false)}
                className="group flex min-h-14 items-center justify-between border-t border-[#27231f]/12 px-6 text-sm font-medium text-[#27231f] transition-colors duration-200 ease-[cubic-bezier(.22,1,.36,1)] hover:bg-primary hover:text-white"
              >
                {labels.viewAll}
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 text-primary transition-[transform,color] duration-200 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                  weight="light"
                />
              </Link>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Link className="nav-link" href="/privacy-notice">
        {labels.privacy}
      </Link>
      <Link className="nav-link" href="/authorization-document">
        {labels.authorization}
      </Link>
    </nav>
  );
}
