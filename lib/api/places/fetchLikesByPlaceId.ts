import { createClient } from "@/lib/supabase/server";
import { PlaceLikesResponse } from "./placeLikes.type";

export async function fetchLikesByPlaceId(
  placeId: string,
  accountId?: string,
): Promise<PlaceLikesResponse> {
  const supabase = await createClient();

  const { count: likeCount, error: countError } = await supabase
    .from("place_likes")
    .select("*", { head: true, count: "exact" })
    .eq("place_id", placeId);

  if (countError && !(countError.message === "")) {
    return {
      success: false,
      code: "SERVER_ERROR",
      message: countError.message,
    };
  }

  let hasLiked = false;

  if (accountId) {
    const { data, error: statusError } = await supabase
      .from("place_likes")
      .select("*")
      .eq("place_id", placeId)
      .eq("account_id", accountId)
      .maybeSingle();

    if (statusError) {
      return {
        success: false,
        code: "SERVER_ERROR",
        message: statusError.message,
      };
    }

    hasLiked = !!data;
  }

  return { success: true, likeCount, hasLiked };
}
