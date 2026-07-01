// Add new entries here as content is added to the site.
// keywords: words/phrases the AI response must contain to surface this media.
// Prefer specific exercise names so matching is precise.

export const MEDIA_CATALOG = [
  // ─── VIDEOS ────────────────────────────────────────────────────────────────
  {
    id: 'fast-feet',
    type: 'video',
    title: 'Fast Feet Drill',
    src: '/videos/star-mat-fast-feet.mov',
    poster: '/images/thumbs/star-mat-fast-feet.mov.png',
    keywords: ['fast feet', 'foot speed', 'ankle strength', 'reaction time', 'foot coordination', 'quickness'],
  },
  {
    id: 'lateral-skaters',
    type: 'video',
    title: 'Lateral Skaters',
    src: '/videos/star-mat-lateral-skaters.mov',
    poster: '/images/thumbs/star-mat-lateral-skaters.mov.png',
    keywords: ['lateral skater', 'lateral skaters', 'skater', 'hip abductor', 'frontal plane', 'glute', 'golf hip', 'hip stability golf'],
  },
  {
    id: 'split-lunge',
    type: 'video',
    title: 'Split Lunge',
    src: '/videos/star-mat-split-lunge.mov',
    poster: '/images/thumbs/star-mat-split-lunge.mov.png',
    keywords: ['split lunge', 'hip flexor', 'sagittal plane', 'quad'],
  },
  {
    id: 'alternating-lunge-row',
    type: 'video',
    title: 'Alternating Lunge with Row',
    src: '/videos/star-mat-alternating-lunge-row.mov',
    poster: '/images/thumbs/star-mat-alternating-lunge-row.mov.png',
    keywords: ['alternating lunge', 'lunge with row', 'lunge row', 'full body', 'rotational', 'golf conditioning', 'golf fitness'],
  },
  {
    id: 'apex-foot-fire',
    type: 'video',
    title: 'Apex Foot Fire',
    src: '/videos/star-mat-apex-foot-fire.mov',
    poster: '/images/thumbs/star-mat-apex-foot-fire.mov.png',
    keywords: ['apex foot fire', 'foot fire', 'apex', 'multi-directional', 'footwork'],
  },
  {
    id: 'side-lunge',
    type: 'video',
    title: 'Side Lunge Drill',
    src: '/videos/star-mat-side-lunge.mov',
    poster: '/images/thumbs/star-mat-side-lunge.mov.png',
    keywords: ['side lunge', 'lateral lunge', 'hip stability', 'lateral plane'],
  },
  {
    id: 'training-drill',
    type: 'video',
    title: 'Star Mat Training Drill',
    src: '/videos/star-mat-training-drill.mov',
    poster: '/images/thumbs/star-mat-training-drill.mov.png',
    keywords: ['training drill', 'compass drill', 'directional drill', 'star pattern', 'rotational pivot', 'pivot drill', 'golf swing', 'golf rotation', 'hip rotation golf', '360 compass', 'compass circle', 'transverse plane', 'golf'],
  },
  {
    id: 'general-drill',
    type: 'video',
    title: 'Star Mat Drill',
    src: '/videos/star-mat-drill.mov',
    poster: '/images/thumbs/star-mat-drill.mov.png',
    keywords: ['warm-up', 'cool-down', 'circuit', 'conditioning', 'interval', 'golf warm-up', 'golf workout', 'single-leg balance', 'balance hold', 'golf balance', 'address position'],
  },

  // ─── IMAGES ────────────────────────────────────────────────────────────────
  {
    id: 'mma',
    type: 'image',
    title: 'MMA Stance & Control',
    src: '/images/commercial/mma-fighter.png',
    keywords: ['mma', 'combat', 'fighting', 'martial arts', 'wrestling', 'grappling', 'striking'],
  },
  {
    id: 'boxing',
    type: 'image',
    title: 'Boxing on the Mat',
    src: '/images/commercial/boxing.png',
    keywords: ['boxing', 'boxer', 'punch', 'footwork drill'],
  },
  {
    id: 'baseball-footwork',
    type: 'image',
    title: 'Baseball Explosive Footwork',
    src: '/images/commercial/baseball-1.png',
    keywords: ['baseball', 'softball', 'fielding', 'first step', 'base'],
  },
  {
    id: 'baseball-rotation',
    type: 'image',
    title: 'Baseball Rotational Power',
    src: '/images/commercial/baseball-2.png',
    keywords: ['baseball rotation', 'hitting', 'swing', 'rotational power', 'pitcher'],
  },
  {
    id: 'lateral-speed',
    type: 'image',
    title: 'Lateral Speed Training',
    src: '/images/commercial/woman-athlete.png',
    keywords: ['change of direction', 'cutting', 'lateral speed', 'basketball', 'soccer', 'tennis'],
  },
  {
    id: 'mat-specs',
    type: 'image',
    title: 'Star Mat Compass Markers',
    src: '/images/mat-onesheet-specs.png',
    keywords: ['compass point', 'compass marker', '360°', '270°', '180°', '90°', '315°', '225°', '135°', '45°', 'load decide'],
  },
]

/**
 * Given an AI response string, returns the most relevant media items (max 3).
 * Scored by number of keyword matches; videos ranked above images.
 * Add new catalog entries above — this function needs no changes.
 */
export function findRelevantMedia(text) {
  const lower = text.toLowerCase()
  const scored = MEDIA_CATALOG.map(item => ({
    item,
    score: item.keywords.filter(kw => lower.includes(kw.toLowerCase())).length,
  })).filter(x => x.score > 0)

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    // tie-break: videos first
    return (a.item.type === 'video' ? 0 : 1) - (b.item.type === 'video' ? 0 : 1)
  })

  return scored.slice(0, 3).map(x => x.item)
}
