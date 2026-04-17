export type Project = {
  slug: string
  title: string
  description: string
  tags: string[]
  year: string
  url?: string
}

export const apps: Project[] = [
  {
    slug: 'nudge',
    title: 'Nudge',
    description: 'A gentle productivity app that keeps you moving forward.',
    tags: ['Mobile', 'Productivity'],
    year: '2024',
    url: 'https://www.writewithnudge.app',
  },
]

export const sites: Project[] = [
  {
    slug: 'level-one-game-pub',
    title: 'Level One Game Pub',
    description: 'A bar and gaming venue bringing people together through play.',
    tags: ['Hospitality', 'Gaming'],
    year: '2024',
    url: 'https://www.levelonegamepub.com',
  },
  {
    slug: 'soul-sweets-bakery',
    title: 'Soul Sweets Bakery',
    description: 'Artisan bakery serving handcrafted sweets with heart.',
    tags: ['Food & Beverage', 'Retail'],
    year: '2024',
    url: 'https://soulsweetsbakery.ca',
  },
  {
    slug: 'pith-band',
    title: 'Pith Band',
    description: 'Band site for Pith — music, shows, and more.',
    tags: ['Music', 'Entertainment'],
    year: '2024',
    url: 'https://pith.band',
  },
]

export const tools: Project[] = [
  {
    slug: 'readsvp',
    title: 'ReadSVP',
    description: 'Speed reading tool using the Serial Visual Presentation technique.',
    tags: ['React', 'TypeScript'],
    year: '2024',
  },
]
