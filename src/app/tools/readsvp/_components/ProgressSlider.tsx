import styles from '../readsvp.module.css';

interface ProgressSliderProps {
  progress: number;
  timeRemaining: number;
  onSeek: (percent: number) => void;
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function ProgressSlider({
  progress,
  timeRemaining,
  onSeek,
}: ProgressSliderProps) {
  return (
    <div className={styles.progressSection}>
      <input
        type="range"
        className={styles.progressSlider}
        min="0"
        max="100"
        step="0.1"
        value={progress}
        onChange={e => onSeek(parseFloat(e.target.value))}
        aria-label="Reading progress"
      />
      <div className={styles.progressInfo}>
        <span className={styles.timeRemaining}>
          {formatTime(timeRemaining)} remaining
        </span>
      </div>
    </div>
  );
}
