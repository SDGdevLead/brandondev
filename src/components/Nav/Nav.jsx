"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./Nav.module.css";

const PILLARS = [
  { label: "PROJECTS",     number: "01", href: "#work"     },
  { label: "PERSONAL",    number: "02", href: "#about"    },
  { label: "PROFESSIONAL",   number: "03", href: "#skills"   },
];

// Colors ordered lightest → darkest so dark is last in DOM (highest z-index)
// and stagger from "end" makes dark lead the animation
const SWIPE_COLORS = [
  "var(--color-primary-subtle)",
  "var(--color-accent-subtle)",
  "var(--color-primary)",
  "var(--color-text)",
];

const HERO_DURATION = 3; // matches HeroBlend delay(1) + duration(2)

const CLOSED_RIGHT = "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)";
const OPEN         = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";

export default function Nav() {
  const pillarsRef = useRef(null);
  const swipeRefs  = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(pillarsRef.current, { autoAlpha: 0 });

      const tl = gsap.timeline({ delay: HERO_DURATION });

      // Dark panel leads entry, lighter panels trail behind
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

      // Reveal nav while all panels still cover the screen
      tl.set(pillarsRef.current, { autoAlpha: 1 });

      // Dark panel leads exit to the right, lighter panels follow
      // Simultaneously shift body content to make room for the fixed nav
      tl.to(swipeRefs.current, {
        clipPath: CLOSED_RIGHT,
        duration: 0.75,
        stagger: { each: 0.1, from: "end" },
        ease: "power3.inOut",
      }, "<").to(document.body, {
        paddingRight: "10.5rem",
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
        {PILLARS.map(({ label, number, href }) => (
          <a key={label} href={href} className={`${styles.pillar} ${styles[`pillar${label}`]}`}>
            <span className={styles.pillarText}>{number} {label}</span>
          </a>
        ))}
      </nav>
    </>
  );
}
