import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClient();

  const { email, password } = await req.json();

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) return NextResponse.json({ success: true });

    // UNKNOWN_ERROR: 기본 에러 코드 및 메시지 (아래 조건에 해당하지 않는 경우)
    let code = "UNKNOWN_ERROR";
    let message = error.message;

    // INVALID_CREDENTIALS: 이메일 혹은 비밀번호가 유효하지 않은 경우
    // 회원가입을 하지 않았거나, 이메일 또는 비밀번호가 잘못된 경우 발생
    if (error.message.includes("Invalid login credentials")) {
      code = "INVALID_CREDENTIALS";
      message = "이메일이나 비밀번호가 잘못되었습니다.";
    }

    // EMAIL_NOT_CONFIRMED: 이메일이 아직 인증되지 않은 경우
    // 회원가입은 하였으나 이메일 인증을 하지 않은 경우 발생
    if (error.message.includes("Email not confirmed")) {
      code = "EMAIL_NOT_CONFIRMED";
      message = "이메일 인증이 완료되지 않았습니다.";
    }

    return NextResponse.json(
      { success: false, code, message },
      { status: 400 },
    );
  } catch (error) {
    console.error("로그인 에러: ", error);

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
