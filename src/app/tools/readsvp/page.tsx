import Link from 'next/link'
import styles from '../../category.module.css'

// To bring in ReadSVP from ~/apps/ReadSVP:
//
//   src/app/tools/readsvp/
//     page.tsx            ← this file
//     _components/        ← move component files here (prefix _ = not a route)
//     _hooks/             ← move custom hooks here
//
// Then import and render below, e.g.:
//   import ReadSVP from './_components/ReadSVP'

export default function ReadSVPPage() {
  return (
    <main className={styles.page}>
      <Link href="/tools" className={styles.back}>← Tools</Link>
      <header className={styles.pageHead}>
        <h1 className={styles.pageTitle}>ReadSVP</h1>
        <p className={styles.pageMeta}>Speed reading via Serial Visual Presentation · React · TypeScript · 2024</p>
      </header>
      <div className={styles.projectContent}>
        {/* <ReadSVP /> */}
      </div>
    </main>
  )
}
