"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import styles from "./HeroBlend.module.css";
import { hasIntroPlayed, markIntroPlayed } from "@/lib/introState";

export default function HeroBlend() {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);

  // Runs before paint — instantly hides hero on back navigation
  useLayoutEffect(() => {
    if (hasIntroPlayed()) {
      sectionRef.current.style.display = "none";
    }
  }, []);

  useEffect(() => {
    if (hasIntroPlayed()) return;

    // Mark before the animation so that any re-render during the sequence skips correctly
    markIntroPlayed();

    const anim = gsap.fromTo(
      bgRef.current,
      { clipPath: "circle(0% at 50% 100%)" },
      {
        clipPath: "circle(150% at 50% 100%)",
        ease: "power4.in",
        duration: 2,
        delay: 1,
      },
    );

    return () => {
      anim.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} id="hero-blend" className={styles.hero}>
      <div className={styles.sticky}>
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
        <p className={styles.naturalHeadline}>Brandon O&apos;Boyle</p>
        <div ref={bgRef} className={styles.bgPanel}>
          <Image
            src="/flower-background.webp"
            alt=""
            fill
            style={{ objectFit: "cover", objectPosition: "center center" }}
            priority
          />
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
        </div>
      </div>
    </section>
  );
}
