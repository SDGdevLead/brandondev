'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import styles from './HeroBlend.module.css'

gsap.registerPlugin(ScrollTrigger)

export default function HeroBlend() {
  const sectionRef = useRef(null)
  const bgRef = useRef(null)

  useEffect(() => {
    // ─── Lenis smooth scroll ──────────────────────────────────────────────
    const lenis = new Lenis()

    const onRaf = (time) => {
      lenis.raf(time * 1000) // GSAP passes seconds; Lenis expects milliseconds
    }
    gsap.ticker.add(onRaf)
    gsap.ticker.lagSmoothing(0)
    lenis.on('scroll', ScrollTrigger.update)

    // Refresh ScrollTrigger on resize/orientation change so trigger positions
    // stay accurate — particularly important on mobile where the browser
    // chrome shows/hides and changes the viewport height mid-session.
    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', onResize)

    // ─── Scroll-driven background expand ─────────────────────────────────
    // circle(radius at cx cy): starts as a zero-radius circle at the
    // bottom centre of the viewport, grows to 150% radius on scroll —
    // large enough to reach every corner from that origin point.
    const anim = gsap.fromTo(
      bgRef.current,
      { clipPath: 'circle(0% at 50% 100%)' },
      {
        clipPath: 'circle(150% at 50% 100%)',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      }
    )

    return () => {
      window.removeEventListener('resize', onResize)
      anim.scrollTrigger?.kill()
      gsap.ticker.remove(onRaf)
      lenis.destroy()
    }
  }, [])

  return (
    /*
      isolation: isolate confines the headline's mix-blend-mode to this
      section only — it won't composite against the navbar or content below.
    */
    <section ref={sectionRef} className={styles.hero}>
      <div className={styles.sticky}>

        {/*
          ── Layer 1: expanding background photo ─ z-index: 1 ─────────────
          Starts clipped to nothing at the bottom centre; GSAP expands it
          to fill the full viewport as the user scrolls.
          Sits behind both the side-fill portrait and the headline.
        */}
        <div ref={bgRef} className={styles.bgPanel}>
          <Image
            src="/flower-background.webp"
            alt=""
            fill
            style={{ objectFit: 'cover', objectPosition: 'center center' }}
            priority
          />
        </div>

        {/*
          ── Layer 2: static side-fill portrait ─ z-index: 2 ──────────────
          Natural proportions, anchored to the bottom centre of the
          viewport. Sits above the expanding background so it's always
          fully visible. No blend mode — renders as-is.
        */}
        <div className={styles.sideFill}>
          <Image
            src="/side-fill-waist.webp"
            alt=""
            width={1148}
            height={2026}
            className={styles.sideFillImg}
            priority
          />
        </div>

        {/*
          ── Layer 3: headline ─ z-index: 3 ───────────────────────────────
          Sits above both image layers so mix-blend-mode composites the
          text against the full backdrop (white bg → expanding photo).

          mix-blend-mode: difference with color: white:
            • Over white background: |255 − 255| = 0   → black text  ✓
            • Over dark image px:    |255 − 20|  = 235 → light text  ✓
            • Over light image px:   |255 − 220| = 35  → dark text   ✓
        */}
        <h1 className={styles.headline}>BRANDON O&apos;BOYLE</h1>

      </div>
    </section>
  )
}
