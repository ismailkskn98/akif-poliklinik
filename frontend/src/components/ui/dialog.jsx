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

function DialogContent({ className, children, ...props }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop className="fixed inset-0 z-40 bg-[#27231f]/24 backdrop-blur-[2px] transition-opacity duration-400 ease-[cubic-bezier(.22,1,.36,1)] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
      <DialogPrimitive.Viewport className="fixed inset-0 z-50 flex justify-end overflow-hidden">
        <DialogPrimitive.Popup
          className={cn(
            "h-full w-full overflow-y-auto overscroll-contain bg-[#f8f5ef] text-[#27231f] outline-none transition-[transform,opacity] duration-600 ease-[cubic-bezier(.22,1,.36,1)] will-change-[transform,opacity] data-[starting-style]:translate-x-8 data-[starting-style]:opacity-0 data-[ending-style]:translate-x-8 data-[ending-style]:opacity-0 sm:max-w-[38rem] sm:border-s sm:border-[#27231f]/12",
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
