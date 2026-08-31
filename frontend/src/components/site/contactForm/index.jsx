"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input/max";
import { z } from "zod";

import PhoneNumberInput from "@/components/site/phoneInput";
import PrivacyNoticeDialog from "@/components/site/privacyNoticeDialog";

function createContactSchema(labels) {
  return z.object({
    fullName: z
      .string()
      .trim()
      .min(1, labels.required)
      .min(2, labels.fullNameLength)
      .max(150, labels.fullNameLength),
    phone: z.union([z.string().trim(), z.null()]).superRefine((phoneNumber, context) => {
      if (phoneNumber === null) {
        context.addIssue({ code: "custom", message: labels.invalidPhone });
        return;
      }

      if (!phoneNumber) {
        context.addIssue({ code: "custom", message: labels.required });
        return;
      }

      if (!isValidPhoneNumber(phoneNumber)) {
        context.addIssue({ code: "custom", message: labels.invalidPhone });
      }
    }),
    email: z
      .string()
      .trim()
      .max(190, labels.emailTooLong)
      .refine(
        (email) => !email || z.email().safeParse(email).success,
        labels.invalidEmail,
      ),
    message: z.string().trim().max(2000, labels.messageTooLong),
    website: z.string().max(0).optional(),
    privacyNoticeAcknowledged: z
      .boolean()
      .refine(Boolean, labels.privacyRequired),
    privacyNoticeVersion: z.string().min(1),
  });
}

const fieldClassName =
  "min-h-12 w-full rounded-none border-0 border-b border-ink/16 bg-transparent px-0 text-base text-ink outline-none transition-colors placeholder:text-ink/50 focus:border-primary focus:ring-0 aria-invalid:border-destructive";

export default function ContactForm({ labels, locale, privacyNotice }) {
  const [submissionState, setSubmissionState] = useState("idle");
  const schema = useMemo(
    () => createContactSchema(labels.validation),
    [labels.validation],
  );
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      message: "",
      website: "",
      privacyNoticeAcknowledged: false,
      privacyNoticeVersion: privacyNotice.version,
    },
  });

  async function submitContactRequest(values) {
    setSubmissionState("idle");

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

  function handleInvalidSubmit() {
    setSubmissionState("idle");
  }

  function handleFormChange() {
    if (submissionState !== "idle") {
      setSubmissionState("idle");
    }
  }

  return (
    <form
      className="grid gap-5"
      noValidate
      onChange={handleFormChange}
      onSubmit={handleSubmit(submitContactRequest, handleInvalidSubmit)}
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-ink/58" htmlFor="fullName">
          {labels.fullName}
        </label>
        <input
          aria-describedby={errors.fullName ? "full-name-error" : undefined}
          aria-invalid={Boolean(errors.fullName)}
          aria-required="true"
          autoComplete="name"
          className={fieldClassName}
          id="fullName"
          maxLength="150"
          {...register("fullName")}
        />
        {errors.fullName ? (
          <p className="mt-1 text-xs text-destructive" id="full-name-error">
            {errors.fullName.message}
          </p>
        ) : null}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink/58" htmlFor="email">
          {labels.email}
        </label>
        <input
          aria-describedby={errors.email ? "email-error" : undefined}
          aria-invalid={Boolean(errors.email)}
          autoComplete="email"
          className={fieldClassName}
          id="email"
          inputMode="email"
          maxLength="190"
          {...register("email")}
        />
        {errors.email ? (
          <p className="mt-1 text-xs text-destructive" id="email-error">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink/58" htmlFor="phone">
          {labels.phone}
        </label>
        <PhoneNumberInput
          control={control}
          error={errors.phone}
          labels={{
            countrySearch: labels.countrySearch,
            countrySelector: labels.countrySelector,
            noCountryResults: labels.noCountryResults,
            phone: labels.phone,
          }}
          locale={locale}
        />
        {errors.phone ? (
          <p className="mt-1 text-xs text-destructive" id="phone-error">
            {errors.phone.message}
          </p>
        ) : null}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink/58" htmlFor="message">
          {labels.message}
        </label>
        <textarea
          aria-describedby={errors.message ? "message-error" : undefined}
          aria-invalid={Boolean(errors.message)}
          className={`${fieldClassName} py-3`}
          id="message"
          maxLength="2000"
          rows="4"
          {...register("message")}
        />
        {errors.message ? (
          <p className="mt-1 text-xs text-destructive" id="message-error">
            {errors.message.message}
          </p>
        ) : null}
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" tabIndex="-1" autoComplete="off" {...register("website")} />
      </div>

      <div>
        <div className="flex items-start gap-3">
          <span className="relative mt-0.5 grid size-5 shrink-0 place-items-center">
            <input
              aria-describedby="privacy-notice-acknowledgement"
              aria-invalid={Boolean(errors.privacyNoticeAcknowledged)}
              aria-required="true"
              className="peer size-5 appearance-none border border-ink/28 bg-transparent transition-[border-color,background-color] duration-180 ease-[cubic-bezier(.22,1,.36,1)] checked:border-primary checked:bg-primary"
              id="privacyNoticeAcknowledged"
              type="checkbox"
              {...register("privacyNoticeAcknowledged")}
            />
            <Check
              aria-hidden="true"
              className="pointer-events-none absolute size-3 text-primary-foreground opacity-0 transition-opacity duration-150 peer-checked:opacity-100"
              weight="bold"
            />
          </span>
          <p id="privacy-notice-acknowledgement" className="text-sm leading-6 text-ink/62">
            <PrivacyNoticeDialog
              address={privacyNotice.address}
              labels={privacyNotice.labels}
              notice={privacyNotice.notice}
              triggerLabel={labels.privacyLink}
            />{" "}
            <label className="cursor-pointer" htmlFor="privacyNoticeAcknowledged">
              {labels.privacyAcknowledgement}
            </label>
          </p>
        </div>
        {errors.privacyNoticeAcknowledged ? (
          <p className="mt-1.5 ps-7 text-xs text-destructive">
            {errors.privacyNoticeAcknowledged.message}
          </p>
        ) : null}
      </div>

      <button
        className="mt-2 min-h-12 border border-primary bg-primary px-6 text-base font-medium text-primary-foreground transition-[transform,background-color] duration-180 ease-[cubic-bezier(.22,1,.36,1)] hover:bg-primary-dark active:scale-[.99] disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? labels.sending : labels.submit}
      </button>

      <div aria-live="polite" className="min-h-4 text-xs">
        {submissionState === "success" ? <p className="text-emerald-700">{labels.success}</p> : null}
        {submissionState === "error" ? <p className="text-destructive">{labels.error}</p> : null}
      </div>
    </form>
  );
}
