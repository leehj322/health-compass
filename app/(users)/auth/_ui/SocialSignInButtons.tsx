"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { errorToast } from "@/lib/ui/toasts";

export default function SocialSignInButtons() {
  const supabase = createClient();
  const handleOAuthSignin = async (provider: "google" | "kakao") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      errorToast(
        `${provider} 로그인 실패`,
        "로그인에 실패하였습니다. 잠시 후 다시 시도해주세요.",
      );
      return;
    }
  };

  return (
    <div className="flex w-full max-w-md gap-4">
      <Button
        type="button"
        variant="outline"
        className="h-10 flex-1 cursor-pointer border-gray-300 text-sm"
        onClick={() => handleOAuthSignin("google")}
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
        onClick={() => handleOAuthSignin("kakao")}
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
