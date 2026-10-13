/** Apply the new menu/footer to the database in .env:  npm run menu:update */
import { getPayload } from 'payload'
import config from '@payload-config'
import { applyMenu } from './menu'

const payload = await getPayload({ config })
await applyMenu(payload)
payload.logger.info('✅ Menu, footer and #ConnectWithRohan link updated.')
process.exit(0)
