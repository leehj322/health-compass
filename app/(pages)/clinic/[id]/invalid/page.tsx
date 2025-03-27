import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldX } from "lucide-react";

export default function InvalidDetailPage() {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center bg-white px-4 text-center">
      <ShieldX className="mb-4 h-12 w-12 text-emerald-600 md:h-20 md:w-20 lg:h-24 lg:w-24" />
      <h1 className="mb-3 text-lg font-bold text-gray-900 md:text-3xl lg:text-4xl">
        유효하지 않은 장소 정보입니다
      </h1>
      <p className="mb-6 max-w-xs text-sm text-gray-600 md:max-w-none md:text-lg lg:text-xl">
        <span className="block md:inline">장소 정보가 존재하지 않거나,</span>
        <span className="block md:inline">잘못된 링크로 접근하셨습니다.</span>
      </p>
      <Button
        asChild
        className="bg-emerald-600 px-5 py-2 text-sm text-white hover:bg-emerald-700 md:px-6 md:py-3 md:text-base lg:text-lg"
      >
        <Link href="/">홈으로 돌아가기</Link>
      </Button>
    </div>
  );
}
