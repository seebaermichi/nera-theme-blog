// §S7 "Contract present": every view, partial, seam and block of §S2, §S4 and
// §S11, every token and key of §S2.5 / §S11.3, every public class of §S4.6 /
// §S12 in views/, nothing withdrawn, and only the sources of §S11.5.
import fs from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'
import { ROOT, loadYaml } from './helpers/site.js'
import { BLOCKS, HELPERS, NOT_RENDERED, PAGE_TYPES, PUBLIC_CLASSES, SEAMS, T_KEYS, THEME_KEYS, TOKEN_DEFAULTS, TOKENS, VIEWS, WITHDRAWN_CLASSES, WITHDRAWN_SEAMS } from './helpers/contract.js'
import { listFiles } from './helpers/html.js'

const VIEWS_DIR = path.join(ROOT, 'views')
const read = (file) => fs.readFileSync(path.join(VIEWS_DIR, file), 'utf-8')
const allViews = () => listFiles(VIEWS_DIR, ['.pug']).map(read).join('\n')
const code = () => allViews().split('\n').filter((line) => !line.trim().startsWith('//')).join('\n')
const css = () => fs.readFileSync(path.join(ROOT, 'assets', 'css', 'theme.css'), 'utf-8')

describe('Contract present', () => {
    it('ships every view and partial of §S2.2', () => {
        for (const view of VIEWS) expect(fs.existsSync(path.join(VIEWS_DIR, view)), view).toBe(true)
    })

    it('ships every seam of §S2.4 and §S4.2, and none that was withdrawn', () => {
        for (const seam of SEAMS) expect(fs.existsSync(path.join(VIEWS_DIR, seam)), seam).toBe(true)
        for (const seam of WITHDRAWN_SEAMS) expect(fs.existsSync(path.join(VIEWS_DIR, seam)), seam).toBe(false)
    })

    it('ships every seam empty (comments only), tag-overview with its plugin-free default', () => {
        for (const seam of SEAMS.filter((s) => s !== 'partials/tag-overview.pug')) {
            const lines = read(seam).split('\n').filter((line) => line.trim() && !line.startsWith('//-'))
            expect(lines, seam).toEqual([])
        }
    })

    it('ships every page type of §S4.1, each extending the layout and filling block main', () => {
        for (const type of PAGE_TYPES) {
            const source = read(`pages/${type}.pug`)
            expect(source, type).toMatch(/^extends \.\.\/layouts\/layout\.pug$/m)
            expect(source, type).toMatch(/^block main$/m)
        }
    })

    it('defines every block of §S2.3 in the layout', () => {
        const layout = read('layouts/layout.pug')
        for (const block of BLOCKS) expect(layout, block).toMatch(new RegExp(`^\\s*block ${block}$`, 'm'))
    })

    // A `- const` line, or a declaration at the first indent of a `-` block.
    it('defines the helpers of §S2.2 and no other top-level name than themeBlog', () => {
        const helpers = read('partials/helpers.pug')
        for (const helper of HELPERS) expect(helpers, helper).toMatch(new RegExp(`function ${helper}\\(`))
        const topLevel = [...allViews().matchAll(/^(?:- *| {4})(?:const|let|var|function) +([A-Za-z_$][\w$]*)/gm)]
            .map((match) => match[1])
        expect([...new Set(topLevel)].sort()).toEqual([...HELPERS, 'themeBlog'].sort())
    })

    it('ships no views/vendor/', () => {
        expect(fs.existsSync(path.join(VIEWS_DIR, 'vendor'))).toBe(false)
    })

    it('declares every token and key of §S2.5 and §S11.3 in config/theme.yaml', () => {
        const config = loadYaml(path.join(ROOT, 'config', 'theme.yaml'))
        for (const key of THEME_KEYS) expect(config, key).toHaveProperty([key])
        for (const [group, names] of Object.entries(TOKENS)) {
            expect(Object.keys(config.tokens[group]).sort()).toEqual([...names].sort())
            for (const name of names) {
                const value = config.tokens[group][name]
                expect(['string', 'number'], `${group}.${name}`).toContain(typeof value)
                expect(String(value)).not.toBe('')
            }
        }
        expect(config.label).toBe('Blog')
        expect(config.extra_css).toEqual([])
        expect(config.footer_links).toEqual([])
        // home_posts counts the posts after the newest, which is the home's
        // opening (§S14 item 1): 9, so the home lists ten posts, as 1.x did
        expect(config.blog).toEqual({ post_layouts: ['pages/post.pug'], home_posts: 9, featured_series: '', highlight_tag: '' })
        expect(config.author).toEqual({ name: '', bio: '', href: '' })
        expect(config.tokens.color).toEqual(TOKEN_DEFAULTS.color)
        expect(config.tokens.size).toEqual(TOKEN_DEFAULTS.size)
        // system stacks only, no webfont (§S11.2 does not apply to Plain)
        expect(config.tokens.font.body).toMatch(/^ui-sans-serif, .*sans-serif$/)
        expect(config.tokens.font.heading).toBe(config.tokens.font.body)
        expect(config.tokens.font.mono).toMatch(/^ui-monospace, .*monospace$/)
    })

    it('uses every public class of §S4.6 and §S12 in views/', () => {
        const source = allViews()
        for (const name of PUBLIC_CLASSES) {
            expect(source, name).toMatch(new RegExp(`(\\.|'|")${name}(?![\\w-])`))
        }
    })

    it('renders no element for a class of §S12 that Plain leaves out (no hero, place, cover or pass)', () => {
        for (const name of NOT_RENDERED) {
            expect(code(), name).not.toMatch(new RegExp(`(\\.|'|")${name}(?![\\w-])`))
            expect(css(), name).not.toMatch(new RegExp(`\\.${name}(?![\\w-])`))
        }
    })

    it('uses no class that the revision of 2026-11-23 withdrew', () => {
        for (const name of WITHDRAWN_CLASSES) {
            expect(allViews(), name).not.toMatch(new RegExp(`(\\.|'|")${name}(?![\\w-])`))
            expect(css(), name).not.toMatch(new RegExp(`\\.${name}(?![\\w-])`))
        }
    })

    it('reads no plugin data and does not parse content (§S10, decision 6)', () => {
        for (const name of ['tagLinks', 'tagCloud', 'taggedPages', 'pagePagination', 'images', 'socialMediaLinks', 'feeds', 'nav']) {
            expect(code(), name).not.toMatch(new RegExp(`(meta|app|item\\.meta|page\\.meta)\\.${name}\\b`))
        }
        // `content` is only ever output (or tested for being empty), never parsed
        const lines = code().split('\n')
            .filter((line) => /\bcontent\b/.test(line) && !/\{ content, meta \}|'Skip to content'|\bcontent=/.test(line))
        expect(lines.length).toBeGreaterThan(0)
        for (const line of lines) expect(line.trim()).toMatch(/^(!= content|if String\(content \|\| ''\)\.trim\(\))$/)
    })

    it('passes every UI string through t() with the keys of §S2.6, §S4.3 and §S11.6', () => {
        const source = allViews()
        for (const key of T_KEYS) expect(source, key).toContain(`t('${key}')`)
    })
})
