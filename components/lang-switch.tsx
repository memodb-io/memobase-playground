"use client";

import { useLocale } from "next-intl";

import { Button } from "@/components/ui/button";
import { setLocale } from "@/i18n";
import { type Locale, locales } from "@/i18n/config";

export function LangSwitch() {
  const [ZH, EN] = locales;
  const locale = useLocale();

  // 切换语言
  function onChangeLang(value: Locale) {
    const locale = value as Locale;
    setLocale(locale);
  }
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => onChangeLang(locale === ZH ? EN : ZH)}
    >
      {locale === ZH ? "EN" : "中"}
      <span className="sr-only">Toggle Lang</span>
    </Button>
  );
}
