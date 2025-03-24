const CATEGORY_CODE = {
  hospital: "HP8",
  pharmacy: "PM9",
};

export const getPlaceByCategory = async (
  lat: number,
  lng: number,
  radius: number,
  page: number,
  category: "hospital" | "pharmacy",
) => {
  const categoryCode = CATEGORY_CODE[category];

  const query = `category_group_code=${categoryCode}&x=${lng}&y=${lat}&radius=${radius}&size=10&page=${page}&sort=distance`;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_KAKAO_LOCAL_BASE_URL}/search/category.json?${query}`,
      {
        headers: {
          Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}`,
        },
      },
    );

    if (!res.ok) {
      throw new Error(`Kakao API Error ${res.status}: ${res.text()}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error(
      `${category === "hospital" ? "병원" : "약국"} 정보 불러오기 실패: ${(error as Error).message}`,
    );
  }
};

export const getLocationByAddress = async (search: string, page: number) => {
  const query = `query=${search}`;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_KAKAO_LOCAL_BASE_URL}/search/address.json?${query}&page=${page}`,
      {
        headers: {
          Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}`,
        },
      },
    );

    if (!res.ok) {
      throw new Error(`Kakao API Error ${res.status}: ${res.text()}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error(`주소 검색하기 실패: ${(error as Error).message}`);
  }
};
