import { useGeoLocationStore } from "@/stores/useGeoLocation";
import { useEffect } from "react";

export default function useCurrentLocation() {
  const { geoLocation, setGeoLocation } = useGeoLocationStore();

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("이 브라우저는 위치 정보를 지원하지 않습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (success) => {
        console.log("사용자가 위치 정보를 허용했습니다.");
        if (success.coords.accuracy < 100) {
          const { latitude, longitude } = success.coords;
          setGeoLocation({ lat: latitude, lng: longitude });
        } else {
          console.log("위치 정보가 정확하지 않습니다 직접 입력 해주세요.");
        }
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          console.log("사용자가 위치 정보 제공을 거부했습니다.");
        } else {
          console.log("위치 정보를 가져오는 중 오류 발생:", error.message);
        }
      },
    );
  }, []);
}
