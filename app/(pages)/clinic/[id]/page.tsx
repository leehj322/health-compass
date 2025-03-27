import KakaoMap from "./_ui/KakaoMap";
import PlaceBasicInfo from "./_ui/PlaceBasicInfo";
import PlaceHoursToggle from "./_ui/PlaceHoursToggle";
import PlaceSocialActions from "./_ui/PlaceSocialActions";
import CommentForm from "./_ui/CommentForm";
import CommentList from "./_ui/CommentList";

export default function PlaceDetailPage() {
  const dummyData = {
    x: "126.97637277",
    y: "37.5716486",
    id: "123123123123",
    place_name: "스타벅스 강남점",
    category_name: "카페",
    category_group_code: "HP8",
    road_address_name: "서울특별시 강남구 테헤란로 10",
    phone: "02-1234-5678",
    distance: "150",
    place_url: "http://place.map.kakao.com/12345678",
    details: {
      dutyTime1s: "0900",
      dutyTime1c: "1800",
      dutyTime2s: "0900",
      dutyTime2c: "1800",
      dutyTime3s: "0900",
      dutyTime3c: "1800",
      dutyTime4s: "0900",
      dutyTime4c: "1800",
      dutyTime5s: "0900",
      dutyTime5c: "1700",
      dutyTime6s: "0900",
      dutyTime6c: "1400",
      dutyTime8s: "0900",
      dutyTime8c: "1400",
    },
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      {/* 상단 레이아웃: 지도 + 장소 정보 */}
      <div className="grid gap-4 md:grid-cols-2">
        <KakaoMap placeData={dummyData} />

        <div className="flex flex-col justify-between rounded-xl bg-gray-50 p-4 shadow md:min-h-72">
          <div className="space-y-1">
            <PlaceBasicInfo placeData={dummyData} />
            <PlaceHoursToggle placeData={dummyData} />
          </div>
          <div className="flex items-center justify-end space-x-4">
            <PlaceSocialActions />
          </div>
        </div>
      </div>

      {/* 하단 레이아웃: 댓글 작성 및 댓글 리스트 */}
      <CommentForm />
      <CommentList />
    </div>
  );
}
