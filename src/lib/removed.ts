/** Pages removed in the Oct 2026 restructure (redirected in next.config.mjs — keep both lists in sync) */
export const REMOVED_PATHS = ['/about/achievements', '/about/party-organisation', '/about/leaders', '/lokmangal/vishwamangal', '/media/downloads', '/grievance', '/careers', '/search']
export const isRemovedPath = (path: string) => REMOVED_PATHS.some((p) => path === p || path.startsWith(`${p}/`))
