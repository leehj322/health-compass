import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

export default function CommentActionDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 hover:cursor-pointer"
        >
          <MoreVertical className="text-gray-500" size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-20" side="bottom" align="end">
        <DropdownMenuItem
          className="flex items-center justify-center hover:cursor-pointer"
          onClick={() => console.log("수정")}
        >
          수정
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center justify-center hover:cursor-pointer"
          onClick={() => console.log("삭제")}
        >
          삭제
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
