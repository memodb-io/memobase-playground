"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "@/app/signup/actions";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("common");

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? t("signingUp") : t("signup")}
    </Button>
  );
}

export default function SignUpPage() {
  const t = useTranslations("common");

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{t("createAccount")}</CardTitle>
              <CardDescription>{t("createAccountDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
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
                    <SubmitButton />
                  </div>
                </form>
                <div className="text-center text-sm">
                  {t("alreadyHaveAccount")}{" "}
                  <Link href="/login" className="underline underline-offset-4">
                    {t("login")}
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
            {t("agreeTerms", {
              terms: t("termsOfService"),
              privacy: t("privacyPolicy"),
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
