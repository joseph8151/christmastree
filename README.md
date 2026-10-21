# C Tree 홈페이지

Cloudflare Workers 정적 에셋으로 배포되는 단일 페이지 사이트입니다. 빌드 과정이 없습니다.

## 구조

```
wrangler.jsonc            배포 설정 (assets.directory = ./public)
public/
  index.html              페이지 본문 (SEO용 텍스트는 모두 여기)
  config.js               사업자 정보, 견적 폼 접수 주소  ← 먼저 채울 파일
  data/portfolio.js       포트폴리오 30장 데이터와 섹션별 이미지 연결
  assets/styles.css       디자인 토큰과 스타일
  assets/site.js          갤러리, 라이트박스, 폼 동작
  images/                 ctree-portfolio-01 ~ 30.webp (+ -640.webp 썸네일)
```

## 자주 하는 작업

- **사업자 정보 입력**: `public/config.js` 의 `company` 항목. 비워 두면 화면에 표시되지 않습니다.
- **견적 폼 연결**: `public/config.js` 의 `form.endpoint` 에 접수 주소(예: Formspree)를 넣습니다. 비어 있으면 폼은 전송되지 않고 안내 문구를 보여 줍니다.
- **이미지 교체/추가**: `public/data/portfolio.js` 상단 주석을 따릅니다. 파일은 WebP 원본과 640px 썸네일 두 개를 한 쌍으로 넣습니다.
- **히어로·섹션 이미지 교체**: `portfolio.js` 의 `CTREE_SLOTS` 에서 이미지 번호만 바꿉니다.
- **실제 시공 사진 표기**: AI 생성 이미지는 `kind: "concept"`, 실제 시공 사진만 `kind: "built"` 로 둡니다.

## 로컬 확인

```
cd public && python3 -m http.server 8123
```
