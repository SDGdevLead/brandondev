import HeroBlend from '@/components/HeroBlend/HeroBlend'

export default function Home() {
  return (
    <main>
      <HeroBlend />

      {/* A section below the hero so there's visible content to scroll past */}
      {/* <section className={styles.after}>
        <p className={styles.afterLabel}>Scroll back up to see the effect</p>
      </section> */}
    </main>
  )
}
