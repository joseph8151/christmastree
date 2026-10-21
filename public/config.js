/*
 * C Tree 사이트 설정
 * 비어 있는 항목은 화면에 표시되지 않습니다. 실제 정보를 입력하면 푸터에 자동 반영됩니다.
 */
window.CTREE_CONFIG = {
  company: {
    name: "C Tree",                                   // 브랜드명
    legalName: "체르토 드라이브",                      // 상호(사업자등록증 기준)
    representative: "김형기",                          // 대표자명
    businessNo: "654-60-00645",                       // 사업자등록번호
    address: "서울특별시 서초구 강남대로8길 39-26, 2층 A9호 (양재동)", // 사업장 주소
    phone: "010-7748-4644",                           // 대표 전화 (비우면 표시 안 됨)
    email: "certo@certo.kr"                           // 문의 이메일
  },
  form: {
    // 견적 문의를 받을 주소. Formspree 등의 접수 주소를 넣으면 폼이 해당 주소로 전송됩니다.
    // 예: "https://formspree.io/f/xxxxxxxx"
    endpoint: "https://formspree.io/f/mzedladw",
    maxFiles: 5,
    maxFileMB: 5
  }
};
