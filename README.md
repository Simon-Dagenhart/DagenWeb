# DagenWeb

Portfolio site for **Eng. Hamzah** — web and Flutter development, and English / computer-skills
teaching, based near Baghdad.

Live: <https://simon-dagenhart.github.io/DagenWeb/>

Static HTML, CSS and vanilla JavaScript. No build step, no dependencies, no framework —
open `index.html` and it runs.

## Pages

| Path | What it is |
| --- | --- |
| `index.html` | Home — hero, who I work with, latest work, packages & pricing |
| `works.html` | Full portfolio, with a grid / list view toggle |
| `about.html` | Bio, skills, what I do, timeline, contact |
| `projects/*.html` | One case-study page per project |
| `demos/` | Browsable copies of two sites, so a reviewer can click through the real thing |

## Bilingual (Arabic / English)

Arabic is the default. English is opt-in and remembered in `localStorage`.

Translation lives in the markup, not in a dictionary file — every translatable element carries a
`data-ar` attribute holding its Arabic text, and `script.js` swaps `textContent` against it while
flipping `<html dir>` between `rtl` and `ltr`:

```html
<a href="works.html" data-ar="أعمالي">works</a>
```

Variants: `data-ar-html` (when the string contains markup), `data-ar-placeholder`, `data-ar-label`.

Layout is written with CSS **logical properties** (`margin-inline`, `inset-inline-start`,
`border-block-end`) rather than `left` / `right`, so the whole page mirrors from the `dir`
attribute alone — there is no duplicated RTL stylesheet.

## Design tokens

All colour, type and spacing lives in one `:root` block at the top of `styles.css`. Two magentas,
used deliberately:

| Token | Value | Use |
| --- | --- | --- |
| `--accent` | `#fc2f96` | Fills and graphics only — 3.5:1, below AA for text |
| `--accent-dark` | `#c1175c` | Anything that is text — 5.9:1, passes AA |
| `--accent-pale` | `#ffe6f3` | Tinted surfaces |
| `--bg` / `--bg-band` | `#faf8f5` / `#ece2d8` | Off-white canvas, mid-beige bands |

Keep that split when adding rules: bright magenta never carries text.

## The hero bowtie

The bowtie in the hero is the entry point to the portfolio — a real `<a href="works.html">`, not a
decoration. It rests tied, unties on hover/focus to reveal its label, and re-ties on leave. The
whole motion is driven by one custom property, `--untie: 0 → 1`, which every part interpolates
against, so the tied state is a true identity transform.

Three behaviours worth knowing before editing it:

- **Touch** has no hover, so CSS rests the bow *open*. JavaScript then re-ties it and plays the
  untie once as the hero settles. Every bail-out path leaves the bow open — the animation is
  progressive enhancement, never load-bearing, because a tied bow means the CTA label is at
  `opacity: 0`.
- **`prefers-reduced-motion`** removes the animation and all transitions; the CTA stays fully
  reachable with no motion at all.
- The label keeps its layout box at all times, so revealing it causes no layout shift.

## Demos

`demos/ashur/` and `demos/swanstore/` are **derived copies** — never edit them by hand. Edit the
source site, then rebuild:

```bash
bash demos/sync-demos.sh
```

The script wipes each copy, re-copies the source, strips what cannot run on static hosting
(Swan Store's PHP admin), and injects the shared demo bar into every page.

## Local preview

Any static server works. With PHP available:

```bash
php -S 127.0.0.1:8610 -t .
```

Then open <http://127.0.0.1:8610/>.

## Deployment

GitHub Pages serves this repository directly from the default branch — push and it publishes.
`.nojekyll` disables Jekyll processing so nothing is filtered.

---

Built by Eng. Hamzah / DagenWeb.
