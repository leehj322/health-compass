import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="border-b p-4">
      <div className="flex gap-2">
        <Input placeholder="병원 또는 약국 이름 / 주소" className="flex-1" />
        <Button variant="default" className="cursor-pointer">
          <Search className="mr-1" size={16} />
          검색
        </Button>
      </div>
    </div>
  );
}
