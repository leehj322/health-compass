"use client";

import { useState } from "react";
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

export default function AddressSearchModal({}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [query, setQuery] = useState("");
  const similarAddresses: string[] | null = [];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="flex-1 hover:cursor-pointer">
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
                className="pl-8"
              />
            </div>
            <Button
              variant="default"
              className="cursor-pointer"
              onClick={() => setQuery(searchValue)}
            >
              <Search className="mr-1" size={16} />
              검색
            </Button>
          </div>
        </div>

        {/* 유사한 주소 리스트 */}
        <div className="max-h-40 space-y-2 overflow-y-auto">
          {similarAddresses == null ? (
            <SearchPlaceholder />
          ) : similarAddresses.length === 0 ? (
            <NoSearchResult />
          ) : (
            <ul>
              {similarAddresses.map((addr, idx) => (
                // key = idx는 임시
                <AddressSelectButton key={idx} onClick={() => setIsOpen(false)}>
                  {addr}
                </AddressSelectButton>
              ))}
            </ul>
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

type AddressSelectButtonProps = Omit<
  React.ComponentProps<"button">,
  "className"
>;

function AddressSelectButton({ children, ...props }: AddressSelectButtonProps) {
  return (
    <li>
      <button
        {...props}
        className="border-muted w-full border-b px-2 py-3 text-left text-sm transition hover:cursor-pointer hover:bg-emerald-50"
      >
        {children}
      </button>
    </li>
  );
}
