/* C Tree site script — 이미지 슬롯, 포트폴리오 갤러리, 라이트박스, 메뉴, 견적 폼 */
(function () {
  "use strict";
  var CFG = window.CTREE_CONFIG || { company: {}, form: {} };
  var WORKS = window.CTREE_WORKS || [];
  var SLOTS = window.CTREE_SLOTS || {};
  var KIND = { built: "실제 시공", concept: "공간 연출 콘셉트" };
  var CATEGORIES = ["HOTEL", "RETAIL", "CORPORATE", "OUTDOOR", "CITY & LANDMARK", "RESORT & NATURE", "DETAIL"];
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (text != null) n.textContent = text;
    return n;
  }
  function workById(id) { return WORKS.filter(function (w) { return w.id === id; })[0]; }
  function srcFull(w) { return "/images/ctree-portfolio-" + w.id + ".webp"; }
  function srcThumb(w) { return "/images/ctree-portfolio-" + w.id + "-640.webp"; }
  function altText(w) { return w.alt || (w.title + ", " + w.space + "에 세운 대형 크리스마스트리 (" + (KIND[w.kind] || "") + " 이미지)"); }
  function makeImg(w, sizes, eager) {
    var img = el("img", {
      src: srcThumb(w),
      srcset: srcThumb(w) + " 640w, " + srcFull(w) + " " + (w.fullWidth || (w.o === "p" ? 784 : 1168)) + "w",
      sizes: sizes || "100vw",
      alt: altText(w),
      decoding: "async"
    });
    if (eager) { img.setAttribute("fetchpriority", "high"); } else { img.setAttribute("loading", "lazy"); }
    return img;
  }

  /* 1) 섹션 이미지 슬롯: CTREE_SLOTS 에서 이미지를 찾아 채우고, 없으면 텍스트 중심 레이아웃으로 전환 */
  $$("[data-slot]").forEach(function (slot) {
    var work = workById(SLOTS[slot.getAttribute("data-slot")]);
    var host = slot.closest("[data-media-host]");
    var wrap = slot.closest("[data-media-wrap]");
    if (!work) {
      if (wrap) wrap.remove();
      if (host) host.classList.add("no-media");
      return;
    }
    if (host) host.classList.add("has-media");
    slot.classList.add("slot");
    if (slot.hasAttribute("data-fill")) slot.classList.add("fill");
    if (slot.getAttribute("data-ratio")) slot.style.setProperty("--ratio", slot.getAttribute("data-ratio"));
    slot.appendChild(makeImg(work, slot.getAttribute("data-sizes"), slot.hasAttribute("data-eager")));
    var cap = slot.getAttribute("data-caption");
    if (cap === "overlay") {
      slot.appendChild(el("span", { "class": "cap" }, KIND[work.kind] || ""));
    } else if (cap === "below") {
      slot.parentNode.appendChild(el("p", { "class": "slot-cap" }, KIND[work.kind] || ""));
    }
  });

  /* 2) 스크롤 등장 */
  var io = null;
  if ("IntersectionObserver" in window && !reduceMotion) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -5% 0px" });
  }
  function observe(node) { if (io) io.observe(node); else node.classList.add("in"); }
  $$(".reveal").forEach(observe);

  /* 2-1) 모바일 고정 문의 버튼: 히어로와 문의 섹션에서는 숨김 */
  var fab = $(".fab"), heroEl = $("#top"), contactEl = $("#contact");
  if (fab && "IntersectionObserver" in window) {
    var seen = { hero: true, contact: false };
    var fabIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { seen[e.target === heroEl ? "hero" : "contact"] = e.isIntersecting; });
      fab.classList.toggle("show", !seen.hero && !seen.contact);
    });
    fabIo.observe(heroEl); fabIo.observe(contactEl);
  } else if (fab) { fab.classList.add("show"); }

  /* 3) 모바일 메뉴 */
  var menuBtn = $(".menu-btn"), nav = $("#nav");
  function setMenu(open) {
    nav.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
  }
  menuBtn.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
  $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("open")) { setMenu(false); menuBtn.focus(); } });

  /* 4) 포트폴리오 갤러리 + 필터 */
  var gallery = $("#gallery"), filters = $("#filters");
  var current = "ALL", shown = [], firstRender = true;

  function renderFilters() {
    var counts = { ALL: WORKS.length };
    WORKS.forEach(function (w) { counts[w.category] = (counts[w.category] || 0) + 1; });
    filters.textContent = "";
    ["ALL"].concat(CATEGORIES).forEach(function (c) {
      if (!counts[c]) return;
      var b = el("button", { type: "button", "aria-pressed": String(c === current), "data-cat": c }, c);
      b.appendChild(el("sup", { "aria-hidden": "true" }, String(counts[c])));
      b.addEventListener("click", function () { current = c; renderFilters(); renderGallery(); });
      filters.appendChild(b);
    });
  }

  function isLand(w) { return w.o !== "p"; }
  /* 필터 적용 시: 가로형은 넓게, 세로형은 좁게 짝지어 한 줄(6칸)을 채웁니다. */
  function packRows(items) {
    var out = [], i = 0;
    while (i < items.length) {
      var a = items[i], b = items[i + 1], c = items[i + 2];
      if (b && isLand(a) !== isLand(b)) {
        var la = isLand(a);
        out.push(la ? { span: 4, ratio: "3/2" } : { span: 2, ratio: "4/5" }, la ? { span: 2, ratio: "4/5" } : { span: 4, ratio: "3/2" }); i += 2;
      } else if (b && isLand(a) && isLand(b)) {
        out.push({ span: 3, ratio: "3/2" }, { span: 3, ratio: "3/2" }); i += 2;
      } else if (b && c && !isLand(a) && !isLand(b) && !isLand(c)) {
        out.push({ span: 2, ratio: "4/5" }, { span: 2, ratio: "4/5" }, { span: 2, ratio: "4/5" }); i += 3;
      } else if (b) {
        out.push({ span: 3, ratio: "4/5" }, { span: 3, ratio: "4/5" }); i += 2;
      } else {
        out.push(isLand(a) ? { span: 6, ratio: "16/9" } : { span: 2, ratio: "4/5" }); i += 1;
      }
    }
    return out;
  }
  function sizesFor(span) {
    if (span >= 6) return "100vw";
    if (span >= 4) return "(max-width: 600px) 100vw, (max-width: 1000px) 100vw, 66vw";
    return "(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw";
  }

  function renderGallery() {
    shown = WORKS.filter(function (w) { return current === "ALL" || w.category === current; });
    gallery.textContent = "";
    if (!shown.length) { gallery.appendChild(el("p", { "class": "empty-msg" }, "이 분류의 이미지를 준비하고 있습니다.")); return; }
    var layout = current === "ALL"
      ? shown.map(function (w) { return { span: w.span || 2, ratio: w.ratio || "4/5" }; })
      : packRows(shown);
    shown.forEach(function (w, i) {
      var L = layout[i];
      var fig = el("figure", { "class": "work reveal" + (L.span >= 4 ? " wide" : "") });
      fig.style.setProperty("--ratio", L.ratio);
      fig.style.setProperty("--span", String(L.span));
      var btn = el("button", { type: "button", "class": "thumb", "aria-label": w.title + " 크게 보기" });
      var img = makeImg(w, sizesFor(L.span));
      if (w.pos) img.style.objectPosition = w.pos;
      btn.appendChild(img);
      btn.addEventListener("click", function () { openLightbox(i); });
      var cap = el("figcaption");
      cap.appendChild(el("span", { "class": "t" }, w.title));
      cap.appendChild(el("span", { "class": "m" }, w.space + " · " + w.concept));
      cap.appendChild(el("span", { "class": "badge" + (w.kind === "built" ? " built" : "") }, KIND[w.kind] || ""));
      if (w.note) cap.appendChild(el("span", { "class": "note" }, w.note));
      fig.appendChild(btn); fig.appendChild(cap);
      gallery.appendChild(fig);
      if (firstRender) observe(fig); else fig.classList.add("in");
    });
    firstRender = false;
  }
  renderFilters(); renderGallery();

  /* 5) 라이트박스 */
  var lb = $("#lightbox"), lbImg = $("#lb-img"), idx = 0;
  function showLb() {
    var w = shown[idx]; if (!w) return;
    lbImg.src = srcFull(w); lbImg.alt = altText(w);
    $("#lb-note").textContent = w.note || "";
    $("#lb-title").textContent = w.title;
    $("#lb-meta").textContent = w.space + " · " + w.concept;
    var k = $("#lb-kind"); k.textContent = KIND[w.kind] || ""; k.className = "badge" + (w.kind === "built" ? " built" : "");
    $("#lb-count").textContent = (idx + 1) + " / " + shown.length;
    var multi = shown.length > 1;
    $("#lb-prev").hidden = !multi; $("#lb-next").hidden = !multi;
  }
  function openLightbox(i) {
    idx = i; showLb();
    if (typeof lb.showModal === "function") lb.showModal(); else lb.setAttribute("open", "");
    document.documentElement.style.overflow = "hidden";
  }
  function step(d) { idx = (idx + d + shown.length) % shown.length; showLb(); }
  function closeLb() { if (typeof lb.close === "function") lb.close(); else lb.removeAttribute("open"); }
  lb.addEventListener("close", function () { document.documentElement.style.overflow = ""; });
  $("#lb-close").addEventListener("click", closeLb);
  $("#lb-prev").addEventListener("click", function () { step(-1); });
  $("#lb-next").addEventListener("click", function () { step(1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
  lb.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
    if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
  });

  /* 6) 사업자 정보 (config.js 에 값이 있을 때만 표시) */
  var co = CFG.company || {};
  var rows = [
    ["상호", co.legalName], ["대표", co.representative], ["사업자등록번호", co.businessNo], ["주소", co.address],
    ["전화", co.phone, "tel:" + String(co.phone || "").replace(/[^0-9+]/g, "")],
    ["이메일", co.email, "mailto:" + co.email]
  ].filter(function (r) { return r[1]; });
  var footCo = $("#foot-co");
  rows.forEach(function (r) {
    var line = el("span", {}, r[0] + " ");
    if (r[2]) { var a = el("a", { href: r[2] }, r[1]); line.appendChild(a); } else { line.appendChild(document.createTextNode(r[1])); }
    footCo.appendChild(line);
  });
  var info = $("#contact-info");
  rows.filter(function (r) { return r[0] === "전화" || r[0] === "이메일" || r[0] === "주소"; }).forEach(function (r) {
    var d = el("div"); d.appendChild(el("dt", {}, r[0]));
    var dd = el("dd"); if (r[2]) dd.appendChild(el("a", { href: r[2] }, r[1])); else dd.textContent = r[1];
    d.appendChild(dd); info.appendChild(d);
  });
  $("#year").textContent = String(new Date().getFullYear());

  /* 7) 견적 폼 */
  var form = $("#quote"), status = $("#form-status"), submitBtn = $("#submit-btn");
  var fileInput = $("#f-files"), fcfg = CFG.form || {};
  var maxFiles = fcfg.maxFiles || 5, maxMB = fcfg.maxFileMB || 5;
  $("#file-hint").textContent = "이미지 파일 최대 " + maxFiles + "장, 장당 " + maxMB + "MB까지 첨부할 수 있습니다.";

  function setErr(field, msg) {
    var box = field.closest(".field");
    var err = $("[data-err]", box);
    if (err) err.textContent = msg || "";
    box.classList.toggle("invalid", !!msg);
    var input = $("input:not([type=radio]), select, textarea", box);
    if (input) { if (msg) input.setAttribute("aria-invalid", "true"); else input.removeAttribute("aria-invalid"); }
  }
  function validate() {
    var bad = [];
    function check(id, ok, msg) { var f = $(id); setErr(f, ok ? "" : msg); if (!ok) bad.push(f); }
    check("#f-name", $("#f-name").value.trim().length > 0, "담당자 이름을 입력해 주세요.");
    check("#f-phone", $("#f-phone").value.replace(/\D/g, "").length >= 8, "연락 가능한 전화번호를 입력해 주세요.");
    check("#f-email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($("#f-email").value.trim()), "이메일 형식을 확인해 주세요.");
    var files = Array.prototype.slice.call(fileInput.files || []);
    var fileMsg = "";
    if (files.length > maxFiles) fileMsg = "이미지는 최대 " + maxFiles + "장까지 첨부할 수 있습니다.";
    else if (files.some(function (f) { return f.type.indexOf("image/") !== 0; })) fileMsg = "이미지 파일만 첨부할 수 있습니다.";
    else if (files.some(function (f) { return f.size > maxMB * 1024 * 1024; })) fileMsg = "파일 하나의 크기는 " + maxMB + "MB 이하여야 합니다.";
    check("#f-files", !fileMsg, fileMsg);
    check("#f-consent", $("#f-consent").checked, "개인정보 수집 및 이용에 동의해 주세요.");
    return bad;
  }
  ["#f-name", "#f-phone", "#f-email", "#f-consent", "#f-files"].forEach(function (id) {
    $(id).addEventListener("input", function () { setErr($(id), ""); });
    $(id).addEventListener("change", function () { setErr($(id), ""); });
  });
  function say(msg, cls) { status.textContent = msg; status.className = "form-status" + (cls ? " " + cls : ""); }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    say("");
    var bad = validate();
    if (bad.length) { say("입력 내용을 확인해 주세요.", "bad"); bad[0].focus(); return; }
    if ($("input[name=website]", form).value) { say("견적 요청이 접수되었습니다."); form.reset(); return; }

    var endpoint = (fcfg.endpoint || "").trim();
    var data = new FormData(form);
    data.delete("website");
    if (!endpoint) {
      if (co.email) {
        var lines = [];
        data.forEach(function (v, k) { if (typeof v === "string" && v && k !== "개인정보 동의") lines.push(k + ": " + v); });
        location.href = "mailto:" + co.email + "?subject=" + encodeURIComponent("[C Tree] 견적 요청") + "&body=" + encodeURIComponent(lines.join("\n"));
        say("메일 앱이 열립니다. 참고 이미지가 있다면 메일에 직접 첨부해 주세요.", "ok");
      } else {
        say("온라인 접수가 아직 연결되지 않아 지금은 전송할 수 없습니다. 잠시 후 다시 시도해 주세요.", "bad");
      }
      return;
    }
    submitBtn.disabled = true; say("전송 중입니다…");
    data.append("_subject", "[C Tree] 견적 요청 - " + $("#f-name").value.trim());
    fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } })
      .then(function (r) { if (!r.ok) throw new Error(String(r.status)); })
      .then(function () { form.reset(); say("견적 요청이 접수되었습니다. 확인 후 연락드리겠습니다.", "ok"); })
      .catch(function () { say("전송하지 못했습니다. 잠시 후 다시 시도해 주세요.", "bad"); })
      .then(function () { submitBtn.disabled = false; });
  });
})();
