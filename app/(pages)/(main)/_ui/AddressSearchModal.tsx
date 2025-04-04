"use client";

import React, { useEffect, useRef, useState } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Search } from "lucide-react";
import { useLocationByAddress } from "@/lib/queries/useLocationByAddress";
import { useGeoLocationStore } from "@/stores/useGeoLocation";
import { cn } from "@/lib/utils";
import { useMainPageStore } from "@/stores/useMainPageStore";
import Spinner from "@/app/_ui/shared/Spinner";

export default function AddressSearchModal({}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [query, setQuery] = useState("");
  const { isSearchMode, setIsSearchMode } = useMainPageStore();
  const { setGeoLocation } = useGeoLocationStore();

  // 무한 스크롤 로직
  const infiniteScrollTriggerRef = useRef<HTMLDivElement | null>(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useLocationByAddress(query);
  const pages = data?.pages;

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    if (!infiniteScrollTriggerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.8 },
    );

    observer.observe(infiniteScrollTriggerRef.current);

    return () => {
      if (infiniteScrollTriggerRef.current) {
        observer.unobserve(infiniteScrollTriggerRef.current);
      }
    };
    // 제일 첫 페이지에서는 hasNextPage가 바뀔때 observer를 등록
    // isFetchingNextPage가 바뀔때 마다 observer를 바꿈
  }, [hasNextPage, isFetchingNextPage]);

  const handleSubmitSearchInput = (
    e: React.MouseEvent | React.KeyboardEvent,
  ) => {
    const isKeyboardEvent = "key" in e;
    if (isKeyboardEvent && e.key !== "Enter") return;

    setQuery(searchValue);
    setSearchValue("");
  };

  const handleAddressSelected = (x: string, y: string) => {
    setGeoLocation({ lat: Number(x), lng: Number(y) });
    setIsSearchMode(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className={cn(
            "flex-1 hover:cursor-pointer",
            !isSearchMode && "border border-emerald-600 text-emerald-600",
          )}
        >
          <MapPin className="mr-1" size={16} />내 주변 찾기
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>내 주소 검색</DialogTitle>
          <DialogDescription asChild>
            <VisuallyHidden>
              도로명 주소 또는 지번을 검색하고 내 주소를 선택하세요.
            </VisuallyHidden>
          </DialogDescription>
        </DialogHeader>

        {/* 검색 인풋 + 버튼 */}
        <div className="border-b pb-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search
                className="absolute top-1/2 left-2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <Input
                placeholder="도로명 주소 또는 지번을 입력하세요"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleSubmitSearchInput}
                className="pl-8"
              />
            </div>
            <Button
              variant="default"
              className="cursor-pointer"
              onClick={handleSubmitSearchInput}
            >
              <Search className="mr-1" size={16} />
              검색
            </Button>
          </div>
        </div>

        {/* 주소 검색 결과 */}
        <div className="max-h-40 space-y-2 overflow-y-auto">
          {pages == null ? (
            <SearchPlaceholder />
          ) : pages[0].documents.length === 0 ? (
            <NoSearchResult />
          ) : (
            <>
              <ul>
                {pages
                  .flatMap((page) => page.documents)
                  .map((similarAddress) => (
                    <button
                      key={similarAddress.address_name}
                      onClick={() =>
                        handleAddressSelected(
                          similarAddress.y,
                          similarAddress.x,
                        )
                      }
                      className="border-muted w-full border-b px-2 py-3 text-left text-sm transition hover:cursor-pointer hover:bg-emerald-50"
                    >
                      {similarAddress.address_name}
                    </button>
                  ))}
              </ul>
              {/* 조건부 렌더링 (데이터 로딩중: Spinner, 다음페이지 있음: 빈 여백) */}
              {isFetchingNextPage ? (
                <Spinner className="mx-auto mt-2" />
              ) : hasNextPage ? (
                <div ref={infiniteScrollTriggerRef} className="mt-2 h-6" />
              ) : null}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SearchPlaceholder() {
  return (
    <div className="text-muted-foreground py-4 text-center text-sm">
      도로명 주소를 입력해주세요.
      <br />
      예) 백범로 10길 8, 세종대로 172
    </div>
  );
}

function NoSearchResult() {
  return (
    <div className="text-muted-foreground py-4 text-center text-sm">
      검색 결과가 없습니다.
    </div>
  );
}
