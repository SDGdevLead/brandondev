export type Project = {
  slug: string
  title: string
  description: string
  tags: string[]
  year: string
}

export const apps: Project[] = []

export const sites: Project[] = []

export const tools: Project[] = [
  {
    slug: 'readsvp',
    title: 'ReadSVP',
    description: 'Speed reading tool using the Serial Visual Presentation technique.',
    tags: ['React', 'TypeScript'],
    year: '2024',
  },
]
