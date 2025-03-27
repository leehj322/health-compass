import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function CommentForm() {
  return (
    <Card className="border-emerald-600 py-0">
      <CardContent className="space-y-2 p-4">
        <p className="font-semibold text-emerald-600">댓글 작성</p>
        <Textarea
          placeholder="댓글을 입력하세요..."
          className="resize-none overflow-hidden text-sm"
        />
        <Button className="ml-auto flex w-24 cursor-pointer bg-emerald-600 text-white hover:bg-emerald-700">
          등록
        </Button>
      </CardContent>
    </Card>
  );
}
