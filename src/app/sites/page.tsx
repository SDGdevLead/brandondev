import Link from 'next/link'
import styles from '../category.module.css'
import { sites } from '@/data/projects'

export default function SitesPage() {
  return (
    <main className={styles.page}>
      <Link href="/" className={styles.back}>← Home</Link>
      <header className={styles.pageHead}>
        <h1 className={styles.pageTitle}>Sites</h1>
        <p className={styles.pageMeta}>Marketing & Portfolio Sites</p>
      </header>
      <div className={styles.grid}>
        {sites.map(p => (
          <Link key={p.slug} href={`/sites/${p.slug}`} className={styles.card}>
            <div className={styles.cardThumb} />
            <div className={styles.cardFoot}>
              <p className={styles.cardTitle}>{p.title}</p>
              <p className={styles.cardMeta}>{p.tags.join(' · ')}</p>
            </div>
          </Link>
        ))}
        {sites.length === 0 && <p className={styles.empty}>Projects coming soon.</p>}
      </div>
    </main>
  )
}
