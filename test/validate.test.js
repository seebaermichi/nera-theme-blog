// §S7 "Validates clean" and "Without plugins": `nera validate --json` and
// `nera check --json` report `"ok": true` and `"results": []`, with every
// rule of the validator on (test/site/config/validate.yaml).
import fs from 'fs'
import path from 'path'
import { createRequire } from 'module'
import { describe, expect, inject, it } from 'vitest'
import { ROOT, SITE, loadYaml } from './helpers/site.js'
import { countTags, pages } from './helpers/html.js'

const builds = inject('builds')
const json = (run) => JSON.parse(run.stdout)

describe('Validates clean', () => {
    it('nera validate --json reports ok and no results', () => {
        expect(builds.default.validate.code).toBe(0)
        expect(json(builds.default.validate)).toEqual({ ok: true, results: [] })
    })

    it('nera check --json reports ok and no results', () => {
        expect(builds.default.check.code).toBe(0)
        expect(json(builds.default.check)).toEqual({ ok: true, results: [] })
    })

    it('runs with every rule of nera check on, the opt-in ones included', async () => {
        const require = createRequire(path.join(ROOT, 'package.json'))
        const validate = path.dirname(require.resolve('@nera-static/validate'))
        const { OUTPUT_RULES } = await import(path.join(validate, 'src', 'output-rules.js'))
        const config = loadYaml(path.join(SITE, 'config', 'validate.yaml'))
        const ids = OUTPUT_RULES.map((rule) => rule.id)

        expect(ids).toEqual(expect.arrayContaining(['a11y-link-lang', 'a11y-target-blank', 'a11y-reduced-motion', 'privacy-storage']))
        expect(Object.keys(config.rules).sort()).toEqual([...ids].sort())
        for (const id of ids) expect(config.rules[id], id).toBe('error')
        expect(config.ignore).toBeUndefined()
    })
})

describe('Without plugins', () => {
    const build = builds.noplugins

    it('removes every plugin, vendor copy and seam override in its copy', () => {
        const pkg = JSON.parse(fs.readFileSync(path.join(build.site, 'package.json'), 'utf-8'))
        expect(pkg.dependencies).toBeUndefined()
        expect(fs.existsSync(path.join(build.site, 'theme', 'views', 'vendor'))).toBe(false)
        expect(fs.existsSync(path.join(build.site, 'theme', 'views', 'partials'))).toBe(false)
        expect(`${build.build.stdout}${build.build.stderr}`).toMatch(/0 loaded, 0 failed/)
    })

    it('still builds, and nera validate and nera check report no findings', () => {
        expect(build.build.code).toBe(0)
        expect(json(build.validate)).toEqual({ ok: true, results: [] })
        expect(json(build.check)).toEqual({ ok: true, results: [] })
    })

    it('renders every seam at its default: no plugin markup, nothing broken', () => {
        const built = pages(build.public)
        expect(built.length).toBe(16)
        for (const { file, html } of built) {
            expect(html, file).not.toMatch(/class="(nav|tag-|page-pagination|social-media-links|nera-code|nera-image)/)
            expect(html, file).not.toMatch(/<picture|<img/)
            expect(countTags(html, 'h1'), file).toBe(1)
            for (const seam of ['post__media', 'post-card__media', 'post__tags', 'post__pagination']) {
                for (const [, inner] of html.matchAll(new RegExp(`<div class="${seam}">([\\s\\S]*?)</div>`, 'g'))) {
                    expect(inner.trim(), `${file} ${seam}`).toBe('')
                }
            }
        }
    })
})
