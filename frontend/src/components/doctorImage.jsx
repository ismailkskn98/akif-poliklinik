"use client";

import { ImageSquare } from "@phosphor-icons/react";
import Image from "next/image";
import { useState } from "react";

import { shouldBypassImageOptimization } from "@/lib/imageSource";

export default function DoctorImage({
  alt,
  className,
  fallbackClassName = "",
  src,
  unoptimized,
  ...props
}) {
  const [failedSource, setFailedSource] = useState("");

  if (!src || failedSource === src) {
    return (
      <div
        className={`absolute inset-0 grid place-items-center bg-black/[.035] ${fallbackClassName}`}
        role="img"
      >
        <ImageSquare aria-hidden="true" className="size-6 text-black/24" weight="light" />
        <span className="sr-only">{alt}</span>
      </div>
    );
  }

  return (
    <Image
      {...props}
      alt={alt}
      className={className}
      onError={() => setFailedSource(src)}
      src={src}
      unoptimized={unoptimized ?? shouldBypassImageOptimization(src)}
    />
  );
}
