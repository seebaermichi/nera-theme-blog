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

    it('matches the ratios recorded in §S4.4', () => {
        const recorded = { 'text/bg': 15.2, 'text/surface': 13.6, 'muted/bg': 6.8, 'muted/surface': 6.1, 'accent/bg': 7.3, 'accent/surface': 6.5, 'accent_text/accent': 7.7, 'focus/bg': 6.5 }
        for (const [fg, bg] of PAIRS) {
            expect(contrast(color[fg], color[bg])).toBeCloseTo(recorded[`${fg}/${bg}`], 0)
        }
    })
})
