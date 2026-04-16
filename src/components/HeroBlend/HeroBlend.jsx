'use client'

import { useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import styles from './HeroBlend.module.css'

gsap.registerPlugin(ScrollTrigger)

// Shrinks el's font-size until the text fits within its padded content box.
// Uses createRange to measure the actual rendered text width after CSS transforms
// (e.g. text-transform: uppercase), so it works for any font or string.
function fitHeadline(el) {
  if (!el) return
  el.style.fontSize = '100px'
  const range = document.createRange()
  range.selectNodeContents(el)
  const textWidth = range.getBoundingClientRect().width
  range.detach()
  const cs = getComputedStyle(el)
  const available = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
  el.style.fontSize = `${Math.floor(100 * (available / textWidth) * 0.98)}px`
}

export default function HeroBlend() {
  const sectionRef = useRef(null)
  const bgRef = useRef(null)
  const naturalHeadlineRef = useRef(null)
  const blendHeadlineRef = useRef(null)

  const fitAll = useCallback(() => {
    fitHeadline(naturalHeadlineRef.current)
    fitHeadline(blendHeadlineRef.current)
  }, [])

  useEffect(() => {
    fitAll()

    const ro = new ResizeObserver(fitAll)
    if (sectionRef.current) ro.observe(sectionRef.current)

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
      ro.disconnect()
      window.removeEventListener('resize', onResize)
      anim.scrollTrigger?.kill()
      gsap.ticker.remove(onRaf)
      lenis.destroy()
    }
  }, [fitAll])

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
        <p ref={naturalHeadlineRef} className={styles.naturalHeadline}>Brandon O&apos;Boyle</p>

        {/*
          ── Layer 3: expanding background + blend layers ─ z-index: 3 ─────
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
          <h1 ref={blendHeadlineRef} className={styles.headline}>PORTFOLIO SITE</h1>
        </div>

      </div>
    </section>
  )
}
