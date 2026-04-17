import styles from '../readsvp.module.css';

export default function KeyboardHints() {
  return (
    <footer className={styles.keyboardHint}>
      <kbd>Space</kbd> Play/Pause
      <kbd>←</kbd>
      <kbd>→</kbd> Navigate
      <kbd>↑</kbd>
      <kbd>↓</kbd> Speed
    </footer>
  );
}
