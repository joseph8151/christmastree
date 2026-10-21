/*
 * 포트폴리오 및 섹션 이미지 데이터 (C Tree)
 *
 * [배열 순서 = 화면 표시 순서]  번호순이 아니라 큐레이션 순서로 배치되어 있습니다.
 *   PC 화면은 6칸 그리드이고, span 4(가로 넓게)와 span 2(세로형)를 한 줄에 짝지었습니다.
 *
 * [새 이미지 추가]
 * 1) public/images/ 에 ctree-portfolio-31.webp (원본) 와 ctree-portfolio-31-640.webp (가로 640px 썸네일)를 넣습니다.
 * 2) 아래 배열에 한 줄을 추가합니다.
 *
 *    id       파일 번호 ("31")
 *    title    한글 제목 (고유하게)
 *    category HOTEL | RETAIL | CORPORATE | OUTDOOR | CITY & LANDMARK | RESORT & NATURE | DETAIL
 *    space    공간 유형
 *    concept  디자인 콘셉트 한 줄
 *    kind     "built" = 실제 시공 / "concept" = 공간 연출 콘셉트(AI 생성 이미지 등)
 *    ratio    "4/5" | "3/2" | "16/9"
 *    span     PC 가로 칸 수 (2 = 좁게, 4 = 넓게, 6 = 전체 폭)
 *    pos      (선택) 잘릴 때 기준 위치, 예: "60% 50%"
 *    o        (선택) "p" = 세로 원본 이미지(784px 폭)
 *    note     (선택) 이미지 아래에 붙는 안내 문구
 *    alt      (선택) 대체 텍스트. 비우면 제목과 공간 유형으로 자동 생성
 *
 * AI로 만든 이미지는 반드시 kind: "concept" 으로 두세요. 실제 시공 사진만 "built" 로 표기합니다.
 */
(function () {
  var NY = "뉴욕의 도시 풍경을 모티프로 한 연출 콘셉트이며, 해당 장소의 실제 시공 사례가 아닙니다.";
  var SC = "순천만의 풍경을 모티프로 한 연출 콘셉트이며, 해당 장소의 실제 시공 사례가 아닙니다.";

  window.CTREE_WORKS = [
    // 첫 화면: 순천만 · 호텔 · 뉴욕 · 백화점 · 야외 광장 순으로 크기를 달리해 배치
    { id: "08", title: "순천만의 노을", category: "RESORT & NATURE", space: "순천만 풍경 모티프", concept: "갈대밭과 노을 풍경에 어울리는 야외 데크 트리", kind: "concept", ratio: "3/2", span: 4, pos: "62% 50%", note: SC },
    { id: "02", title: "그랜드 계단홀", category: "HOTEL", space: "호텔 계단홀", concept: "샹들리에 아래 대리석 계단과 이어지는 수직 구성의 트리", kind: "concept", ratio: "4/5", span: 2, o: "p" },
    { id: "03", title: "루프톱의 밤", category: "CITY & LANDMARK", space: "뉴욕풍 도시 루프톱", concept: "스카이라인을 배경으로 한 야간 테라스 연출", kind: "concept", ratio: "4/5", span: 2, pos: "50% 50%", note: NY },
    { id: "12", title: "아트리움 센터피스", category: "RETAIL", space: "백화점 아트리움", concept: "유리 천장과 층고를 살려 세운 대형 중앙 트리", kind: "concept", ratio: "3/2", span: 4 },
    { id: "16", title: "궁정 앞 광장", category: "OUTDOOR", space: "대형 야외 광장", concept: "고전 건축 파사드 앞에 스타 토퍼로 마무리한 대형 트리", kind: "concept", ratio: "3/2", span: 4 },
    { id: "09", title: "역사 광장의 트리", category: "CITY & LANDMARK", space: "도시 광장", concept: "고전 건축에 둘러싸인 광장 한가운데의 대형 트리", kind: "concept", ratio: "4/5", span: 2, pos: "50% 50%" },
    { id: "10", title: "블루 아워 불러바드", category: "CITY & LANDMARK", space: "도시 거리", concept: "해 질 녘 젖은 보도에 조명이 비치는 거리 연출", kind: "concept", ratio: "4/5", span: 2, o: "p" },
    { id: "22", title: "바다 앞 테라스", category: "RESORT & NATURE", space: "해안 리조트", concept: "바다와 암석 정원을 배경으로 리본으로 마무리한 트리", kind: "concept", ratio: "3/2", span: 4 },
    { id: "21", title: "미니멀 라운지", category: "CORPORATE", space: "기업 로비 라운지", concept: "밝은 석재와 큰 창에 맞춰 장식을 절제한 트리", kind: "concept", ratio: "3/2", span: 4, pos: "32% 50%" },
    { id: "07", title: "마블 볼룸", category: "HOTEL", space: "호텔 볼룸", concept: "아치 창과 대리석 바닥, 크림 리본의 조화", kind: "concept", ratio: "4/5", span: 2, o: "p" },
    { id: "17", title: "만의 저녁 조명", category: "RESORT & NATURE", space: "해안 야간 조명", concept: "해 질 녘 물가에서 빛나는 조명 트리와 화단 조명", kind: "concept", ratio: "4/5", span: 2, pos: "82% 50%" },
    { id: "19", title: "스카이라인 로비", category: "CORPORATE", space: "기업 로비", concept: "도시 전망 창 앞에 한 쌍의 트리로 만든 대칭 구도", kind: "concept", ratio: "3/2", span: 4 },
    { id: "15", title: "겨울 정원의 온실", category: "RESORT & NATURE", space: "정원", concept: "유리 온실을 배경으로 잔디 원 위에 세운 트리", kind: "concept", ratio: "3/2", span: 4 },
    { id: "13", title: "갈대밭의 고요", category: "RESORT & NATURE", space: "습지 정원", concept: "장식을 덜어낸 미니멀한 자연 속 트리", kind: "concept", ratio: "4/5", span: 2, pos: "30% 50%" },
    { id: "29", title: "카페의 창가", category: "RETAIL", space: "카페", concept: "아치 창가 좌석 옆에 놓은 아담한 트리", kind: "concept", ratio: "4/5", span: 2, o: "p" },
    { id: "14", title: "세 그루의 테라스", category: "RESORT & NATURE", space: "리조트 테라스", concept: "크기가 다른 세 그루로 만든 시선의 리듬", kind: "concept", ratio: "16/9", span: 4 },
    { id: "05", title: "알파인 라운지", category: "RESORT & NATURE", space: "산악 리조트 라운지", concept: "설산 전망과 벽난로가 있는 라운지의 따뜻한 연출", kind: "concept", ratio: "3/2", span: 4 },
    { id: "04", title: "클래식 서재", category: "HOTEL", space: "부티크 호텔 라운지", concept: "짙은 붉은 리본으로 클래식한 공간에 깊이를 더한 트리", kind: "concept", ratio: "4/5", span: 2, o: "p" },
    { id: "24", title: "곡선 벽면의 두 그루", category: "RETAIL", space: "부티크 쇼룸", concept: "곡선 벽과 단상에 맞춘 두 그루 구성", kind: "concept", ratio: "4/5", span: 2, o: "p" },
    { id: "18", title: "캠퍼스 플라자", category: "CORPORATE", space: "기업 사옥 광장", concept: "사옥 앞 광장에서 브랜드의 얼굴이 되는 트리", kind: "concept", ratio: "3/2", span: 4 },
    { id: "26", title: "마켓 광장의 겨울", category: "OUTDOOR", space: "크리스마스 마켓 광장", concept: "마켓 부스와 중앙 트리가 이어지는 광장 연출", kind: "concept", ratio: "16/9", span: 4, pos: "50% 35%" },
    { id: "06", title: "애비뉴 코너", category: "CITY & LANDMARK", space: "뉴욕풍 도시 대로", concept: "석조 건물이 이어지는 거리 모퉁이에 놓은 대형 트리", kind: "concept", ratio: "4/5", span: 2, pos: "36% 50%", note: NY },
    { id: "11", title: "눈 내린 전망대", category: "CITY & LANDMARK", space: "도시 전망 테라스", concept: "눈 덮인 전망 테라스에 붉은 리본으로 포인트를 준 트리", kind: "concept", ratio: "4/5", span: 2, o: "p" },
    { id: "25", title: "정원의 밤", category: "OUTDOOR", space: "정형 정원", concept: "정원 조형과 조명 오브제로 완성한 야간 연출", kind: "concept", ratio: "3/2", span: 4 },
    { id: "27", title: "단지 중정의 저녁", category: "OUTDOOR", space: "주거 단지 중정", concept: "아파트 단지 중정에 놓은 따뜻한 조명 트리", kind: "concept", ratio: "3/2", span: 4 },
    { id: "20", title: "갤러리 홀", category: "RETAIL", space: "브랜드 쇼룸", concept: "유리 볼트 천장과 가랜드, 선물 오브제를 엮은 연출", kind: "concept", ratio: "4/5", span: 2, o: "p" },
    { id: "28", title: "오너먼트 디테일", category: "DETAIL", space: "장식 디테일", concept: "리본과 오너먼트의 질감과 색 조합", kind: "concept", ratio: "4/5", span: 2, o: "p", alt: "크림색 리본과 샴페인 골드 오너먼트가 달린 전나무 가지 근접 사진" },
    { id: "23", title: "화이트 아키텍처", category: "OUTDOOR", space: "문화시설 진입부", concept: "계단과 화단이 이어지는 흰 건축 입구의 트리", kind: "concept", ratio: "4/5", span: 2, pos: "62% 50%" },
    { id: "01", title: "아이보리 로비", category: "HOTEL", space: "호텔 로비", concept: "석재 마감과 통창의 자연광에 맞춘 크림 리본 트리", kind: "concept", ratio: "4/5", span: 2, pos: "52% 50%" },
    { id: "30", title: "온실 홀의 시그니처", category: "HOTEL", space: "유리 온실형 홀", concept: "밝은 자연광이 드는 아치 창 홀의 C Tree 대표 연출", kind: "concept", ratio: "16/9", span: 6, pos: "50% 22%" }
  ];

  /*
   * 섹션별 이미지 연결. 값은 위 WORKS 의 id 또는 null(이미지 없음 → 텍스트 중심 레이아웃)입니다.
   * 키 이름은 index.html 의 data-slot 속성과 같습니다.
   */
  window.CTREE_SLOTS = {
    hero: "30",
    approach: "07",
    "service-design": "24",
    "service-installation": "16",
    "service-seasonal": "02",
    "service-commercial": "20",
    "service-outdoor": "17",
    "service-rental": "14",
    "service-removal": null,
    "space-hotel": "01",
    "space-retail": "12",
    "space-corporate": "19",
    "space-public": "23",
    "space-outdoor": "09",
    "space-residential": "27",
    "space-resort": "22",
    "space-dining": "29",
    "detail-ribbon": null,
    "detail-branch": null,
    "detail-ornament": "28",
    "detail-light": null
  };
})();
