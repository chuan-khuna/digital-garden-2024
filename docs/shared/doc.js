// Page contract:
//   <head>
//     <link rel="stylesheet" href="../shared/globals.css">
//     <script src="../shared/doc.js"></script>   <!-- in <head>, no defer: applies the saved theme before first paint -->
//   </head>
//   <body data-doc-name="Short name for the top bar">
//     <main class="doc">
//       <header class="doc-head"><h1>Title</h1><p class="byline">…</p></header>
//       … h2/h3 sections (they become the table of contents) …
//       <pre><code class="language-ts">…</code></pre>          <!-- highlighted with Shiki -->
//       <figure class="diagram" data-diagram data-title="Caption" data-height="640">
//         <script type="text/plain" class="mermaid-src">flowchart LR …</script>
//       </figure>                                              <!-- rendered with Pele; `class <id> accent` highlights a node -->
//       <dl class="glossary"><dt id="term-core">Core</dt><dd>…</dd></dl>
//       <a class="term" href="#term-core">Core</a>              <!-- shows the meaning in a card on hover, focus or tap -->
//     </main>
//   </body>
//
// Classic script, not type="module": browsers block module scripts on file:// pages.
// Pele and Shiki load through dynamic import(), which works from file:// too.

(() => {
"use strict";

const PELE_URL = "https://cdn.jsdelivr.net/npm/pele@1.12.0/dist/pele.js";
const SHIKI_URL = "https://esm.sh/shiki@4.5.0";

const root = document.documentElement;
const dark = window.matchMedia("(prefers-color-scheme: dark)");

// Theme ids are the matching Shiki theme names, so code blocks follow the page theme.
const THEMES = {
  light: [
    ["rose-pine-dawn", "Rosé Pine Dawn"],
    ["catppuccin-latte", "Catppuccin Latte"],
    ["everforest-light", "Everforest Light"],
    ["kanagawa-lotus", "Kanagawa Lotus"],
  ],
  dark: [
    ["rose-pine-moon", "Rosé Pine Moon"],
    ["catppuccin-macchiato", "Catppuccin Macchiato"],
    ["everforest-dark", "Everforest Dark"],
    ["kanagawa-wave", "Kanagawa Wave"],
  ],
};
const THEME_IDS = new Set([...THEMES.light, ...THEMES.dark].map(([id]) => id));
const LEGACY = { moon: "rose-pine-moon", dawn: "rose-pine-dawn" };

const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch {} },
};

function savedTheme() {
  const t = store.get("doc-theme");
  const id = LEGACY[t] || t;
  return THEME_IDS.has(id) ? id : "auto";
}

function applyTheme(choice) {
  if (choice === "auto") delete root.dataset.theme;
  else root.dataset.theme = choice;
}

// The theme the page is showing now; Auto is Rosé Pine Dawn or main.
function effectiveTheme() {
  return root.dataset.theme || (dark.matches ? "rose-pine" : "rose-pine-dawn");
}

// Runs in <head>, before the body exists.
applyTheme(savedTheme());

// ---------- Small helpers ----------

const ICONS = {
  menu: '<path d="M4 6h16M4 12h16M4 18h10"/>',
  expand: '<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  zoomIn: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M8 11h6M11 8v6"/>',
  zoomOut: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M8 11h6"/>',
  fit: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
  check: '<path d="M5 12l5 5L20 7"/>',
  svg: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M12 12v6M9 15l3 3 3-3"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/>',
};

const icon = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;
const button = (name, label, attrs = "") =>
  `<button type="button" class="icon-btn" title="${label}" aria-label="${label}" ${attrs}>${icon(name)}</button>`;

function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

let toastTimer;
function toast(msg) {
  let t = document.querySelector(".doc-toast");
  if (!t) { t = el('<div class="doc-toast" role="status" aria-live="polite"></div>'); document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 1600);
}

function flashDone(btn) {
  const prev = btn.innerHTML;
  btn.innerHTML = icon("check");
  btn.classList.add("done");
  setTimeout(() => { btn.innerHTML = prev; btn.classList.remove("done"); }, 1200);
}

async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch {
    const ta = el("<textarea></textarea>");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    const ok = document.execCommand("copy"); ta.remove(); return ok;
  }
}

function download(blob, filename) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function slugFile(text, fallback) {
  const s = (text || "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "");
  return s || fallback;
}

// Listeners told when the shown theme changes (dropdown, or the system while on Auto).
const themeListeners = [];
const themeChanged = () => themeListeners.forEach((fn) => fn(effectiveTheme()));
dark.addEventListener("change", () => { if (!root.dataset.theme) themeChanged(); });

// ---------- Page chrome: top bar, theme dropdown, table of contents ----------

// A small preview of a theme: three overlapping accent dots (accent, love, foam)
// on a chip of the theme's base colour.
const DOTS = "<i></i><i></i><i></i>";
const swatch = (id) => `<span class="swatch" data-swatch="${id}" aria-hidden="true">${DOTS}</span>`;
// Auto: the chip is split diagonally, Rosé Pine Dawn | Rosé Pine (main);
// the first dot, on the Dawn half, takes Dawn's colours.
const autoSwatch = () =>
  `<span class="swatch swatch-auto" data-swatch="rose-pine" aria-hidden="true"><b class="split" data-swatch="rose-pine-dawn"></b><i data-swatch="rose-pine-dawn"></i><i></i><i></i></span>`;
const THEME_NAMES = new Map([["auto", "Auto (system)"], ...THEMES.light, ...THEMES.dark]);

// Theme dropdown: a button plus a listbox (aria-activedescendant pattern).
function buildThemePicker() {
  const option = (id, name) =>
    `<div class="theme-option" role="option" id="theme-opt-${id}" data-value="${id}" aria-selected="false">
      ${id === "auto" ? autoSwatch() : swatch(id)}<span class="name">${name}</span>
      <svg class="check" viewBox="0 0 24 24" aria-hidden="true">${ICONS.check}</svg>
    </div>`;
  const group = (key, label, list) =>
    `<div role="group" aria-labelledby="theme-group-${key}">
      <div class="group-label" id="theme-group-${key}">${label}</div>
      ${list.map(([id, name]) => option(id, name)).join("")}
    </div>`;
  const picker = el(`<div class="theme-picker">
    <button type="button" class="theme-trigger" aria-haspopup="listbox" aria-expanded="false"
      aria-controls="theme-menu" title="Theme">
      <span class="current"></span><span class="label"></span>
      <svg class="chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
    </button>
    <div class="theme-menu" id="theme-menu" role="listbox" aria-label="Theme" tabindex="-1" hidden>
      ${option("auto", "Auto (system)")}
      <div class="sep-line" role="separator"></div>
      ${group("light", "Light", THEMES.light)}
      ${group("dark", "Dark", THEMES.dark)}
    </div>
  </div>`);

  const trigger = picker.querySelector(".theme-trigger");
  const menu = picker.querySelector(".theme-menu");
  const options = [...menu.querySelectorAll(".theme-option")];
  let current = savedTheme(), active = null;

  const showCurrent = () => {
    const name = THEME_NAMES.get(current);
    trigger.querySelector(".current").innerHTML = current === "auto" ? autoSwatch() : swatch(current);
    trigger.querySelector(".label").textContent = name;
    trigger.setAttribute("aria-label", `Theme: ${name}`);
    options.forEach((o) => o.setAttribute("aria-selected", String(o.dataset.value === current)));
  };
  const setActive = (opt) => {
    options.forEach((o) => o.classList.toggle("active", o === opt));
    active = opt;
    menu.setAttribute("aria-activedescendant", opt.id);
    // Scroll only the menu: scrollIntoView() would also scroll the page.
    const top = opt.offsetTop, bottom = top + opt.offsetHeight;
    if (top < menu.scrollTop) menu.scrollTop = top;
    else if (bottom > menu.scrollTop + menu.clientHeight) menu.scrollTop = bottom - menu.clientHeight;
  };
  const open = () => {
    if (!menu.hidden) return;
    menu.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    setActive(options.find((o) => o.dataset.value === current) || options[0]);
    menu.focus({ preventScroll: true });
  };
  const close = (refocus = true) => {
    if (menu.hidden) return;
    menu.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
    if (refocus) trigger.focus({ preventScroll: true });
  };
  const choose = (opt) => {
    current = opt.dataset.value;
    applyTheme(current);
    store.set("doc-theme", current === "auto" ? null : current);
    showCurrent();
    themeChanged();
    close();
  };

  trigger.addEventListener("click", () => (menu.hidden ? open() : close()));
  trigger.addEventListener("keydown", (e) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) { e.preventDefault(); open(); }
  });
  menu.addEventListener("keydown", (e) => {
    const i = options.indexOf(active);
    if (e.key === "ArrowDown") setActive(options[Math.min(options.length - 1, i + 1)]);
    else if (e.key === "ArrowUp") setActive(options[Math.max(0, i - 1)]);
    else if (e.key === "Home") setActive(options[0]);
    else if (e.key === "End") setActive(options[options.length - 1]);
    else if (e.key === "Enter" || e.key === " ") choose(active);
    else if (e.key === "Escape") close();
    else if (e.key === "Tab") { close(false); return; }
    else if (e.key.length === 1) {
      // Type-ahead: jump to the next theme whose name starts with the typed letter.
      const k = e.key.toLowerCase();
      const order = [...options.slice(i + 1), ...options.slice(0, i + 1)];
      const hit = order.find((o) => o.querySelector(".name").textContent.toLowerCase().startsWith(k));
      if (hit) setActive(hit);
    } else return;
    e.preventDefault();
  });
  options.forEach((o) => {
    o.addEventListener("pointermove", () => { if (active !== o) setActive(o); });
    o.addEventListener("click", () => choose(o));
  });
  document.addEventListener("pointerdown", (e) => { if (!picker.contains(e.target)) close(false); });
  menu.addEventListener("focusout", (e) => { if (!picker.contains(e.relatedTarget)) close(false); });

  showCurrent();
  return picker;
}

function buildChrome(main, isThai) {
  const bar = el(`<div class="doc-topbar">
    ${button("menu", isThai ? "สารบัญ" : "Contents", 'aria-expanded="false" data-toc-toggle')}
    <span class="name"></span>
  </div>`);
  bar.querySelector(".name").textContent = document.body.dataset.docName || document.title;
  bar.appendChild(buildThemePicker());
  const tt = bar.querySelector("[data-toc-toggle]");
  tt.classList.add("toc-toggle");
  document.body.prepend(bar);

  const layout = el('<div class="doc-layout"></div>');
  main.before(layout);
  const toc = buildToc(main, isThai);
  if (toc) layout.appendChild(toc); else { layout.classList.add("no-toc"); tt.remove(); }
  layout.appendChild(main);

  if (toc) {
    tt.addEventListener("click", () => {
      const open = toc.classList.toggle("open");
      tt.setAttribute("aria-expanded", String(open));
    });
    toc.addEventListener("click", (e) => {
      if (e.target.closest("a")) { toc.classList.remove("open"); tt.setAttribute("aria-expanded", "false"); }
    });
  }
}

function buildToc(main, isThai) {
  const heads = [...main.querySelectorAll("h2, h3")].filter((h) => !h.closest("figure, .no-toc"));
  if (heads.length < 2) return null;
  const label = isThai ? "สารบัญ" : "Contents";
  const nav = el(`<nav class="doc-toc" aria-label="${label}"><div class="toc-title">${label}</div></nav>`);
  const top = document.createElement("ol");
  let h2 = 0, h3 = 0, sub = null, lastLi = null;
  for (const h of heads) {
    if (h.tagName === "H2") { h2++; h3 = 0; } else { h3++; }
    if (!h.id) h.id = h.tagName === "H2" ? `s${h2}` : `s${h2}-${h3}`;
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `#${h.id}`;
    a.textContent = h.textContent;
    li.appendChild(a);
    if (h.tagName === "H2" || !lastLi) { top.appendChild(li); lastLi = li; sub = null; }
    else { if (!sub) { sub = document.createElement("ol"); lastLi.appendChild(sub); } sub.appendChild(li); }
  }
  nav.appendChild(top);

  const links = new Map([...nav.querySelectorAll("a")].map((a) => [a.hash.slice(1), a]));
  const mark = () => {
    let current = heads[0];
    for (const h of heads) { if (h.getBoundingClientRect().top < 120) current = h; else break; }
    links.forEach((a, id) => a.classList.toggle("active", id === current.id));
  };
  document.addEventListener("scroll", mark, { passive: true });
  requestAnimationFrame(mark);
  return nav;
}

function wrapTables(main) {
  main.querySelectorAll("table").forEach((t) => {
    if (t.parentElement.classList.contains("table-wrap")) return;
    const w = el('<div class="table-wrap"></div>');
    t.before(w); w.appendChild(t);
  });
}

// ---------- Code blocks (Shiki, theme follows the page) ----------

async function setupCode(main) {
  const blocks = [...main.querySelectorAll("pre > code")];
  if (!blocks.length) return;

  const items = blocks.map((code) => {
    const pre = code.parentElement;
    const lang = ([...code.classList].find((c) => c.startsWith("language-")) || "language-text").slice(9);
    const source = code.textContent.replace(/\n$/, "");
    const wrap = el(`<div class="code-block"><div class="code-bar"><span class="lang"></span>${button("copy", "Copy code", "data-copy")}</div><div class="code-body"></div></div>`);
    wrap.querySelector(".lang").textContent = lang;
    pre.before(wrap);
    wrap.querySelector(".code-body").appendChild(pre);
    wrap.querySelector("[data-copy]").addEventListener("click", async (e) => {
      if (await copyText(source)) flashDone(e.currentTarget);
    });
    return { wrap, lang, source };
  });

  let shiki;
  try { shiki = await import(SHIKI_URL); } catch { return; }

  let run = 0;
  const paint = async (theme) => {
    const mine = ++run;
    for (const it of items) {
      let html;
      try { html = await shiki.codeToHtml(it.source, { lang: it.lang, theme }); }
      catch { html = await shiki.codeToHtml(it.source, { lang: "text", theme }); }
      if (mine !== run) return; // a newer theme change took over
      it.wrap.querySelector(".code-body").innerHTML = html;
    }
  };
  await paint(effectiveTheme());
  themeListeners.push(paint);
}

// ---------- Diagrams (Mermaid rendered by Pele) ----------

function zoomControls() {
  return `${button("zoomOut", "Zoom out", 'data-zoom="out"')}
    <button type="button" class="zoom-level" data-zoom="reset" title="Reset to 100%" aria-label="Reset to 100%">100%</button>
    ${button("zoomIn", "Zoom in", 'data-zoom="in"')}
    ${button("fit", "Fit", 'data-zoom="fit"')}`;
}

function exportControls() {
  return `${button("copy", "Copy Mermaid source", "data-copy-src")}
    ${button("svg", "Download SVG", "data-dl-svg")}
    ${button("image", "Download PNG", "data-dl-png")}`;
}

// Pan and zoom for one stage.
class PanZoom {
  constructor(stage, inner, label, { wheelNeedsModifier }) {
    Object.assign(this, { stage, inner, label, scale: 1, tx: 0, ty: 0, w: 0, h: 0 });
    stage.addEventListener("wheel", (e) => {
      if (wheelNeedsModifier && !(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      const r = stage.getBoundingClientRect();
      this.zoomAt(Math.exp(-e.deltaY * 0.0015), e.clientX - r.left, e.clientY - r.top);
    }, { passive: false });

    const pointers = new Map();
    let dist = 0, drag = null;
    stage.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      e.preventDefault(); // stop the drag from starting a text selection
      window.getSelection()?.removeAllRanges();
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 1) { drag = { x: e.clientX - this.tx, y: e.clientY - this.ty }; stage.classList.add("dragging"); }
      stage.setPointerCapture(e.pointerId);
    });
    stage.addEventListener("pointermove", (e) => {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        const r = stage.getBoundingClientRect();
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist) this.zoomAt(d / dist, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top);
        dist = d;
      } else if (drag) {
        this.tx = e.clientX - drag.x; this.ty = e.clientY - drag.y; this.apply();
      }
    });
    const end = (e) => {
      pointers.delete(e.pointerId); dist = 0;
      if (!pointers.size) { drag = null; stage.classList.remove("dragging"); }
      else { const p = pointers.values().next().value; drag = { x: p.x - this.tx, y: p.y - this.ty }; }
    };
    stage.addEventListener("pointerup", end);
    stage.addEventListener("pointercancel", end);
    stage.addEventListener("dblclick", () => this.fit());
  }
  setContent(svg) {
    this.inner.replaceChildren(svg);
    const vb = svg.viewBox?.baseVal;
    this.w = vb?.width || svg.getBoundingClientRect().width;
    this.h = vb?.height || svg.getBoundingClientRect().height;
    svg.setAttribute("width", this.w);
    svg.setAttribute("height", this.h);
    svg.style.maxWidth = "none";
  }
  apply() {
    this.inner.style.transform = `translate(${this.tx}px, ${this.ty}px) scale(${this.scale})`;
    this.label.textContent = `${Math.round(this.scale * 100)}%`;
  }
  center() {
    const r = this.stage.getBoundingClientRect();
    this.tx = (r.width - this.w * this.scale) / 2;
    this.ty = (r.height - this.h * this.scale) / 2;
    this.apply();
  }
  fit(maxScale = 4) {
    const r = this.stage.getBoundingClientRect();
    if (!this.w || !r.width) return;
    this.scale = Math.min((r.width - 32) / this.w, (r.height - 32) / this.h, maxScale);
    this.center();
  }
  reset() { this.scale = 1; this.center(); }
  zoomAt(factor, cx, cy) {
    const next = Math.min(8, Math.max(0.1, this.scale * factor));
    this.tx = cx - (cx - this.tx) * (next / this.scale);
    this.ty = cy - (cy - this.ty) * (next / this.scale);
    this.scale = next;
    this.apply();
  }
  zoomCenter(factor) {
    const r = this.stage.getBoundingClientRect();
    this.zoomAt(factor, r.width / 2, r.height / 2);
  }
}

function wireZoom(bar, pz) {
  bar.querySelectorAll("[data-zoom]").forEach((b) => b.addEventListener("click", () => {
    const z = b.dataset.zoom;
    if (z === "in") pz.zoomCenter(1.25);
    else if (z === "out") pz.zoomCenter(0.8);
    else if (z === "reset") pz.reset();
    else pz.fit();
  }));
}

// Copy computed colours and fonts into a clone so exported files keep the current look.
const EXPORT_PROPS = ["fill", "fill-opacity", "stroke", "stroke-width", "stroke-dasharray", "stroke-opacity", "opacity",
  "color", "font-family", "font-size", "font-weight", "font-style", "text-decoration", "rx", "ry"];

function exportableSvg(live) {
  const clone = live.cloneNode(true);
  const src = [live, ...live.querySelectorAll("*")];
  const dst = [clone, ...clone.querySelectorAll("*")];
  src.forEach((node, i) => {
    const cs = getComputedStyle(node);
    dst[i].setAttribute("style", EXPORT_PROPS.map((p) => `${p}:${cs.getPropertyValue(p)}`).join(";"));
  });
  const vb = live.viewBox.baseVal;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", vb.width);
  clone.setAttribute("height", vb.height);
  const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  bg.setAttribute("x", vb.x); bg.setAttribute("y", vb.y);
  bg.setAttribute("width", vb.width); bg.setAttribute("height", vb.height);
  bg.setAttribute("fill", getComputedStyle(document.body).backgroundColor);
  clone.prepend(bg);
  return { text: new XMLSerializer().serializeToString(clone), width: vb.width, height: vb.height };
}

function downloadPng({ text, width, height }, filename) {
  const scale = 2;
  const img = new Image();
  img.onload = () => {
    const c = document.createElement("canvas");
    c.width = Math.ceil(width * scale); c.height = Math.ceil(height * scale);
    const ctx = c.getContext("2d");
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0, width, height);
    c.toBlob((b) => b && download(b, filename), "image/png");
  };
  img.onerror = () => toast("PNG export failed");
  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(text);
}

function wireExport(bar, getEntry) {
  bar.querySelector("[data-copy-src]").addEventListener("click", async (e) => {
    if (await copyText(getEntry().source)) { flashDone(e.currentTarget); toast("Mermaid source copied"); }
  });
  bar.querySelector("[data-dl-svg]").addEventListener("click", () => {
    const f = getEntry();
    if (f.svg) download(new Blob([exportableSvg(f.svg).text], { type: "image/svg+xml" }), `${f.file}.svg`);
  });
  bar.querySelector("[data-dl-png]").addEventListener("click", () => {
    const f = getEntry();
    if (f.svg) downloadPng(exportableSvg(f.svg), `${f.file}.png`);
  });
}

async function setupDiagrams(main) {
  const figs = [...main.querySelectorAll("figure[data-diagram]")];
  if (!figs.length) return;

  let pele;
  try { pele = await import(PELE_URL); } catch {
    figs.forEach((f) => f.appendChild(el('<div class="diagram-error">Diagram library failed to load.</div>')));
    return;
  }
  if (document.fonts?.ready) await document.fonts.ready;

  // One shared full-screen viewer.
  const viewer = el(`<div class="diagram-viewer" role="dialog" aria-modal="true" aria-label="Diagram">
    <div class="diagram-bar"><span class="title"></span>${zoomControls()}<span class="sep"></span>${exportControls()}<span class="sep"></span>${button("close", "Close", "data-close")}</div>
    <div class="diagram-stage"><div class="inner"></div></div>
  </div>`);
  document.body.appendChild(viewer);
  const vBar = viewer.querySelector(".diagram-bar");
  const vPz = new PanZoom(viewer.querySelector(".diagram-stage"), viewer.querySelector(".inner"),
    vBar.querySelector(".zoom-level"), { wheelNeedsModifier: false });
  wireZoom(vBar, vPz);
  let active = null, lastTrigger = null;
  wireExport(vBar, () => active);

  const close = () => {
    viewer.classList.remove("open");
    document.body.style.overflow = "";
    active = null;
    lastTrigger?.focus();
  };
  vBar.querySelector("[data-close]").addEventListener("click", close);
  document.addEventListener("keydown", (e) => {
    if (!viewer.classList.contains("open")) return;
    if (e.key === "Escape") close();
    else if (e.key === "+" || e.key === "=") vPz.zoomCenter(1.25);
    else if (e.key === "-") vPz.zoomCenter(0.8);
    else if (e.key === "0") vPz.fit();
    else if (e.key === "1") vPz.reset();
  });
  window.addEventListener("resize", () => { if (active) vPz.fit(); });

  const mac = /Mac|iPhone|iPad/.test(navigator.platform);
  figs.forEach((fig, n) => {
    const source = (fig.querySelector(".mermaid-src")?.textContent || "").replace(/^\n+|\s+$/g, "");
    const title = fig.dataset.title || "";
    const entry = { source, svg: null, file: slugFile(title, `diagram-${n + 1}`) };

    const bar = el(`<div class="diagram-bar"><span class="title"></span>${zoomControls()}<span class="sep"></span>${exportControls()}<span class="sep"></span>${button("expand", "Expand", "data-expand")}</div>`);
    bar.querySelector(".title").textContent = title;
    const stage = el('<div class="diagram-stage"><div class="inner"></div><span class="diagram-hint"></span></div>');
    stage.querySelector(".diagram-hint").textContent = mac ? "⌘ + scroll to zoom" : "Ctrl + scroll to zoom";
    fig.prepend(bar, stage);

    const pz = new PanZoom(stage, stage.querySelector(".inner"), bar.querySelector(".zoom-level"), { wheelNeedsModifier: true });
    wireZoom(bar, pz);
    wireExport(bar, () => entry);

    try {
      const node = el(pele.render(source, { fontSize: 14 }).svg);
      entry.svg = node;
      pz.setContent(node);
      // Size the inline stage to the diagram at its fitted width, capped by data-height.
      const sizeStage = () => {
        const s = Math.min(1, (stage.clientWidth - 32) / pz.w);
        const maxH = Number(fig.dataset.height) || 640;
        stage.style.height = `${Math.round(Math.min(maxH, Math.max(160, pz.h * s + 32)))}px`;
        pz.fit(1);
      };
      sizeStage();
      let lastWidth = fig.clientWidth;
      new ResizeObserver(() => {
        if (fig.clientWidth === lastWidth) return;
        lastWidth = fig.clientWidth;
        sizeStage();
      }).observe(fig);
    } catch (err) {
      stage.replaceChildren(el('<div class="diagram-error"></div>'));
      stage.firstChild.textContent = `Diagram failed to render: ${err?.message || err}`;
      bar.querySelectorAll("button").forEach((b) => (b.disabled = true));
      return;
    }

    bar.querySelector("[data-expand]").addEventListener("click", (e) => {
      active = entry;
      lastTrigger = e.currentTarget;
      viewer.querySelector(".title").textContent = title;
      vPz.setContent(entry.svg.cloneNode(true));
      viewer.classList.add("open");
      document.body.style.overflow = "hidden";
      vPz.fit();
      vBar.querySelector("[data-close]").focus();
    });
  });
}

// ---------- Glossary term cards ----------

// Reads <dl class="glossary"> (dt id="term-<slug>" + dd) and tables marked
// data-glossary (tr id="term-<slug>", first cell = term, second = meaning).
// <a class="term" href="#term-<slug>"> shows the meaning on hover, focus or tap.
function setupGlossary(main) {
  const defs = new Map();
  main.querySelectorAll('dl.glossary dt[id^="term-"]').forEach((dt) => {
    const dd = dt.nextElementSibling;
    if (dd?.tagName === "DD") defs.set(dt.id, { name: dt.textContent.trim(), html: dd.innerHTML });
  });
  main.querySelectorAll('[data-glossary] tr[id^="term-"]').forEach((tr) => {
    defs.set(tr.id, { name: tr.cells[0]?.textContent.trim() || "", html: tr.cells[1]?.innerHTML || "" });
  });
  const terms = [...main.querySelectorAll('a.term[href^="#term-"]')];
  if (!terms.length || !defs.size) return;

  const card = el('<div class="term-card" id="term-card" role="tooltip" hidden><div class="term-name"></div><div class="term-def"></div></div>');
  document.body.append(card);
  const touch = window.matchMedia("(hover: none)");
  let current = null;
  let hideTimer = 0;

  const position = (a) => {
    const r = a.getBoundingClientRect();
    const w = card.offsetWidth;
    const h = card.offsetHeight;
    let top = r.bottom + 6;
    if (top + h > window.innerHeight - 8) top = Math.max(8, r.top - h - 6);
    card.style.left = `${Math.min(Math.max(8, r.left), window.innerWidth - w - 8)}px`;
    card.style.top = `${top}px`;
  };
  const hideNow = () => {
    clearTimeout(hideTimer);
    card.hidden = true;
    current?.removeAttribute("aria-describedby");
    current = null;
  };
  const hide = () => { clearTimeout(hideTimer); hideTimer = setTimeout(hideNow, 120); };
  const show = (a) => {
    const d = defs.get(a.getAttribute("href").slice(1));
    if (!d) return;
    clearTimeout(hideTimer);
    current?.removeAttribute("aria-describedby");
    current = a;
    card.querySelector(".term-name").textContent = d.name;
    card.querySelector(".term-def").innerHTML = d.html;
    card.hidden = false;
    a.setAttribute("aria-describedby", "term-card");
    position(a);
  };

  terms.forEach((a) => {
    a.addEventListener("mouseenter", () => { if (!touch.matches) show(a); });
    a.addEventListener("mouseleave", () => { if (!touch.matches) hide(); });
    a.addEventListener("focus", () => show(a));
    a.addEventListener("blur", hide);
    a.addEventListener("click", (e) => {
      if (!touch.matches) return;
      e.preventDefault();
      if (current === a && !card.hidden) hideNow();
      else show(a);
    });
  });
  card.addEventListener("mouseenter", () => clearTimeout(hideTimer));
  card.addEventListener("mouseleave", hide);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !card.hidden) hideNow(); });
  document.addEventListener("pointerdown", (e) => {
    if (!card.hidden && !card.contains(e.target) && !e.target.closest?.("a.term")) hideNow();
  });
  window.addEventListener("scroll", () => { if (current && !card.hidden) position(current); }, { passive: true });
}

// ---------- Boot (after the body is parsed) ----------

function boot() {
  const main = document.querySelector("main.doc");
  if (!main) return;
  const isThai = (root.lang || "").startsWith("th");
  buildChrome(main, isThai);
  wrapTables(main);
  setupCode(main);
  setupDiagrams(main);
  setupGlossary(main);
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
})();
