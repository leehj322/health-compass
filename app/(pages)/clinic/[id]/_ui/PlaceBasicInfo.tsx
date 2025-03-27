import Link from "next/link";
import { PlaceWithDetails } from "@/lib/api/unifiedLocationApi.type";

interface PlaceBasicInfoProps {
  placeData: PlaceWithDetails;
}

export default function PlaceBasicInfo({ placeData }: PlaceBasicInfoProps) {
  const infoList = [
    { label: "분류", value: placeData.category_name },
    { label: "주소", value: placeData.road_address_name },
    { label: "전화번호", value: placeData.phone },
    { label: "거리", value: `${placeData.distance}m` },
    { label: "웹사이트", value: `${placeData.place_url}m` },
  ];

  return (
    <>
      <h2 className="pb-2 text-2xl font-bold text-emerald-600">
        {placeData.place_name}
      </h2>
      {infoList.map((item) => (
        <p key={item.label} className="text-sm text-gray-600">
          <span className="mr-1 font-medium text-gray-800">{item.label}:</span>
          {item.label === "웹사이트" ? (
            <Link
              href={placeData.place_url}
              target="_blank"
              className="text-emerald-600 underline"
            >
              바로가기
            </Link>
          ) : (
            item.value
          )}
        </p>
      ))}
    </>
  );
}
