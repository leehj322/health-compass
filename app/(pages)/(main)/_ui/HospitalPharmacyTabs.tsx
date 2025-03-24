import { useMainPageStore } from "@/stores/useMainPageStore";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import HospitalPharmacyCard from "./HospitalPharmacyCard";
import { PlacesByLocationResponse } from "@/lib/api/unifiedLocationApi.type";

interface HospitalPharmacyTabsProps {
  hospitals: PlacesByLocationResponse | undefined;
  pharmacies: PlacesByLocationResponse | undefined;
}

export default function HospitalPharmacyTabs({
  hospitals,
  pharmacies,
}: HospitalPharmacyTabsProps) {
  const { activeTab, setActiveTab } = useMainPageStore();

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-base font-semibold">
          {activeTab === "hospital" ? "병원" : "약국"} 목록
        </h2>
        <span className="text-sm text-gray-500">
          총
          <span className="m-1">
            {activeTab === "hospital"
              ? hospitals?.meta.total_count || 0
              : pharmacies?.meta.total_count || 0}
          </span>
          곳 검색됨
        </span>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as "hospital" | "pharmacy")
        }
      >
        <TabsList className="mb-4 w-full justify-around">
          <TabsTrigger value="hospital" className="cursor-pointer">
            병원
          </TabsTrigger>
          <TabsTrigger value="pharmacy" className="cursor-pointer">
            약국
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hospital">
          {hospitals == null ? (
            <NoFilter />
          ) : hospitals.places.length === 0 ? (
            <NoNearbyPlaces type="hospital" />
          ) : (
            <ul className="space-y-3">
              {hospitals.places.map((hospital) => (
                <HospitalPharmacyCard key={hospital.id} place={hospital} />
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="pharmacy">
          {pharmacies == null ? (
            <NoFilter />
          ) : pharmacies.places.length === 0 ? (
            <NoNearbyPlaces type="pharmacy" />
          ) : (
            <ul className="space-y-3">
              {pharmacies.places.map((pharmacy) => (
                <HospitalPharmacyCard key={pharmacy.id} place={pharmacy} />
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function NoFilter() {
  return (
    <div className="flex h-40 items-center justify-center text-center text-gray-500">
      병원/약국을 검색하거나
      <br />
      위치 정보를 입력해주세요.
    </div>
  );
}

interface NoNearbyPlacesProps {
  type: "hospital" | "pharmacy";
}

function NoNearbyPlaces({ type }: NoNearbyPlacesProps) {
  return (
    <div className="flex h-40 items-center justify-center text-gray-500">
      주변에 {type === "hospital" ? "병원" : "약국"}이 없습니다.
    </div>
  );
}
