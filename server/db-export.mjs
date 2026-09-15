// Exports every Star Fitness table to JSON for the nightly backup.
// Uses the service key over the REST API, so it does not depend on the
// Supabase plan's own backup retention.
import dotenv from 'dotenv'
dotenv.config()
import ws from 'ws'
if (!globalThis.WebSocket) globalThis.WebSocket = ws
import { createClient } from '@supabase/supabase-js'
import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const dest = process.argv[2]
if (!dest) {
  console.error('usage: node db-export.mjs <destination-dir>')
  process.exit(1)
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)

const TABLES = [
  'subscriptions',
  'assessments',
  'consents',
  'redemption_codes',
  'code_redemptions',
  'stripe_events',
]

const outDir = join(dest, 'database')
mkdirSync(outDir, { recursive: true })

let failed = 0
const summary = {}

for (const table of TABLES) {
  const { data, error } = await supabase.from(table).select('*')
  if (error) {
    console.error(`  ${table}: FAILED ${error.message}`)
    failed++
    continue
  }
  writeFileSync(join(outDir, `${table}.json`), JSON.stringify(data, null, 2))
  summary[table] = data.length
  console.log(`  ${table}: ${data.length} rows`)
}

writeFileSync(
  join(outDir, '_manifest.json'),
  JSON.stringify({ exported_at: new Date().toISOString(), rows: summary }, null, 2)
)

process.exit(failed > 0 ? 1 : 0)
