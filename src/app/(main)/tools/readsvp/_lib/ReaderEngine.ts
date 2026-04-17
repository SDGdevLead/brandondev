import type { WordParts } from '../_types';

export function calculateORP(word: string): number {
  const n = word.length;
  if (n === 0) return 0;
  return Math.floor((n + 2) / 4);
}

export function splitAtORP(word: string): WordParts {
  if (!word || word.length === 0) {
    return { before: '', pivot: '', after: '' };
  }
  const orpIndex = calculateORP(word);
  return {
    before: word.slice(0, orpIndex),
    pivot: word[orpIndex] || '',
    after: word.slice(orpIndex + 1),
  };
}

function hasSentenceEnd(word: string): boolean {
  return /[.!?]$/.test(word);
}

function hasClausePause(word: string): boolean {
  return /[,;:]$/.test(word);
}

export function parseText(text: string): string[] {
  if (!text || typeof text !== 'string') return [];
  return text
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(word => word.length > 0);
}

export class ReaderEngine {
  words: string[] = [];
  currentIndex: number = 0;
  wpm: number = 300;
  isPlaying: boolean = false;

  readonly sentencePauseMultiplier = 2.5;
  readonly clausePauseMultiplier = 1.5;

  #timeoutId: ReturnType<typeof setTimeout> | null = null;
  #onChange: (() => void) | null = null;

  get currentWord(): string {
    return this.words[this.currentIndex] ?? '';
  }

  get totalWords(): number {
    return this.words.length;
  }

  get progress(): number {
    return this.totalWords > 0
      ? (this.currentIndex / (this.totalWords - 1)) * 100
      : 0;
  }

  get isAtEnd(): boolean {
    return this.currentIndex >= this.totalWords - 1;
  }

  get isAtStart(): boolean {
    return this.currentIndex === 0;
  }

  get baseDelay(): number {
    return 60000 / this.wpm;
  }

  get currentWordParts(): WordParts {
    return splitAtORP(this.currentWord);
  }

  get timeRemaining(): number {
    return ((this.totalWords - this.currentIndex) * this.baseDelay) / 1000;
  }

  subscribe(callback: () => void): () => void {
    this.#onChange = callback;
    return () => {
      this.#onChange = null;
    };
  }

  #notify() {
    this.#onChange?.();
  }

  setText(text: string): void {
    this.stop();
    this.words = parseText(text);
    this.currentIndex = 0;
    this.#notify();
  }

  play(): void {
    if (this.totalWords === 0) return;
    if (this.isAtEnd) {
      this.currentIndex = 0;
    }
    this.isPlaying = true;
    this.#notify();
    this.#scheduleNext();
  }

  pause(): void {
    this.isPlaying = false;
    this.#clearTimeout();
    this.#notify();
  }

  toggle(): void {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  stop(): void {
    this.pause();
    this.currentIndex = 0;
    this.#notify();
  }

  seekTo(index: number): void {
    const wasPlaying = this.isPlaying;
    this.pause();
    this.currentIndex = Math.max(0, Math.min(index, this.totalWords - 1));
    this.#notify();
    if (wasPlaying) {
      this.play();
    }
  }

  seekToPercent(percent: number): void {
    if (this.totalWords === 0) return;
    const index = Math.round((percent / 100) * (this.totalWords - 1));
    this.seekTo(index);
  }

  nextWord(): void {
    if (!this.isAtEnd) {
      this.currentIndex++;
      this.#notify();
    }
  }

  prevWord(): void {
    if (!this.isAtStart) {
      this.currentIndex--;
      this.#notify();
    }
  }

  setWpm(newWpm: number): void {
    this.wpm = Math.max(50, Math.min(1000, newWpm));
    this.#notify();
  }

  destroy(): void {
    this.#clearTimeout();
  }

  #calculateDelay(): number {
    const word = this.currentWord;
    let delay = this.baseDelay;
    if (hasSentenceEnd(word)) {
      delay *= this.sentencePauseMultiplier;
    } else if (hasClausePause(word)) {
      delay *= this.clausePauseMultiplier;
    }
    return delay;
  }

  #clearTimeout(): void {
    if (this.#timeoutId !== null) {
      clearTimeout(this.#timeoutId);
      this.#timeoutId = null;
    }
  }

  #scheduleNext(): void {
    this.#clearTimeout();
    if (!this.isPlaying || this.isAtEnd) {
      if (this.isAtEnd) {
        this.isPlaying = false;
        this.#notify();
      }
      return;
    }
    const delay = this.#calculateDelay();
    this.#timeoutId = setTimeout(() => {
      if (this.isPlaying) {
        this.currentIndex++;
        this.#notify();
        this.#scheduleNext();
      }
    }, delay);
  }
}
