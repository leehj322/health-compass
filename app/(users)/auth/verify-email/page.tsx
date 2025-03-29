import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MailCheck } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center bg-white px-4 text-center">
      <MailCheck className="mb-4 h-12 w-12 text-emerald-600 md:h-20 md:w-20 lg:h-24 lg:w-24" />
      <h1 className="mb-3 text-lg font-bold text-gray-900 md:text-3xl lg:text-4xl">
        이메일을 확인해주세요
      </h1>
      <p className="mb-6 max-w-xs text-sm text-gray-600 md:max-w-none md:text-lg lg:text-xl">
        <span className="block md:inline">
          입력하신 이메일로 인증 메일을 보냈습니다.
        </span>
        <span className="block md:inline">
          메일의 링크를 클릭하여 인증을 완료해주세요.
        </span>
      </p>
      <Button
        asChild
        className="bg-emerald-600 px-5 py-2 text-sm text-white hover:bg-emerald-700 md:px-6 md:py-3 md:text-base lg:text-lg"
      >
        <Link href="/auth/signin">로그인 페이지로 이동</Link>
      </Button>
    </div>
  );
}
