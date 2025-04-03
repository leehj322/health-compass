"use client";

import { useEffect } from "react";
import { QUERY_KEYS } from "@/lib/queries/queryKeys";
import { createClient } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { errorToast } from "@/lib/ui/toasts";
import { useRouter } from "next/navigation";
import Spinner from "@/app/_ui/shared/Spinner";

export default function OAuthCallbackPage() {
  const queryClient = useQueryClient();
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (!user || error) {
          errorToast("로그인 실패", "유저 정보를 불러올 수 없습니다.");
          return;
        }

        const nickname = "user_" + Math.random().toString(36).substring(2, 6);

        const { error: profileError } = await supabase.from("profiles").insert({
          id: user.id,
          nickname,
          role: "user",
        });

        if (
          profileError &&
          !profileError.message.includes(
            "duplicate key value violates unique constraint",
          )
        ) {
          console.error(profileError);
          errorToast(
            "프로필 생성 실패",
            "유저 프로필 생성 중 오류가 발생했습니다.",
          );
          return;
        }
      } finally {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user.all });
        router.replace("/");
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="flex h-[calc(100vh-5rem)] items-center justify-center">
      <Spinner />
    </div>
  );
}
