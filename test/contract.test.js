// §S7 "Contract present": every view, partial, seam and block of §S2 and §S4,
// every token and key of §S2.5, every public class of §S4.6 in views/.
import fs from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'
import { ROOT, loadYaml } from './helpers/site.js'
import { BLOCKS, HELPERS, PAGE_TYPES, PUBLIC_CLASSES, SEAMS, T_KEYS, THEME_KEYS, TOKENS, VIEWS } from './helpers/contract.js'
import { listFiles } from './helpers/html.js'

const VIEWS_DIR = path.join(ROOT, 'views')
const read = (file) => fs.readFileSync(path.join(VIEWS_DIR, file), 'utf-8')
const allViews = () => listFiles(VIEWS_DIR, ['.pug']).map(read).join('\n')

describe('Contract present', () => {
    it('ships every view and partial of §S2.2', () => {
        for (const view of VIEWS) expect(fs.existsSync(path.join(VIEWS_DIR, view)), view).toBe(true)
    })

    it('ships every seam of §S2.4 and §S4.2', () => {
        for (const seam of SEAMS) expect(fs.existsSync(path.join(VIEWS_DIR, seam)), seam).toBe(true)
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

    it('defines the helpers of §S2.2', () => {
        const helpers = read('partials/helpers.pug')
        for (const helper of HELPERS) expect(helpers, helper).toMatch(new RegExp(`function ${helper}\\(`))
    })

    it('ships no views/vendor/', () => {
        expect(fs.existsSync(path.join(VIEWS_DIR, 'vendor'))).toBe(false)
    })

    it('declares every token and key of §S2.5 in config/theme.yaml', () => {
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
        expect(config.blog).toEqual({ post_layouts: ['pages/post.pug'], home_posts: 10 })
    })

    it('uses every public class of §S4.6 in views/', () => {
        const source = allViews()
        for (const name of PUBLIC_CLASSES) {
            expect(source, name).toMatch(new RegExp(`(\\.|'|")${name}(?![\\w-])`))
        }
    })

    it('passes every UI string through t() with the keys of §S2.6 and §S4.3', () => {
        const source = allViews()
        for (const key of T_KEYS) expect(source, key).toContain(`t('${key}')`)
    })
})
