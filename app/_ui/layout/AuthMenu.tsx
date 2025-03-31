"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSignout } from "@/lib/queries/useAuthQueries";
import { ErrorToast } from "@/lib/toasts";
import Image from "next/image";
import Link from "next/link";
import Spinner from "../shared/Spinner";
import { LogIn } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/lib/queries/useUserQueries";
import { QUERY_KEYS } from "@/lib/queries/queryKeys";
import { UserProfile } from "@/lib/api/user/user.type";

export default function AuthMenu() {
  const { data } = useUser();

  return (
    <>
      {data?.user ? (
        <div
          title="유저 메뉴"
          aria-label="유저 메뉴"
          className="flex items-center justify-center pl-1"
        >
          <ProfileMenu profile={data.profile} />
        </div>
      ) : (
        <Link href="/auth/signin" title="로그인" aria-label="로그인">
          <LogIn size={20} />
        </Link>
      )}
    </>
  );
}

interface ProfileMenuProps {
  profile: UserProfile | null;
}

function ProfileMenu({ profile }: ProfileMenuProps) {
  const queryClient = useQueryClient();
  const { mutate: signOut, isPending } = useSignout();

  const handleSignOut = () => {
    signOut(undefined, {
      onSuccess: () => {
        // 즉시 UI 반영을 위해 user 데이터를 null로 캐싱
        queryClient.setQueryData(QUERY_KEYS.user.all, {
          user: null,
          profile: null,
        });

        // 최신 상태 유지를 위해 user 쿼리 무효화하여 서버에서 다시 fetch
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user.all });
      },
      onError: (error) => {
        ErrorToast("로그아웃 실패", error.message);
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="메뉴 열기"
        disabled={isPending}
        className="relative cursor-pointer"
      >
        <Image
          src={profile?.avatar_url || "/default-profile.png"}
          alt="프로필 이미지"
          width={32}
          height={32}
          className="rounded-full object-cover object-center"
        />
        {/* 로그아웃 로딩 스피너 */}
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-white/60">
            <Spinner className="h-4 w-4" />
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="end"
        className="w-40 rounded-xl border bg-white py-2 shadow-lg"
      >
        <DropdownMenuItem asChild>
          <Link
            className="block w-full cursor-pointer rounded-md px-3 py-2 text-sm font-medium hover:bg-emerald-50"
            href="/mypage"
          >
            내 정보 관리
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <button
            onClick={handleSignOut}
            className="block w-full cursor-pointer rounded-md px-3 py-2 text-sm font-medium hover:bg-emerald-50"
          >
            로그아웃
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
