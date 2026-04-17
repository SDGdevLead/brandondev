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
        {sites.map((p, i) => (
          <Link key={p.slug} href={p.url ?? `/sites/${p.slug}`} target={p.url ? '_blank' : undefined} rel={p.url ? 'noopener noreferrer' : undefined} className={`${styles.card} ${styles[`card_${(['primary','accent','surface'] as const)[i % 3]}`]}`}>
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
        {sites.length === 0 && <p className={styles.empty}>Projects coming soon.</p>}
      </div>
    </main>
  )
}
