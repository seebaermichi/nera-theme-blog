# Changelog

All notable changes to `@nera-static/theme-blog` are documented in this file. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and the theme follows [semantic versioning](https://semver.org/) over its contract (see the README).

## [1.0.1] - 2026-10-15

### Changed

-   The `feed-link.pug` seam is no longer "reserved for the planned" `@nera-static/plugin-feed`: the plugin is released, so the seam's comment and the README show its override, `include /vendor/plugin-feed/feed-link` (after `npx nera-feed`, with `origin` set in `config/app.yaml`). The seam itself is unchanged.

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
