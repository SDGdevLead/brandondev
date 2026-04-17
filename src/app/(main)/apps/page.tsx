import Link from 'next/link'
import styles from '../category.module.css'
import { apps } from '@/data/projects'

export default function AppsPage() {
  return (
    <main className={styles.page}>
      <Link href="/" className={styles.back}>← Home</Link>
      <header className={styles.pageHead}>
        <h1 className={styles.pageTitle}>Apps</h1>
        <p className={styles.pageMeta}>Web & Mobile Applications</p>
      </header>
      <div className={styles.grid}>
        {apps.map((p, i) => (
          <Link key={p.slug} href={`/apps/${p.slug}`} className={`${styles.card} ${styles[`card_${(['primary','accent','surface'] as const)[i % 3]}`]}`}>
            <div className={styles.cardTop}>
              <span className={styles.cardNum}>{String(i + 1).padStart(2, '0')}</span>
              <span className={styles.cardArrow}>→</span>
            </div>
            <div>
              <p className={styles.cardTitle}>{p.title}</p>
              <p className={styles.cardMeta}>{p.tags.join(' · ')}</p>
            </div>
          </Link>
        ))}
        {apps.length === 0 && <p className={styles.empty}>Projects coming soon.</p>}
      </div>
    </main>
  )
}
