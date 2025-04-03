import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import { formatDistance } from "@/utils/formatDistance";
import { PlaceWithDetails } from "@/lib/api/unifiedLocationApi.type";
import { buildPlaceDetailQuery } from "@/utils/buildQueryString";

interface HospitalPharmacyCardProps {
  place: PlaceWithDetails;
}

export default function HospitalPharmacyCard({
  place,
}: HospitalPharmacyCardProps) {
  const query = buildPlaceDetailQuery(place);

  return (
    <li>
      <Link href={`/detail/${place.id}?${query}`}>
        <Card className="relative py-3">
          <span className="text-muted-foreground absolute top-2 right-3 text-sm">
            {formatDistance(Number(place.distance)) || "? m"}
          </span>
          <CardContent className="px-4 py-0">
            <CardTitle className="text-base">
              {place.place_name || "이름 정보를 불러올 수 없습니다"}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              {place.road_address_name || "주소 정보를 불러올 수 없습니다"}
            </CardDescription>
            <p className="mt-2 text-sm text-gray-700">
              {place.phone || "전화 번호를 불러올 수 없습니다"}
            </p>
          </CardContent>
        </Card>
      </Link>
    </li>
  );
}
