import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { after, before, describe, it } from 'node:test'
import { clearContent, ensureAdmin, isEmpty, loadSnapshot, readSnapshot, resetAdmin } from '../src/seed/load.js'
import { startServer } from './helpers.js'

describe('the bundled website content', () => {
  let srv
  let stats
  before(async () => {
    srv = await startServer()
    stats = await loadSnapshot(srv.ctx, await readSnapshot(), { log: () => {} })
  })
  after(() => srv.stop())

  it('loads completely: every document, with the same ids as the old site', async () => {
    assert.equal(stats.documents, 235)
    assert.equal(stats.media, 171)
    assert.equal(stats.globals, 5)
    assert.deepEqual(stats.problems, [])
    const post = (await srv.client().get('/api/posts/1?locale=en')).data
    assert.match(post.title, /LOTUS/)
    assert.equal((await srv.client().get('/api/initiatives?limit=0')).data.totalDocs, 22)
  })

  it('is not empty afterwards, and clearContent empties it again', async () => {
    assert.equal(await isEmpty(srv.ctx), false)
  })

  it('the homepage has its sections and a hero slider with photos', async () => {
    const home = (await srv.client().get('/api/globals/home?depth=2&locale=en')).data
    assert.deepEqual(home.sections.map((s) => s.blockType), ['heroSlider', 'aboutIntro', 'homeJourney', 'homeHighlights', 'homeVision', 'homeParivar', 'family', 'featuredVideo', 'socialFeeds'])
    const hero = home.sections[0]
    assert.equal(hero.slides[0].heading, 'I am Rohan Subhash Deshmukh')
    assert.match(hero.slides[0].image.url, /^\/uploads\/.+\.webp$/)
    assert.ok(existsSync(path.join(srv.dir, 'uploads', hero.slides[0].image.filename)))
    assert.equal(home.sections.find((s) => s.blockType === 'family').hidden, true)
  })

  it('the menu, footer and settings came across', async () => {
    const c = srv.client()
    const header = (await c.get('/api/globals/header?locale=en')).data
    assert.deepEqual(header.nav.map((n) => n.label), ['Home', 'About', 'Lokmangal', 'Media', 'Vision', 'Connect'])
    assert.equal(header.nav[1].children.length, 4)
    const footer = (await c.get('/api/globals/footer?locale=en')).data
    assert.equal(footer.columns.length, 3)
    const settings = (await c.get('/api/globals/site-settings?locale=en&depth=1')).data
    assert.equal(settings.siteName, 'Rohan Subhash Deshmukh')
    assert.equal(settings.phone, '+91 8208737624')
    assert.ok(settings.logoLight.url)
  })

  it('pages, albums, events, videos and offices are all there', async () => {
    const c = srv.client()
    assert.equal((await c.get('/api/pages?limit=0')).data.totalDocs, 10)
    assert.equal((await c.get('/api/albums?limit=0')).data.totalDocs, 3)
    assert.equal((await c.get('/api/events?limit=0')).data.totalDocs, 5)
    assert.equal((await c.get('/api/videos?limit=0')).data.totalDocs, 4)
    const offices = (await c.get('/api/offices?limit=0&locale=en')).data.docs
    assert.deepEqual(offices.map((o) => o.name), ['Head Office, Solapur', 'Contact Office, Pune'])
    const family = (await c.get('/api/pages?where[path][equals]=/about/biography&depth=2&locale=en')).data.docs[0]
    assert.equal(family.layout.filter((b) => b.blockType === 'mediaText').length, 3)
    assert.match(family.layout[1].image.url, /^\/uploads\/.+\.webp$/)
  })

  it('article text came across as clean HTML, with its photos', async () => {
    const posts = (await srv.client().get('/api/posts?limit=0&locale=mr')).data.docs
    assert.ok(posts.some((p) => /<figure><img src="\/uploads\//.test(p.content)))
    for (const p of posts) assert.ok(!/<script|onerror=/i.test(p.content))
  })

  it('clearContent removes the content and the files; accounts stay', async () => {
    const users = await srv.ctx.db.models.users.count()
    await clearContent(srv.ctx)
    assert.equal(await isEmpty(srv.ctx), true)
    assert.equal(await srv.ctx.db.models.media.count(), 0)
    assert.equal(await srv.ctx.db.models.users.count(), users)
    assert.ok(!existsSync(path.join(srv.dir, 'uploads', 'logo-light.webp')))
  })
})

describe('the first admin account', () => {
  it('is never created in production with the example password', async () => {
    const srv = await startServer()
    try {
      // a database without users, a production setting and the password from .env.example
      await srv.ctx.db.models.users.destroy({ where: {} })
      const ctx = { ...srv.ctx, cfg: { ...srv.ctx.cfg, production: true, admin: { email: 'owner@example.com', password: 'ChangeMe@123' } } }
      await assert.rejects(() => ensureAdmin(ctx), /ADMIN_PASSWORD/)
      assert.equal(await srv.ctx.db.models.users.count(), 0)
      // a password of the owner's own is accepted
      ctx.cfg.admin.password = 'My-Own-Long-Password-7'
      assert.equal(await ensureAdmin(ctx), 'owner@example.com')
    } finally {
      await srv.stop()
    }
  })
})

describe('getting back in with `npm run admin`', () => {
  it('sets a new password, lifts a lock-out and ends the old sessions; an unknown e-mail becomes a super admin', async () => {
    const srv = await startServer()
    try {
      const old = srv.client()
      assert.equal((await old.post('/api/users/login', { json: { email: 'admin@test.local', password: 'Correct-Horse-9' } })).status, 200)
      // five wrong passwords lock the account
      for (let i = 0; i < 5; i++) await srv.client().post('/api/users/login', { json: { email: 'admin@test.local', password: 'wrong-password' } })
      assert.equal((await srv.client().post('/api/users/login', { json: { email: 'admin@test.local', password: 'Correct-Horse-9' } })).status, 423)

      const result = await resetAdmin(srv.ctx, { email: ' Admin@Test.Local ', password: 'A-New-Password-42' })
      assert.deepEqual(result, { created: false, email: 'admin@test.local' })
      assert.equal((await srv.client().post('/api/users/login', { json: { email: 'admin@test.local', password: 'Correct-Horse-9' } })).status, 401)
      assert.equal((await srv.client().post('/api/users/login', { json: { email: 'admin@test.local', password: 'A-New-Password-42' } })).status, 200)
      assert.equal((await old.get('/api/users/me')).data.user, null) // the session from before the reset has ended

      const created = await resetAdmin(srv.ctx, { email: 'second@test.local', password: 'Another-Password-7', name: 'Second' })
      assert.deepEqual(created, { created: true, email: 'second@test.local' })
      const me = await srv.client()
      await me.post('/api/users/login', { json: { email: 'second@test.local', password: 'Another-Password-7' } })
      assert.equal((await me.get('/api/users/me')).data.user.role, 'super-admin')

      // too short a password is refused and changes nothing
      await assert.rejects(() => resetAdmin(srv.ctx, { email: 'second@test.local', password: 'short' }))
      assert.equal((await srv.client().post('/api/users/login', { json: { email: 'second@test.local', password: 'Another-Password-7' } })).status, 200)
    } finally {
      await srv.stop()
    }
  })
})
