"use client";

import { useEffect, useState } from "react";
import { Heart, Share2 } from "lucide-react";
import { useUser } from "@/lib/queries/useUserQueries";
import {
  usePlaceLikeMutation,
  usePlaceLikes,
  usePlaceUnlikeMutation,
} from "@/lib/queries/usePlaceLikesQueries";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/queries/queryKeys";
import { ErrorToast } from "@/lib/toasts";

interface PlaceSocialActionsProps {
  placeId: string;
}

export default function PlaceSocialActions({
  placeId,
}: PlaceSocialActionsProps) {
  const queryClient = useQueryClient();

  const {
    data: { user },
  } = useUser();

  const { data: likesData } = usePlaceLikes(placeId, user?.id);

  const [liked, setLiked] = useState(likesData?.hasLiked ?? false);
  const [likeCount, setLikeCount] = useState(likesData?.likeCount ?? 0);

  useEffect(() => {
    if (likesData && likesData.likeCount) {
      setLiked(likesData.hasLiked);
      setLikeCount(likesData.likeCount);
    }
  }, [likesData]);

  const { mutate: postLike } = usePlaceLikeMutation();
  const { mutate: deleteLike } = usePlaceUnlikeMutation();

  const handleLikeButtonClick = () => {
    if (!user) {
      ErrorToast("로그인이 필요한 기능입니다.");
      return;
    }

    const optimisticLiked = !liked; // true: post like | false: delete like

    // 낙관적 업데이트
    setLiked(optimisticLiked);
    setLikeCount((prev) => (optimisticLiked ? prev + 1 : prev - 1));

    const onSuccess = () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.likes.byPlaceId(placeId, user?.id),
      });
    };

    // 실패 시 낙관적 업데이트 롤백
    const onError = () => {
      setLiked((prev) => !prev);
      setLikeCount((prev) => (optimisticLiked ? prev - 1 : prev + 1));
    };

    if (optimisticLiked) {
      postLike(placeId, { onSuccess, onError });
    } else {
      deleteLike(placeId, { onSuccess, onError });
    }
  };

  return (
    <>
      <button
        onClick={handleLikeButtonClick}
        className="flex cursor-pointer items-center space-x-1"
      >
        <Heart
          className={
            liked ? "fill-emerald-600 text-emerald-600" : "text-gray-400"
          }
          size={20}
        />
        <span className="text-sm">{likeCount} 명</span>
      </button>
      <button className="flex cursor-pointer items-center space-x-1">
        <Share2 className="text-gray-500" size={20} />
        <span className="text-sm">공유</span>
      </button>
    </>
  );
}
