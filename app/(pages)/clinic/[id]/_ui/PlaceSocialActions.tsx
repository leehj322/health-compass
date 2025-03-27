"use client";

import { useState } from "react";
import { Heart, Share2 } from "lucide-react";

export default function PlaceSocialActions() {
  const [liked, setLiked] = useState(false);
  const likeCount = 42;

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
        <span className="text-sm">{likeCount}명</span>
      </button>
      <button className="flex cursor-pointer items-center space-x-1">
        <Share2 className="text-gray-500" size={20} />
        <span className="text-sm">공유</span>
      </button>
    </>
  );
}
