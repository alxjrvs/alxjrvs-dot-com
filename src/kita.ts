// kita.alxjrvs.com: one joke page for a friend, Kita Sivraj, commissioned by
// voice from a Taco Bell line in Salem on 2026-11-15. It is the only page on
// that host (src/gateway.ts), served by src/worker.ts, and the only words of
// the site's that live in the repo rather than EmDash: it is a one-off, not
// part of alxjrvs.com. Same "Legal Pad" palette and type as the main site
// (DESIGN.md §2–3); the fonts and favicon come from the same static assets.
// The die re-rolls the tagline and the sauce packet, like the splash die.

const TAGLINES: [string, string, string][] = [
  ["Certified legend.", "Kita orders", "for the table."],
  ["Salem's finest.", "Kita knows", "the whole menu."],
  ["Not a witch.", "Kita is", "just like that."],
  ["Hot sauce sommelier.", "Kita reads", "every packet."],
  ["Best friend.", "Kita makes", "the line go faster."],
  ["Fourth meal enthusiast.", "Kita eats", "a fifth."],
];

const PACKETS = [
  "Kita would share. Kita would not share the Crunchwrap.",
  "The line is long. Kita is worth it.",
  "If you can read this, Kita already ordered for you.",
  "Spice tolerance: yes.",
  "Salem has tried worse people. Salem acquits Kita.",
  "You are the friend people make a whole website about.",
  "Ask Kita about the sauce. Have an hour free.",
];

const esc = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const first = TAGLINES[0] as [string, string, string];

export const KITA_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>kita</title>
<meta name="description" content="Kita Sivraj: certified legend, Taco Bell regular, not a witch.">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#14161f">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/assets/fonts/familjen-grotesk-latin.woff2" as="font" type="font/woff2" crossorigin>
<style>
@font-face{font-family:"Familjen Grotesk";src:url(/assets/fonts/familjen-grotesk-latin.woff2) format("woff2");font-weight:400 700;font-display:swap}
@font-face{font-family:"IBM Plex Mono";src:url(/assets/fonts/ibm-plex-mono-500-latin.woff2) format("woff2");font-weight:500;font-display:swap}
:root{--surface:#14161f;--line:#262a38;--line-strong:#353948;--pattern:#1c1f2c;--fg:#f3f0dc;--fg-body:#e6e3ce;--fg-muted:#c7c4ad;--fg-subtle:#aea57a;--brand:#ffe45c;--brand-2:#a986d6;color-scheme:dark}
*{box-sizing:border-box;margin:0}
html{background:var(--surface)}
body{background:var(--surface);color:var(--fg-body);font:400 1.125rem/1.55 "Familjen Grotesk",system-ui,sans-serif;min-height:100svh;display:flex;flex-direction:column}
.mono{font:500 .75rem/1.4 "IBM Plex Mono",ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:var(--fg-subtle)}
main{flex:1;width:100%;max-width:60rem;margin:0 auto;padding:clamp(2rem,6vh,4rem) 16px 2rem}
.hero{position:relative;padding:clamp(1rem,6vh,4rem) 0 clamp(2rem,6vh,3rem)}
.mark{font-weight:700;font-size:clamp(96px,min(30vw,38vh),260px);line-height:.85;letter-spacing:-.06em;color:var(--fg)}
.mark span{color:var(--brand)}
.tag{margin-top:1.25rem;font-weight:500;font-size:clamp(28px,4.7vw,52px);line-height:1.12;letter-spacing:-.02em;color:var(--fg);min-height:2.3em}
.tag .s{color:var(--brand);display:block}
.tag .v{color:var(--fg-subtle)}
.die{position:absolute;top:clamp(1rem,6vh,4rem);right:0;width:clamp(56px,10vw,84px);aspect-ratio:1;background:none;border:0;padding:0;cursor:pointer;color:var(--brand-2);transition:transform .15s ease}
.die:hover{transform:scale(1.12)}
.die:focus-visible{outline:2px solid var(--brand);outline-offset:6px;border-radius:12px}
.die svg{width:100%;height:100%;display:block}
.die circle{transition:opacity .08s}
.die circle.off{opacity:0}
.notes{display:grid;gap:0;border-top:1px solid var(--line);margin-top:1rem}
.note{display:grid;grid-template-columns:11rem 1fr;gap:.25rem 1.5rem;padding:1rem 0;border-bottom:1px solid var(--line)}
.note p{color:var(--fg-body)}
.note b{color:var(--fg);font-weight:700}
h2{font-weight:700;line-height:1.05;font-size:clamp(2rem,6vw,3rem);letter-spacing:-.04em;color:var(--fg);margin:clamp(2.5rem,8vh,4rem) 0 1rem}
.packet{position:relative;margin:2.5rem auto 0;max-width:30rem;background:var(--brand);color:var(--surface);padding:1.5rem 1.5rem 1.25rem;border-radius:4px;clip-path:polygon(0 6px,4% 0,8% 6px,12% 0,16% 6px,20% 0,24% 6px,28% 0,32% 6px,36% 0,40% 6px,44% 0,48% 6px,52% 0,56% 6px,60% 0,64% 6px,68% 0,72% 6px,76% 0,80% 6px,84% 0,88% 6px,92% 0,96% 6px,100% 0,100% 100%,0 100%);transform:rotate(-1.5deg)}
.packet .mono{color:var(--surface);opacity:.75}
.packet p{font-weight:700;font-size:1.375rem;line-height:1.25;letter-spacing:-.02em;margin-top:.5rem}
footer{width:100%;max-width:60rem;margin:0 auto;padding:2rem 16px 2.5rem;display:flex;flex-wrap:wrap;justify-content:space-between;gap:.5rem 1.5rem;border-top:1px solid var(--line)}
footer a{color:var(--fg-muted);text-decoration:underline;text-decoration-color:var(--brand);text-underline-offset:3px}
footer a:hover{color:var(--fg)}
@media (max-width:600px){.note{grid-template-columns:1fr}.mark{font-size:clamp(96px,32vw,200px)}}
@media (prefers-reduced-motion:reduce){.die,.die circle{transition:none}}
</style>
</head>
<body>
<main>
<section class="hero" aria-labelledby="who">
<h1 class="mark" id="who">ki<span>ta</span></h1>
<p class="tag" aria-live="polite"><span class="s">${esc(first[0])}</span> <span class="v">${esc(first[1])}</span> ${esc(first[2])}</p>
<button class="die" type="button" aria-label="Roll for another Kita fact">
<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="2" y="2" width="60" height="60" rx="12" fill="currentColor"/><g fill="#14161f"><circle cx="17" cy="17" r="5"/><circle cx="32" cy="17" r="5"/><circle cx="47" cy="17" r="5"/><circle cx="17" cy="32" r="5"/><circle cx="32" cy="32" r="5"/><circle cx="47" cy="32" r="5"/><circle cx="17" cy="47" r="5"/><circle cx="32" cy="47" r="5"/><circle cx="47" cy="47" r="5"/></g></svg>
</button>
</section>

<h2>Field notes from the line</h2>
<div class="notes">
<div class="note"><span class="mono">Location</span><p>Taco Bell, Salem. Somewhere between <b>&ldquo;I&rsquo;m just getting a drink&rdquo;</b> and a full Cravings Box.</p></div>
<div class="note"><span class="mono">Status</span><p>In line. Has been in line. Will be in line in our hearts forever.</p></div>
<div class="note"><span class="mono">Known for</span><p>Making the wait the best part. Knowing what everyone wants before they do.</p></div>
<div class="note"><span class="mono">Spice tolerance</span><p>Diablo, <b>respectfully</b>.</p></div>
<div class="note"><span class="mono">Salem verdict</span><p>Examined by the town. Found to be <b>not a witch</b>, just genuinely magic. Case closed.</p></div>
<div class="note"><span class="mono">Rating</span><p>Five stars. Would wait in line with again.</p></div>
</div>

<div class="packet" role="status"><span class="mono">The sauce packet says</span><p id="packet">${esc(PACKETS[0] as string)}</p></div>
</main>
<footer>
<span class="mono">Made in a Taco Bell line, Salem, Nov 15, 2026</span>
<a href="https://alxjrvs.com/">a page by alxjrvs</a>
</footer>
<script>
(() => {
  const T = ${JSON.stringify(TAGLINES).replace(/</g, "\\u003c")};
  const P = ${JSON.stringify(PACKETS).replace(/</g, "\\u003c")};
  const tag = document.querySelector(".tag");
  const packet = document.getElementById("packet");
  const die = document.querySelector(".die");
  const pips = [...die.querySelectorAll("circle")];
  const faces = [[4],[0,8],[0,4,8],[0,2,6,8],[0,2,4,6,8],[0,2,3,5,6,8]];
  let t = 0, p = 0;
  const other = (n, i) => (i + 1 + Math.floor(Math.random() * (n - 1))) % n;
  const show = (f) => pips.forEach((c, i) => c.classList.toggle("off", !faces[f].includes(i)));
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  show(5);
  die.addEventListener("click", () => {
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let n = calm ? 0 : 6;
    const land = () => {
      t = other(T.length, t); p = other(P.length, p);
      const [s, v, o] = T[t];
      tag.innerHTML = '<span class="s">' + esc(s) + '</span> <span class="v">' + esc(v) + '</span> ' + esc(o);
      packet.textContent = P[p];
      show(Math.floor(Math.random() * 6));
    };
    const tick = () => {
      if (n-- <= 0) return land();
      show(Math.floor(Math.random() * 6));
      setTimeout(tick, 60);
    };
    tick();
  });
})();
</script>
</body>
</html>
`;
