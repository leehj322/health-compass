export interface Address {
  address_name: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
  region_3depth_h_name?: string;
  mountain_yn: "Y" | "N";
  main_address_no: string;
  sub_address_no: string;
}

export interface RoadAddress {
  address_name: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
  road_name: string;
  underground_yn: "Y" | "N";
  main_building_no: string;
  sub_building_no: string;
  building_name: string;
  zone_no: string;
}

export interface LocationSearchResultByAddress {
  address_name: string;
  address_type: string;
  x: string;
  y: string;
  address: Address | null;
  road_address: RoadAddress | null;
}

export interface PlaceDocumentSummary {
  road_address_name: string;
  category_name: string;
  distance: string;
  id: string;
  phone: string;
  place_name: string;
  place_url: string;
  x: string;
  y: string;
}

export interface Meta {
  is_end: boolean;
  pageable_count: number;
  total_count: number;
  same_name?: {
    region: string[];
    keyword: string;
    selected_region: string;
  } | null;
}

export interface LocationByAddressResponse {
  documents: LocationSearchResultByAddress[];
  meta: Meta;
}

export interface PlacesByKeywordResponse {
  documents: PlaceDocumentSummary[];
  meta: Meta;
}
