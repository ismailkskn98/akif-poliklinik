"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

function createContactSchema(labels) {
  return z.object({
    fullName: z.string().trim().min(2, labels.required),
    phone: z.string().trim().min(7, labels.required),
    email: z
      .union([z.literal(""), z.string().trim().email(labels.invalidEmail)])
      .optional(),
    message: z.string().trim().max(2000).optional(),
    website: z.string().max(0).optional(),
  });
}

const fieldClassName =
  "min-h-11 w-full rounded-none border-0 border-b border-[#172038]/16 bg-transparent px-0 text-sm text-[#172038] outline-none transition-colors placeholder:text-[#172038]/30 focus:border-primary focus:ring-0";

export default function ContactForm({ labels, locale }) {
  const [submissionState, setSubmissionState] = useState("idle");
  const schema = createContactSchema(labels.validation);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { fullName: "", phone: "", email: "", message: "", website: "" },
  });

  async function submitContactRequest(values) {
    setSubmissionState("loading");

    try {
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "http://localhost:4000/api/akifclinic/v1";
      const response = await fetch(`${apiBaseUrl}/public/contact-requests/create`, {
        method: "POST",
        headers: {
          "Accept-Language": locale,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Contact request could not be submitted.");
      }

      reset();
      setSubmissionState("success");
    } catch {
      setSubmissionState("error");
    }
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit(submitContactRequest)} noValidate>
      <div>
        <label className="mb-1 block text-xs font-medium text-[#172038]/52" htmlFor="fullName">
          {labels.fullName}
        </label>
        <input id="fullName" autoComplete="name" className={fieldClassName} {...register("fullName")} />
        {errors.fullName ? <p className="mt-1 text-xs text-destructive">{errors.fullName.message}</p> : null}
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-[#172038]/52" htmlFor="email">
          {labels.email}
        </label>
        <input id="email" autoComplete="email" inputMode="email" className={fieldClassName} {...register("email")} />
        {errors.email ? <p className="mt-1 text-xs text-destructive">{errors.email.message}</p> : null}
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-[#172038]/52" htmlFor="phone">
          {labels.phone}
        </label>
        <input id="phone" autoComplete="tel" inputMode="tel" className={fieldClassName} {...register("phone")} />
        {errors.phone ? <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p> : null}
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-[#172038]/52" htmlFor="message">
          {labels.message}
        </label>
        <textarea id="message" rows="4" className={`${fieldClassName} py-3`} {...register("message")} />
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" tabIndex="-1" autoComplete="off" {...register("website")} />
      </div>

      <button
        className="mt-2 min-h-11 border border-primary bg-primary px-5 text-[0.82rem] font-medium text-white transition-[transform,background-color] duration-180 ease-[cubic-bezier(.22,1,.36,1)] hover:bg-[#354ea5] active:scale-[.99] disabled:cursor-not-allowed disabled:opacity-60"
        disabled={submissionState === "loading"}
        type="submit"
      >
        {submissionState === "loading" ? labels.sending : labels.submit}
      </button>

      <div aria-live="polite" className="min-h-4 text-xs">
        {submissionState === "success" ? <p className="text-emerald-700">{labels.success}</p> : null}
        {submissionState === "error" ? <p className="text-destructive">{labels.error}</p> : null}
      </div>
    </form>
  );
}
