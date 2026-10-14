# Issue conventions

Review rules for work on `@nera-static/theme-blog`, run through Snagio from
`nera-theme-blog/`. The Snagio project **"Nera AI"** tracks
`../nera-cli/ROADMAP-ai.md` (this theme carries the blog starter of its **L5**);
its issues carry the target repo as a title prefix. **Work an issue only from the
repo it names** — the step skills commit in the current repo.

The workspace `../CLAUDE.md` holds the fleet-wide rules (semver, CHANGELOG,
releases, publishing a brand-new package); this file only adds what a reviewer
checks per diff. Adapted from `nera-plugin-sitemap` (the first plugin repo set up
this way) to a theme; copy it for `nera-theme-business` and swap the names.

## Non-negotiables

- **No own ROADMAP.** `../generator/ROADMAP-themes.md`, "Starter-ready themes", is
  the spec: §S2 (shared contract), **§S4** (this theme), §S5 (semver and release),
  §S6 (what a starter does, which the fixture site does too), §S7 (acceptance) and
  §S8/§S9 (plugin-class record, open questions). A decision made while working an
  issue is written back there in the same pass. Extend it, never fork it.
- **The contract is everything a site can depend on** (§S5): view, page-type, seam
  and partial paths, blocks, token names and every other `config/theme.yaml` key,
  `t()` keys, the frontmatter and `app.*` keys read, the public classes of §S4.6
  and the plugin classes of §S4.5. Classify every change by §S5's table (a new
  `t()` key is minor and is named in the CHANGELOG).
- **Semver + `CHANGELOG.md` in the same commit as the change** (Keep a Changelog,
  four-space bullets, `**BREAKING**:` prefix). Bump with
  `npm version <bump> --no-git-tag-version`, never by hand-editing `package.json`.
- **Never publish or push.** No `npm publish`, no `git push`, no tags pushed, no repo
  created on GitHub, no posts anywhere public. The maintainer bootstrap-publishes
  1.0.0 by hand, then a CI-published x.y.1 within ~2 days so the Trusted Publisher
  does not expire; the session hands over the exact commands.
- **Presentation only.** No JavaScript (no `.js` file in the package, no inline
  script), no third-party request of any kind (fonts, CDNs, analytics): every
  `src`/`href`/`url()` is root-absolute and honours `base_path`.
- **Plugins are optional peers.** Plugin output reaches a page only through a
  seam (§S4.2) the site fills; with no plugin installed every seam renders nothing,
  never broken markup. The theme never ships `views/vendor/` (§4).
- Paste-ready text for the maintainer goes in a fenced code block between
  `----- START: … -----` and `----- END -----` lines, never in a blockquote.

## Framework correctness

- `package.json` exactly per §S2.1 with §S4.5's peers: `files` = `views`, `assets`,
  `config`; `exports` only `./package.json`; `engines` `^20.19.0 || >=22.0.0`;
  `nera.generator` `>=4.15.0` (no upper bound); every peer optional.
- Tokens are `--theme-*` custom properties emitted from the merged
  `app.theme.config` (`config/theme.yaml`, §1c/§S2.5); a value containing `}` is
  never emitted. Code blocks are styled only through `--nera-code-*`.
- Post dates come from frontmatter `date` (`meta.createdAt`, core ≥ 4.7.0), never
  from file birth time. Lists are sorted deterministically (newest first, ties
  broken by a stable key).
- Translations go through `t()` with the keys of §S2.6/§S4.3; `<html lang>` from
  `meta.lang || app.lang`.

## UI / template rules

- Pug; markup and the BEM classes of §S4.6 are a public contract — renaming one or
  changing its element or nesting is **major**.
- Accessibility per §S2.7: one `<h1>` per page, landmarks with names, visible
  focus, skip link, contrast ≥ 4.5:1 for the default token pairs, reduced-motion
  respected. `nera check` with every rule on (§S7) is the judge.
- Interface language of the theme's own docs and messages: English; user-visible
  strings only through `t()`.

## UI walkthrough

- Browser tooling: Playwright MCP (`mcp__playwright__browser_navigate`,
  `mcp__playwright__browser_snapshot`, `mcp__playwright__browser_console_messages`).
- Boot (the fixture site, theme by local path):
  `cd test/site && npm install && npx nera build && npx nera serve --port 3125`
  (Node 22 if npm crashes: `PATH=~/.nvm/versions/node/v22.22.0/bin:$PATH`).
- Base URL / login: http://localhost:3125/, no login.
- Surfaces:
    | surface | url | role | how to open |
    |---|---|---|---|
    | home (recent posts) | `/` and `/de/` | reader | open the URL |
    | post | a fixture post | reader | follow a card |
    | archive (by year) | the archive page | reader | header nav |
    | tag page | a generated tag page | reader | a post's tag link |

## Tests & hygiene

- The repo's CI commands must pass (read `.github/workflows/test.yml`; `npm test`
  is watch mode — never use it here). Run from the package root.
- Every §S7 criterion is checked by a script or a build in CI, against the fixture
  site `test/site/` (en + de, peers as `devDependencies`, `theme: ../..`, §S6
  applied, every `nera check` rule on). No network beyond `npm ci`.
- Generate lockfiles with npm ≥ 10.9 (Node 22); commit them before any workflow
  that runs `npm ci`.
- The repo matches the fleet: `test.yml` and `publish.yml` adapted from a recent
  package (`../nera-plugin-sitemap`), `LICENSE`, `README.md` with the Test and npm
  badges linking https://nera.js.org, `.github/dependabot.yml`, `.github/FUNDING.yml`.

## Step order

1. Toolchain — `package.json`, lockfile, eslint/vitest config, CI workflows — `npm ci` and the CI commands pass
2. Contract — `config/theme.yaml` tokens and keys, view/seam/partial skeleton — contract-present check passes
3. Behaviour — page types, layouts, seams with plugin output, token emission — fixture builds, `nera check` clean
4. UI — `assets/css/theme.css`, the "Quiet paper" look, contrast — §S7 scripts + walkthrough
5. Docs — README, CHANGELOG, §S4 status in `../generator/ROADMAP-themes.md`

## Reconciliation steps (run when resolving an issue)

- Version bump + `CHANGELOG.md` entry in the change's commit, if it ships in the
  tarball; none for tests, fixtures, CI or `.claude/`.
- Update `../generator/ROADMAP-themes.md` §S4 (status, date, choices made) and,
  when the blog slice of L5 moves, `../nera-cli/ROADMAP-ai.md`. Commits in other
  repos — hand them over or make them locally, as the maintainer prefers.
- Hand over the release commands (GitHub repo creation, `git push`, bootstrap
  `npm publish`, `git tag -a v<x.y.z> …`, `../generator/scripts/fleet-check.sh --fix
  nera-theme-blog`) — do not run them.
- If the release changes a contract item (minor or major): check the nera.js.org
  tutorials that stamp this package (`grep -l 'theme-blog:'
  ../nera-website/pages/tutorials/*.md`) — still right → bump their
  `verified_with`; stale → fix in en/de/es or file a `[nera-website] Tutorial …`
  issue. See "Check the tutorials too" in `../CLAUDE.md` and `/tutorial-review`.
- Remove the issue's plan files last, once nothing else needs them:
  `git rm` its tracked files under `plans/` (`plans/issues/<id>-*`,
  `plans/issues/browser-tests/<id>-*`, `plans/cloud/<id>-*`), delete the
  untracked ones, and commit
  `chore(plan): remove the plan files of the resolved <short title> issue`.
  Git history keeps them; `plans/` holds only open issues.
