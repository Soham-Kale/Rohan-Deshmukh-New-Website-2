/**
 * Replaced (Oct 2026) by scripts/hero-slides.mjs (npm run content:hero-slides), which sets the homepage hero to its two slides and,
 * unlike this script did, never overwrites slides that were edited in the admin. Kept so "npm run content:hero-covers" still works.
 */
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

console.log('content:hero-covers is replaced by content:hero-slides — running that instead.')
const { status } = spawnSync(process.execPath, [fileURLToPath(new URL('./hero-slides.mjs', import.meta.url))], { stdio: 'inherit' })
process.exit(status ?? 1)
