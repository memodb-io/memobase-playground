import Image from "next/image";
import Link from "next/link";
import { ImageCarousel } from "@/components/image-carousel";

export default function AuthPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="https://assets.memodb.io/memobase_logo-light.jpg"
              alt="logo"
              width={142}
              height={32}
              unoptimized
              className="rounded-sm object-cover"
            />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">{children}</div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <ImageCarousel
          delay={5000}
          aspectRatio="aspect-[3/4]"
          images={[
            "https://assets.memodb.io/shots-3.jpeg",
            "https://assets.memodb.io/shots-4.jpeg",
            "https://assets.memodb.io/shots-1.jpeg",
            "https://assets.memodb.io/shots-2.jpeg",
          ]}
        />
      </div>
    </div>
  );
}
