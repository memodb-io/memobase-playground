"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "@/app/signup/actions";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import AuthPage from "@/components/auth-page";

function SubmitButton({
  label,
  loadingLabel,
}: {
  label: string;
  loadingLabel: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? loadingLabel : label}
    </Button>
  );
}

export default function SignUpPage() {
  const t = useTranslations("common");

  return (
    <AuthPage>
      <div className="grid gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">{t("createAccount")}</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {t("createAccountDesc")}
          </p>
        </div>
        <form action={signup}>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@email.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>
            <SubmitButton label={t("signup")} loadingLabel={t("signingUp")} />
          </div>
        </form>
        <div className="text-center text-sm">
          {t("alreadyHaveAccount")}{" "}
          <Link href="/login" className="underline underline-offset-4">
            {t("login")}
          </Link>
        </div>
      </div>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        {t("agreeTerms", {
          terms: t("termsOfService"),
          privacy: t("privacyPolicy"),
        })}
      </div>
    </AuthPage>
  );
}
