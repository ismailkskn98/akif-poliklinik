"use client";

import { CaretDown, Check, MagnifyingGlass } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import PhoneInput from "react-phone-number-input/react-hook-form";
import flags from "react-phone-number-input/flags";
import { getCountries, getCountryCallingCode } from "react-phone-number-input";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const countryCodes = getCountries();

function createCountryLabels(locale, labels) {
  const displayNames = new Intl.DisplayNames([locale], { type: "region" });
  const countryLabels = Object.fromEntries(
    countryCodes.map((countryCode) => [
      countryCode,
      displayNames.of(countryCode) || countryCode,
    ]),
  );

  return {
    ...countryLabels,
    country: labels.countrySelector,
    phone: labels.phone,
    ZZ: labels.countrySelector,
  };
}

function normalizeSearchValue(value, locale) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase(locale)
    .trim();
}

function CountrySelect({
  value,
  onChange,
  options,
  iconComponent: CountryIcon,
  disabled,
  readOnly,
  onBlur,
  onFocus,
  locale,
  searchPlaceholder,
  noResultsLabel,
  ...triggerProps
}) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const selectedOption = options.find(
    (option) => !option.divider && option.value === value,
  );
  const normalizedQuery = normalizeSearchValue(searchQuery, locale);
  const filteredOptions = options.filter((option) => {
    if (option.divider || !option.value) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const callingCode = `+${getCountryCallingCode(option.value)}`;
    const searchableValue = normalizeSearchValue(
      `${option.label} ${option.value} ${callingCode}`,
      locale,
    );

    return searchableValue.includes(normalizedQuery);
  });

  function handleOpenChange(nextOpen) {
    setOpen(nextOpen);

    if (!nextOpen) {
      setSearchQuery("");
    }
  }

  function handleCountryChange(countryCode) {
    onChange(countryCode);
    handleOpenChange(false);
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        {...triggerProps}
        className="group flex min-h-12 shrink-0 items-center gap-2 border-e border-ink/12 pe-3 text-base text-ink transition-colors duration-180 ease-[cubic-bezier(.22,1,.36,1)] hover:text-primary data-[popup-open]:text-primary disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled || readOnly}
        dir="ltr"
        onBlur={onBlur}
        onFocus={onFocus}
        type="button"
      >
        {selectedOption && value ? (
          <span className="[&_.PhoneInputCountryIcon]:h-3.5 [&_.PhoneInputCountryIcon]:w-5 [&_.PhoneInputCountryIcon]:overflow-hidden [&_.PhoneInputCountryIconImg]:h-full [&_.PhoneInputCountryIconImg]:w-full">
            <CountryIcon country={value} label={selectedOption.label} />
          </span>
        ) : null}
        <span className="min-w-9 text-start tabular-nums" dir="ltr">
          {value ? `+${getCountryCallingCode(value)}` : ""}
        </span>
        <CaretDown
          aria-hidden="true"
          className="size-3 text-ink/42 transition-transform duration-250 ease-[cubic-bezier(.22,1,.36,1)] group-data-[popup-open]:rotate-180"
          weight="light"
        />
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-[min(23rem,calc(100vw-2rem))] overflow-hidden p-0"
        sideOffset={8}
      >
        <div className="flex items-center gap-2 border-b border-ink/12 px-4">
          <MagnifyingGlass
            aria-hidden="true"
            className="size-4 shrink-0 text-ink/42"
            weight="light"
          />
          <input
            aria-label={searchPlaceholder}
            autoComplete="off"
            autoFocus
            className="min-h-12 min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-ink/50"
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={searchPlaceholder}
            type="search"
            value={searchQuery}
          />
        </div>

        <div
          aria-label={triggerProps["aria-label"]}
          className="max-h-72 overflow-y-auto overscroll-contain p-1.5"
          role="listbox"
        >
          {filteredOptions.length ? (
            filteredOptions.map((option) => {
              const isSelected = option.value === value;

              return (
                <button
                  aria-selected={isSelected}
                  className={cn(
                    "flex min-h-11 w-full items-center gap-3 px-3 text-start text-sm text-ink/72 transition-colors duration-150 hover:bg-primary/7 hover:text-ink focus-visible:bg-primary/7",
                    isSelected && "bg-primary/8 text-primary",
                  )}
                  key={option.value}
                  onClick={() => handleCountryChange(option.value)}
                  role="option"
                  type="button"
                >
                  <span className="shrink-0 [&_.PhoneInputCountryIcon]:h-3.5 [&_.PhoneInputCountryIcon]:w-5 [&_.PhoneInputCountryIcon]:overflow-hidden [&_.PhoneInputCountryIconImg]:h-full [&_.PhoneInputCountryIconImg]:w-full">
                    <CountryIcon country={option.value} label={option.label} />
                  </span>
                  <span className="min-w-0 flex-1 truncate">{option.label}</span>
                  <span className="text-xs tabular-nums text-ink/58" dir="ltr">
                    +{getCountryCallingCode(option.value)}
                  </span>
                  <span className="grid size-4 shrink-0 place-items-center">
                    {isSelected ? (
                      <Check aria-hidden="true" className="size-3.5" weight="bold" />
                    ) : null}
                  </span>
                </button>
              );
            })
          ) : (
            <p className="px-3 py-8 text-center text-sm text-ink/52">
              {noResultsLabel}
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default function PhoneNumberInput({
  control,
  error,
  labels,
  locale,
}) {
  const countryLabels = useMemo(
    () => createCountryLabels(locale, labels),
    [labels, locale],
  );

  return (
    <PhoneInput
      addInternationalOption={false}
      className={cn(
        "flex min-h-12 w-full border-b bg-transparent transition-colors duration-180 ease-[cubic-bezier(.22,1,.36,1)] focus-within:border-primary",
        error ? "border-destructive" : "border-ink/16",
      )}
      control={control}
      countrySelectComponent={CountrySelect}
      countrySelectProps={{
        "aria-label": labels.countrySelector,
        locale,
        noResultsLabel: labels.noCountryResults,
        searchPlaceholder: labels.countrySearch,
      }}
      defaultCountry="TR"
      flags={flags}
      focusInputOnCountrySelection
      labels={countryLabels}
      limitMaxLength
      name="phone"
      numberInputProps={{
        "aria-describedby": error ? "phone-error" : undefined,
        "aria-invalid": Boolean(error),
        "aria-required": true,
        autoComplete: "tel",
        className:
          "min-h-12 min-w-0 flex-1 bg-transparent ps-3 text-base text-ink outline-none placeholder:text-ink/50",
        dir: "ltr",
        id: "phone",
        inputMode: "tel",
      }}
    />
  );
}
