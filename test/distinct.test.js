// §S7 "Distinct": blog's body font stack is not business's default, and
// blog's page types differ from business's (§S3.1 vs §S4.1).
import fs from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'
import { ROOT, loadYaml } from './helpers/site.js'
import { BUSINESS_FONT_BODY, BUSINESS_PAGE_TYPES, PAGE_TYPES } from './helpers/contract.js'

describe('Distinct', () => {
    it('does not use business\'s body font stack', () => {
        const body = loadYaml(path.join(ROOT, 'config', 'theme.yaml')).tokens.font.body
        expect(body).not.toBe(BUSINESS_FONT_BODY)
    })

    it('has a different set of page types than business', () => {
        const shipped = fs.readdirSync(path.join(ROOT, 'views', 'pages')).map((f) => f.replace(/\.pug$/, '')).sort()
        expect(shipped).toEqual([...PAGE_TYPES].sort())
        expect(shipped).not.toEqual([...BUSINESS_PAGE_TYPES].sort())
    })
})
