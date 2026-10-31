// 검색 노출용 파일을 데이터(public/data/portfolio.js)에서 만들어 반영합니다.
//  1) index.html 의 포트폴리오 목록(검색 로봇이 자바스크립트 없이도 읽도록)
//  2) index.html 의 첫 화면 이미지 선로딩 태그(LCP 속도 개선)
//  3) sitemap.xml (페이지 + 이미지 30장)
//  4) 회사 정보(푸터·문의·소개 표)와 FAQPage/서비스 구조화 데이터 (자바스크립트를 실행하지 않는 검색·AI 크롤러용)
//  5) llms.txt, llms-full.txt (AI 답변 엔진용 요약 문서)
// 사용법: 저장소 루트에서  node scripts/prerender.mjs
// portfolio.js 를 수정하거나 히어로 이미지를 바꾼 뒤 한 번 실행하세요. 화면 동작은 site.js 가 같은 데이터로 다시 그립니다.
import fs from "node:fs";
import vm from "node:vm";

const root = new URL("../public/", import.meta.url);
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(new URL("data/portfolio.js", root), "utf8"), sandbox);
const works = sandbox.window.CTREE_WORKS;
const slots = sandbox.window.CTREE_SLOTS;
const cfgBox = { window: {} };
vm.runInNewContext(fs.readFileSync(new URL("config.js", root), "utf8"), cfgBox);
const co = cfgBox.window.CTREE_CONFIG.company;

const KIND = { built: "실제 시공", concept: "공간 연출 콘셉트" };
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const alt = (w) => w.alt || `${w.title}, ${w.space}에 세운 대형 크리스마스트리 (${KIND[w.kind] || ""} 이미지)`;

const figures = works.map((w) => {
  const pos = w.pos ? ` style="object-position:${esc(w.pos)}"` : "";
  const span = w.span || 2;
  return `<figure class="work in${span >= 4 ? " wide" : ""}" style="--ratio:${w.ratio || "4/5"};--span:${span}">` +
    `<div class="thumb"><img src="/images/ctree-portfolio-${w.id}-640.webp" alt="${esc(alt(w))}" loading="lazy" decoding="async"${pos}></div>` +
    `<figcaption><span class="t">${esc(w.title)}</span><span class="m">${esc(w.space)} · ${esc(w.concept)}</span>` +
    `<span class="badge${w.kind === "built" ? " built" : ""}">${KIND[w.kind] || ""}</span>` +
    (w.note ? `<span class="note">${esc(w.note)}</span>` : "") + `</figcaption></figure>`;
}).join("\n");

const file = new URL("index.html", root);
let html = fs.readFileSync(file, "utf8");
function inject(name, content) {
  const start = `<!-- prerender:${name}:start -->`, end = `<!-- prerender:${name}:end -->`;
  const a = html.indexOf(start), b = html.indexOf(end);
  if (a < 0 || b < 0) throw new Error(`index.html 에서 prerender:${name} 표시를 찾지 못했습니다.`);
  html = html.slice(0, a + start.length) + content + html.slice(b);
}
inject("gallery", "\n" + figures + "\n");

// 첫 화면 이미지 선로딩: site.js 가 만드는 img 의 srcset/sizes 와 같아야 이중 다운로드가 생기지 않습니다.
const hero = works.find((w) => w.id === slots.hero);
inject("preload", hero
  ? `\n<link rel="preload" as="image" href="/images/ctree-portfolio-${hero.id}-640.webp" imagesrcset="/images/ctree-portfolio-${hero.id}-640.webp 640w, /images/ctree-portfolio-${hero.id}.webp ${hero.o === "p" ? 784 : 1168}w" imagesizes="(max-width: 960px) 100vw, 58vw" fetchpriority="high">\n`
  : "");

// ---- 본문에서 서비스·FAQ 를 읽어 구조화 데이터와 AI용 문서를 만듭니다(본문과 항상 일치) ----
const siteUrl = html.match(/<link rel="canonical" href="([^"]+)"/)[1].replace(/\/$/, "");
const plain = (t) => t.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
const services = [...html.matchAll(/<h3>(.*?)<\/h3><p class="ko">(.*?)<\/p><\/div>\s*<p class="copy svc-body">(.*?)<\/p>/gs)]
  .map((m) => ({ name: plain(m[1]), ko: plain(m[2]), desc: plain(m[3]) }));
const faqs = [...html.matchAll(/<details class="q"><summary>(.*?)<\/summary><p>(.*?)<\/p><\/details>/gs)]
  .map((m) => ({ q: plain(m[1]), a: plain(m[2]) }));
if (!services.length || !faqs.length) throw new Error("서비스 또는 FAQ 를 본문에서 찾지 못했습니다.");

const phoneHref = "tel:" + String(co.phone || "").replace(/[^0-9+]/g, "");
const rows = [["상호", co.legalName], ["대표", co.representative], ["사업자등록번호", co.businessNo], ["주소", co.address],
  ["전화", co.phone, phoneHref], ["이메일", co.email, "mailto:" + co.email]].filter((r) => r[1]);
const link = (r) => r[2] ? `<a href="${esc(r[2])}">${esc(r[1])}</a>` : esc(r[1]);

inject("footer", `<b>C Tree</b><span>Christmas Decoration &amp; Spatial Design</span>` +
  rows.map((r) => `<span>${esc(r[0])} ${link(r)}</span>`).join(""));
inject("contact", rows.filter((r) => ["전화", "이메일", "주소"].includes(r[0]))
  .map((r) => `<div><dt>${esc(r[0])}</dt><dd>${link(r)}</dd></div>`).join(""));

const serviceNames = services.map((x) => x.ko.replace(/ 디자인 및 제작$/, "")).join(", ");
const facts = [
  ["브랜드", "C Tree (Christmas Decoration & Spatial Design)"],
  ...rows.filter((r) => ["상호", "대표", "사업자등록번호"].includes(r[0])).map((r) => [r[0], r[1]]),
  ["사업장 소재지", co.address],
  ["주요 서비스", "맞춤 크리스마스트리 제작, 실내·야외 대형 트리 설치와 시공, 공간 전체 시즌 데코레이션, 백화점·쇼핑몰·쇼윈도 연출, 야외 조명 연출, 트리 렌탈과 유지관리, 철거와 보관"],
  ["대상 공간", "호텔, 백화점·쇼핑몰, 기업, 관공서·공공기관, 야외 광장, 주거 단지, 리조트·정원, 레스토랑·카페"],
  ["문의 방법", ["견적 요청 폼", co.phone && `전화 ${co.phone}`, co.email && `이메일 ${co.email}`].filter(Boolean).join(" · ")],
  ["견적에 필요한 정보", "설치 지역, 공간 유형, 실내·야외 여부, 희망 트리 높이, 설치·철거 희망일, 공간 사진(선택), 예산 범위(선택)"],
  ["이미지 안내", "이 사이트의 이미지는 모두 공간 연출 콘셉트 이미지이며 실제 시공 사례가 아닙니다."]
].filter((f) => f[1]);
inject("facts", facts.map((f) => `<div><dt>${esc(f[0])}</dt><dd>${esc(f[1])}</dd></div>`).join(""));

const orgId = `${siteUrl}/#org`;
const ld = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebPage", "@id": `${siteUrl}/#webpage`, dateModified: new Date().toISOString().slice(0, 10) },
    { "@type": ["Organization", "ProfessionalService"], "@id": orgId,
      hasOfferCatalog: { "@type": "OfferCatalog", name: "C Tree 서비스",
        itemListElement: services.map((x) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: x.ko, alternateName: x.name, description: x.desc, provider: { "@id": orgId } } })) } },
    { "@type": "FAQPage", "@id": `${siteUrl}/#faq`, inLanguage: "ko-KR",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }
  ]
};
inject("jsonld", `\n<script type="application/ld+json">\n${JSON.stringify(ld, null, 2).replace(/</g, "\\u003c")}\n</script>\n`);

// ---- AI 답변 엔진용 요약 문서 ----
const contact = [co.phone && `전화: ${co.phone}`, co.email && `이메일: ${co.email}`, co.address && `주소: ${co.address}`].filter(Boolean);
const am = (co.address || "").match(/^(\S+)\s+(\S+).*\((\S+)\)/);
const area = am ? `${am[1]} ${am[2]} ${am[3]}` : (co.address || "");
const summary = "호텔·백화점·기업·관공서·야외 공간을 위한 크리스마스트리 제작, 대형 트리 설치, 크리스마스 시즌 데코레이션을 제안하는 크리스마스 공간 디자인 스튜디오입니다. " +
  `상호는 ${co.legalName}, 사업장은 ${area}에 있습니다. 이 사이트의 이미지는 모두 공간 연출 콘셉트 이미지이며 실제 시공 사례가 아닙니다.`;
fs.writeFileSync(new URL("llms.txt", root),
`# C Tree

> ${summary}

## 페이지
- [홈페이지](${siteUrl}/): 서비스, 포트폴리오, 진행 과정, 소개, FAQ, 견적 문의를 한 페이지에 담았습니다.
- [서비스](${siteUrl}/#services)
- [포트폴리오](${siteUrl}/#works)
- [회사 소개](${siteUrl}/#about)
- [자주 묻는 질문](${siteUrl}/#faq)
- [견적 문의](${siteUrl}/#contact)

## 서비스
${services.map((x) => `- ${x.ko} (${x.name})`).join("\n")}

## 문의
${contact.map((c) => `- ${c}`).join("\n")}

## 전체 텍스트
- [llms-full.txt](${siteUrl}/llms-full.txt): 서비스 설명과 FAQ 전문
- [sitemap.xml](${siteUrl}/sitemap.xml)
`);
fs.writeFileSync(new URL("llms-full.txt", root),
`# C Tree

> ${summary}

## 회사 정보
${facts.map((f) => `- ${f[0]}: ${f[1]}`).join("\n")}

## 서비스
${services.map((x) => `### ${x.ko} (${x.name})\n${x.desc}`).join("\n\n")}

## 자주 묻는 질문
${faqs.map((f) => `### ${f.q}\n${f.a}`).join("\n\n")}

## 문의
${contact.map((c) => `- ${c}`).join("\n")}
- 견적 요청 폼: ${siteUrl}/#contact
`);

fs.writeFileSync(file, html);

// sitemap.xml: 주소는 index.html 의 canonical 에서 가져옵니다(도메인이 바뀌면 canonical 만 고치면 됩니다).
const site = siteUrl;
const today = new Date().toISOString().slice(0, 10);
const images = works.map((w) =>
  `    <image:image>\n      <image:loc>${site}/images/ctree-portfolio-${w.id}.webp</image:loc>\n` +
  `      <image:title>${esc(w.title)}</image:title>\n      <image:caption>${esc(w.space + " · " + w.concept)}</image:caption>\n    </image:image>`).join("\n");
fs.writeFileSync(new URL("sitemap.xml", root),
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${site}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
${images}
  </url>
</urlset>
`);
console.log(`포트폴리오 ${works.length}개, 선로딩 태그, sitemap.xml(이미지 ${works.length}장)을 반영했습니다.`);
