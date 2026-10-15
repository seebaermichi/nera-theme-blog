# Work log — 01a13a62-1789-7010-90ab-d28eaa839b22-nera-theme-blog-blog-theme-nera-static-theme-blog

- **Issue:** `01a13a62-1789-7010-90ab-d28eaa839b22`

## Issue snapshot (2026-10-14)

- **Id:** `01a13a62-1789-7010-90ab-d28eaa839b22`
- **Type:** feature
- **Group:** S5 Starters
- **Status:** in_progress
- **Title:** [nera-theme-blog] Blog theme (@nera-static/theme-blog)

Spec: `generator/ROADMAP-themes.md`, "Starter-ready themes" — **§S4** (`@nera-static/theme-blog`), plus the shared §S2 (contract, seams, tokens, translation keys), §S5 (semver and release), §S6 (what a starter must do) and the acceptance criteria in **§S7**. Context: `nera-cli/ROADMAP-ai.md` L5.

Build the theme that carries the blog starter: `@nera-static/theme-blog`, repo `nera-theme-blog` (a flat sibling of `generator/`), `theme: blog` in a site's `config/app.yaml`.

## Scope

- Page types (§S4.1): `pages/home.pug` (recent posts as cards, `blog.home_posts`), `pages/post.pug`, `pages/archive.pug` (by year), `pages/tag.pug` (for plugin-tags 3.x), `pages/default.pug`.
- Seams (§S4.2): `post-media`, `card-media`, `post-tags`, `post-pagination`, `tag-overview`, `tag-cloud`, and the reserved `feed-link` for the planned plugin-feed. Plugin output only through seams the starter overrides; plugins are optional peers.
- Translation keys (§S4.3) on top of the shared ones; tokens as `--theme-*` custom properties from `config/theme.yaml` (§S4.4 "Quiet paper" look and defaults); code blocks styled via `--nera-code-*`.
- `nera.generator >=4.15.0`, no JS, no third-party requests.

## Done when

- Every §S7 acceptance criterion for theme-blog holds, including zero `nera check` findings on the fixture site built the way §S6 describes.
- Released per §S5: 1.0.0 bootstrap-published by hand, then a CI OIDC x.y.1 within two days; fleet setup (badges, ruleset, secret scanning, Dependabot, private vulnerability reporting, `FUNDING.yml`).

## Blocks

`[nera-starter-blog] Blog starter kit` (`01a1260d-8f10-7193-b92d-a006f8b6468f`) — each theme ships 1.0.x before the starter that depends on it.

## Before working it

The repo does not exist yet: set up `nera-theme-blog/` per the workspace `CLAUDE.md` ("Starting a new repo for a Snagio issue") before running `/work-issue`.

## Cloud launch (2026-10-14)

- **Worked in a Claude Code cloud session**, outside the local plan → implement → review → approve loop (to use the cloud credit). The gate was not armed.
- **Brief:** `plans/cloud/01a13a62-1789-7010-90ab-d28eaa839b22-brief.md` · **Branch:** `issue/01a13a62-theme-blog` · **Session:** launched by the user (`! claude --cloud …`), URL to be filled in
- **On return:** `/work-issue-cloud 01a13a62-1789-7010-90ab-d28eaa839b22` — verify locally, triage, merge, reconcile (release 1.0.0 bootstrap + x.y.1 CI, fleet setup, §S4 spec note), resolve.

## Cloud result (2026-10-14)

- **Branch:** `issue/01a13a62-theme-blog` · 13 commits · result file `plans/cloud/01a13a62-1789-7010-90ab-d28eaa839b22-result.md`
- **Summary:** the whole `@nera-static/theme-blog` 1.0.0 package (views, "Quiet paper" CSS, theme.yaml, fleet files, README, CHANGELOG) plus an en/de fixture site with every §S6 step; 14 vitest files / 86 tests cover every §S7 criterion for blog.
- **Verified locally (Node 22.22.0, clean `npm ci`):** `npm run lint` clean; `npx vitest run` 14/86 passed; fixture `nera build` 16 pages 0 errors; `nera validate --json` and `nera check --json` → ok, `[]`; `npm pack --dry-run` lists only package.json, README, LICENSE, views/, assets/, config/.
- **Review findings:** `CHANGELOG.md:9-17` bullets are `    - …` (four-space indent → GitHub renders a code block); the fleet uses `-   …` (nera-plugin-sitemap). Caused by the brief's wording, not the cloud.

### Decisions
- Fixture plugins resolve through the root `node_modules` (no install in `test/site`).
- Tests build four fixture variants once each in a temp mirror (default, overrides, no plugins, `base_path: /sub`).
- Only the six §S2.2 helpers + one internal `themeBlog` object at Pug top level (plugin-tags' `const lang` clash).
- Dates formatted and grouped in UTC; `tokens.pug` also drops unsafe names; `extra_css` refuses `/\…`; §S2.8 rule 2 requires a `layout`; empty legal nav omitted; undated posts skipped in the archive.
- `--nera-code-*` mapping on `.nera-code-scope, .nera-code`; fixture `copy_button: false`, plugin-tags `group_by_lang: true`; validate.yaml promotes all 21 output rules to `error`; vitest `isolate: false`.

### Carry forward
- core: `checkThemeCompatibility` uses `require.resolve('<plugin>/package.json')`, which throws for plugins whose `exports` lists only `.` → peer-range warning never fires.
- core: js-beautify 2 → nopt@10/abbrev@5 need Node `^22.22.2 || ^24.15 || >=26`, core declares `^20.19.0 || >=22.0.0` → EBADENGINE on Node 20 and 22 < 22.22.2 (seen locally on 22.22.0).
- fleet: vitest 5 needs Node ≥ 22.12, `test.yml` matrices still run Node 20.
- spec note into `generator/ROADMAP-themes.md` §S4 (+ §S2 rules: layout-required homeHref, top-level-names rule).
- release 1.0.0 bootstrap + x.y.1 CI; GitHub ruleset, secret scanning, private vulnerability reporting.
- CHANGELOG bullet format (review finding).

## Browser test (2026-10-14)

Result: pass

| # | case | result |
|---|---|---|
| 1 | home, desktop: cards newest first, image card, "Recent posts" | pass |
| 2 | post: meta line, media seam, code block in `.nera-code-scope`, 2 tag links, prev/next | pass |
| 3 | skip link first in tab order; on focus visible, 3px solid outline rgb(26,90,166) | pass |
| 4 | de archive: `lang=de`, years 2026/2025/2024, tabular-nums dates, switch with hreflang+lang, tag cloud | pass |
| 5 | 375 px (iframe): home, post, de archive, tag page — scrollWidth 375, nothing wider, nav wraps, `pre` scrolls | pass |
| 6 | one `<h1>` per page; no off-site src/href except the fixture's own GitHub link; only script is vite's dev client | pass |

## Triage (2026-10-14)

| # | item | from | disposition | why |
|---|---|---|---|---|
| 1 | CHANGELOG bullets `    - …` render as a code block; fleet uses `-   …` | review | fix | in this repo, a few lines; caused by the brief's wording, fix locally |
| 2 | core `installedVersion` → `require.resolve('<plugin>/package.json')` throws `ERR_PACKAGE_PATH_NOT_EXPORTED` (reproduced with plugin-tags), so the theme peer-range warning never fires | cloud | file | other repo (generator), core release |
| 3 | core's js-beautify 2 → nopt@10/abbrev@5 need Node ≥ 22.22.2 / 24.15; core declares `^20.19.0 \|\| >=22.0.0` → EBADENGINE (seen on 22.22.0 here) | cloud | file | other repo (generator); engines floor or dependency pin decision |
| 4 | vitest 5 needs Node ≥ 22.12; every fleet `test.yml` still runs Node 20 | cloud | file | fleet-wide decision across ~24 repos |
| 5 | spec note into `generator/ROADMAP-themes.md` §S4 (+ §S2: layout-required homeHref, top-level-names rule) | cloud | reconcile | Step 9 |
| 6 | release 1.0.0 bootstrap + 1.0.1 CI OIDC; ruleset, secret scanning, private vulnerability reporting | cloud | reconcile | Step 9, the user's go |

Already done / elsewhere: none on the board (no core, fleet or engines issue matches 2–4).
Planning signal: the brief's "four spaces (`    - …`)" came from the workspace CLAUDE.md wording; that line should say `-   …`.

## Fixes after triage (2026-10-15)

User chose option 2 (fix everything, file nothing).
- 1 CHANGELOG bullets → `-   …` (fc9ba17 on the branch); workspace CLAUDE.md wording corrected.
- 2 core `installedVersion` reads package.json from Node's node_modules search paths; test added; core 4.16.3 bumped (generator 1679776).
- 3 already settled in core 4.16.2 (a0d637a): js-beautify 2 chosen over glob@10 deprecation, EBADENGINE documented as harmless. No change.
- 4 Node 20 dropped from all 27 fleet test.yml matrices → [22, 24], `engines` unchanged, no releases; every repo's CI commands pass on Node 24.21.0; nera-website deploy.yml 20 → 24.
- 5 spec note + two §S2 rules in generator/ROADMAP-themes.md (a84fa3a).

## Release (2026-10-15)

- 1.0.0 published by hand (user); Trusted Publisher configured.
- v1.0.1 CI publish failed: package test under npm 12 (`npm pack --json` is an object keyed by name). Moving the tag was refused (destructive), so the fix shipped as 1.0.2.
- 1.0.2 published by CI OIDC 2026-10-15 (Trusted Publisher validated): plugin-feed override documented for the `feed-link` seam, test reads the version from the CHANGELOG and accepts both pack JSON shapes.
- Along the way: core 4.16.3 (CI), plugin-feed 1.0.2 (README, CI), Node 20 dropped from 27 fleet CI matrices, nera.js.org redeployed (Node 24). Spec notes: generator ROADMAP-themes §S4, nera-cli ROADMAP-ai slice 5.
- GitHub: ruleset, secret scanning, private vulnerability reporting, sponsorships on.
