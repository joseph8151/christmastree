// 검색 노출용 파일을 데이터(public/data/portfolio.js)에서 만들어 반영합니다.
//  1) index.html 의 포트폴리오 목록(검색 로봇이 자바스크립트 없이도 읽도록)
//  2) index.html 의 첫 화면 이미지 선로딩 태그(LCP 속도 개선)
//  3) sitemap.xml (페이지 + 이미지 30장)
// 사용법: 저장소 루트에서  node scripts/prerender.mjs
// portfolio.js 를 수정하거나 히어로 이미지를 바꾼 뒤 한 번 실행하세요. 화면 동작은 site.js 가 같은 데이터로 다시 그립니다.
import fs from "node:fs";
import vm from "node:vm";

const root = new URL("../public/", import.meta.url);
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(new URL("data/portfolio.js", root), "utf8"), sandbox);
const works = sandbox.window.CTREE_WORKS;
const slots = sandbox.window.CTREE_SLOTS;

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
fs.writeFileSync(file, html);

// sitemap.xml: 주소는 index.html 의 canonical 에서 가져옵니다(도메인이 바뀌면 canonical 만 고치면 됩니다).
const site = html.match(/<link rel="canonical" href="([^"]+)"/)[1].replace(/\/$/, "");
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
