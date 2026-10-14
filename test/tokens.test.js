// §S7 "Tokens": the defaults are emitted as --theme-* custom properties; a
// site override changes only its token; a value with `}` is not emitted.
// Also §S2.5: theme.css reads every token with the same default.
import fs from 'fs'
import path from 'path'
import { describe, expect, inject, it } from 'vitest'
import { ROOT, loadYaml } from './helpers/site.js'
import { page } from './helpers/html.js'

const builds = inject('builds')
const config = loadYaml(path.join(ROOT, 'config', 'theme.yaml'))
const property = (group, name) => `--theme-${group}-${name.replace(/_/g, '-')}`
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const declaration = (group, name, value) => new RegExp(`${escape(property(group, name))}:\\s*${escape(String(value))};`)
const styleOf = (html) => (/<style>([\s\S]*?)<\/style>/.exec(html) || [])[1] || ''
const tokens = Object.entries(config.tokens).flatMap(([group, values]) =>
    Object.entries(values).map(([name, value]) => ({ group, name, value }))
)

describe('Tokens', () => {
    it('emits every default token, the accent included', () => {
        const style = styleOf(page(builds.default.public, 'index.html'))
        expect(style).toMatch(/^\s*:root\s*\{/)
        expect(style).toMatch(declaration('color', 'accent', '#8c3a12'))
        for (const { group, name, value } of tokens) expect(style).toMatch(declaration(group, name, value))
    })

    it('emits a site override and keeps every other token at its default', () => {
        const style = styleOf(page(builds.overrides.public, 'index.html'))
        expect(style).toMatch(declaration('color', 'accent', '#006400'))
        expect(style).not.toContain('#8c3a12')
        for (const { group, name, value } of tokens.filter((t) => t.name !== 'accent')) {
            expect(style).toMatch(declaration(group, name, value))
        }
    })

    it('does not emit a value containing }', () => {
        const html = page(builds.overrides.public, 'index.html')
        expect(html).not.toContain('--theme-color-injected')
        expect(html).not.toContain('display:none')
        expect(styleOf(html).match(/[{}]/g)).toEqual(['{', '}'])
    })

    it('theme.css reads every token as var(--theme-…, <the same default>)', () => {
        const css = fs.readFileSync(path.join(ROOT, 'assets', 'css', 'theme.css'), 'utf-8')
        for (const { group, name, value } of tokens) {
            const uses = [...css.matchAll(new RegExp(`var\\(${escape(property(group, name))}(,\\s*([^;]*?))?\\)(?=[;\\s/,)])`, 'g'))]
            expect(uses.length, property(group, name)).toBeGreaterThan(0)
            for (const use of uses) expect(use[2], property(group, name)).toBe(String(value))
        }
        // and no other --theme-* property is read
        const known = new Set(tokens.map(({ group, name }) => property(group, name)))
        for (const [, prop] of css.matchAll(/var\((--theme-[\w-]+)/g)) expect(known.has(prop), prop).toBe(true)
    })
})
