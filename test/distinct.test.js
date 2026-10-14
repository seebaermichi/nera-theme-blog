// §S7 "Distinct": blog's body font is a serif stack, unlike business's sans
// default, and blog's page types differ from business's (§S3.1 vs §S4.1).
import fs from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'
import { ROOT, loadYaml } from './helpers/site.js'
import { BUSINESS_FONT_BODY, BUSINESS_PAGE_TYPES, PAGE_TYPES } from './helpers/contract.js'

describe('Distinct', () => {
    it('uses a serif body font, not business\'s sans-serif default', () => {
        const body = loadYaml(path.join(ROOT, 'config', 'theme.yaml')).tokens.font.body
        expect(body).toMatch(/(^|,\s*)serif$/)
        expect(body).not.toMatch(/sans-serif/)
        expect(body).not.toBe(BUSINESS_FONT_BODY)
    })

    it('has a different set of page types than business', () => {
        const shipped = fs.readdirSync(path.join(ROOT, 'views', 'pages')).map((f) => f.replace(/\.pug$/, '')).sort()
        expect(shipped).toEqual([...PAGE_TYPES].sort())
        expect(shipped).not.toEqual([...BUSINESS_PAGE_TYPES].sort())
    })
})
