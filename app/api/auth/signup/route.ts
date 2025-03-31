import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClient();

  const { email, password } = await req.json();

  try {
    const { data, error } = await supabase.auth.signUp({ email, password });

    // 에러가 발생하지 않는 경우 (프로필 생성)
    if (!error) {
      if (!data.user) {
        return NextResponse.json(
          {
            success: false,
            code: "USER_NOT_EXIST",
            message: "유저가 정보를 받아올 수 없습니다.",
          },
          { status: 400 },
        );
      }

      const nickname = "user_" + Math.random().toString(36).substring(2, 6);

      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        nickname,
        role: "user",
      });

      // 프로필 등록 에러 처리
      if (profileError) {
        console.error("프로필 생성 실패:", profileError);

        await supabaseAdmin.auth.admin.deleteUser(data.user.id);

        return NextResponse.json(
          {
            success: false,
            code: "PROFILE_INSERT_ERROR",
            message: "프로필 생성 중 오류가 발생했습니다.",
          },
          { status: 500 },
        );
      }

      return NextResponse.json({ success: true });
    }

    // 회원가입 중 에러 처리
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

    // EMAIL_RATE_LIMIT_EXCEEDED: 이메일을 너무 자주 전송하는 경우
    // 회원가입 요청이 너무 잦아서 이메일이 자주 전송되는 경우 발생
    if (error.message.includes("email rate limit exceeded")) {
      code = "EMAIL_RATE_LIMIT_EXCEEDED";
      message = "이메일 전송이 잦습니다. 잠시 기다려주세요.";
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

    console.error("회원가입 에러: ", error.message);

    return NextResponse.json(
      { success: false, code, message },
      { status: 400 },
    );
  } catch (error) {
    console.error("회원가입 에러: ", error);

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
