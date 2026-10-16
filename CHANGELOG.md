# Changelog

All notable changes to `@nera-static/theme-blog` are documented in this file. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and the theme follows [semantic versioning](https://semver.org/) over its contract (see the README).

## [1.1.0] - 2026-10-16

### Changed

-   `engines.node` is now `>=22.12.0` (was `^20.19.0 || >=22.0.0`), documenting the real floor. A site installs the theme next to `@nera-static/nera`, which brings vite 8, and the npm 10.8.2 bundled with Node 20 crashes in arborist (`Cannot read properties of null (reading 'edgesOut')`) on the optional peer dependencies of current vite 8 releases, so a fresh site cannot be installed there. Node 22.12 bundles npm 10.9, which installs it, and Node 20 is past its end of life. The theme's views and assets are unchanged, and so is its engine range (`"nera": { "generator": ">=4.15.0" }`).

## [1.0.3] - 2026-10-15

### Fixed

-   The language switch is no longer rendered when no other language has a page to link. A site with two `translations` entries but pages in one language only (what `nera new --starter blog --lang de` leaves: a `de` entry copied from `en`, and `en` kept) showed a switch with a single, current item.

## [1.0.2] - 2026-10-15

### Changed

-   The `feed-link.pug` seam is no longer "reserved for the planned" `@nera-static/plugin-feed`: the plugin is released, so the seam's comment and the README show its override, `include /vendor/plugin-feed/feed-link` (after `npx nera-feed`, with `origin` set in `config/app.yaml`). The seam itself is unchanged.

## [1.0.1] - 2026-10-15 [NOT PUBLISHED]

The `v1.0.1` tag's CI publish failed in the package test under npm 12 (`npm pack --json` changed shape), so 1.0.1 never reached npm; its change ships in 1.0.2.

## [1.0.0] - 2026-10-14

### Added

-   The "Quiet paper" blog theme: `views/`, `assets/css/theme.css` and `config/theme.yaml`, presentation only — no JavaScript, no web fonts, no third-party request.
-   Page types `pages/home.pug` (the newest `blog.home_posts` posts as cards, a link to `archive_href`), `pages/post.pug`, `pages/archive.pug` (posts grouped by year), `pages/tag.pug` (the tag pages of `@nera-static/plugin-tags`) and `pages/default.pug`.
-   The shell `layouts/layout.pug` with the blocks `head`, `header`, `main`, `footer` and `scripts`; the partials `head.pug`, `tokens.pug`, `helpers.pug` (`pageLang`, `sameLang`, `homeHref`, `formatDate`, `isoDate`, `hrefFor`), `header.pug`, `lang-switch.pug`, `footer.pug`, `scripts.pug`, `page-header.pug` and `post-card.pug`.
-   Seams `head-extra.pug`, `nav-main.pug`, `footer-extra.pug`, `scripts-extra.pug`, `post-media.pug`, `card-media.pug`, `post-tags.pug`, `post-pagination.pug`, `tag-overview.pug`, `tag-cloud.pug` and the reserved, empty `feed-link.pug` for the planned `@nera-static/plugin-feed`.
-   Design tokens `tokens.color.*` (`bg`, `surface`, `text`, `muted`, `accent`, `accent_text`, `border`, `focus`), `tokens.font.*` (`body`, `heading`, `mono`) and `tokens.size.*` (`base`, `measure`, `width`, `radius`, `space`), emitted as `--theme-*` custom properties; the keys `label`, `extra_css`, `footer_links`, `blog.post_layouts` and `blog.home_posts`.
-   `t()` keys `Skip to content`, `Main navigation`, `Language`, `Legal`, `Recent posts`, `All posts`, `Published`, `Updated` and `By`, plus `language_name` read per language by the language switch.
-   Styles for the classes of `@nera-static/plugin-tags` `^3.3.0`, `@nera-static/plugin-page-pagination` `^2.4.0`, `@nera-static/plugin-code-blocks` `^1.2.1` (its `--nera-code-*` properties mapped onto the tokens), `@nera-static/plugin-images` `^1.0.2`, `@nera-static/plugin-navigation` `^3.1.0` and `@nera-static/plugin-social-media-links` `^2.3.0`, all optional peer dependencies.
-   Requires `@nera-static/core` 4.15.0 or later (`nera.generator: >=4.15.0`).
