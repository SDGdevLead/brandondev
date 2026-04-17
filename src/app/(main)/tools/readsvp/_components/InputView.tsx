import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { parseFile, FILE_ACCEPT } from '../_lib/parsers';
import type { Chapter } from '../_types';
import styles from '../readsvp.module.css';

const SAMPLE_TEXT =
  'Speed reading is a collection of reading methods which attempt to increase rates of reading without greatly reducing comprehension or retention. Methods include chunking and minimizing subvocalization. The many available speed reading training programs include books, videos, software, and seminars. RSVP, or Rapid Serial Visual Presentation, displays words one at a time at a fixed focal point, eliminating the need for eye movement across the page.';

interface InputViewProps {
  onTextReady: (text: string) => void;
  onChaptersReady: (chapters: Chapter[], title: string) => void;
}

export default function InputView({ onTextReady, onChaptersReady }: InputViewProps) {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setIsLoading(true);
    setLoadProgress(0);
    setErrorMessage('');

    try {
      const result = await parseFile(file, p => setLoadProgress(p));
      if (result.chapters && result.chapters.length > 1) {
        onChaptersReady(result.chapters, result.title);
      } else {
        onTextReady(result.text);
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to parse file');
    } finally {
      setIsLoading(false);
      setLoadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  function handleLoadText() {
    if (inputText.trim()) {
      onTextReady(inputText);
    }
  }

  return (
    <section className={styles.inputSection}>
      <div
        className={styles.fileUploadArea}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <button
          className={styles.fileUploadBtn}
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className={styles.loadingSpinner} />
              <span>Loading… {loadProgress}%</span>
            </>
          ) : (
            <>
              <svg className={styles.uploadIcon} viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M14 2v6h6M12 18v-6M9 15l3-3 3 3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className={styles.uploadText}>Open EPUB, PDF, or TXT</span>
              <span className={styles.uploadHint}>or paste text below</span>
            </>
          )}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={FILE_ACCEPT}
        onChange={handleFileChange}
        className={styles.visuallyHidden}
        aria-hidden="true"
      />

      {errorMessage && (
        <div className={styles.errorMessage} role="alert">
          {errorMessage}
        </div>
      )}

      <div className={styles.divider}>
        <span>or paste text</span>
      </div>

      <textarea
        className={styles.textInput}
        value={inputText}
        onChange={e => setInputText(e.target.value)}
        placeholder="Paste or type your text here…"
        rows={6}
        disabled={isLoading}
      />

      <div className={styles.inputActions}>
        <button
          className={`${styles.btn} ${styles.btnSecondary}`}
          onClick={() => setInputText(SAMPLE_TEXT)}
          disabled={isLoading}
        >
          Load Sample
        </button>
        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={handleLoadText}
          disabled={!inputText.trim() || isLoading}
        >
          Start Reading
        </button>
      </div>
    </section>
  );
}
