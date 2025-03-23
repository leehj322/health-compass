import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import { formatDistance } from "@/utils/formatDistance";
import { PlaceWithDetails } from "@/lib/api/getPlacesByLocation";

interface HospitalPharmacyCardProps {
  place: PlaceWithDetails;
}

export default function HospitalPharmacyCard({
  place,
}: HospitalPharmacyCardProps) {
  return (
    <li>
      <Link href={`/clinic/${place.id}`}>
        <Card className="relative py-3">
          <span className="text-muted-foreground absolute top-2 right-3 text-sm">
            {formatDistance(Number(place.distance))}
          </span>
          <CardContent className="px-4 py-0">
            <CardTitle className="text-base">{place.place_name}</CardTitle>
            <CardDescription className="text-sm text-gray-500">
              {place.road_address_name}
            </CardDescription>
            <p className="mt-2 text-sm text-gray-700">{place.phone}</p>
          </CardContent>
        </Card>
      </Link>
    </li>
  );
}
