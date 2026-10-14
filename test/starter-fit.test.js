// §S7 "Starter fit (blog)": the home lists the posts newest first; the archive
// groups them by year; a generated tag page has exactly one <h1>; a post shows
// prev/next from plugin-page-pagination and its tags from plugin-tags; a code
// block uses the theme's --nera-code-* mapping.
import fs from 'fs'
import path from 'path'
import { describe, expect, inject, it } from 'vitest'
import { ROOT } from './helpers/site.js'
import { CODE_MAPPING } from './helpers/contract.js'
import { attr, countTags, elementByClass, page, pages, stripTags, tags } from './helpers/html.js'

const builds = inject('builds')
const pub = builds.default.public
const datetimes = (html) => tags(html, 'time').map((a) => attr(a, 'datetime'))
const isDescending = (list) => list.every((value, i) => i === 0 || list[i - 1] >= value)

describe('Starter fit (blog)', () => {
    for (const [lang, home, archive] of [['en', 'index.html', 'archive.html'], ['de', 'de/index.html', 'de/archiv.html']]) {
        it(`${lang}: the home lists the posts newest first, as post cards`, () => {
            const list = elementByClass(page(pub, home), 'section', 'post-list')
            const dates = datetimes(list)
            expect(dates).toEqual(['2026-09-21', '2025-03-02', '2024-05-14'])
            expect(countTags(list, 'li')).toBe(3)
            expect(list).toMatch(/<article class="post-card">/)
            const hrefs = tags(list, 'a').filter((a) => /post-card__link/.test(a)).map((a) => attr(a, 'href'))
            expect(hrefs.every((href) => href.startsWith(lang === 'de' ? '/de/posts/' : '/posts/'))).toBe(true)
            expect(list).toMatch(/class="post-list__more" href="[^"]+(archive|archiv)\.html"/)
        })

        it(`${lang}: the archive groups the posts by year, newest year first`, () => {
            const html = page(pub, archive)
            const sections = html.split('<section class="post-archive__year">').slice(1)
            const years = sections.map((s) => Number(/<h2>(\d{4})<\/h2>/.exec(s)[1]))
            expect(years).toEqual([2026, 2025, 2024])
            sections.forEach((section, i) => {
                const dates = datetimes(section.split('</section>')[0])
                expect(dates.length).toBeGreaterThan(0)
                for (const date of dates) expect(date.startsWith(String(years[i]))).toBe(true)
            })
            expect(isDescending(datetimes(html))).toBe(true)
        })
    }

    it('limits the home to blog.home_posts', () => {
        const list = elementByClass(page(builds.overrides.public, 'index.html'), 'section', 'post-list')
        expect(datetimes(list)).toEqual(['2026-09-21', '2025-03-02'])
    })

    it('formats dates in the page language', () => {
        expect(page(pub, 'posts/tokens.html')).toContain('<time class="post__date" datetime="2025-03-02">March 2, 2025</time>')
        expect(page(pub, 'de/posts/tokens.html')).toContain('<time class="post__date" datetime="2025-03-02">2. März 2025</time>')
        expect(page(pub, 'de/posts/tokens.html')).toContain('<time class="post__updated" datetime="2025-04-10">10. April 2025</time>')
    })

    it('renders every generated tag page with exactly one <h1>, through pages/tag.pug', () => {
        const tagPages = pages(pub).filter(({ file }) => /^(de\/)?tags\//.test(file))
        expect(tagPages.length).toBeGreaterThanOrEqual(10)
        for (const { file, html } of tagPages) {
            expect(countTags(html, 'h1'), file).toBe(1)
            expect(html, file).toMatch(/<section class="tag-page">\s*<section class="tag-overview">/)
        }
        expect(page(pub, 'de/tags/css.html')).toMatch(/<html lang="de">/)
    })

    it('shows prev/next from plugin-page-pagination and the tags from plugin-tags on a post', () => {
        const html = page(pub, 'posts/tokens.html')
        const pagination = elementByClass(html, 'div', 'post__pagination')
        expect(pagination).toMatch(/<nav class="page-pagination" aria-label="Pagination">/)
        expect(pagination).toMatch(/page-pagination__link--previous" href="\/posts\/plain-html\.html">Plain HTML still works</)
        expect(pagination).toMatch(/page-pagination__link--next" href="\/posts\/first-build\.html">Your first build</)
        const postTags = elementByClass(html, 'div', 'post__tags')
        expect(postTags).toMatch(/<section class="tag-links">/)
        expect(tags(postTags, 'a').map((a) => attr(a, 'href'))).toEqual(['/tags/css.html', '/tags/nera.html'])
        expect(elementByClass(page(pub, 'de/posts/tokens.html'), 'div', 'post__pagination')).toContain('aria-label="Blätternavigation"')
    })

    it('renders the post image through the post-media and card-media seams', () => {
        const media = elementByClass(page(pub, 'posts/tokens.html'), 'div', 'post__media')
        expect(media).toMatch(/<picture>/)
        expect(media).toMatch(/<img class="post__image" [^>]*alt="Shapes in rust/)
        expect(media).toMatch(/loading="eager"/)
        expect(page(pub, 'index.html')).toMatch(/<img class="post-card__image" [^>]*alt="Shapes in rust[^>]*loading="lazy"/)
    })

    it('puts a code block of plugin-code-blocks inside .nera-code-scope', () => {
        const body = elementByClass(page(pub, 'posts/first-build.html'), 'div', 'post__body')
        expect(page(pub, 'posts/first-build.html')).toContain('<div class="post__body nera-code-scope">')
        expect(body).toMatch(/<div class="nera-code nera-code--shell">/)
        expect(stripTags(body)).toContain('npx nera build')
    })

    it('maps every --nera-code-* property onto the theme\'s tokens on .nera-code', () => {
        const css = fs.readFileSync(path.join(ROOT, 'assets', 'css', 'theme.css'), 'utf-8')
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
        const links = tags(page(pub, 'posts/first-build.html'), 'link').map((a) => attr(a, 'href'))
        expect(links).toEqual(['/css/theme.css', '/_nera/code-blocks.css'])
        expect(fs.existsSync(path.join(pub, '_nera', 'code-blocks.css'))).toBe(true)
    })
})
