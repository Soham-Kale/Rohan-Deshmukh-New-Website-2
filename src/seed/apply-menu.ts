/** Apply the latest menu, footer and content changes to the database in .env:  npm run content:update */
import { getPayload } from 'payload'
import config from '@payload-config'
import { applyContentUpdates } from './content-updates'

const payload = await getPayload({ config })
await applyContentUpdates(payload)
payload.logger.info('✅ Menu, footer and page content updated.')
process.exit(0)
