import { parseStringPromise } from "xml2js";
import { PublicDataResponse, PublicDataItem } from "./publicData.type";

export const getHospitalDetailsByName = async (
  name: string,
  addr: string,
  from: "server" | "client" = "client",
): Promise<PublicDataResponse> => {
  // QN 파라미터에 공백 등이 포함될 수 있어 encodeURIComponent 적용
  let query = `serviceKey=${process.env.NEXT_PUBLIC_DATA_GO_KR_API_KEY}&QN=${encodeURIComponent(name)}`;
  if (addr) {
    const splittedAddress = addr.split(" ");
    query += `&Q0=${splittedAddress[0]}`;
    query += `&Q1=${splittedAddress[1]}`;
  }

  let res;
  if (from === "client") {
    res = await fetch(
      `/api/public-data/hospital/getHsptlMdcncListInfoInqire?${query}`,
    );
  } else {
    res = await fetch(
      `${process.env.NEXT_PUBLIC_DATA_HOSPITAL_BASE_URL}/getHsptlMdcncListInfoInqire?${query}`,
    );
  }

  if (!res.ok) {
    throw new Error(
      `공공의료 데이터 API 오류 (국립중앙의료원 병의원 정보): ${await res.text()}`,
    );
  }

  const xmlText = await res.text();
  const jsonData = await parseStringPromise(xmlText, {
    explicitArray: false,
    trim: true,
  });

  const item = jsonData.response?.body?.items?.item;

  if (!item) return null;
  return (Array.isArray(item) ? item[0] : item) as PublicDataItem;
};

export const getPharmacyDetailsByName = async (
  name: string,
  addr: string,
  from: "server" | "client" = "client",
): Promise<PublicDataResponse> => {
  // QN 파라미터에 공백 등이 포함될 수 있어 encodeURIComponent 적용
  let query = `serviceKey=${process.env.NEXT_PUBLIC_DATA_GO_KR_API_KEY}&QN=${encodeURIComponent(name)}`;
  if (addr) {
    const splittedAddress = addr.split(" ");
    query += `&Q0=${splittedAddress[0]}`;
    query += `&Q1=${splittedAddress[1]}`;
  }

  let res;
  if (from === "client") {
    res = await fetch(
      `/api/public-data/pharmacy/getParmacyListInfoInqire?${query}`,
    );
  } else {
    res = await fetch(
      `${process.env.NEXT_PUBLIC_DATA_PHARMACY_BASE_URL}/getParmacyListInfoInqire?${query}`,
    );
  }

  if (!res.ok) {
    throw new Error(
      `공공의료 데이터 API 오류 (국립중앙의료원 약국 정보): ${await res.text()}`,
    );
  }

  const xmlText = await res.text();
  const jsonData = await parseStringPromise(xmlText, {
    explicitArray: false,
    trim: true,
  });

  const item = jsonData.response?.body?.items?.item;

  if (!item) return null;
  return (Array.isArray(item) ? item[0] : item) as PublicDataItem;
};
