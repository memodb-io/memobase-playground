import { GalleryVerticalEnd } from "lucide-react";
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
import { signup } from "./actions";

export default function SignUpPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </a>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">创建账号</CardTitle>
              <CardDescription>
                输入您的邮箱和密码进行注册
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <form action={signup}>
                  <div className="grid gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="email">邮箱</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="example@email.com"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">密码</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      注册
                    </Button>
                  </div>
                </form>
                <div className="text-center text-sm">
                  已有账号？{" "}
                  <a href="/login" className="underline underline-offset-4">
                    登录
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
            点击继续即表示您同意我们的 <a href="#">服务条款</a>{" "}
            和 <a href="#">隐私政策</a>。
          </div>
        </div>
      </div>
    </div>
  );
}
