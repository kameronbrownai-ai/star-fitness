import { motion } from 'framer-motion'

const LIBS = [
  {
    name: 'Google MediaPipe (Tasks Vision)',
    use: 'On-device pose detection powering the Live Form Check and the Star Assessment. All processing runs in your browser.',
    license: 'Apache License 2.0',
    copyright: 'Copyright 2023 The MediaPipe Authors.',
    url: 'https://github.com/google-ai-edge/mediapipe',
    licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0',
  },
  { name: 'React', use: 'User interface library.', license: 'MIT License', copyright: 'Copyright (c) Meta Platforms, Inc. and affiliates.', url: 'https://github.com/facebook/react' },
  { name: 'React Router', use: 'Client-side routing.', license: 'MIT License', copyright: 'Copyright (c) Remix Software Inc.', url: 'https://github.com/remix-run/react-router' },
  { name: 'Framer Motion', use: 'UI animation.', license: 'MIT License', copyright: 'Copyright (c) Framer B.V.', url: 'https://github.com/framer/motion' },
  { name: 'lucide-react', use: 'Icon set.', license: 'ISC License', copyright: 'Copyright (c) Lucide Contributors.', url: 'https://github.com/lucide-icons/lucide' },
  { name: 'Supabase JS', use: 'Accounts, authentication, and database.', license: 'MIT License', copyright: 'Copyright (c) Supabase.', url: 'https://github.com/supabase/supabase-js' },
  { name: 'Tailwind CSS', use: 'Styling framework.', license: 'MIT License', copyright: 'Copyright (c) Tailwind Labs, Inc.', url: 'https://github.com/tailwindlabs/tailwindcss' },
  { name: 'Vite', use: 'Build tooling.', license: 'MIT License', copyright: 'Copyright (c) Yuxi (Evan) You and Vite contributors.', url: 'https://github.com/vitejs/vite' },
]

export default function Licenses() {
  return (
    <main className="pt-28 pb-24">
      <div className="section-padding max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-star-yellow text-xs font-bold tracking-widest uppercase mb-3">Open Source</p>
          <h1 className="text-4xl md:text-5xl font-black mb-3">Licenses &amp; Attributions</h1>
          <p className="text-star-grey leading-relaxed mb-10">
            Star Fitness is built with the help of the open-source projects below. We're grateful to their authors and
            include these notices in accordance with their licenses.
          </p>

          <div className="space-y-4">
            {LIBS.map((lib) => (
              <div key={lib.name} className="rounded-2xl border border-star-border bg-star-card p-5">
                <div className="flex items-center justify-between gap-3 flex-wrap mb-1">
                  <h2 className="text-white font-bold">{lib.name}</h2>
                  <span className="text-star-yellow text-xs font-semibold px-2 py-0.5 rounded-full bg-star-yellow/10 border border-star-yellow/20">{lib.license}</span>
                </div>
                <p className="text-star-grey text-sm leading-relaxed mb-2">{lib.use}</p>
                <p className="text-star-grey/70 text-xs">{lib.copyright}</p>
                <div className="flex gap-4 mt-2">
                  <a href={lib.url} target="_blank" rel="noopener noreferrer" className="text-star-blue text-xs hover:underline">Project</a>
                  {lib.licenseUrl && <a href={lib.licenseUrl} target="_blank" rel="noopener noreferrer" className="text-star-blue text-xs hover:underline">License text</a>}
                </div>
              </div>
            ))}
          </div>

          <p className="text-star-grey/60 text-xs mt-8 leading-relaxed">
            Full license texts are retained in our source repository. Apache 2.0-licensed components (MediaPipe) are used
            under the terms at apache.org/licenses/LICENSE-2.0. Star Fitness's own code, content, and branding are proprietary.
          </p>
        </motion.div>
      </div>
    </main>
  )
}
