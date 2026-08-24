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

function DialogContent({ className, children, keepMounted = false, ...props }) {
  return (
    <DialogPrimitive.Portal keepMounted={keepMounted}>
      <DialogPrimitive.Backdrop className="fixed inset-0 z-40 min-h-dvh bg-ink/24 transition-opacity duration-[280ms] ease-[cubic-bezier(.33,1,.68,1)] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 data-[ending-style]:duration-[220ms] data-[ending-style]:ease-[cubic-bezier(.32,0,.67,0)] supports-[-webkit-touch-callout:none]:absolute" />
      <DialogPrimitive.Viewport className="fixed inset-0 z-50 flex h-dvh min-h-dvh justify-end overflow-hidden data-[ending-style]:pointer-events-none">
        <DialogPrimitive.Popup
          className={cn(
            "h-dvh min-h-0 w-full translate-x-0 transform-gpu overflow-hidden bg-surface text-ink outline-none transition-transform duration-[460ms] ease-[cubic-bezier(.33,1,.68,1)] will-change-transform data-[starting-style]:translate-x-full data-[ending-style]:translate-x-full data-[ending-style]:duration-[340ms] data-[ending-style]:ease-[cubic-bezier(.32,0,.67,0)] sm:max-w-[38rem] sm:border-s sm:border-ink/12",
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

export { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger };
