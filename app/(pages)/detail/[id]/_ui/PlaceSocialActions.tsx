"use client";

import { useState } from "react";
import { Heart, Share2 } from "lucide-react";
import { useUser } from "@/lib/queries/useUserQueries";
import { usePlaceLikes } from "@/lib/queries/usePlaceLikesQueries";

interface PlaceSocialActionsProps {
  placeId: string;
}

export default function PlaceSocialActions({
  placeId,
}: PlaceSocialActionsProps) {
  const [liked, setLiked] = useState(false);

  const {
    data: { user },
  } = useUser();

  const { data: likesData } = usePlaceLikes(placeId, user?.id);

  return (
    <>
      <button
        onClick={() => setLiked(!liked)}
        className="flex cursor-pointer items-center space-x-1"
      >
        <Heart
          className={
            liked ? "fill-emerald-600 text-emerald-600" : "text-gray-400"
          }
          size={20}
        />
        <span className="text-sm">{likesData?.likeCount || 0} 명</span>
      </button>
      <button className="flex cursor-pointer items-center space-x-1">
        <Share2 className="text-gray-500" size={20} />
        <span className="text-sm">공유</span>
      </button>
    </>
  );
}
