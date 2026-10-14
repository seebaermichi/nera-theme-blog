// Per-page guarantees of §S2.7 on every built page of every variant: no
// script, the right <html lang>, one <h1>, one main#main, a skip link first;
// and no JavaScript in the package.
import path from 'path'
import { describe, expect, inject, it } from 'vitest'
import { ROOT } from './helpers/site.js'
import { attr, countTags, listFiles, page, pages, tags } from './helpers/html.js'

const builds = inject('builds')

describe('Every built page', () => {
    for (const name of ['default', 'overrides', 'noplugins', 'sub']) {
        it(`${name}: has no <script>, one <h1>, one main#main and the skip link first`, () => {
            for (const { file, html } of pages(builds[name].public)) {
                expect(countTags(html, 'script'), file).toBe(0)
                expect(countTags(html, 'h1'), file).toBe(1)
                expect(countTags(html, 'main'), file).toBe(1)
                expect(html, file).toMatch(/<main class="site-main" id="main">/)
                expect(html, file).toMatch(/<body><a class="skip-link" href="#main">/)
                expect(html, file).not.toMatch(/target="_blank"/)
            }
        })

        it(`${name}: carries the page language in <html lang>`, () => {
            for (const { file, html } of pages(builds[name].public)) {
                expect(html, file).toMatch(file.startsWith(`de${path.sep}`) ? /<html lang="de">/ : /<html lang="en">/)
            }
        })
    }

    it('has a language switch with hreflang and a matching lang on every link', () => {
        const html = page(builds.default.public, 'posts/tokens.html')
        const links = tags(html, 'a').filter((a) => /lang-switch__link/.test(a))
        expect(links.length).toBe(1)
        expect(attr(links[0], 'href')).toBe('/de/posts/tokens.html')
        expect(attr(links[0], 'hreflang')).toBe('de')
        expect(attr(links[0], 'lang')).toBe('de')
        expect(html).toContain('<span class="lang-switch__link" aria-current="true" lang="en">English</span>')
        // a tag page has no slug twin: the switch falls back to the other home
        const tagLinks = tags(page(builds.default.public, 'tags/css.html'), 'a').filter((a) => /lang-switch__link/.test(a))
        expect(attr(tagLinks[0], 'href')).toBe('/de/index.html')
    })

    it('labels every <nav>, and translates the theme\'s strings on German pages', () => {
        for (const { file, html } of pages(builds.default.public)) {
            for (const attrs of tags(html, 'nav')) expect(attr(attrs, 'aria-label'), file).toBeTruthy()
        }
        const de = page(builds.default.public, 'de/index.html')
        for (const text of ['Zum Inhalt springen', 'aria-label="Hauptnavigation"', 'aria-label="Sprache"', 'aria-label="Rechtliches"', 'Neueste Beiträge', 'Alle Beiträge', '>Impressum<', '>Datenschutz<']) {
            expect(de).toContain(text)
        }
        const post = page(builds.default.public, 'de/posts/tokens.html')
        for (const text of ['Veröffentlicht', 'Aktualisiert', 'Von']) expect(post).toContain(text)
    })

    it('ships no .js file in the package folders', () => {
        for (const dir of ['views', 'assets', 'config']) {
            expect(listFiles(path.join(ROOT, dir), ['.js', '.mjs', '.cjs']), dir).toEqual([])
        }
    })
})
