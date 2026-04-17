import type { WordParts } from '../_types';
import styles from '../readsvp.module.css';

interface FocalDisplayProps {
  wordParts: WordParts;
  currentIndex: number;
  totalWords: number;
}

export default function FocalDisplay({
  wordParts,
  currentIndex,
  totalWords,
}: FocalDisplayProps) {
  return (
    <>
      <div className={styles.focalContainer}>
        <div className={styles.pivotMarker} aria-hidden="true" />
        <div
          className={styles.wordDisplay}
          aria-live="polite"
          aria-atomic="true"
        >
          <span className={styles.wordBefore}>{wordParts.before}</span>
          <span className={styles.wordPivot}>{wordParts.pivot}</span>
          <span className={styles.wordAfter}>{wordParts.after}</span>
        </div>
        <div
          className={`${styles.pivotMarker} ${styles.pivotMarkerBottom}`}
          aria-hidden="true"
        />
      </div>
      <div className={styles.wordCounter}>
        {currentIndex + 1} / {totalWords}
      </div>
    </>
  );
}
