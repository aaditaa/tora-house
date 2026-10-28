"use client";

import type { ChangeEvent, FocusEvent, ReactNode } from "react";

type Base = {
  id: string;
  label: string;
  helper?: ReactNode;
  error?: string;
  required?: boolean;
};

function Describe({
  id,
  helper,
  error,
}: {
  id: string;
  helper?: ReactNode;
  error?: string;
}) {
  return (
    <>
      {helper ? (
        <p id={`${id}-help`} className="t-meta text-fg-muted">
          {helper}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="t-meta text-brass-text">
          {error}
        </p>
      ) : null}
    </>
  );
}

function describedBy(id: string, helper?: ReactNode, error?: string) {
  const ids = [
    helper ? `${id}-help` : null,
    error ? `${id}-error` : null,
  ].filter(Boolean);
  return ids.length > 0 ? ids.join(" ") : undefined;
}

type TextFieldProps = Base & {
  value: string;
  onChange: (value: string) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  type?: "text" | "email" | "tel";
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel";
  placeholder?: string;
};

export function TextField({
  id,
  label,
  helper,
  error,
  required,
  value,
  onChange,
  onBlur,
  type = "text",
  autoComplete,
  inputMode,
  placeholder,
}: TextFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="t-meta font-medium">
        {label}
      </label>
      <Describe id={id} helper={helper} />
      <input
        id={id}
        name={id}
        className="field-input"
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={describedBy(id, helper, error)}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
        onBlur={onBlur}
      />
      {error ? (
        <p id={`${id}-error`} className="t-meta text-brass-text">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type TextAreaFieldProps = Base & {
  value: string;
  onChange: (value: string) => void;
  onBlur?: (event: FocusEvent<HTMLTextAreaElement>) => void;
  rows?: number;
};

export function TextAreaField({
  id,
  label,
  helper,
  error,
  required,
  value,
  onChange,
  onBlur,
  rows = 4,
}: TextAreaFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="t-meta font-medium">
        {label}
      </label>
      <Describe id={id} helper={helper} />
      <textarea
        id={id}
        name={id}
        rows={rows}
        className="field-input"
        value={value}
        required={required}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={describedBy(id, helper, error)}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
      />
      {error ? (
        <p id={`${id}-error`} className="t-meta text-brass-text">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type SelectFieldProps = Base & {
  value: string;
  options: readonly string[];
  placeholder?: string;
  onChange: (value: string) => void;
  onBlur?: (event: FocusEvent<HTMLSelectElement>) => void;
};

export function SelectField({
  id,
  label,
  helper,
  error,
  required,
  value,
  options,
  placeholder = "Choose one",
  onChange,
  onBlur,
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="t-meta font-medium">
        {label}
      </label>
      <Describe id={id} helper={helper} />
      <div className="relative">
        <select
          id={id}
          name={id}
          className="field-input"
          value={value}
          required={required}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={describedBy(id, helper, error)}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 12 8"
          className="pointer-events-none absolute top-1/2 right-0 h-2 w-3 -translate-y-1/2 text-fg-muted"
        >
          <path
            d="M1 1.5 6 6.5 11 1.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
          />
        </svg>
      </div>
      {error ? (
        <p id={`${id}-error`} className="t-meta text-brass-text">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type RadioFieldProps = {
  name: string;
  legend: string;
  helper?: ReactNode;
  error?: string;
  value: string;
  options: readonly { value: string; label: string }[];
  onChange: (value: string) => void;
};

export function RadioField({
  name,
  legend,
  helper,
  error,
  value,
  options,
  onChange,
}: RadioFieldProps) {
  return (
    <fieldset
      className="flex flex-col gap-3"
      aria-invalid={error ? "true" : undefined}
      aria-describedby={describedBy(name, helper, error)}
    >
      <legend className="t-meta font-medium">{legend}</legend>
      <Describe id={name} helper={helper} />
      <div className="flex flex-col gap-3 pt-1">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-center gap-3"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              className="field-radio"
              onChange={() => onChange(option.value)}
            />
            <span className="t-meta">{option.label}</span>
          </label>
        ))}
      </div>
      {error ? (
        <p id={`${name}-error`} className="t-meta text-brass-text">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

type CheckboxFieldProps = {
  id: string;
  label: ReactNode;
  error?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function CheckboxField({
  id,
  label,
  error,
  checked,
  onChange,
}: CheckboxFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      {/*
        py-1 is the tap target, not decoration. The row is one line of t-meta, which
        measures 22px tall — under the 24px minimum, and this is the only checkbox on
        the form that stands on its own rather than in a list.
      */}
      <label
        htmlFor={id}
        className="flex cursor-pointer items-start gap-3 py-1"
      >
        <span className="relative mt-0.5 inline-flex flex-none">
          <input
            id={id}
            name={id}
            type="checkbox"
            checked={checked}
            className="field-check peer"
            aria-invalid={error ? "true" : undefined}
            aria-describedby={error ? `${id}-error` : undefined}
            onChange={(e) => onChange(e.target.checked)}
          />
          <svg
            aria-hidden="true"
            viewBox="0 0 12 12"
            className="pointer-events-none absolute inset-0 m-auto hidden h-3 w-3 text-bone peer-checked:block"
          >
            <path
              d="M1.5 6.5 4.5 9.5 10.5 2.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            />
          </svg>
        </span>
        <span className="t-meta">{label}</span>
      </label>
      {error ? (
        <p id={`${id}-error`} className="t-meta text-brass-text">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type CheckboxGroupProps = {
  name: string;
  legend: string;
  helper?: ReactNode;
  error?: string;
  values: readonly string[];
  options: readonly string[];
  onChange: (values: string[]) => void;
  /** Two columns once there is room — a fourteen-item list is a wall in one. */
  columns?: boolean;
  /**
   * Ticking this option clears every other, and ticking any other clears it. For the
   * "nothing for now" kind of answer, which means nothing alongside its opposites.
   */
  exclusive?: string;
};

export function CheckboxGroupField({
  name,
  legend,
  helper,
  error,
  values,
  options,
  onChange,
  columns = false,
  exclusive,
}: CheckboxGroupProps) {
  function toggle(option: string) {
    const on = values.includes(option);
    if (on) {
      onChange(values.filter((v) => v !== option));
      return;
    }
    if (exclusive && option === exclusive) {
      onChange([option]);
      return;
    }
    const kept = exclusive ? values.filter((v) => v !== exclusive) : values;
    onChange([...kept, option]);
  }

  return (
    <fieldset
      className="flex flex-col gap-3"
      aria-invalid={error ? "true" : undefined}
      aria-describedby={describedBy(name, helper, error)}
    >
      <legend className="t-meta font-medium">{legend}</legend>
      <Describe id={name} helper={helper} />
      <div
        className={`grid gap-x-8 gap-y-3 pt-1 ${columns ? "sm:grid-cols-2" : "grid-cols-1"}`}
      >
        {options.map((option) => {
          const id = `${name}-${option.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
          return (
            <label
              key={option}
              htmlFor={id}
              className="flex cursor-pointer items-start gap-3"
            >
              <span className="relative mt-0.5 inline-flex flex-none">
                <input
                  id={id}
                  type="checkbox"
                  name={name}
                  value={option}
                  checked={values.includes(option)}
                  className="field-check peer"
                  onChange={() => toggle(option)}
                />
                <svg
                  aria-hidden="true"
                  viewBox="0 0 12 12"
                  className="pointer-events-none absolute inset-0 m-auto hidden h-3 w-3 text-bone peer-checked:block"
                >
                  <path
                    d="M1.5 6.5 4.5 9.5 10.5 2.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                </svg>
              </span>
              <span className="t-meta">{option}</span>
            </label>
          );
        })}
      </div>
      {error ? (
        <p id={`${name}-error`} className="t-meta text-brass-text">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

/** CSS-hidden, never reachable by keyboard, never autofilled. Must stay empty. */
export function Honeypot({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div
      aria-hidden="true"
      className="absolute h-0 w-0 overflow-hidden opacity-0"
    >
      <label htmlFor="website">Website</label>
      <input
        id="website"
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
