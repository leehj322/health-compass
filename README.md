# 건강 나침반

> Next.js를 기반으로 사용자들에게 가까운 병원과 약국 검색 기능을 제공하고, 정보를 나눌 수 있는 커뮤니티 사이트입니다.

## 개발 기간

2025년 3월 14일 ~ 2025년 4월 4일 (총 3주)

## 기술 스택

### 주요스택

<img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white"> <img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"> <img src="https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white"> <img src="https://img.shields.io/badge/tailwind_css-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"> <img src="https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white"> <img src="https://img.shields.io/badge/zustand-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB"> <img src="https://img.shields.io/badge/tanstack_query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white"> <img src="https://img.shields.io/badge/zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white"> <img src="https://img.shields.io/badge/supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white">

### 기타

<img src="https://img.shields.io/badge/lucide_react-F56565?style=for-the-badge&logo=lucide&logoColor=white"> <img src="https://img.shields.io/badge/react_hook_form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white"> <img src="https://img.shields.io/badge/react_kakao_maps_sdk-FFCD00?style=for-the-badge&logo=kakaotalk&logoColor=white"> <img src="https://img.shields.io/badge/xml2js-005FAD?style=for-the-badge&logo=xml&logoColor=white"> <img src="https://img.shields.io/badge/sonner-%2320232a?style=for-the-badge&logo=react&logoColor=%2361DAFB">

➕ 카카오 로컬 API 및 공공 데이터 API (병원 및 약국 정보)

## 주요 기능

### 1. 메인 페이지

- 병원 및 약국 정보 검색 시 지도를 기준으로 주변 병원 또는 약국을 검색합니다.
- 내 위치 정보 제공 동의 또는 내 주변 찾기 버튼을 눌러 주소를 입력 시, 주변 병원 및 약국을 자동 검색합니다.
- 필터 기능을 활용하여 더 먼거리 또는 영업 시간 및 일자에 따라 필터링할 수 있습니다.

![메인페이지](https://github.com/user-attachments/assets/421addf9-78bf-4532-a482-4a588322d071)

### 2. 상세 페이지

- 지도에서 검색한 병원 및 약국 카드 또는 맵의 마커를 클릭하여 상세 페이지에서 확인할 수 있습니다.
- 장소에 하트를 좋아요를 등록할 수 있습니다.
- 댓글 또는 답글을 작성하고 내 댓글을 제거 및 수정할 수 있습니다.

![상세 페이지](https://github.com/user-attachments/assets/cbd73ea8-1e43-49bd-aa37-593f86f91561)

### 3. 로그인 및 회원가입 페이지

- 이메일과 비밀번호를 이용한 회원가입이 가능합니다.
- 이메일로 로그인 하는 경우 이메일 인증 페이지로 이동합니다. (현재는 SMTP 설정 해제하여 이메일 인증 기능 비활성화)
- 구글 및 카카오 OAuth 로그인/회원가입 기능을 제공합니다.

![회원가입](https://github.com/user-attachments/assets/9a6b655a-ec73-44ba-afe9-dde1c3346fbb)
![이메일 인증](https://github.com/user-attachments/assets/60a0c3dc-57e7-454d-a773-1641410714fa)

## 트러블 슈팅

### 초기 검색 시 위치 정보 누락 및 ref 타이밍 이슈

- 문제 발생

1. 검색 실행 시 `geoLocation` 값이 `undefined`
2. 이로 인해, `useInfiniteQuery`의 `enabled` 조건이 충족되지 않아 검색 쿼리가 실행되지 않음

- 해결 방법

1. `mapRef.current`가 초기 마운트 시점에는 `null`로 설정되었고, `useEffect`를 트리거 하지 않음 (`useEffect`에 deps를 설정하지 않고 마운트 시에 실행되도록 하는 경우 타이밍으로 인해 `mapRef.current`가 null이 됨)
2. 이로 인해 `map.setRef(mapRef.current)`가 호출되지 않아 `zustand`에 카카오 맵 `ref`가 등록되지 않아서 기존 코드가 실행되지 않았던 것을 확인함
3. 따라서, `mapRef.current`값을 마운트 즉시 Map의 ref가 할당되는 정확한 시점에 `setMapRef`를 실행하도록 콜백 ref를 사용한 코드로 수정

- 코드 비교

1. 적용 전

```ts
// SearchBar.tsx
const handleSubmitSearchInput = (
  e: React.MouseEvent | Reacat.KeyboardEvent,
) => {
  const isKeyBoardEvent = "key" in e;
  if (isKeyBoardEvent && e.key !== "Enter") return;

  setIsSearchMode(true);

  if (map.ref) {
    const cetner = map.ref.getCenter();
    setGeoLocation({ lat: cetner.getLat(), lng: cetner.getLng() });
  }
  setFilterGroupos("query", searchValue.trim());
  setSearchValue("");
}

// KakaoMap.tsx
useEffect(() => {
    if (mapRef.current) {
      map.setRef(mapRef.current);
    }
  }, [mapRef.current]);

...

<Map cetner={map.center} ref={mapRef} className="h-full w-full">
```

2. 적용 후

```ts
// SearchBar.tsx

const handleSubmitSearchInput = (
  e: React.MouseEvent | Reacat.KeyboardEvent,
) => {
  const isKeyBoardEvent = "key" in e;
  if (isKeyBoardEvent && e.key !== "Enter") return;

  setIsSearchMode(true);

  if (map.ref) {
    const cetner = map.ref.getCenter();
    setGeoLocation({ lat: cetner.getLat(), lng: cetner.getLng() });
  }
  setFilterGroupos("query", searchValue.trim());
  setSearchValue("");
}

// KakaoMap.tsx

const setMapRef = useCallback(
  (element: kakao.maps.Map | null) => {
    if (element && element !== map.ref) {
      map.setRef(element);
    }
  },
  [map.ref]
);

...

<Map cetner={map.center} ref={setMapRef} className="h-full w-full">
```

- 개선된 점

1. 초기 검색 시 `geoLocation` 값이 누락되는 문제는 `mapRef`의 초기화 타이밍 문제였기 때문에, 콜백 ref로 안전하게 등록하여 해결함
2. 무한 루프는 동일 ref 여부를 검사해 방지하여 첫 검색 시도 시 문제 없이 렌더링 및 api 요청이 발생함을 확인함

### 공공 데이터 API CORS 이슈

- 문제 발생

1. 배포 시 병원 및 약국 세부 정보 API (공공 데이터) 요청에 에러가 생겨 데이터가 지도에 나타나지 않는 것을 확인

- 해결 방법

1. main 브랜치 배포 환경에서 Response를 직접 확인하는 코드를 작성하지 않아 Preview에서 코드를 수정하여 확인
2. CORS 문제임을 확인하고 `next.config.ts`의 `rewrites`를 활용하여 내부적인 proxy를 이용하기로 결정

- 코드 비교

1. 적용 전

```ts
// 요청 부분 api 코드
const res = await fetch(
  `${process.env.NEXT_PUBLIC_DATA_HOSPITAL_BASE_URL}/getHsptlMdcncListInfoInqire?${query}`,
);
```

2. 적용 이후

```ts
// 요청 부분 api 코드
const res = await fetch(
  `/api/public-data/hospital/getHsptlMdcncListInfoInqire?${query}`,
);

// next.config.ts
const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/public-data/hospital/:path*",
        destination: `${process.env.NEXT_PUBLIC_DATA_HOSPITAL_BASE_URL}/:path*`,
      },
      {
        source: "/api/public-data/pharmacy/:path*",
        destination: `${process.env.NEXT_PUBLIC_DATA_PHARMACY_BASE_URL}/:path*`,
      },
    ];
  },
};
```

## 폴더 구조

```
📦 root/
├── .github/               # GitHub 관련 설정 (템플릿 등)
│
├── app/                   # Next.js App Router 폴더
│   └── _ui/
│       ├── layout/        # 레이아웃 관련 컴포넌트
│       └── shared/        # 공통 UI 컴포넌트
│
│   └── (admin)/           # 관리자 페이지 관련 라우팅 (미구현)
│       └── admin
│           └── page.tsx
│
│   └── (pages)/           # 일반 사용자 페이지 라우팅
│       └── (main)/        # 메인 페이지
│           ├── _ui/       # 메인 페이지에서 사용되는 UI 컴포넌트
│           └── page.tsx
│       └── detail/[id]    # 상세 페이지
│           ├── _ui/       # 상세 페이지에서 사용되는 UI 컴포넌트
│           └── page.tsx
│       └── board          # 자유 게시판 (미구현)
│           └── page.tsx
│       └── emergency      # 응급실 페이지 (미구현)
│           └── page.tsx
│
│   └── (users)/           # 사용자 정보 관련 페이지 라우팅
│       └── auth           # 로그인,회원가입 관련
│           ├── _ui/
│           ├── callback/  # OAuth redirect 처리 페이지
│           ├── signin/
│           ├── signup/
│           └── verify-email/
│       └── mypage         # 내 정보 페이지 (미구현)
│           └── page.tsx
│
│   └── api/               # API Route 핸들러 (클라이언트에서 사용)
│       ├── auth/          # 회원 관련
│       └── place/         # 장소 관련
│
│
│   ├── favicon.ico        # 파비콘
│   ├── globals.css        # 전역 스타일
│   ├── layout.tsx         # 루트 레이아웃
│   ├── loading.tsx        # 페이지 로딩 상태
│   ├── not-found.tsx      # 404 페이지
│   └── providers.tsx      # 글로벌 Provider 설정
│
├── components/            # 재사용 가능한 컴포넌트들
│
├── constants/             # 상수 정의 (예: 경로, 색상 등)
│
├── hooks/                 # 커스텀 훅
│
├── lib/
│   ├── api/               # API 호출 관련 유틸 (RSC에서 사용)
│   ├── queries/           # React Query 또는 DB 쿼리 관리
│   ├── supabase/          # Supabase 관련 로직
│   ├── ui/                # UI 관련 유틸
│   └── utils.ts           # shadcn/ui 유틸 (자동설치)
│
├── public/                # 정적 파일 (이미지 등)
│
├── stores/                # 전역 상태 관리 (예: Zustand)
│   └── useGeoLocation.ts
│
├── utils/                 # 일반 유틸리티 함수
│
├── .env.local             # 환경 변수 파일
├── .gitignore             # Git 제외 설정
├── ...
```

## 유저플로우 및 UI 구성 기획

### 네비게이션 바

1. 좌측 상단 로고 클릭 시 메인 페이지로 이동
2. 우측 상단 메뉴에서 원하는 페이지로 이동 가능
3. 로그인 유뮤에 따라 UI 전환
   - 로그인 X
     - 로그인 페이지로 이동할 수 있는 아이콘 표시
   - 로그인 O
     - 유저 프로필 이미지로 변환
     - 유저 프로필 클릭 시 로그아웃 및 마이페이지 이동 버튼 드롭다운

### 메인 페이지 (`/`)

1. 기능 설명
   - 사이트 접속 시 위치 정보 제공 동의 여부 확인
   - 동의 한 경우
     - 위치 값이 정확하지 않은 경우 (accuracy > 100), 위치 정보 제공에 동의하지 않은 경우와 동일하게 동작
     - 현재 위치를 기준으로 반경 1km 이내의 10개 병원 및 약국 정보 확인 (최대 45개 까지 확인 가능)
     - 또한, 필터 기능을 사용하여 검색 거리 또는 영업 시간 필터링 가능
   - 동의 하지 않은 경우
     - 내 주변 찾기 버튼을 눌러 내 주소를 찾아서 선택
     - 또는, 검색 창에 병원 이름 또는 내과 등의 분류를 입력하여 지도 중심 주변 1km 이내 장소 정보 검색
     - 마찬가지로, 필터 기능 사용 가능
2. UI 구성
   - 병원 및 약국의 마커가 있는 지도 (kakao map 사용)
   - 검색 입력
   - 주변 검색 필터 및 내 위치 정보 입력 모달 트리거 버튼
   - 병원 및 약국의 목록

### 병원 및 약국 상세 페이지 (`/detail/[id]`)

1. 기능 설명
   - 병원 상세 정보와 댓글 리스트를 SSR로 제공
   - URL의 쿼리 값을 기준으로 재 검색 (카카오 로컬 API 한계)
   - 검색된 정보와 id를 비교하고 id가 잘못된 경우 invalid 페이지로 리다이렉트
   - 병원 및 약국 상세 정보 페이지
   - 로그인한 사용자에 제한하여 병원 및 약국 리뷰 작성 및 좋아요 기능 제공
2. UI 구성
   - 병원 및 약국의 마커가 있는 지도 (kakao map 사용)
   - 병원 및 약국의 상세 정보 (좋아요, 공유 기능 포함)
   - 댓글 입력 폼
   - 댓글 리스트

### 병원 및 약국 상세 페이지 (`auth/signin`, `auth/signup`)

1. 기능 설명
   - 이메일을 활용한 로그인 및 회원가입 기능 제공
   - 이메일을 활용하여 회원가입 시 verify-email 페이지로 이동 (현재는 이동은 하지만 실제로 인증 메일을 전송하지 않음)
   - 구글, 카카오 OAuth를 활용한 로그인 및 회원가입 기능 제공
   - 로그인에 성공한 경우 메인 페이지로 이동
2. UI 구성
   - 회원가입 및 로그인 폼
   - verify-email 페이지
