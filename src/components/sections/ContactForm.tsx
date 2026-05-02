"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { useState } from "react";
import { isRtl, type Locale } from "@/lib/i18n";

export function ContactForm({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Record<string, string>;
}) {
  const rtl = isRtl(locale);
  const inputDir = rtl ? "rtl" : "ltr";

  const requiredMsg =
    locale === "ar"
      ? "هذا الحقل مطلوب"
      : locale === "fr"
        ? "Ce champ est obligatoire"
        : "Required";
  const invalidEmail =
    locale === "ar"
      ? "بريد إلكتروني غير صحيح"
      : locale === "fr"
        ? "E-mail invalide"
        : "Invalid email";

  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    message: false,
  });

  const validateEmail = (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();

    const next = {
      name: !name,
      email: !email || !validateEmail(email),
      message: !message,
    };
    setErrors(next);
    if (next.name || next.email || next.message) return;
    setSent(true);
  }

  function reset() {
    setSent(false);
    setErrors({ name: false, email: false, message: false });
  }

  return (
    <div className="form-card">
      {!sent ? (
        <>
          <h3 className="mb-6 text-[19px] font-bold text-[var(--text-dark)]">
            {dict.title ?? ""}
          </h3>
          <form id="c-form" onSubmit={onSubmit}>
            <div className="form-row">
              <div
                className={clsx("form-group", errors.name && "err")}
                id="fg-n"
              >
                <label className="form-label" htmlFor="f-n">
                  {dict.name ?? ""}
                </label>
                <input
                  name="name"
                  className="form-input"
                  id="f-n"
                  dir={inputDir}
                  required
                  placeholder={dict.placeholderName ?? ""}
                />
                <div className="form-error">{requiredMsg}</div>
              </div>
              <div
                className={clsx("form-group", errors.email && "err")}
                id="fg-e"
              >
                <label className="form-label" htmlFor="f-e">
                  {dict.email ?? ""}
                </label>
                <input
                  name="email"
                  type="email"
                  className="form-input"
                  id="f-e"
                  dir={inputDir}
                  required
                  placeholder={dict.placeholderEmail ?? ""}
                />
                <div className="form-error">{invalidEmail}</div>
              </div>
            </div>
            <div className="form-group" id="fg-p">
              <label className="form-label" htmlFor="f-p">
                {dict.phone ?? ""}
              </label>
              <input
                name="phone"
                type="tel"
                className="form-input"
                id="f-p"
                dir={inputDir}
                placeholder={dict.placeholderPhone ?? ""}
              />
            </div>
            <div
              className={clsx("form-group", errors.message && "err")}
              id="fg-m"
            >
              <label className="form-label" htmlFor="f-m">
                {dict.message ?? ""}
              </label>
              <textarea
                name="message"
                className="form-textarea"
                id="f-m"
                rows={5}
                dir={inputDir}
                required
                placeholder={dict.placeholderMessage ?? ""}
              />
              <div className="form-error">{requiredMsg}</div>
            </div>
            <button
              type="submit"
              className="btn btn-brand btn-lg flex w-full justify-center"
            >
              <FontAwesomeIcon icon={faPaperPlane} /> {dict.submit ?? ""}
            </button>
          </form>
        </>
      ) : (
        <div className="form-success show" id="form-ok">
          <div className="form-success-icon">
            <FontAwesomeIcon icon={faCheck} />
          </div>
          <h3 className="form-success-title">{dict.okTitle ?? ""}</h3>
          <p className="form-success-desc">{dict.okDesc ?? ""}</p>
          <button
            type="button"
            className="btn btn-outline btn-sm mt-[18px]"
            onClick={() => reset()}
          >
            {dict.again ?? ""}
          </button>
        </div>
      )}
    </div>
  );
}
