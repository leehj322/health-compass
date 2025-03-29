import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function SocialSignInButtons() {
  return (
    <div className="flex w-full max-w-md gap-4">
      <Button
        type="button"
        variant="outline"
        className="h-10 flex-1 cursor-pointer border-gray-300 text-sm"
      >
        <Image
          src="/icons/google-login.png"
          alt="구글 로그인"
          width={24}
          height={24}
        />
        <span className="inline sm:hidden">Google</span>
        <span className="hidden sm:inline">Google 계정으로 로그인</span>
      </Button>
      <Button
        type="button"
        variant="outline"
        className="h-10 flex-1 cursor-pointer border border-gray-300 text-sm"
      >
        <Image
          src="/icons/kakao-login.png"
          alt="카카오 로그인"
          width={24}
          height={24}
        />
        <span className="inline sm:hidden">Kakao</span>
        <span className="hidden sm:inline">Kakao 계정으로 로그인</span>
      </Button>
    </div>
  );
}
