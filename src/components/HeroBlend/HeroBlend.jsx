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

    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', onResize)

    // ─── Scroll-driven background expand ─────────────────────────────────
    // Only bgPanel is animated — the blend layers live inside it and are
    // clipped automatically, so there is only one expanding circle.
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
    <section ref={sectionRef} className={styles.hero}>
      <div className={styles.sticky}>

        {/*
          ── Layer 1: natural side-fill portrait ─ z-index: 1 ─────────────
          Natural portrait shown on initial page load, before any scroll.
          Covered by the expanding bgPanel as it grows.
        */}
        <div className={styles.naturalSideFill}>
          <Image
            src="/side-fill-waist.webp"
            alt=""
            width={1148}
            height={2026}
            className={styles.naturalSideFillImg}
            priority
          />
        </div>

        {/*
          ── Layer 2: natural headline ─ z-index: 2 ────────────────────────
          Dark text visible on the white background before scroll begins.
          Covered by the expanding bgPanel on scroll.
        */}
        <p className={styles.naturalHeadline}>Brandon O&apos;Boyle</p>

        {/*
          ── Layer 3: expanding background + blend layers ─ z-index: 3 ─────
          bgPanel is the sole animated element. The blend sideFill and
          headline live inside it so they are clipped by the same
          circle — one expanding circle, no duplicate edges.

          Because bgPanel creates a stacking context (will-change:
          clip-path), the blend children composite against the flower
          photo inside the circle, which is the intended end state.
        */}
        <div ref={bgRef} className={styles.bgPanel}>
          <Image
            src="/flower-background.webp"
            alt=""
            fill
            style={{ objectFit: 'cover', objectPosition: 'center center' }}
            priority
          />

          {/* Blend portrait — composites against flower photo */}
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

          {/* Blend headline — composites against flower photo */}
          <h1 className={styles.headline}>PORTFOLIO SITE</h1>
        </div>

      </div>
    </section>
  )
}
