import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";

export default function HospitalPharmacyCard() {
  return (
    <li>
      <Link href="/clinic/1">
        <Card className="relative py-3">
          {/* 거리 - 우측 상단 고정 */}
          <span className="text-muted-foreground absolute top-2 right-3 text-sm">
            1.2km
          </span>

          <CardContent className="px-4 py-0">
            {/* 이름 */}
            <CardTitle className="text-base">서울내과의원</CardTitle>

            {/* 주소 */}
            <CardDescription className="text-sm text-gray-500">
              서울 강남구 테헤란로 123
            </CardDescription>

            {/* 전화번호 */}
            <p className="mt-2 text-sm text-gray-700">02-123-4567</p>
          </CardContent>
        </Card>
      </Link>
    </li>
  );
}
