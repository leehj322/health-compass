import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";
import { useMainPageStore } from "@/stores/useMainPageStore";
import { useGeoLocationStore } from "@/stores/useGeoLocation";

export default function SearchBar() {
  const [searchValue, setSearchValue] = useState("");
  const { setFilterGroups, map, setIsSearchMode } = useMainPageStore();
  const { setGeoLocation } = useGeoLocationStore();

  const handleSubmitSearchInput = (
    e: React.MouseEvent | React.KeyboardEvent,
  ) => {
    const isKeyboardEvent = "key" in e;
    if (isKeyboardEvent && e.key !== "Enter") return;

    setIsSearchMode(true);

    // KakaoMap ref를 통해 현재 보여지는 지도의 중앙을 현재 위치 정보로 설정하고 검색
    if (map.ref) {
      const center = map.ref.getCenter();
      setGeoLocation({ lat: center.getLat(), lng: center.getLng() });
    }
    setFilterGroups("query", searchValue.trim());

    setSearchValue("");
  };

  return (
    <div className="border-b p-4">
      <div className="flex gap-2">
        <Input
          value={searchValue}
          placeholder="병원/약국에 대한 정보 (이름, 진료과 등..)을 입력하세요"
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleSubmitSearchInput}
          className="flex-1"
        />
        <Button
          variant="default"
          onClick={handleSubmitSearchInput}
          className="cursor-pointer"
        >
          <Search className="mr-1" size={16} />
          검색
        </Button>
      </div>
    </div>
  );
}
