// 포트폴리오 목록을 index.html 에 미리 그려 넣습니다(검색 로봇이 자바스크립트 없이도 읽을 수 있도록).
// 사용법: 저장소 루트에서  node scripts/prerender.mjs
// public/data/portfolio.js 를 수정한 뒤 한 번 실행하세요. 화면 동작은 site.js 가 같은 데이터로 다시 그립니다.
import fs from "node:fs";
import vm from "node:vm";

const root = new URL("../public/", import.meta.url);
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(new URL("data/portfolio.js", root), "utf8"), sandbox);
const works = sandbox.window.CTREE_WORKS;

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
const html = fs.readFileSync(file, "utf8");
const start = "<!-- prerender:gallery:start -->", end = "<!-- prerender:gallery:end -->";
const a = html.indexOf(start), b = html.indexOf(end);
if (a < 0 || b < 0) throw new Error("index.html 에서 prerender 표시를 찾지 못했습니다.");
fs.writeFileSync(file, html.slice(0, a + start.length) + "\n" + figures + "\n" + html.slice(b));
console.log(`포트폴리오 ${works.length}개를 index.html 에 반영했습니다.`);
