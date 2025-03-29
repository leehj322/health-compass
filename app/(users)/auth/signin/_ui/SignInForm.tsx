"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignInForm() {
  const errors = {
    email: {
      message: "에러 메세지",
    },
    password: {
      message: null,
    },
    passwordConfirm: {
      message: null,
    },
  };

  const formError = null;

  return (
    <>
      {formError && (
        <p className="mb-5 h-10 w-full max-w-md rounded-md border border-red-200 bg-red-50 px-4 py-2 text-center text-sm text-red-600">
          {formError}
        </p>
      )}
      <form className="w-full max-w-md space-y-2">
        <div className="space-y-2">
          <Label htmlFor="email" className="mb-3 ml-1 font-bold">
            이메일
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            className="mb-1 h-10 placeholder:text-sm"
          />
          <p className="h-2 text-right text-xs text-red-500">
            {errors.email.message ?? (
              <span className="invisible">placeholder</span>
            )}
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="mb-3 ml-1 font-bold">
            비밀번호
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="비밀번호 입력"
            className="mb-1 h-10 placeholder:text-sm"
          />
          <p className="h-2 text-right text-xs text-red-500">
            {errors.password.message ?? (
              <span className="invisible">placeholder</span>
            )}
          </p>
        </div>
        {/* 일반 가입 버튼 */}
        <Button
          type="submit"
          className="mt-3 h-10 w-full cursor-pointer rounded-md bg-emerald-600 text-sm font-medium text-white hover:bg-emerald-700"
        >
          로그인
        </Button>
      </form>
    </>
  );
}
