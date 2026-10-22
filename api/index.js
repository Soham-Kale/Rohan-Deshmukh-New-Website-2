/**
 * Vercel entry point: the whole Express application (API, sitemap, robots.txt, old-address redirects and every page of the
 * website with its title and share tags) as one function. vercel.json sends every request that is not a built file here;
 * the built files themselves (frontend/dist) are served by Vercel's CDN.
 *
 * The application is built once per function instance and reused (the database connection pool with it).
 * Migrations and the first content load run in the build step (backend/scripts/vercel-prepare.mjs), not here.
 */
import { createApp } from '../backend/src/app.js'

let ready = null

export default async function handler(req, res) {
  ready ??= createApp().then(({ app }) => app).catch((err) => {
    ready = null // try again on the next request instead of keeping a broken instance
    throw err
  })
  try {
    const app = await ready
    // Vercel's Node runtime pre-parses the query string into req.query with flat keys ("where[path][equals]"), which hides the app's
    // own parser (qs, nested objects) — every filtered request then returned everything (e.g. each page showed the first page).
    // Dropping it lets Express parse the address itself, exactly as it does locally.
    if (Object.prototype.hasOwnProperty.call(req, 'query')) delete req.query
    return app(req, res)
  } catch (err) {
    console.error('[vercel] the application could not start:', err)
    res.statusCode = 500
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.end('The website is starting up or misconfigured. Please try again in a moment.')
  }
}
