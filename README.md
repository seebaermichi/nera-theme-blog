# @nera-static/theme-blog

[![Test](https://github.com/seebaermichi/nera-theme-blog/actions/workflows/test.yml/badge.svg)](https://github.com/seebaermichi/nera-theme-blog/actions/workflows/test.yml)
[![npm version](https://img.shields.io/npm/v/@nera-static/theme-blog)](https://www.npmjs.com/package/@nera-static/theme-blog)

A theme for the [Nera](https://github.com/seebaermichi/nera) static site generator, made for personal and team blogs: reading comfort first, posts by date, tags, prev/next and code blocks. It is presentation only — Pug views, one stylesheet and a `config/theme.yaml` of design tokens — and carries the Nera blog starter.

📖 **Documentation:** [nera.js.org](https://nera.js.org)

- **"Plain"**: black on white, one system sans-serif, no colour. Dates, years, the author line and a post's facts sit in a margin on the left, the words in the column beside it; below 48rem the margin folds away and everything stacks. Links are underlined, never coloured.
- **One contract with Stack, Ansitz and Umwege**: the same page types, `config/theme.yaml` keys and frontmatter as [`@nera-static/theme-stack`](https://www.npmjs.com/package/@nera-static/theme-stack), [`theme-ansitz`](https://www.npmjs.com/package/@nera-static/theme-ansitz) and [`theme-umwege`](https://www.npmjs.com/package/@nera-static/theme-umwege), so a blog moves between the four by changing `theme:` alone (see [Switching themes](#switching-between-the-blog-themes)).
- **No JavaScript** and **no third-party request**: no script, no web font, no `url()`, no CDN. Every URL the theme emits or its CSS loads is a root-absolute path on your own site, and it works under a `base_path`.
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
| `pages/home.pug` | the front page | page header, body (only when it has one), the newest post large under "Latest post", the next `blog.home_posts` posts under "Recent posts" with a link to the archive (`archive_href`), the featured series (`blog.featured_series`), the highlight list (`blog.highlight_tag`), the about block (`author.*`), the `tag-cloud` seam |
| `pages/post.pug` | one post | post header (the series line, title, the author line with the initials, published, updated, lead), the `post-media` seam when the post has an `image`, its `facts`, the body, the `post-tags` seam, the parts of its series, the `post-pagination` seam |
| `pages/archive.pug` | all posts | page header, body, the posts grouped by year (newest first) with the count per year, each row day and month and title, the `tag-cloud` seam |
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
| `author` | string | post: the author line (else `author.name` in `config/theme.yaml`) |
| `archive_href` | site path | home: the "All posts" link |
| `image`, `image_alt` | path, string | whether a post has a picture: with `image`, the `post-media` and `card-media` seams render it (through plugin-images); without, there is no media element |
| `tags` | list of strings | `blog.highlight_tag` selects posts by it; plugin-tags reads it too, and the `post-tags` seam shows it |
| `series`, `series_part` | string, integer | above the title: "Series: name · Part n"; under the post: the parts of the series in the page's language, ordered by `series_part`, numbered `01`, `02` …, the current one marked |
| `facts` | list of `{ label, value }`, at most four | a post's figures, in the margin beside the text (above it on a phone). Give a value its unit: `1 hour a week` |
| `location`, `image_note` | strings | not rendered by this theme (Ansitz and Umwege show them); harmless, so switching themes keeps them |

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
        bg: '#ffffff'          # page background
        surface: '#f5f5f4'     # inline code, plain code blocks
        text: '#141414'        # body text, headings, marks
        muted: '#676767'       # dates, captions, meta lines, labels, the footer
        accent: '#000000'      # links, buttons
        accent_text: '#ffffff' # text on accent (the skip link)
        border: '#e4e4e2'      # hairlines, table rules, code blocks
        focus: '#141414'       # the :focus-visible outline
    font:
        body: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
        heading: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
        mono: "ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace"
    size:
        base: '1.0625rem'      # body text size (the root font size stays the browser's)
        measure: '38.25rem'    # width of the reading column (612 px)
        width: '50rem'         # margin and column together, header and footer (800 px)
        radius: '0.375rem'     # corners of pictures and code blocks
        space: '1.5rem'        # vertical rhythm
extra_css: []
footer_links: []
blog:
    post_layouts: ['pages/post.pug']
    home_posts: 9
    featured_series: ''
    highlight_tag: ''
author:
    name: ''
    bio: ''
    href: ''
```

| key | meaning |
|---|---|
| `label` | the theme's human name |
| `tokens.<group>.<name>` | each token becomes the CSS custom property `--theme-<group>-<name>` (`_` → `-`) in an inline `<style>`. A value containing `<`, `>`, `{`, `}` or `;` is dropped, so a typo cannot break out of the rule. `theme.css` repeats every default, so the page is styled even if the `<style>` is blocked (a strict `style-src` CSP). |
| `extra_css` | stylesheets linked after `theme.css`, in order. Only root-absolute paths (`/css/custom.css`) are linked; anything else, `https://…` and `//…` included, is ignored. |
| `footer_links` | the footer's legal links: `{ label, href }`. `label` goes through `t()`; `href` is a path or a `{ <lang>: path }` map, and an entry without a path for the page's language is left out. |
| `blog.post_layouts` | the layouts that make a page a post |
| `blog.home_posts` | how many posts the home lists **after** the newest one, which opens the home large and is never counted (default `9`, so ten posts in all) |
| `blog.featured_series` | a `series` name: the home lists its parts in the page's language, with a "Read more" link to part one. Nothing when no part exists |
| `blog.highlight_tag` | a tag: the home lists the four newest posts whose `tags` contain it, with their dates, under the tag as heading. No link to the tag page |
| `author.name`, `author.bio` | the about block on the home (the initials in a round mark, "About the author", the name, the bio) and the author line under a post's title. Without `author.name` neither appears; a post's own `author` wins on that post |
| `author.href` | the about block's "Read more" link; a path or a `{ <lang>: path }` map, like `footer_links` |

The keys of `blog.*` and `author.*` mean the same in Stack, Ansitz and Umwege, so they carry over when you switch.

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

**Fonts.** The theme uses system font stacks and ships no font files (unlike Stack, Ansitz and Umwege, which ship webfonts). To use a web font, self-host it: the files in `theme/assets/fonts/`, an `@font-face` in your `custom.css`, the family in `tokens.font.*`. Never a font CDN.

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
        Latest post: Neuester Beitrag
        Series: Serie
        Part: Teil
        About the author: Über die Autorin
        Read more: Weiterlesen
        posts: Beiträge
        # your footer_links labels
        Imprint: Impressum
        Privacy: Datenschutz
        # plugins: plugin-page-pagination, plugin-tags
        Pagination: Blätternavigation
```

| key | where |
|---|---|
| `Skip to content` | the skip link |
| `Main navigation` | `aria-label` of the header navigation |
| `Language` | `aria-label` of the language switch |
| `Legal` | `aria-label` of the footer's legal links |
| `Recent posts` | heading of the home's post list |
| `All posts` | the home's link to the archive |
| `Latest post` | heading over the newest post on the home |
| `Published`, `Updated`, `By` | a post's meta line |
| `Series`, `Part` | the series line above a post's title, the label of the home's series and the `aria-label` of a post's series list |
| `About the author` | label of the home's about block |
| `Read more` | the links of the home's series and about block (plugin-tags uses the key too) |
| `posts` | the count under a year in the archive ("4 posts") |
| `language_name` | each language's own name in the language switch (falls back to the upper-case code) |

The language switch appears when `translations` has two or more languages. For each other language it links the page with the same `slug` in that language, else that language's home page (its `index.html` with the shortest path), else leaves the language out. When no other language is left, there is no switch (e.g. a German-only site whose `translations` still holds an `en` entry).

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

The views and partials, all part of the contract: `layouts/layout.pug`; `partials/head.pug`, `tokens.pug`, `helpers.pug`, `header.pug`, `lang-switch.pug`, `footer.pug`, `scripts.pug`, `page-header.pug` (the page's `<h1>` and lead), `post-card.pug` (one post in a list; `item`, `position` and `featured` in scope), `home-series.pug`, `home-highlight.pug` and `home-about.pug` (the home's blocks); the seams above; `pages/home.pug`, `post.pug`, `archive.pug`, `tag.pug`, `default.pug`.

`partials/helpers.pug` defines the functions the views call: `pageLang(page)`, `sameLang(page)`, `homeHref(lang)`, `formatDate(value, lang)`, `isoDate(value)` and `hrefFor(value, lang)`. A layout of your own includes it first (`include ../partials/helpers.pug`). It also defines `themeBlog`, an object the theme's own views use internally; it is not part of the contract.

### Classes

The theme's public classes, safe to style in your `custom.css`:

- shell: `skip-link`, `site-header`, `site-header__inner`, `site-header__brand`, `site-header__nav`, `lang-switch`, `lang-switch__list`, `lang-switch__item`, `lang-switch__link`, `site-main`, `page__header`, `page__title`, `page__lead`, `page__body`, `site-footer`, `site-footer__inner`, `site-footer__legal`, `site-footer__copy`
- post: `post`, `post__header`, `post__title`, `post__meta`, `post__date`, `post__updated`, `post__author`, `post__lead`, `post__media`, `post__image`, `post__body`, `post__footer`, `post__tags`, `post__pagination`
- post, shared with the other blog themes: `post__series`, `post-author`, `post-author__mark`, `post-author__name`, `post-facts`, `post-facts__item`, `post-facts__label`, `post-facts__value`, `post-series`, `post-series__title`, `post-series__list`, `post-series__item`, `post-series__item--current`
- lists: `post-list`, `post-list__title`, `post-list__items`, `post-list__item`, `post-list__more`, `post-card`, `post-card--featured`, `post-card__media`, `post-card__image`, `post-card__body`, `post-card__title`, `post-card__link`, `post-card__meta`, `post-card__date`, `post-card__excerpt`, `post-archive__year`, `post-archive__count`, `post-archive__list`, `post-archive__item`, `tag-page`
- home: `home-series`, `home-highlight`, `home-about`, `home-about__mark`, `home-about__links`, `button`

Markup of the shared parts: `section.home-series` → `div` (`p` label, `h2` name, `a.button`) + `ol` → `li` → `a`; `section.home-highlight` → `h2` + `ul` → `li` → `a` + `time`; `section.home-about` → `span.home-about__mark` + `div` (`p`, `h2`, `p`) + `div.home-about__links` → `a.button`; `p.post__meta` → `span.post-author` (`span.post-author__mark`, `span.post__author.post-author__name`) + the date spans; `dl.post-facts` → `div.post-facts__item` → `dt` + `dd`; `nav.post-series` → `h2.post-series__title` + `ol.post-series__list` → `li.post-series__item` → `span` (the number) + `a`; a card → `div.post-card__media` (only with an `image`) + `div.post-card__body` (`h3.post-card__title`, `p.post-card__excerpt`, `p.post-card__meta` → `time.post-card__date`).

The classes of the other blog themes for elements Plain does not draw (`home-hero*`, `button--primary`, `post-card__location`, `post-card__facts`, `post-card__cover*`, `post__location`, `home-pass*`, `home-statement`, `post__image-note`) are not rendered.

The plugin classes the theme styles, all optional peer dependencies:

| plugin | peer range | classes |
|---|---|---|
| `@nera-static/plugin-tags` | `^3.4.1` | `tag-cloud`, `tag-cloud__item`, `tag-links`, `tag-links__item`, `tag-overview` and its elements (`__header`, `__title`, `__image`, `__content`, `__item`, `__item-title`, `__item-date`, `__item-description`, `__item-link`) |
| `@nera-static/plugin-page-pagination` | `^2.4.0` | `page-pagination`, `page-pagination__link`, `page-pagination__link--previous`, `page-pagination__link--next` |
| `@nera-static/plugin-code-blocks` | `^1.2.1` | `nera-code` (custom properties only), `nera-code-scope` |
| `@nera-static/plugin-images` | `^1.0.3` | `nera-image`, `nera-image__caption` |
| `@nera-static/plugin-navigation` | `^3.1.0` | `nav`, `nav--list`, `nav__item`, `nav__link`, `nav__link--active`, `nav__link--active-path` — only inside `.site-header__nav`; keep the plugin's default class names |
| `@nera-static/plugin-social-media-links` | `^2.3.0` | `social-media-links`, `social-media-links__list`, `__item`, `__link`, `__icon`, `__label` — only inside `.site-footer` |

## What your site must do

The theme guarantees its own markup. Your content and the plugin output are yours; for `nera check` to report nothing:

1. Keep a `theme/views/` folder, and delete the `nera:scaffold-default` starter files from it.
2. Publish every plugin template you use (`npx nera-<plugin>`) and fill the seams; keep plugin-navigation's default class names and call `+linkListNav` (with `rootPath` for a language folder).
3. Use `@nera-static/plugin-page-pagination` 2.4.0 or later (its `<nav>` is labelled) and translate `Pagination`.
4. Never include `fontawesome-cdn-link.pug`. External links may open in a new tab (plugin-link-attributes, `open_in_new_tab: true` in `config/social-media-links.yaml`): the theme marks every `a[target="_blank"]` with `↗`. Then turn `a11y-target-blank` off in `config/validate.yaml`, the one rule that reports every such link; with `open_in_new_tab: false` and no plugin-link-attributes it stays clean.
5. Set `footer_links` to your imprint and privacy pages, per language, with labels the legal checks recognise (`Imprint`/`Impressum`, `Privacy`/`Datenschutz`); legal texts cite § 5 DDG and the TDDDG, not the TMG or TTDSG.
6. Translate every theme key, `language_name` per language, and your `footer_links` labels.
7. Start page bodies at `##`, give every image an `alt`, every post a `date`, and the translations of one page the same `slug`.
8. With plugin-tags: `tag_overview_layout: 'pages/tag.pug'` in `config/tags.yaml` (and `group_by_lang: true` on a multilingual site). With plugin-code-blocks: `extra_css: ['/_nera/code-blocks.css']`.

`test/site/` in this repository is a complete example: the sample blog "Marginalia" in English and German (posts with and without a picture, a series of three, a post with facts, an author and a highlight tag) with every step above applied, checked in CI with every `nera check` rule on except `a11y-target-blank` (its external links open in a new tab).

## Switching between the blog themes

`theme-blog` ("Plain"), `theme-stack` (code), `theme-ansitz` (photographs) and `theme-umwege` (travel) share their page types, seams, `config/theme.yaml` keys, frontmatter and `t()` keys, so a blog switches by changing `theme:` in `config/app.yaml` (and installing the package). What one theme does not draw it ignores: Plain shows no `location` or `image_note`, Stack no highlight list, Umwege no featured series. Each theme's `blog.home_posts` counts the cards after its home's large opening, with a default that fills its own grid (Plain 9, Stack 6, Ansitz and Umwege 7); a value in your `config/theme.yaml` applies to whichever theme you use. Token values are each theme's own: your colours and sizes carry over, but you may want to drop them when you switch. Your seam overrides and vendor copies carry over unchanged.

## Accessibility and privacy

- Skip link first, one `<main id="main">`, one `<h1>`, no skipped heading level, every theme `<nav>` labelled, `<html lang>` always set, a zoomable viewport, no `target="_blank"` in theme markup (links your site opens in a new tab are marked with `↗`).
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
