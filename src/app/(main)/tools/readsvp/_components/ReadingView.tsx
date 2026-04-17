import type { ReaderEngine } from '../_lib/ReaderEngine';
import FocalDisplay from './FocalDisplay';
import ProgressSlider from './ProgressSlider';
import PlaybackControls from './PlaybackControls';
import KeyboardHints from './KeyboardHints';
import styles from '../readsvp.module.css';

interface ReadingViewProps {
  engine: ReaderEngine;
}

export default function ReadingView({ engine }: ReadingViewProps) {
  return (
    <>
      <main className={styles.readingArea}>
        <FocalDisplay
          wordParts={engine.currentWordParts}
          currentIndex={engine.currentIndex}
          totalWords={engine.totalWords}
        />
      </main>

      <ProgressSlider
        progress={engine.progress}
        timeRemaining={engine.timeRemaining}
        onSeek={percent => engine.seekToPercent(percent)}
      />

      <PlaybackControls
        isPlaying={engine.isPlaying}
        isAtStart={engine.isAtStart}
        isAtEnd={engine.isAtEnd}
        wpm={engine.wpm}
        onToggle={() => engine.toggle()}
        onPrev={() => engine.prevWord()}
        onNext={() => engine.nextWord()}
        onWpmChange={delta => engine.setWpm(engine.wpm + delta)}
      />

      <KeyboardHints />
    </>
  );
}
