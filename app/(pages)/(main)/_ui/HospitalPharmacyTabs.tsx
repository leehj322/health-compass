import { useMainPageStore } from "@/stores/useMainPageStore";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import HospitalPharmacyCard from "./HospitalPharmacyCard";

export default function HospitalPharmacyTabs() {
  const { activeTab, setActiveTab } = useMainPageStore();

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-base font-semibold">
          {activeTab === "hospital" ? "병원" : "약국"} 목록
        </h2>
        <span className="text-sm text-gray-500">총 0 곳 검색됨</span>
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
          <ul className="space-y-3">
            <HospitalPharmacyCard />
            <HospitalPharmacyCard />
            <HospitalPharmacyCard />
            <HospitalPharmacyCard />
            <HospitalPharmacyCard />
          </ul>
        </TabsContent>

        <TabsContent value="pharmacy">
          <ul className="space-y-3">
            <HospitalPharmacyCard />
          </ul>
        </TabsContent>
      </Tabs>
    </div>
  );
}
