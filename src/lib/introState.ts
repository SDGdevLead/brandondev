const KEY = 'brandondev_intro_played'

export function hasIntroPlayed(): boolean {
  if (typeof window === 'undefined') return false
  return sessionStorage.getItem(KEY) === '1'
}

export function markIntroPlayed(): void {
  sessionStorage.setItem(KEY, '1')
}
