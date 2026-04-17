import { useState } from 'react';
import type { Chapter } from '../_types';
import { formatWordCount } from '../_lib/parsers';
import styles from '../readsvp.module.css';

interface ChapterSelectProps {
  chapters: Chapter[];
  onStart: (text: string) => void;
}

export default function ChapterSelect({ chapters, onStart }: ChapterSelectProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(chapters.map(ch => ch.id))
  );

  const allSelected = selectedIds.size === chapters.length;

  const selectedWordCount = chapters
    .filter(ch => selectedIds.has(ch.id))
    .reduce((sum, ch) => sum + ch.wordCount, 0);

  function toggleChapter(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleAll() {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(chapters.map(ch => ch.id)));
    }
  }

  function handleStart() {
    const text = chapters
      .filter(ch => selectedIds.has(ch.id))
      .map(ch => ch.text)
      .join('\n\n');
    onStart(text);
  }

  return (
    <section className={styles.chapterSection}>
      <div className={styles.chapterHeader}>
        <h2 className={styles.chapterHeading}>Select Chapters</h2>
        <button
          className={`${styles.btn} ${styles.btnText} ${styles.btnSmall}`}
          onClick={toggleAll}
        >
          {allSelected ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      <ul className={styles.chapterList}>
        {chapters.map((chapter, index) => (
          <li key={chapter.id} className={styles.chapterItem}>
            <label className={styles.chapterLabel}>
              <input
                type="checkbox"
                checked={selectedIds.has(chapter.id)}
                onChange={() => toggleChapter(chapter.id)}
                className={styles.chapterCheckbox}
              />
              <span className={styles.chapterNumber}>{index + 1}.</span>
              <span className={styles.chapterTitle}>{chapter.title}</span>
              <span className={styles.chapterWords}>
                {formatWordCount(chapter.wordCount)} words
              </span>
            </label>
          </li>
        ))}
      </ul>

      <div className={styles.chapterActions}>
        <div className={styles.chapterSummary}>
          {selectedIds.size} of {chapters.length} chapters
          <span className={styles.chapterSummaryWords}>
            {' '}
            ({formatWordCount(selectedWordCount)} words)
          </span>
        </div>
        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={handleStart}
          disabled={selectedIds.size === 0}
        >
          Start Reading
        </button>
      </div>
    </section>
  );
}
