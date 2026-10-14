// §S7 "Builds clean": `nera build` of the fixture exits 0, without a ⚠️ line,
// without `Views folder not found`, with one `HTML created:` line per page that
// has a layout. Every other build the tests make is held to the same log rules.
import path from 'path'
import { describe, expect, inject, it } from 'vitest'
import { SITE, frontmatter } from './helpers/site.js'
import { listFiles } from './helpers/html.js'

const builds = inject('builds')
// core colours its success lines; strip the ANSI codes before reading the log
const logOf = ({ build }) => `${build.stdout}\n${build.stderr}`.replace(/\x1b\[[0-9;]*m/g, '')

describe('Builds clean', () => {
    it('exits 0', () => {
        expect(builds.default.build.code, logOf(builds.default)).toBe(0)
    })

    it('writes one "HTML created:" line per fixture page that has a layout', () => {
        const log = logOf(builds.default)
        const created = [...log.matchAll(/HTML created: (\S+)/g)].map((m) => m[1])
        const pagesDir = path.join(SITE, 'pages')
        const authored = listFiles(pagesDir, ['.md'])
            .filter((file) => frontmatter(path.join(pagesDir, file)).layout)
            .map((file) => `/${file.split(path.sep).join('/').replace(/\.md$/, '.html')}`)

        expect(authored.length).toBe(16)
        for (const href of authored) expect(created, href).toContain(href)
        // ...and nothing written twice; the rest are plugin-tags' tag pages
        expect(new Set(created).size).toBe(created.length)
        expect(created.filter((href) => !authored.includes(href)).every((href) => /^(\/de)?\/tags\//.test(href))).toBe(true)
        expect(listFiles(builds.default.public, ['.html']).length).toBe(created.length)
    })

    it('logs no ⚠️, no deprecation, no error and no "Views folder not found" in any build', () => {
        for (const build of Object.values(builds)) {
            const log = logOf(build)
            expect(build.build.code, build.name).toBe(0)
            expect(log, build.name).not.toMatch(/⚠️|❌|deprecat|Views folder not found|\bError\b|warn/i)
            expect(log, build.name).toMatch(/0 errors/)
        }
    })

    it('builds in temporary copies, never in test/site/', () => {
        for (const build of Object.values(builds)) expect(build.site.startsWith(SITE), build.name).toBe(false)
    })
})
