// §S7 "No unlisted plugin coupling": every class selector in theme.css is a
// public class of §S4.6 or a plugin class listed in §S4.5.
import fs from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'
import { ROOT } from './helpers/site.js'
import { PLUGIN_CLASSES, PUBLIC_CLASSES } from './helpers/contract.js'

const css = fs.readFileSync(path.join(ROOT, 'assets', 'css', 'theme.css'), 'utf-8').replace(/\/\*[\s\S]*?\*\//g, '')
const selectorClasses = () => {
    const found = new Set()
    // class selectors only appear in the prelude of a rule, before `{`
    for (const [, prelude] of css.matchAll(/([^{}]+)\{/g)) {
        for (const [, name] of prelude.matchAll(/\.([A-Za-z_][\w-]*)/g)) found.add(name)
    }
    return [...found].sort()
}

describe('No unlisted plugin coupling', () => {
    it('uses only public classes and listed plugin classes', () => {
        const allowed = new Set([...PUBLIC_CLASSES, ...Object.values(PLUGIN_CLASSES).flatMap((p) => p.classes)])
        const classes = selectorClasses()
        expect(classes.length).toBeGreaterThan(40)
        expect(classes.filter((name) => !allowed.has(name))).toEqual([])
    })

    it('styles plugin-navigation only under .site-header__nav and social-media-links only under .site-footer', () => {
        for (const [, prelude] of css.matchAll(/([^{}]+)\{/g)) {
            for (const selector of prelude.split(',').map((s) => s.trim())) {
                if (/\.nav(?![\w-])|\.nav(--|__)/.test(selector)) expect(selector).toMatch(/^\.site-header__nav /)
                if (/\.social-media-links/.test(selector)) expect(selector).toMatch(/^\.site-footer /)
            }
        }
    })
})
