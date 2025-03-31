import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.signOut();

    if (!error) return NextResponse.json({ success: true });

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 },
    );
  } catch (error) {
    console.error("로그아웃 에러: ", error);

    return NextResponse.json(
      {
        success: false,
        code: "SERVER_ERROR",
        message: "네트워크 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
      },
      { status: 500 },
    );
  }
}
