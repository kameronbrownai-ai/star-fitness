#!/usr/bin/env node
// Runway Gen-4 helper — generates video from a text prompt
// Usage: node scripts/runway.mjs "your prompt here" [duration] [output-name]
// Example: node scripts/runway.mjs "athlete doing lateral cuts on a training mat" 5 hero-clip

import fs from 'fs'
import path from 'path'
import https from 'https'

const API_KEY = process.env.RUNWAY_API_KEY
const API_VERSION = '2024-11-06'
const BASE = 'api.dev.runwayml.com'

if (!API_KEY) {
  console.error('❌  RUNWAY_API_KEY not set. Run: source ~/.zshrc')
  process.exit(1)
}

const [,, prompt, duration = '5', outputName = 'runway-output'] = process.argv

if (!prompt) {
  console.error('Usage: node scripts/runway.mjs "prompt" [duration=5] [output-name]')
  process.exit(1)
}

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null
    const req = https.request({
      hostname: BASE,
      path,
      method,
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'X-Runway-Version': API_VERSION,
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
      },
    }, res => {
      let raw = ''
      res.on('data', c => raw += c)
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(raw) }) }
        catch { resolve({ status: res.statusCode, body: raw }) }
      })
    })
    req.on('error', reject)
    if (data) req.write(data)
    req.end()
  })
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    https.get(url, res => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        file.close()
        https.get(res.headers.location, res2 => {
          res2.pipe(file)
          file.on('finish', () => file.close(resolve))
        })
      } else {
        res.pipe(file)
        file.on('finish', () => file.close(resolve))
      }
    }).on('error', reject)
  })
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function main() {
  console.log(`\n🎬  Generating: "${prompt}"`)
  console.log(`⏱   Duration: ${duration}s\n`)

  // Submit task
  const submit = await request('POST', '/v1/text_to_video', {
    model: 'gen4.5',
    promptText: prompt,
    duration: parseInt(duration),
    ratio: '1280:720',
  })

  if (submit.status !== 200 && submit.status !== 201) {
    console.error('❌  Submission failed:', JSON.stringify(submit.body, null, 2))
    process.exit(1)
  }

  const taskId = submit.body.id
  console.log(`✅  Task submitted: ${taskId}`)
  console.log('⏳  Polling for completion...\n')

  // Poll until done
  let attempts = 0
  while (attempts < 60) {
    await sleep(10000)
    attempts++
    const poll = await request('GET', `/v1/tasks/${taskId}`)
    const { status, output, failure } = poll.body

    process.stdout.write(`   [${attempts * 10}s] Status: ${status}\r`)

    if (status === 'SUCCEEDED') {
      console.log(`\n✅  Generation complete!\n`)
      const videoUrl = output?.[0]
      if (!videoUrl) { console.error('No output URL in response'); process.exit(1) }

      // Save to public/videos/
      const outDir = path.join('/Users/kameronbrown/star-fitness/public/videos')
      fs.mkdirSync(outDir, { recursive: true })
      const outPath = path.join(outDir, `${outputName}.mp4`)

      console.log(`⬇️   Downloading to ${outPath}...`)
      await download(videoUrl, outPath)
      console.log(`\n🏁  Saved: public/videos/${outputName}.mp4`)
      console.log(`    Use in site: src="/videos/${outputName}.mp4"\n`)
      break
    }

    if (status === 'FAILED') {
      console.error(`\n❌  Generation failed: ${failure || 'unknown error'}`)
      process.exit(1)
    }
  }

  if (attempts >= 60) {
    console.error('\n⏰  Timed out after 10 minutes')
    process.exit(1)
  }
}

main().catch(err => { console.error('Error:', err.message); process.exit(1) })
