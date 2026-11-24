// §S7 "Starter fit (blog)" and §S15 "Starter fit", with the page contents of
// §S11.7 in the look "Plain": the home shows the title and lead, the newest
// post large under "Latest post" (the opening, never counted), the next
// `blog.home_posts` posts under "Recent posts", the featured series, the
// highlight list and the about block. The archive groups by year with a
// count; a tag page has one <h1>; a post shows its tags, its series with the
// current part marked, its facts and prev/next of plugin-page-pagination; a
// post without a picture renders no empty media element; a code block uses
// the --nera-code-* mapping.
import fs from 'fs'
import path from 'path'
import { describe, expect, inject, it } from 'vitest'
import { ROOT } from './helpers/site.js'
import { CODE_MAPPING } from './helpers/contract.js'
import { attr, countTags, elementByClass, page, pages, stripTags, tags } from './helpers/html.js'

const builds = inject('builds')
const pub = builds.default.public
const sections = (html, className) => html.split(`<section class="${className}"`).slice(1).map((s) => s.split('</section>')[0])
const datetimes = (html) => tags(html, 'time').map((a) => attr(a, 'datetime'))
const isDescending = (list) => list.every((value, i) => i === 0 || list[i - 1] >= value)
const cardHrefs = (html) => tags(html, 'a').filter((a) => /post-card__link/.test(a)).map((a) => attr(a, 'href'))
const css = fs.readFileSync(path.join(ROOT, 'assets', 'css', 'theme.css'), 'utf-8')

describe('Starter fit: home', () => {
    const html = page(pub, 'index.html')

    it('shows the page title as the one <h1> and the lead, and no empty body', () => {
        const header = elementByClass(html, 'header', 'page__header')
        expect(header).toMatch(/<h1 class="page__title">Notes from the margin of other work\.<\/h1>/)
        expect(header).toMatch(/<p class="page__lead">Short posts on writing, tools and the small web\./)
        expect(countTags(html, 'h1')).toBe(1)
        expect(html).not.toContain('page__body')
    })

    for (const [lang, home, prefix, latest, recent] of [
        ['en', 'index.html', '/posts/', 'Latest post', 'Recent posts'],
        ['de', 'de/index.html', '/de/posts/', 'Neuester Beitrag', 'Neueste Beiträge'],
    ]) {
        it(`${lang}: opens with the newest post as post-card--featured under "${latest}"`, () => {
            const [opening] = sections(page(pub, home), 'post-list')
            expect(opening).toMatch(new RegExp(`^>\\s*<h2 class="post-list__title">${latest}</h2>`))
            expect(cardHrefs(opening)).toEqual([`${prefix}door-closed.html`])
            expect(opening).toMatch(/<li class="post-list__item">\s*<article class="post-card post-card--featured">/)
        })

        it(`${lang}: lists the next five posts (home_posts: 5, the opening not counted), newest first, none featured`, () => {
            const [, list] = sections(page(pub, home), 'post-list')
            expect(list).toMatch(new RegExp(`^>\\s*<h2 class="post-list__title">${recent}</h2>`))
            expect(cardHrefs(list)).toEqual(['no-analytics', 'plain-text', 'forty-lines', 'notebooks', 'no-comments'].map((slug) => `${prefix}${slug}.html`))
            expect(list).not.toContain('post-card--featured')
            expect(isDescending(datetimes(list))).toBe(true)
            expect(list).toMatch(/class="post-list__more" href="[^"]+(archive|archiv)\.html"/)
        })
    }

    it('counts home_posts after the opening: a site override of 2', () => {
        const [opening, list] = sections(page(builds.overrides.public, 'index.html'), 'post-list')
        expect(cardHrefs(opening)).toEqual(['/posts/door-closed.html'])
        expect(cardHrefs(list)).toEqual(['/posts/no-analytics.html', '/posts/plain-text.html'])
    })

    it('counts home_posts after the opening: the default of 9 lists every other post', () => {
        const [, list] = sections(page(builds.defaults.public, 'index.html'), 'post-list')
        expect(countTags(list, 'article')).toBe(8)
    })

    it('gives a card its picture, title, description and date; a card without a picture has no media element', () => {
        const [, list] = sections(html, 'post-list')
        const [, withPicture, without] = list.split('<li class="post-list__item">')
        expect(withPicture).toMatch(/<div class="post-card__media">\s*<picture>[\s\S]*<img class="post-card__image"[^>]*alt="A dark mountain ridge under heavy cloud"[^>]*loading="lazy"/)
        expect(withPicture).toMatch(/<div class="post-card__body">\s*<h3 class="post-card__title"><a class="post-card__link" href="\/posts\/no-analytics\.html">A year without analytics<\/a><\/h3>/)
        expect(withPicture).toMatch(/<p class="post-card__excerpt">I removed the visitor counter/)
        expect(withPicture).toMatch(/<p class="post-card__meta"><time class="post-card__date" datetime="2026-10-02">October 2, 2026<\/time><\/p>/)
        expect(without).not.toContain('post-card__media')
        expect(without).not.toContain('<picture')
    })

    it('shows the featured series: label, name, Read more to part one, the parts in order', () => {
        const series = elementByClass(html, 'section', 'home-series')
        expect(series).toMatch(/<p>Series<\/p>\s*<h2>A small website<\/h2>\s*<a class="button" href="\/posts\/small-site-domain\.html">Read more<\/a>/)
        expect(tags(series.split('<ol>')[1], 'a').map((a) => attr(a, 'href'))).toEqual([
            '/posts/small-site-domain.html',
            '/posts/small-site-hosting.html',
            '/posts/small-site-feed.html',
        ])
        expect(elementByClass(page(pub, 'de/index.html'), 'section', 'home-series')).toMatch(/<p>Serie<\/p>[\s\S]*href="\/de\/posts\/small-site-domain\.html">Weiterlesen</)
    })

    it('shows the highlight list: the tag as heading, the four newest posts with it, each with its date', () => {
        const list = elementByClass(html, 'section', 'home-highlight')
        expect(list).toMatch(/^\s*<h2>tools<\/h2>/)
        expect(tags(list, 'a').map((a) => attr(a, 'href'))).toEqual([
            '/posts/door-closed.html',
            '/posts/plain-text.html',
            '/posts/forty-lines.html',
            '/posts/notebooks.html',
        ])
        expect(list).toMatch(/<li><a href="\/posts\/door-closed\.html">Writing with the door closed<\/a><time datetime="2026-11-18">November 18, 2026<\/time><\/li>/)
        expect(list).not.toMatch(/<picture|\/tags\//)
    })

    it('shows the about block: initials, label, name, bio, Read more to author.href', () => {
        const about = elementByClass(html, 'section', 'home-about')
        expect(about).toMatch(/<span class="home-about__mark" aria-hidden="true">AE<\/span>/)
        expect(about).toMatch(/<p>About the author<\/p>\s*<h2>Ada Example<\/h2>\s*<p>Edits technical documentation by day\./)
        expect(about).toMatch(/<div class="home-about__links"><a class="button" href="\/about\.html">Read more<\/a><\/div>/)
        expect(elementByClass(page(pub, 'de/index.html'), 'section', 'home-about')).toMatch(/href="\/de\/ueber-uns\.html">Weiterlesen</)
    })

    it('ends with the tag cloud', () => {
        const main = /<main[^>]*>([\s\S]*)<\/main>/.exec(html)[1]
        expect(main).toMatch(/<section class="tag-cloud">[\s\S]*<\/section>\s*$/)
    })

    it('leaves out the series, highlight and about blocks without their keys', () => {
        const plain = page(builds.overrides.public, 'index.html')
        for (const name of ['home-series', 'home-highlight', 'home-about']) expect(plain).not.toContain(name)
    })
})

describe('Starter fit: post', () => {
    const html = page(pub, 'posts/door-closed.html')

    it('shows the header: title, the author line with the mark, published and updated, the lead', () => {
        const header = elementByClass(html, 'header', 'post__header')
        expect(header).toMatch(/^\s*<h1 class="post__title">Writing with the door closed<\/h1>/)
        expect(header).toMatch(/<span class="post-author">By <span class="post-author__mark" aria-hidden="true">AE<\/span><span class="post__author post-author__name">Ada Example<\/span><\/span>/)
        expect(header).toMatch(/Published <time class="post__date" datetime="2026-11-18">November 18, 2026<\/time>/)
        expect(header).toMatch(/Updated <time class="post__updated" datetime="2026-11-21">November 21, 2026<\/time>/)
        expect(header).toMatch(/<p class="post__lead">First drafts are for one reader\./)
        expect(header).not.toContain('post__series')
    })

    it('formats dates in the page language', () => {
        const de = page(pub, 'de/posts/door-closed.html')
        expect(de).toContain('<time class="post__date" datetime="2026-11-18">18. November 2026</time>')
        expect(de).toContain('<time class="post__updated" datetime="2026-11-21">21. November 2026</time>')
    })

    it('renders no media element for a post without a picture, and the picture eagerly for one with it', () => {
        expect(html).not.toContain('post__media')
        const media = elementByClass(page(pub, 'posts/no-analytics.html'), 'div', 'post__media')
        expect(media).toMatch(/<img class="post__image" [^>]*alt="A dark mountain ridge under heavy cloud"[^>]*loading="eager"/)
    })

    it('shows its facts after the picture, before the text', () => {
        const post = page(pub, 'posts/no-analytics.html')
        const facts = elementByClass(post, 'dl', 'post-facts')
        expect(tags(facts, 'dt').length).toBe(4)
        expect(facts).toMatch(/<div class="post-facts__item">\s*<dt class="post-facts__label">Visitors counted<\/dt>\s*<dd class="post-facts__value">0<\/dd>\s*<\/div>/)
        expect(stripTags(facts).replace(/\s+/g, ' ').trim()).toBe('Visitors counted 0 Scripts removed 2 Cookie banners none Time saved 1 hour a week')
        expect(post.indexOf('class="post-facts"')).toBeGreaterThan(post.indexOf('class="post__media"'))
        expect(post.indexOf('class="post-facts"')).toBeLessThan(post.indexOf('class="post__body'))
        expect(html).not.toContain('post-facts')
    })

    it('shows the series line above the title and lists the parts, the current one marked', () => {
        const part = page(pub, 'posts/small-site-hosting.html')
        expect(elementByClass(part, 'header', 'post__header')).toMatch(/^\s*<p class="post__series">Series: A small website · Part 2<\/p>\s*<h1/)
        expect(part).toMatch(/<nav class="post-series" aria-label="Series">/)
        const series = elementByClass(part, 'nav', 'post-series')
        expect(series).toContain('<h2 class="post-series__title">A small website</h2>')
        const items = series.split('<li ').slice(1)
        expect(items.length).toBe(3)
        expect(items[0]).toMatch(/^class="post-series__item"><span>01<\/span><a href="\/posts\/small-site-domain\.html">A domain of your own<\/a>/)
        expect(items[1]).toMatch(/^class="post-series__item post-series__item--current"><span>02<\/span><a href="\/posts\/small-site-hosting\.html" aria-current="page">/)
        expect(items[2]).toMatch(/^class="post-series__item"><span>03<\/span>/)
        expect(html).not.toContain('post-series')
    })

    it('shows its tags through the post-tags seam and prev/next through post-pagination, the older post first', () => {
        const post = page(pub, 'posts/no-analytics.html')
        const postTags = elementByClass(post, 'div', 'post__tags')
        expect(postTags).toMatch(/<section class="tag-links">/)
        expect(tags(postTags, 'a').map((a) => attr(a, 'href'))).toEqual(['/tags/web.html'])
        const pagination = elementByClass(post, 'div', 'post__pagination')
        expect(pagination).toMatch(/<nav class="page-pagination" aria-label="Pagination">/)
        expect(pagination).toMatch(/page-pagination__link--previous" href="\/posts\/plain-text\.html">Plain text will outlive us</)
        expect(pagination).toMatch(/page-pagination__link--next" href="\/posts\/door-closed\.html">Writing with the door closed</)
        expect(elementByClass(page(pub, 'de/posts/no-analytics.html'), 'div', 'post__pagination')).toContain('aria-label="Blätternavigation"')
    })

    it('outputs the body as plugin output: the figure with its caption, the code block, the table', () => {
        const body = elementByClass(html, 'div', 'post__body nera-code-scope')
        expect(body).toMatch(/<figure class="nera-image">[\s\S]*<figcaption class="nera-image__caption">The view from the desk/)
        expect(body).toMatch(/<div class="nera-code nera-code--shell">/)
        expect(stripTags(body)).toContain('nera build --check')
        expect(body).toMatch(/<table>/)
    })

    it('links the feed through the feed-link seam', () => {
        expect(html).toMatch(/<link rel="alternate" type="application\/atom\+xml" href="\/feed\.xml"/)
        expect(page(pub, 'de/index.html')).toMatch(/<link rel="alternate" type="application\/atom\+xml" href="\/de\/feed\.xml"/)
    })
})

describe('Starter fit: code blocks', () => {
    it('maps every --nera-code-* property onto the theme\'s tokens on .nera-code', () => {
        const rule = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].find(([, prelude]) =>
            prelude.split(',').map((s) => s.trim()).includes('.nera-code')
        )
        expect(rule).toBeDefined()
        for (const [property, value] of Object.entries(CODE_MAPPING)) {
            expect(rule[2]).toContain(`${property}: ${value}`)
        }
        expect(rule[2]).not.toMatch(/--nera-code-(string|symbol|prompt)/)
    })

    it('links the code-blocks stylesheet through extra_css, after theme.css', () => {
        const links = tags(page(pub, 'posts/door-closed.html'), 'link').filter((a) => attr(a, 'rel') === 'stylesheet').map((a) => attr(a, 'href'))
        expect(links).toEqual(['/css/theme.css', '/_nera/code-blocks.css'])
        expect(fs.existsSync(path.join(pub, '_nera', 'code-blocks.css'))).toBe(true)
    })
})

describe('Starter fit: archive, tag page, default page', () => {
    for (const [lang, archive, word, prefix] of [['en', 'archive.html', 'posts', '/posts/'], ['de', 'de/archiv.html', 'Beiträge', '/de/posts/']]) {
        it(`${lang}: the archive groups the posts by year, newest first, with <n> ${word}`, () => {
            const html = page(pub, archive)
            const years = sections(html, 'post-archive__year')
            const counts = [4, 4, 1]
            expect(years.map((s) => Number(/<h2>(\d{4})/.exec(s)[1]))).toEqual([2026, 2025, 2024])
            years.forEach((section, i) => {
                const dates = datetimes(section)
                expect(dates.length).toBe(counts[i])
                for (const date of dates) expect(date.startsWith(String(2026 - i))).toBe(true)
                expect(section).toMatch(new RegExp(`<span class="post-archive__count">${counts[i]} ${word}</span>`))
            })
            expect(isDescending(datetimes(html))).toBe(true)
            expect(html).toContain(`href="${prefix}small-site-domain.html"`)
            expect(html).toMatch(/<section class="tag-cloud">/)
        })
    }

    it('shows each archive row as day and month (the year is the heading) and the title', () => {
        const [year] = sections(page(pub, 'archive.html'), 'post-archive__year')
        expect(year).toMatch(/<li class="post-archive__item"><time datetime="2026-11-18">November 18<\/time><a href="\/posts\/door-closed\.html">Writing with the door closed<\/a><\/li>/)
        const [deYear] = sections(page(pub, 'de/archiv.html'), 'post-archive__year')
        expect(deYear).toMatch(/<time datetime="2026-11-18">18\. November<\/time>/)
    })

    it('renders every generated tag page with exactly one <h1>, through pages/tag.pug', () => {
        const tagPages = pages(pub).filter(({ file }) => /^(de\/)?tags\//.test(file))
        expect(tagPages.length).toBe(6)
        for (const { file, html } of tagPages) {
            expect(countTags(html, 'h1'), file).toBe(1)
            expect(html, file).toMatch(/<section class="tag-page">\s*<section class="tag-overview">/)
        }
        const tools = page(pub, 'tags/tools.html')
        expect(tools).toMatch(/<h1 class="tag-overview__title">tools<\/h1>/)
        expect(tools).toMatch(/<time class="tag-overview__item-date" datetime="2026-11-18">November 18, 2026<\/time>/)
        expect(page(pub, 'de/tags/schreiben.html')).toMatch(/<html lang="de">/)
    })

    it('renders a default page as header and body, nothing beside them', () => {
        const html = page(pub, 'about.html')
        const main = /<main[^>]*>([\s\S]*)<\/main>/.exec(html)[1]
        expect(main).toMatch(/^\s*<header class="page__header">\s*<h1 class="page__title">About<\/h1>/)
        expect(main.replace(/<header class="page__header">[\s\S]*?<\/header>/, '')).toMatch(/^\s*<div class="page__body">[\s\S]*<\/div>\s*$/)
        expect(main).not.toMatch(/<aside/)
    })
})

describe('Starter fit: external links open in a new tab', () => {
    it('opens external links in a new tab (plugin-link-attributes, social links), internal ones not', () => {
        const html = page(pub, 'about.html')
        const external = tags(elementByClass(html, 'div', 'page__body'), 'a').filter((a) => /^https?:/.test(attr(a, 'href')))
        expect(external.length).toBe(1)
        for (const a of external) {
            expect(attr(a, 'target')).toBe('_blank')
            expect(attr(a, 'rel')).toBe('noopener noreferrer')
        }
        for (const a of tags(html, 'a').filter((a) => /^\//.test(attr(a, 'href')))) expect(attr(a, 'target')).toBeUndefined()
        const social = tags(elementByClass(html, 'footer', 'site-footer'), 'a').filter((a) => /social-media-links__link/.test(a))
        expect(social.length).toBe(1)
        expect(attr(social[0], 'target')).toBe('_blank')
        for (const { file, html: built } of pages(builds.noplugins.public)) expect(built, file).not.toContain('target="_blank"')
    })

    it('marks every link that opens a new tab with an arrow, in CSS only', () => {
        expect(css).toMatch(/a\[target='_blank'\]::after\s*\{[^}]*content: '\\00a0\\2197'/)
    })
})
