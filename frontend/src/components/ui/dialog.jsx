"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";

import { cn } from "@/lib/utils";

function Dialog(props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger(props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogClose(props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogTitle(props) {
  return <DialogPrimitive.Title data-slot="dialog-title" {...props} />;
}

function DialogDescription(props) {
  return <DialogPrimitive.Description data-slot="dialog-description" {...props} />;
}

const viewportClassNames = {
  drawer:
    "fixed inset-0 z-50 flex h-dvh min-h-dvh justify-end overflow-hidden data-[ending-style]:pointer-events-none",
  responsive:
    "fixed inset-0 z-50 flex h-dvh min-h-dvh items-end justify-center overflow-hidden data-[ending-style]:pointer-events-none sm:items-center sm:p-6",
  sheet:
    "fixed inset-0 z-50 flex h-dvh min-h-dvh items-end justify-center overflow-hidden data-[ending-style]:pointer-events-none sm:items-stretch sm:justify-end",
};

const popupClassNames = {
  drawer:
    "h-dvh min-h-0 w-full translate-x-0 transform-gpu overflow-hidden bg-surface text-ink opacity-100 outline-none transition-[transform,opacity] duration-[420ms] ease-[cubic-bezier(.22,.68,.28,1)] data-[starting-style]:translate-x-[18px] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 data-[ending-style]:duration-[280ms] data-[ending-style]:ease-[cubic-bezier(.4,0,.6,1)] sm:max-w-[38rem] sm:border-s sm:border-ink/12",
  responsive:
    "max-h-[90dvh] w-full translate-y-0 transform-gpu overflow-hidden border-t border-ink/12 bg-surface text-ink opacity-100 outline-none transition-[transform,opacity] duration-[380ms] ease-[cubic-bezier(.22,.68,.28,1)] data-[starting-style]:translate-y-[18px] data-[starting-style]:opacity-0 data-[ending-style]:translate-y-[12px] data-[ending-style]:opacity-0 data-[ending-style]:duration-[260ms] data-[ending-style]:ease-[cubic-bezier(.4,0,.6,1)] sm:max-h-[min(86dvh,48rem)] sm:max-w-[46rem] sm:border sm:border-ink/12 sm:data-[starting-style]:translate-y-2 sm:data-[ending-style]:translate-y-2",
  sheet:
    "max-h-[92dvh] w-full translate-y-0 transform-gpu overflow-hidden border-t border-ink/12 bg-surface text-ink opacity-100 outline-none transition-[transform,opacity] duration-[360ms] ease-[cubic-bezier(.22,.68,.28,1)] data-[starting-style]:translate-y-5 data-[starting-style]:opacity-0 data-[ending-style]:translate-y-3 data-[ending-style]:opacity-0 data-[ending-style]:duration-[240ms] data-[ending-style]:ease-[cubic-bezier(.4,0,.6,1)] sm:h-dvh sm:max-h-none sm:max-w-[38rem] sm:translate-x-0 sm:translate-y-0 sm:border-t-0 sm:border-s sm:data-[starting-style]:translate-x-5 sm:data-[starting-style]:translate-y-0 sm:data-[ending-style]:translate-x-3 sm:data-[ending-style]:translate-y-0",
};

function DialogContent({ className, children, keepMounted = false, variant = "drawer", ...props }) {
  return (
    <DialogPrimitive.Portal keepMounted={keepMounted}>
      <DialogPrimitive.Backdrop className="fixed inset-0 z-40 min-h-dvh bg-ink/20 transition-opacity duration-[340ms] ease-[cubic-bezier(.22,.68,.28,1)] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 data-[ending-style]:duration-[260ms] data-[ending-style]:ease-[cubic-bezier(.4,0,.6,1)] supports-[-webkit-touch-callout:none]:absolute" />
      <DialogPrimitive.Viewport className={viewportClassNames[variant]}>
        <DialogPrimitive.Popup
          className={cn(
            popupClassNames[variant],
            className,
          )}
          {...props}
        >
          {children}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Viewport>
    </DialogPrimitive.Portal>
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
};
