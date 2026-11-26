// The fixture's search page (plugin-search as an optional peer): a page type
// of the site's own, the plugin's script through the scripts-extra.pug seam
// on that page only, one index per language, a menu item and a language
// switch between the two pages.
import fs from 'fs'
import path from 'path'
import { describe, expect, inject, it } from 'vitest'
import { ROOT } from './helpers/site.js'
import { attr, elementByClass, page, tags } from './helpers/html.js'

const builds = inject('builds')
const PAGES = [
    { file: 'search.html', href: '/search.html', lang: 'en', home: 'index.html', index: '/search-index.json', label: 'Search', empty: 'No results', other: '/de/suche.html' },
    { file: path.join('de', 'suche.html'), href: '/de/suche.html', lang: 'de', home: path.join('de', 'index.html'), index: '/search-index.de.json', label: 'Suche', empty: 'Keine Treffer', other: '/search.html' },
]
const index = (build, file) => JSON.parse(fs.readFileSync(path.join(build.public, file), 'utf-8'))
// theme.css without comments; rule() joins the bodies of every rule whose
// selector list names the selector (as in starter-fit.test.js)
const css = fs.readFileSync(path.join(ROOT, 'assets', 'css', 'theme.css'), 'utf-8').replace(/\/\*[\s\S]*?\*\//g, '')
const wide = css.slice(css.indexOf('@media (min-width: 48rem)'), css.indexOf('@media (prefers-reduced-motion'))
const rules = (text) => [...text.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([, prelude, body]) => ({ selectors: prelude.split(',').map((x) => x.trim()), body }))
const rule = (text, selector) => rules(text).filter(({ selectors }) => selectors.includes(selector)).map(({ body }) => body).join('\n')
const searchInput = (html) => tags(html, 'input').filter((a) => /search__input/.test(a))

describe('The search page', () => {
    for (const { file, href, lang, home, index: indexUrl, label, empty, other } of PAGES) {
        it(`${lang}: loads /js/search.js once, at the end of <body>, outside <main>`, () => {
            const html = page(builds.default.public, file)
            const scripts = tags(html, 'script')
            expect(scripts.length).toBe(1)
            expect(attr(scripts[0], 'src')).toBe('/js/search.js')
            expect(html).toMatch(/<\/footer>\s*<script src="\/js\/search\.js"><\/script>\s*<\/body>/)
            expect(html.slice(html.indexOf('<main'), html.indexOf('</main>'))).not.toContain('<script')
        })

        it(`${lang}: renders the page header, then the input with its language's index and texts`, () => {
            const html = page(builds.default.public, file)
            expect(html).toMatch(/<h1 class="page__title">/)
            expect(html).not.toContain('search__title')
            const inputs = searchInput(html)
            expect(inputs.length).toBe(1)
            expect(attr(inputs[0], 'data-search-index')).toBe(indexUrl)
            expect(attr(inputs[0], 'aria-label')).toBe(label)
            expect(attr(inputs[0], 'data-search-empty')).toBe(empty)
            expect(elementByClass(html, 'ul', 'search__results').trim()).toBe('')
            expect(html.indexOf('page__header')).toBeLessThan(html.indexOf('search__input'))
        })

        it(`${lang}: is in the header menu of its language and switches to the other language's search page`, () => {
            const html = page(builds.default.public, file)
            for (const source of [html, page(builds.default.public, home)]) {
                expect(elementByClass(source, 'nav', 'site-header__nav')).toContain(`href="${href}">${label}</a>`)
            }
            const links = tags(html, 'a').filter((a) => /lang-switch__link/.test(a))
            expect(links.map((a) => attr(a, 'href'))).toEqual([other])
        })
    }

    it('writes one index per language: German pages only in the German one, tag pages included', () => {
        const en = index(builds.default, 'search-index.json')
        const de = index(builds.default, 'search-index.de.json')
        expect(en.length).toBeGreaterThan(10)
        expect(de.length).toBeGreaterThan(10)
        expect(en.every((item) => item.lang === 'en' && !item.href.startsWith('/de/'))).toBe(true)
        expect(de.every((item) => item.lang === 'de' && item.href.startsWith('/de/'))).toBe(true)
        // plugin-search runs last (config/plugin-order.yaml), so tag pages are in
        expect(en.some((item) => item.href.startsWith('/tags/'))).toBe(true)
        expect(de.some((item) => item.href.startsWith('/de/tags/'))).toBe(true)
    })

    it('prefixes the script, the index URL and the index hrefs with base_path', () => {
        const build = builds.sub
        for (const { file, index: indexUrl } of PAGES) {
            const html = page(build.public, file)
            expect(attr(tags(html, 'script')[0], 'src')).toBe('/sub/js/search.js')
            expect(attr(searchInput(html)[0], 'data-search-index')).toBe(`/sub${indexUrl}`)
        }
        expect(index(build, 'search-index.json').every((item) => item.href.startsWith('/sub/'))).toBe(true)
        expect(index(build, 'search-index.de.json').every((item) => item.href.startsWith('/sub/de/'))).toBe(true)
    })
})

describe('The search page looks like Plain', () => {
    const searchRules = rules(css).filter(({ selectors }) => selectors.some((x) => /\.search(?![\w-])|\.search__/.test(x)))
    const MEASURE = 'var(--theme-size-measure, 38.25rem)'

    it('sets the search block in the measure, in the content column next to the date margin', () => {
        expect(rule(css, '.search')).toContain(`max-width: ${MEASURE}`)
        expect(rule(wide, '.search')).toContain(`margin-left: calc(var(--theme-size-width, 50rem) - ${MEASURE})`)
        // the block draws nothing of its own
        expect(rule(css, '.search')).not.toMatch(/border|background|padding/)
    })

    it('scopes every search rule to the plugin\'s classes, so nothing leaks into prose or the archive', () => {
        expect(searchRules.length).toBeGreaterThan(8)
        for (const { selectors } of searchRules) {
            for (const selector of selectors.filter((x) => /search/.test(x))) {
                expect(selector, selector).toMatch(/^\.search(__[a-z]+)?(?![\w-])/)
            }
        }
    })

    it('uses no colour but text, muted and bg, and no new token', () => {
        const bodies = searchRules.map(({ body }) => body).join('\n')
        const tokens = [...bodies.matchAll(/var\((--[\w-]+)/g)].map(([, name]) => name)
        const allowed = ['--theme-color-text', '--theme-color-muted', '--theme-color-bg', '--theme-size-measure', '--theme-size-width', '--theme-size-space', '--theme-size-radius']
        expect(tokens.filter((name) => !allowed.includes(name))).toEqual([])
        // a literal colour only as a token's fallback, never on its own
        expect(bodies.replace(/var\([^()]*\)/g, '')).not.toMatch(/#[0-9a-f]{3,8}\b|rgb|hsl/i)
    })

    it('draws the input full width with a text-coloured edge and keeps the global focus outline', () => {
        const input = rule(css, '.search__input')
        expect(input).toMatch(/width: 100%/)
        expect(input).toMatch(/border: 1px solid var\(--theme-color-text, #141414\)/)
        expect(input).toMatch(/font: inherit/)
        expect(input).not.toMatch(/outline/)
        expect(rule(css, '.search__input:focus-visible')).toBe('')
        expect(rule(css, '.search__input::placeholder')).toMatch(/color: var\(--theme-color-muted, #676767\)/)
        // the native clear button is redrawn in the text colour, without a url()
        const clear = rule(css, '.search__input::-webkit-search-cancel-button')
        expect(clear).toMatch(/appearance: none/)
        expect(clear).toMatch(/linear-gradient\(45deg[^;]*var\(--theme-color-text, #141414\)/)
        expect(clear).not.toMatch(/url\(/)
    })

    it('reads like the archive: no bullets, a bold link, a muted snippet, a bold match without background', () => {
        expect(rule(css, '.search__results')).toMatch(/list-style: none/)
        expect(rule(css, '.search__results')).toMatch(/padding: 0/)
        expect(rule(css, '.search__link')).toMatch(/font-weight: 600/)
        expect(rule(css, '.search__link')).toMatch(/text-decoration: none/)
        expect(rule(css, '.search__description')).toMatch(/color: var\(--theme-color-muted, #676767\)/)
        const highlight = rule(css, '.search__highlight')
        expect(highlight).toMatch(/(^|[^-])color: var\(--theme-color-text, #141414\)/)
        expect(highlight).toMatch(/font-weight: 600/)
        expect(highlight).not.toMatch(/background/)
    })

    it('takes no space while the list or the message is empty, and mutes the message', () => {
        expect(rule(css, '.search__results:empty')).toMatch(/display: none/)
        expect(rule(css, '.search__empty:empty')).toMatch(/display: none/)
        expect(rule(css, '.search__empty')).toMatch(/color: var\(--theme-color-muted, #676767\)/)
        // `hidden` stays in charge: the message rule sets no display of its own
        expect(rule(css, '.search__empty')).not.toMatch(/display/)
    })
})
