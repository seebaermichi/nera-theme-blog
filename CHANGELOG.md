# Changelog

All notable changes to `@nera-static/theme-blog` are documented in this file. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and the theme follows [semantic versioning](https://semver.org/) over its contract (see the README).

## [2.0.0] - 2026-11-24

The look "Plain" and the contract the theme now shares with `@nera-static/theme-stack`, `theme-ansitz` and `theme-umwege`, so a blog moves between the four by changing `theme:` alone.

### Added

-   `config/theme.yaml` keys of the blog themes: `blog.featured_series` (the home lists that series' parts, with a "Read more" link to part one), `blog.highlight_tag` (the home lists the four newest posts with that tag, with their dates), `author.name`, `author.bio` and `author.href` (the about block on the home, and the author line under a post's title when the post has no `author` of its own).
-   Frontmatter: `series` and `series_part` (a series line above the title, the parts listed under the post with the current one marked), `facts` (at most four `{ label, value }`, beside the text). `location` and `image_note`, used by Ansitz and Umwege, are accepted and not rendered.
-   Partials `home-series.pug`, `home-highlight.pug` and `home-about.pug`; `post-card.pug` takes `featured` and `position`.
-   Public classes `button`, `post-card--featured`, `post-card__body`, `post-card__meta`, `post__series`, `post-author`, `post-author__mark`, `post-author__name`, `post-facts`, `post-facts__item`, `post-facts__label`, `post-facts__value`, `post-series`, `post-series__title`, `post-series__list`, `post-series__item`, `post-series__item--current`, `home-series`, `home-highlight`, `home-about`, `home-about__mark`, `home-about__links`, `post-archive__count`.
-   New `t()` keys, shown in English until you translate them: `Latest post`, `Series`, `Part`, `About the author`, `Read more`, `posts`.
-   Links your site opens in a new tab (plugin-link-attributes, `open_in_new_tab` of plugin-social-media-links) are marked with `↗`. The theme itself still sets no `target`.

### Changed

-   **BREAKING**: the default look is "Plain": black on white, one system sans-serif (`ui-sans-serif, system-ui, …`) for text and headings, no colour; dates, years, the author line and facts sit in a margin on the left. Every token default changed (see the README's token list); a site that set none of them looks different after the update.
-   **BREAKING**: `blog.home_posts` counts the posts **after** the newest one, which now opens the home large under "Latest post" and is never counted. The default is `9` (was `10`), so an unconfigured home still lists ten posts.
-   **BREAKING**: `size.base` is the body text size, set on `body`; the root font size stays the browser's, so `rem` means 16 px. `size.measure` is `38.25rem` and `size.width` `50rem` (612 and 800 px).
-   **BREAKING**: post card markup: the title and excerpt sit in `div.post-card__body`, the date in `p.post-card__meta` inside it, and `div.post-card__media` is rendered only for a post with an `image`.
-   **BREAKING**: post meta: the author is `span.post-author` (the label, `span.post-author__mark` with the initials, `span.post__author.post-author__name`), first in `p.post__meta`; `div.post__media` is rendered only for a post with an `image`.
-   **BREAKING**: archive rows show day and month (the year is the heading, which also carries `span.post-archive__count`); the home and the archive render `div.page__body` only when the page has a body.
-   **BREAKING**: peer floors `@nera-static/plugin-images ^1.0.3` and `@nera-static/plugin-tags ^3.4.1`.

### Migration from v1.x

1.  Update: `npm install @nera-static/theme-blog@^2.0.0`, and `@nera-static/plugin-images` / `@nera-static/plugin-tags` if older than 1.0.3 / 3.4.1. Republish plugin-tags' templates (`rm -rf theme/views/vendor/plugin-tags && npx nera-tags`) so the tag pages print calendar dates.
2.  `blog.home_posts`: subtract one. The newest post is no longer counted.

    ```yaml
    # 1.x                    # 2.0
    blog:                    blog:
        home_posts: 7            home_posts: 6
    ```

3.  The look: to keep 1.x's "Quiet paper" colours and fonts, set its tokens in your `config/theme.yaml` (`bg: '#fbf9f4'`, `surface: '#f1ece1'`, `text: '#24211d'`, `muted: '#5c574f'`, `accent: '#8c3a12'`, `border: '#ddd5c6'`, `focus: '#1a5aa6'`, `font.body: "Charter, 'Bitstream Charter', 'Sitka Text', Cambria, Georgia, serif"`). Sizes: 1.x's `size.base` scaled the root; to keep 1.x's `measure: '38rem'` at the same width (with 1.x's `base: '1.1875rem'`), write `measure: '45.125rem'` (multiply by 1.1875), and `width: '54.625rem'` for 1.x's `46rem`.
4.  Your own CSS: a rule on `.post-card__date` as a direct grid child of `.post-card` now meets `p.post-card__meta > time.post-card__date`; a rule on `.post__author` still matches (the class is kept), but its parent is `span.post-author`.
5.  Optional, to use the new parts: `author`, `blog.featured_series` and `blog.highlight_tag` in `config/theme.yaml`, `series`, `series_part` and `facts` in a post, and the six new `t()` keys in each translation.

## [1.1.1] - 2026-10-17

### Fixed

-   An `extra_css` entry with a tab, CR or LF anywhere is no longer linked. The URL parser drops those characters, so `"/\t/example.org/x.css"` passed the single-leading-slash check and still loaded `//example.org/x.css`, a third-party stylesheet. Every other entry is linked as before.
-   The `lang-switch.pug` and `tokens.pug` partials no longer declare a top-level name (`languageLinks`, `themeTokenRule`), which could clash with the same name in an included plugin template; both now go through the theme's internal `themeBlog` object, as the theme's other partials do. The rendered pages are unchanged.

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
