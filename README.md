# @nera-static/theme-blog

[![Test](https://github.com/seebaermichi/nera-theme-blog/actions/workflows/test.yml/badge.svg)](https://github.com/seebaermichi/nera-theme-blog/actions/workflows/test.yml)
[![npm version](https://img.shields.io/npm/v/@nera-static/theme-blog)](https://www.npmjs.com/package/@nera-static/theme-blog)

A theme for the [Nera](https://github.com/seebaermichi/nera) static site generator, made for personal and team blogs: reading comfort first, posts by date, tags, prev/next and code blocks. It is presentation only — Pug views, one stylesheet and a `config/theme.yaml` of design tokens — and carries the Nera blog starter.

📖 **Documentation:** [nera.js.org](https://nera.js.org)

- **"Quiet paper"**: a warm off-white page, one centred reading column, a serif for running text, a system sans-serif for headings, dates and navigation, a rust accent, underlined links.
- **No JavaScript** and **no third-party request**: no script, no web font, no CDN. Every URL the theme emits or its CSS loads is a root-absolute path on your own site, and it works under a `base_path`.
- **Accessible by default**: skip link, one `<main id="main">`, one `<h1>` per page, labelled navigation, visible focus, a language switch with `hreflang` and `lang`, contrast of at least 4.5:1 for every default colour pair, no motion for visitors who asked for less.
- **Plugins are optional**: plugin output reaches a page only through *seams* you fill; without a plugin the seam renders nothing.

## Installation

```bash
npm install @nera-static/theme-blog
```

In your site's `config/app.yaml`:

```yaml
theme: blog
```

The theme needs Nera's engine, `@nera-static/core`, **4.15.0 or later** (`"nera": { "generator": ">=4.15.0" }`); an older one fails the build with a message naming the range. `npm ls @nera-static/core` shows yours, `npm update @nera-static/core` brings it up. Keep a `theme/views/` folder in your site (it holds your vendor copies and seam overrides anyway), and remove the `nera new` starter files `theme/views/layouts/layout.pug` and `theme/views/pages/default.pug` if they still carry the `nera:scaffold-default` line, or they hide the theme's files (`nera validate` warns with `theme-shadowed`).

## Page types

Set a page's `layout` to one of these:

| `layout:` | for | renders |
|---|---|---|
| `pages/home.pug` | the front page | page header, body (an intro), the newest posts as cards (`blog.home_posts`), a link to the archive (`archive_href`), the `tag-cloud` seam |
| `pages/post.pug` | one post | post header (title, date, update, author, lead), the `post-media` seam, the body, the `post-tags` and `post-pagination` seams |
| `pages/archive.pug` | all posts | page header, body, the posts grouped by year (newest first), the `tag-cloud` seam |
| `pages/tag.pug` | the tag pages of `@nera-static/plugin-tags` | the `tag-overview` seam, which owns the page's `<h1>` |
| `pages/default.pug` | about, legal pages, anything else | page header, body |

The page header is the page's only `<h1>` (from `title`), so **start a page's Markdown at `##`**: a `#` heading would be a second `<h1>`.

**Posts** are the pages whose `layout` is listed in `blog.post_layouts` (default `['pages/post.pug']`) and whose language is the current page's, newest first by date, ties broken by URL. Give every post a `date`: without it Nera falls back to the file's birth time, which a CI checkout stamps the same on every file. Prev/next between posts comes from `@nera-static/plugin-page-pagination`, which pairs pages of the same folder, so keep the posts of one language in a folder of their own (`pages/posts/`, `pages/de/posts/`).

Frontmatter the views read:

| key | type | read by |
|---|---|---|
| `title` | string | every page (`<title>`, the `<h1>`, card and archive titles) |
| `description` | string | every page (`<meta name="description">`); the excerpt on a post card |
| `lead` | string | page and post header |
| `robots` | string | `<meta name="robots">` (else `robots` in `config/app.yaml`) |
| `lang` | string | `<html lang>`, the post selection, dates, `t()` (else `lang` in `config/app.yaml`) |
| `slug` | string | the language switch: translations of one page share a `slug` |
| `date` | date | post, cards, archive (becomes `meta.createdAt`) |
| `updated` | date | post |
| `author` | string | post |
| `archive_href` | site path | home: the "All posts" link |
| `tags` | list | not read by the theme: plugin-tags reads it, the `post-tags` seam shows it |

Dates are printed with `toLocaleDateString(<page language>, { year: 'numeric', month: 'long', day: 'numeric' })` in UTC, so a YAML date (`date: 2026-09-21`) prints the same day wherever the site is built.

## Seams: where plugin output goes

A seam is a partial the theme ships empty (or with a plugin-free default). You fill it by putting a file with the same path into your site's `theme/views/`; your file wins over the theme's. The theme never reads plugin data itself, so a theme update cannot break on a plugin's data shape.

Plugin templates are not found automatically: publish each plugin's templates into your site first, from the site root (`npx nera-<plugin>`, for example `npx nera-tags`); they land in `theme/views/vendor/plugin-<name>/`.

| seam (`theme/views/…`) | where | in scope | typical override |
|---|---|---|---|
| `partials/head-extra.pug` | end of `<head>` | `app`, `meta` | canonical and alternate links |
| `partials/feed-link.pug` | end of `<head>`, before `head-extra.pug` | `app`, `meta` | plugin-feed: the `<link rel="alternate">` to the page language's feed |
| `partials/nav-main.pug` | inside the header's `<nav>` | `app`, `meta` | plugin-navigation |
| `partials/footer-extra.pug` | footer, before the legal links | `app`, `meta` | plugin-social-media-links |
| `partials/scripts-extra.pug` | end of `<body>` | `app`, `meta` | your own `<script type="module">` |
| `partials/post-media.pug` | `div.post__media` of a post | `meta` | plugin-images |
| `partials/card-media.pug` | `div.post-card__media` of a card | `item` (the post) | plugin-images |
| `partials/post-tags.pug` | `div.post__tags` of a post | `meta` | plugin-tags |
| `partials/post-pagination.pug` | `div.post__pagination` of a post | `meta` | plugin-page-pagination |
| `partials/tag-overview.pug` | `section.tag-page` | `meta`, `app` | plugin-tags. Default without the plugin: `h1.page__title` and the body |
| `partials/tag-cloud.pug` | home and archive, after the posts | `app`, `meta` | plugin-tags |

The overrides the blog starter uses, ready to copy:

```pug
//- theme/views/partials/feed-link.pug — npx nera-feed
//- plugin-feed writes a feed only when config/app.yaml sets `origin`.
include /vendor/plugin-feed/feed-link
```

```pug
//- theme/views/partials/nav-main.pug — npx nera-navigation
//- The list form, so the theme's labelled <nav> is the only <nav> around it.
include /vendor/plugin-navigation/partials/link-list-navigation
+linkListNav
```

On a multilingual site, give each language its own menu (`elements: { main_en: […], main_de: […] }` in `config/navigation.yaml`) and pass the language's folder as `rootPath`:

```pug
include /vendor/plugin-navigation/partials/link-list-navigation
+linkListNav(((app.nav || {})[`main_${meta.lang || app.lang}`] || { elements: [] }).elements, '', (meta.lang || app.lang) === app.lang ? '/' : `/${meta.lang}`)
```

```pug
//- theme/views/partials/footer-extra.pug — npx nera-social-media-links
//- Never include fontawesome-cdn-link.pug: it loads icons from a CDN.
include /vendor/plugin-social-media-links/social-media-links
```

```pug
//- theme/views/partials/post-media.pug — npx nera-images
include /vendor/plugin-images/picture
+picture(meta.images && meta.images.image, { alt: meta.image_alt, class: 'post__image', loading: 'eager' })
```

```pug
//- theme/views/partials/card-media.pug
include /vendor/plugin-images/picture
+picture(item.meta.images && item.meta.images.image, { alt: item.meta.image_alt, class: 'post-card__image' })
```

```pug
//- theme/views/partials/post-tags.pug — npx nera-tags
include /vendor/plugin-tags/partials/tag-links
```

```pug
//- theme/views/partials/tag-overview.pug
include /vendor/plugin-tags/pages/tag-overview
```

```pug
//- theme/views/partials/tag-cloud.pug
include /vendor/plugin-tags/partials/tag-cloud
```

```pug
//- theme/views/partials/post-pagination.pug — npx nera-page-pagination
include /vendor/plugin-page-pagination/page-pagination
```

With plugin-images, render the post image eagerly through the seam and set `eager_first: false` in `config/images.yaml`, so it does not compete with the first Markdown image. A post's image is its `image` frontmatter key, its text alternative `image_alt`.

## Configuration: `config/theme.yaml`

The theme's `config/theme.yaml` holds every key with a default. Your site's `config/theme.yaml` is deep-merged over it: set only what you change. Arrays (`extra_css`, `footer_links`, `post_layouts`) are replaced as a whole.

```yaml
label: Blog
tokens:
    color:
        bg: '#fbf9f4'          # page background
        surface: '#f1ece1'     # inline code, quiet areas
        text: '#24211d'        # body text
        muted: '#5c574f'       # dates, captions, meta lines, the footer
        accent: '#8c3a12'      # links, active navigation
        accent_text: '#ffffff' # text on accent (the skip link)
        border: '#ddd5c6'      # hairlines, tag outlines, code blocks
        focus: '#1a5aa6'       # the :focus-visible outline
    font:
        body: "Charter, 'Bitstream Charter', 'Sitka Text', Cambria, Georgia, serif"
        heading: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
        mono: "ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace"
    size:
        base: '1.1875rem'      # root font size
        measure: '38rem'       # width of the reading column
        width: '46rem'         # width of header and footer
        radius: '0'            # corners
        space: '1.75rem'       # vertical rhythm
extra_css: []
footer_links: []
blog:
    post_layouts: ['pages/post.pug']
    home_posts: 10
```

| key | meaning |
|---|---|
| `label` | the theme's human name |
| `tokens.<group>.<name>` | each token becomes the CSS custom property `--theme-<group>-<name>` (`_` → `-`) in an inline `<style>`. A value containing `<`, `>`, `{`, `}` or `;` is dropped, so a typo cannot break out of the rule. `theme.css` repeats every default, so the page is styled even if the `<style>` is blocked (a strict `style-src` CSP). |
| `extra_css` | stylesheets linked after `theme.css`, in order. Only root-absolute paths (`/css/custom.css`) are linked; anything else, `https://…` and `//…` included, is ignored. |
| `footer_links` | the footer's legal links: `{ label, href }`. `label` goes through `t()`; `href` is a path or a `{ <lang>: path }` map, and an entry without a path for the page's language is left out. |
| `blog.post_layouts` | the layouts that make a page a post |
| `blog.home_posts` | how many posts the home lists |

A blog with code blocks, an imprint and a privacy page in English and German:

```yaml
# your site's config/theme.yaml
extra_css: ['/_nera/code-blocks.css']
footer_links:
    - label: Imprint
      href: { en: /imprint.html, de: /de/impressum.html }
    - label: Privacy
      href: { en: /privacy.html, de: /de/datenschutz.html }
```

**Fonts.** The theme uses system font stacks and ships no font files. To use a web font, self-host it: the files in `theme/assets/fonts/`, an `@font-face` in your `custom.css`, the family in `tokens.font.*`. Never a font CDN.

**Code blocks.** `theme.css` maps the tokens onto `@nera-static/plugin-code-blocks`' custom properties (`--nera-code-bg`, `-ink`, `-muted`, `-accent`, `-line`, `-font`, `-radius`) on `.nera-code` and `.nera-code-scope`; the post body carries `nera-code-scope`, so plain fenced blocks match too. Link the plugin's stylesheet with `extra_css: ['/_nera/code-blocks.css']`; the theme never links `/_nera/…` itself. The theme ships no JavaScript, so without your own script the plugin's copy button stays hidden: set `copy_button: false` in `config/code-blocks.yaml`, or load `/_nera/code-blocks.js` from `scripts-extra.pug`.

## Translations

Every string the theme renders goes through `t()` with an English key, so an English site needs nothing. For other languages add the keys under `translations.<lang>` in `config/app.yaml`:

```yaml
translations:
    en:
        language_name: English
    de:
        language_name: Deutsch
        Skip to content: Zum Inhalt springen
        Main navigation: Hauptnavigation
        Language: Sprache
        Legal: Rechtliches
        Recent posts: Neueste Beiträge
        All posts: Alle Beiträge
        Published: Veröffentlicht
        Updated: Aktualisiert
        By: Von
        # your footer_links labels
        Imprint: Impressum
        Privacy: Datenschutz
        # plugins: plugin-page-pagination, plugin-tags
        Pagination: Blätternavigation
        Read more: Weiterlesen
```

| key | where |
|---|---|
| `Skip to content` | the skip link |
| `Main navigation` | `aria-label` of the header navigation |
| `Language` | `aria-label` of the language switch |
| `Legal` | `aria-label` of the footer's legal links |
| `Recent posts` | heading of the home's post list |
| `All posts` | the home's link to the archive |
| `Published`, `Updated`, `By` | a post's meta line |
| `language_name` | each language's own name in the language switch (falls back to the upper-case code) |

The language switch appears when `translations` has two or more languages. For each other language it links the page with the same `slug` in that language, else that language's home page (its `index.html` with the shortest path), else leaves the language out.

## Overriding the theme

| to change | do this | keeps theme updates for |
|---|---|---|
| a colour, a font, a width | the token in your `config/theme.yaml` | everything |
| a few CSS rules | `theme/assets/css/custom.css` + `extra_css: ['/css/custom.css']` | everything |
| where plugin output goes | override a seam | every other file |
| one partial or page type | copy it to `theme/views/<same path>` | every other file |
| the whole shell | override `layouts/layout.pug` | page types, partials, CSS |
| a new page type | `theme/views/pages/<name>.pug` with `extends ../layouts/layout.pug` | everything |

Never override `assets/css/theme.css` unless you accept losing its updates.

The layout defines these blocks, for your own page types:

| block | where | default |
|---|---|---|
| `head` | end of `<head>`, after `head-extra.pug` | empty |
| `header` | start of `<body>`, after the skip link | the site header |
| `main` | inside `main#main.site-main` | the page's content |
| `footer` | after `</main>` | the site footer |
| `scripts` | end of `<body>` | `scripts-extra.pug` |

```pug
//- theme/views/pages/note.pug
extends ../layouts/layout.pug

block main
    include ../partials/page-header.pug
    .page__body
        != content
```

The views and partials, all part of the contract: `layouts/layout.pug`; `partials/head.pug`, `tokens.pug`, `helpers.pug`, `header.pug`, `lang-switch.pug`, `footer.pug`, `scripts.pug`, `page-header.pug` (the page's `<h1>` and lead) and `post-card.pug` (one post in a list, `item` in scope); the seams above; `pages/home.pug`, `post.pug`, `archive.pug`, `tag.pug`, `default.pug`.

`partials/helpers.pug` defines the functions the views call: `pageLang(page)`, `sameLang(page)`, `homeHref(lang)`, `formatDate(value, lang)`, `isoDate(value)` and `hrefFor(value, lang)`. A layout of your own includes it first (`include ../partials/helpers.pug`). It also defines `themeBlog`, an object the theme's own views use internally; it is not part of the contract.

### Classes

The theme's public classes, safe to style in your `custom.css`:

- shell: `skip-link`, `site-header`, `site-header__inner`, `site-header__brand`, `site-header__nav`, `lang-switch`, `lang-switch__list`, `lang-switch__item`, `lang-switch__link`, `site-main`, `page__header`, `page__title`, `page__lead`, `page__body`, `site-footer`, `site-footer__inner`, `site-footer__legal`, `site-footer__copy`
- post: `post`, `post__header`, `post__title`, `post__meta`, `post__date`, `post__updated`, `post__author`, `post__lead`, `post__media`, `post__image`, `post__body`, `post__footer`, `post__tags`, `post__pagination`
- lists: `post-list`, `post-list__title`, `post-list__items`, `post-list__item`, `post-list__more`, `post-card`, `post-card__media`, `post-card__image`, `post-card__title`, `post-card__link`, `post-card__date`, `post-card__excerpt`, `post-archive__year`, `post-archive__list`, `post-archive__item`, `tag-page`

The plugin classes the theme styles, all optional peer dependencies:

| plugin | peer range | classes |
|---|---|---|
| `@nera-static/plugin-tags` | `^3.3.0` | `tag-cloud`, `tag-cloud__item`, `tag-links`, `tag-links__item`, `tag-overview` and its elements (`__header`, `__title`, `__image`, `__content`, `__item`, `__item-title`, `__item-date`, `__item-description`, `__item-link`) |
| `@nera-static/plugin-page-pagination` | `^2.4.0` | `page-pagination`, `page-pagination__link`, `page-pagination__link--previous`, `page-pagination__link--next` |
| `@nera-static/plugin-code-blocks` | `^1.2.1` | `nera-code` (custom properties only), `nera-code-scope` |
| `@nera-static/plugin-images` | `^1.0.2` | `nera-image`, `nera-image__caption` |
| `@nera-static/plugin-navigation` | `^3.1.0` | `nav`, `nav--list`, `nav__item`, `nav__link`, `nav__link--active`, `nav__link--active-path` — only inside `.site-header__nav`; keep the plugin's default class names |
| `@nera-static/plugin-social-media-links` | `^2.3.0` | `social-media-links`, `social-media-links__list`, `__item`, `__link`, `__icon`, `__label` — only inside `.site-footer` |

## What your site must do

The theme guarantees its own markup. Your content and the plugin output are yours; for `nera check` to report nothing:

1. Keep a `theme/views/` folder, and delete the `nera:scaffold-default` starter files from it.
2. Publish every plugin template you use (`npx nera-<plugin>`) and fill the seams; keep plugin-navigation's default class names and call `+linkListNav` (with `rootPath` for a language folder).
3. Use `@nera-static/plugin-page-pagination` 2.4.0 or later (its `<nav>` is labelled) and translate `Pagination`.
4. Never include `fontawesome-cdn-link.pug`; set `open_in_new_tab: false` in `config/social-media-links.yaml`.
5. Set `footer_links` to your imprint and privacy pages, per language, with labels the legal checks recognise (`Imprint`/`Impressum`, `Privacy`/`Datenschutz`); legal texts cite § 5 DDG and the TDDDG, not the TMG or TTDSG.
6. Translate every theme key, `language_name` per language, and your `footer_links` labels.
7. Start page bodies at `##`, give every image an `alt`, every post a `date`, and the translations of one page the same `slug`.
8. With plugin-tags: `tag_overview_layout: 'pages/tag.pug'` in `config/tags.yaml` (and `group_by_lang: true` on a multilingual site). With plugin-code-blocks: `extra_css: ['/_nera/code-blocks.css']`.

`test/site/` in this repository is a complete example: the blog starter's pages in English and German with every step above applied, checked in CI with every `nera check` rule on.

## Accessibility and privacy

- Skip link first, one `<main id="main">`, one `<h1>`, no skipped heading level, every theme `<nav>` labelled, `<html lang>` always set, a zoomable viewport, no `target="_blank"`.
- `:focus-visible` gets a 3px outline in the `focus` colour. No animation, no smooth scrolling; the few transitions run only for visitors without a reduced-motion preference.
- The eight default colour pairs (`text`, `muted` and `accent` on `bg` and `surface`, `accent_text` on `accent`, `focus` on `bg`) reach at least 4.5:1.
- No JavaScript, no cookies or device storage, no request to another host. Narrow screens are handled by CSS alone: the header navigation wraps.

## Versioning

The theme follows semantic versioning over its contract: view, partial, seam and block paths; token names and every `config/theme.yaml` key; the `t()` keys; the frontmatter and `app.*` keys it reads; the public classes; the plugin classes it styles.

| change | release |
|---|---|
| remove or rename any of these, change an element or its nesting under a public class, change what a key means, raise the `nera.generator` floor, drop a plugin major | major |
| add a view, seam, block, token, key or class; add a plugin major to a peer range; change a token's default | minor (a new `t()` key is named in the [changelog](CHANGELOG.md)) |
| a CSS or markup fix that keeps the contract, an accessibility fix, docs | patch |

## Development

```bash
npm ci
npm run lint
npx vitest run     # builds the fixture site in temporary copies and checks it
```

To look at the fixture site: `cd test/site && npx nera build && npx nera serve`.

## License

MIT
