'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Chapter } from '../_types';
import { useReaderEngine } from '../_hooks/useReaderEngine';
import { useKeyboardControls } from '../_hooks/useKeyboardControls';
import InputView from './InputView';
import ChapterSelect from './ChapterSelect';
import ReadingView from './ReadingView';
import styles from '../readsvp.module.css';

type View = 'input' | 'chapters' | 'reading';

export default function ReadSVPApp() {
  const engine = useReaderEngine();
  const [view, setView] = useState<View>('input');
  const [documentTitle, setDocumentTitle] = useState('');
  const [chapters, setChapters] = useState<Chapter[]>([]);

  useKeyboardControls(engine);

  function handleTextReady(text: string) {
    engine.setText(text);
    setChapters([]);
    setDocumentTitle('');
    setView('reading');
  }

  function handleChaptersReady(newChapters: Chapter[], title: string) {
    setChapters(newChapters);
    setDocumentTitle(title);
    setView('chapters');
  }

  function handleChapterStart(text: string) {
    engine.setText(text);
    setView('reading');
  }

  function handleBackToChapters() {
    engine.stop();
    engine.words = [];
    setView('chapters');
  }

  function handleNewText() {
    engine.stop();
    engine.words = [];
    setDocumentTitle('');
    setChapters([]);
    setView('input');
  }

  return (
    <div className={styles.readerApp}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/tools" className={styles.backLink}>← Tools</Link>
          <span className={styles.appTitle}>ReadSVP</span>
          {documentTitle && view !== 'input' && (
            <span className={styles.documentTitle}>{documentTitle}</span>
          )}
        </div>

        {view === 'reading' && chapters.length > 1 ? (
          <button
            className={`${styles.btn} ${styles.btnText}`}
            onClick={handleBackToChapters}
            aria-label="Back to chapter selection"
          >
            Chapters
          </button>
        ) : view !== 'input' ? (
          <button
            className={`${styles.btn} ${styles.btnText}`}
            onClick={handleNewText}
            aria-label="Clear and load new text"
          >
            New Text
          </button>
        ) : null}
      </header>

      {view === 'input' && (
        <InputView
          onTextReady={handleTextReady}
          onChaptersReady={handleChaptersReady}
        />
      )}

      {view === 'chapters' && (
        <ChapterSelect chapters={chapters} onStart={handleChapterStart} />
      )}

      {view === 'reading' && <ReadingView engine={engine} />}
    </div>
  );
}
