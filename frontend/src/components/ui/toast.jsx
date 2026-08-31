"use client";

import {
  CheckCircle,
  Info,
  SpinnerGap,
  Warning,
  X,
  XCircle,
} from "@phosphor-icons/react";
import { Toast as ToastPrimitive } from "@base-ui/react/toast";

import { cn } from "@/lib/utils";

import { Button } from "./button";

const toast = ToastPrimitive.createToastManager();

function ToastProvider(props) {
  return <ToastPrimitive.Provider {...props} />;
}

function ToastPortal(props) {
  return <ToastPrimitive.Portal data-slot="toast-portal" {...props} />;
}

function ToastViewport({ className, ...props }) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      className={cn(
        "pointer-events-none fixed inset-x-4 bottom-4 z-50 mx-auto w-auto max-w-sm outline-none sm:right-5 sm:left-auto sm:mx-0 sm:w-full",
        className,
      )}
      {...props}
    />
  );
}

function Toast({ className, ...props }) {
  return (
    <ToastPrimitive.Root
      data-slot="toast"
      className={cn(
        "group/toast pointer-events-auto absolute right-0 bottom-0 z-[calc(1000-var(--toast-index))] w-full origin-bottom rounded-md border border-black/8 bg-white text-ink shadow-[0_18px_55px_rgb(var(--shadow-rgb)_/_0.14)] will-change-transform outline-none select-none focus-visible:border-primary/40 focus-visible:ring-3 focus-visible:ring-primary/12",
        "[--gap:0.65rem] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))] [--peek:0.65rem] [--scale:calc(max(0,1-(var(--toast-index)*0.08)))] [--shrink:calc(1-var(--scale))]",
        "h-(--height) [transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))] [transition:transform_420ms_cubic-bezier(.33,1,.68,1),opacity_320ms_cubic-bezier(.33,1,.68,1),height_150ms]",
        "after:absolute after:top-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']",
        "data-expanded:h-(--toast-height) data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]",
        "data-limited:opacity-0 data-starting-style:[transform:translateY(130%)]",
        "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(130%)]",
        "data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+130%))]",
        "data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-130%))_translateY(var(--offset-y))]",
        "data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+130%))_translateY(var(--offset-y))]",
        "data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-130%))]",
        className,
      )}
      {...props}
    />
  );
}

function ToastContent({ className, ...props }) {
  return (
    <ToastPrimitive.Content
      data-slot="toast-content"
      className={cn(
        "flex h-full items-center gap-3 overflow-hidden p-4 transition-opacity duration-300 ease-[cubic-bezier(.33,1,.68,1)] data-behind:opacity-0 data-expanded:opacity-100",
        className,
      )}
      {...props}
    />
  );
}

function ToastTitle({ className, ...props }) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn("text-sm font-semibold", className)}
      {...props}
    />
  );
}

function ToastDescription({ className, ...props }) {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      className={cn("text-xs leading-5 text-black/52", className)}
      {...props}
    />
  );
}

function ToastAction({
  className,
  render = <Button variant="outline" size="sm" />,
  ...props
}) {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      render={render}
      className={cn("shrink-0", className)}
      {...props}
    />
  );
}

function ToastClose({
  className,
  children,
  render = <Button variant="ghost" size="icon-sm" />,
  ...props
}) {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      aria-label="Bildirimi kapat"
      render={render}
      className={cn(
        "relative shrink-0 text-black/38 after:absolute after:-inset-2 after:content-[''] hover:text-ink",
        className,
      )}
      {...props}
    >
      {children ?? <X aria-hidden="true" weight="light" />}
    </ToastPrimitive.Close>
  );
}

function ToastIcon({ type }) {
  const iconClassName = "size-4";
  let icon = null;

  if (type === "success") {
    icon = <CheckCircle className={`${iconClassName} text-emerald-600`} weight="light" />;
  }

  if (type === "info") {
    icon = <Info className={`${iconClassName} text-primary`} weight="light" />;
  }

  if (type === "warning") {
    icon = <Warning className={`${iconClassName} text-amber-600`} weight="light" />;
  }

  if (type === "error") {
    icon = <XCircle className={`${iconClassName} text-destructive`} weight="light" />;
  }

  if (type === "loading") {
    icon = <SpinnerGap className={`${iconClassName} animate-spin text-primary`} weight="light" />;
  }

  return icon ? (
    <span data-slot="toast-icon" className="shrink-0" aria-hidden="true">
      {icon}
    </span>
  ) : null;
}

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager();

  return toasts.map((toastItem) => (
    <Toast key={toastItem.id} toast={toastItem}>
      <ToastContent>
        <ToastIcon type={toastItem.type} />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <ToastTitle />
          <ToastDescription />
        </div>
        <ToastAction />
        <ToastClose />
      </ToastContent>
    </Toast>
  ));
}

function Toaster({ children, toastManager = toast, ...props }) {
  return (
    <ToastProvider toastManager={toastManager} {...props}>
      {children}
      <ToastPortal>
        <ToastViewport>
          <ToastList />
        </ToastViewport>
      </ToastPortal>
    </ToastProvider>
  );
}

const createToastManager = ToastPrimitive.createToastManager;
const useToastManager = ToastPrimitive.useToastManager;

export {
  Toaster,
  Toast,
  ToastAction,
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastPortal,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  createToastManager,
  toast,
  useToastManager,
};
