"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import styles from "./Nav.module.css";
import { hasIntroPlayed } from "@/lib/introState";

const PILLARS = [
  { label: "PROJECTS",     number: "01", hash: "work"    },
  { label: "PERSONAL",     number: "02", hash: "about"   },
  { label: "PROFESSIONAL", number: "03", hash: "skills"  },
  { label: "CONTACT",      number: "04", hash: "contact" },
];

const SWIPE_COLORS = [
  "var(--color-primary-subtle)",
  "var(--color-accent-subtle)",
  "var(--color-primary)",
  "var(--color-text)",
];

const HERO_DURATION = 3;

const CLOSED_RIGHT = "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)";
const OPEN         = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";

export default function Nav() {
  const pillarsRef = useRef(null);
  const swipeRefs  = useRef([]);
  const pathname   = usePathname();
  const isHome     = pathname === "/";

  // Runs before paint — instantly applies end state on back navigation or non-home pages
  useLayoutEffect(() => {
    if (!isHome || hasIntroPlayed()) {
      gsap.set(pillarsRef.current, { autoAlpha: 1 });
      gsap.set(document.body, { paddingRight: "14rem" });
      const heroEl = document.getElementById("hero-blend");
      if (heroEl) gsap.set(heroEl, { display: "none" });
    }
  }, [isHome]);

  useEffect(() => {
    if (!isHome || hasIntroPlayed()) return;

    const ctx = gsap.context(() => {
      gsap.set(pillarsRef.current, { autoAlpha: 0 });

      const tl = gsap.timeline({ delay: HERO_DURATION });

      tl.fromTo(
        swipeRefs.current,
        { clipPath: CLOSED_RIGHT },
        {
          clipPath: OPEN,
          duration: 0.75,
          stagger: { each: 0.1, from: "end" },
          ease: "power3.inOut",
        }
      );

      tl.set(pillarsRef.current, { autoAlpha: 1 });

      tl.to(swipeRefs.current, {
        clipPath: CLOSED_RIGHT,
        duration: 0.75,
        stagger: { each: 0.1, from: "end" },
        ease: "power3.inOut",
      }, "<").to(document.body, {
        paddingRight: "14rem",
        duration: 0.75,
        ease: "power3.inOut",
      }, "<").set("#hero-blend", { display: "none" }, "<");
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {SWIPE_COLORS.map((color, i) => (
        <div
          key={i}
          ref={(el) => (swipeRefs.current[i] = el)}
          className={styles.swipePanel}
          style={{ backgroundColor: color }}
        />
      ))}

      <nav className={styles.pillars} ref={pillarsRef}>
        {PILLARS.map(({ label, number, hash }) => (
          <a key={label} href={isHome ? `#${hash}` : `/#${hash}`} className={`${styles.pillar} ${styles[`pillar${label}`]}`}>
            <span className={styles.pillarText}>{number} {label}</span>
          </a>
        ))}
      </nav>
    </>
  );
}
