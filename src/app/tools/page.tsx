import Link from 'next/link'
import styles from '../category.module.css'
import { tools } from '@/data/projects'

export default function ToolsPage() {
  return (
    <main className={styles.page}>
      <Link href="/" className={styles.back}>← Home</Link>
      <header className={styles.pageHead}>
        <h1 className={styles.pageTitle}>Tools</h1>
        <p className={styles.pageMeta}>Dev Tools & Utilities</p>
      </header>
      <div className={styles.grid}>
        {tools.map(p => (
          <Link key={p.slug} href={`/tools/${p.slug}`} className={styles.card}>
            <div className={styles.cardThumb} />
            <div className={styles.cardFoot}>
              <p className={styles.cardTitle}>{p.title}</p>
              <p className={styles.cardMeta}>{p.tags.join(' · ')}</p>
            </div>
          </Link>
        ))}
        {tools.length === 0 && <p className={styles.empty}>Projects coming soon.</p>}
      </div>
    </main>
  )
}
