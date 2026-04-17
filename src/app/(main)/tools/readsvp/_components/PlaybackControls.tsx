import styles from '../readsvp.module.css';

interface PlaybackControlsProps {
  isPlaying: boolean;
  isAtStart: boolean;
  isAtEnd: boolean;
  wpm: number;
  onToggle: () => void;
  onPrev: () => void;
  onNext: () => void;
  onWpmChange: (delta: number) => void;
}

export default function PlaybackControls({
  isPlaying,
  isAtStart,
  isAtEnd,
  wpm,
  onToggle,
  onPrev,
  onNext,
  onWpmChange,
}: PlaybackControlsProps) {
  return (
    <div className={styles.controls}>
      <div className={styles.playbackControls}>
        <button
          className={`${styles.btn} ${styles.btnIcon}`}
          onClick={onPrev}
          disabled={isAtStart}
          aria-label="Previous word"
        >
          <svg viewBox="0 0 24 24" className={styles.icon}>
            <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" fill="currentColor" />
          </svg>
        </button>

        <button
          className={`${styles.btn} ${styles.btnPlay}`}
          onClick={onToggle}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" className={`${styles.icon} ${styles.iconLarge}`}>
              <path d="M6 4h4v16H6zm8 0h4v16h-4z" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className={`${styles.icon} ${styles.iconLarge}`}>
              <path d="M8 5v14l11-7z" fill="currentColor" />
            </svg>
          )}
        </button>

        <button
          className={`${styles.btn} ${styles.btnIcon}`}
          onClick={onNext}
          disabled={isAtEnd}
          aria-label="Next word"
        >
          <svg viewBox="0 0 24 24" className={styles.icon}>
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" fill="currentColor" />
          </svg>
        </button>
      </div>

      <div className={styles.wpmControls}>
        <button
          className={`${styles.btn} ${styles.btnIcon} ${styles.btnSmall}`}
          onClick={() => onWpmChange(-25)}
          aria-label="Decrease speed"
        >
          −
        </button>
        <span className={styles.wpmDisplay}>
          {wpm} <abbr title="words per minute">WPM</abbr>
        </span>
        <button
          className={`${styles.btn} ${styles.btnIcon} ${styles.btnSmall}`}
          onClick={() => onWpmChange(25)}
          aria-label="Increase speed"
        >
          +
        </button>
      </div>
    </div>
  );
}
