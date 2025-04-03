import { useGeoLocationStore } from "@/stores/useGeoLocation";
import { useEffect, useState } from "react";
import { errorToast } from "@/lib/ui/toasts";

export function useCurrentLocation() {
  const { geoLocation, setGeoLocation } = useGeoLocationStore();
  const [isAutoLoaded, setIsAutoLoaded] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      errorToast("이 브라우저는 위치 정보를 제공하지 않습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (success) => {
        if (success.coords.accuracy < 100) {
          const { latitude, longitude } = success.coords;
          setGeoLocation({ lat: latitude, lng: longitude });
          setIsAutoLoaded(true);
        } else {
          errorToast(
            "위치 정보가 올바르지 않습니다.",
            "내 주변 찾기 버튼을 눌러 등록할 수 있습니다.",
          );
        }
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          errorToast(
            "위치 정보 제공을 승인하지 않았습니다.",
            "내 주변 찾기 버튼을 눌러 등록할 수 있습니다.",
          );
        } else {
          errorToast(
            "위치 정보 설정 실패",
            "내 주변 찾기 버튼을 눌러 등록할 수 있습니다.",
          );
        }
      },
    );
  }, []);

  return { geoLocation, setGeoLocation, isAutoLoaded };
}
