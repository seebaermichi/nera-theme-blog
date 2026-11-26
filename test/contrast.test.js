// §S7 "Contrast": the eight default pairs of §S2.7, computed from
// config/theme.yaml, each reach 4.5:1 (WCAG 2.2 relative luminance).
import path from 'path'
import { describe, expect, it } from 'vitest'
import { ROOT, loadYaml } from './helpers/site.js'

const { color } = loadYaml(path.join(ROOT, 'config', 'theme.yaml')).tokens

const luminance = (hex) => {
    const match = /^#([0-9a-f]{6})$/i.exec(hex)
    if (!match) throw new Error(`not a #rrggbb colour: ${hex}`)
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(match[1].slice(i, i + 2), 16) / 255)
        .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const contrast = (a, b) => {
    const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x)
    return (light + 0.05) / (dark + 0.05)
}

const PAIRS = [
    ['text', 'bg'],
    ['text', 'surface'],
    ['muted', 'bg'],
    ['muted', 'surface'],
    ['accent', 'bg'],
    ['accent', 'surface'],
    ['accent_text', 'accent'],
    ['focus', 'bg'],
]

describe('Contrast', () => {
    for (const [fg, bg] of PAIRS) {
        it(`${fg} on ${bg} reaches 4.5:1`, () => {
            expect(contrast(color[fg], color[bg])).toBeGreaterThanOrEqual(4.5)
        })
    }

    // WCAG 1.4.11: the search input's only edge is a text-coloured hairline
    it('the search input edge (text on bg) reaches 3:1 as a non-text contrast', () => {
        expect(contrast(color.text, color.bg)).toBeGreaterThanOrEqual(3)
    })

    it('matches the ratios recorded in §S4.4', () => {
        const recorded = { 'text/bg': 18.4, 'text/surface': 16.9, 'muted/bg': 5.7, 'muted/surface': 5.2, 'accent/bg': 21, 'accent/surface': 19.3, 'accent_text/accent': 21, 'focus/bg': 18.4 }
        for (const [fg, bg] of PAIRS) {
            expect(contrast(color[fg], color[bg])).toBeCloseTo(recorded[`${fg}/${bg}`], 0)
        }
    })
})
