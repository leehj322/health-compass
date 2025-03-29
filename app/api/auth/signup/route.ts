import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClient();

  const { email, password } = await req.json();

  try {
    const { error } = await supabase.auth.signUp({ email, password });

    if (!error) return NextResponse.json({ success: true });

    // UNKNOWN_ERROR: 기본 에러 코드 및 메시지 (아래 조건에 해당하지 않는 경우)
    let code = "UNKNOWN_ERROR";
    let message = error.message;

    // USER_ALREADY_EXISTS: 이미 가입된 이메일인 경우
    // 이메일 인증을 비활성화한 상태에서 중복 이메일 가입 시 발생
    if (error.message.includes("User already registered")) {
      code = "USER_ALREADY_EXISTS";
      message = "이미 가입된 이메일입니다.";
    }

    // EMAIL_RESEND_RATE_LIMIT: 인증 이메일 재전송 제한 에러
    // 이메일 인증이 활성화된 상태에서 같은 이메일로 반복 가입 요청 시 발생
    if (
      error.message.includes(
        "For security purposes, you can only request this after",
      )
    ) {
      const match = error.message.match(/after (\d+) seconds/);
      const waitSeconds = match?.[1];

      code = "EMAIL_RESEND_RATE_LIMIT";
      message = "잠시 후에 다시 시도해주세요.";

      if (waitSeconds) {
        message += ` (${waitSeconds}초)`;
      }
    }

    // INVALID_EMAIL_FORMAT: 이메일 형식이 유효하지 않은 경우
    // 이메일이 아니거나, @email.com 같은 유효하지 않은 도메인인 경우 발생
    if (
      error.message.includes("Email address") &&
      error.message.includes("is invalid")
    ) {
      code = "INVALID_EMAIL_FORMAT";
      message = "유효한 이메일 형식이 아닙니다.";
    }

    return NextResponse.json(
      { success: false, code, message },
      { status: 400 },
    );
  } catch (_) {
    return NextResponse.json(
      {
        success: false,
        code: "SERVER_ERROR",
        message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      },
      { status: 500 },
    );
  }
}
