"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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
const MOBILE_QUERY  = "(max-width: 768px)";

const CLOSED_RIGHT = "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)";
const OPEN         = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";

const offscreenY = () =>
  typeof window === "undefined" ? -1000 : -window.innerHeight;

export default function Nav() {
  const pillarsRef        = useRef(null);
  const swipeRefs         = useRef([]);
  const hamburgerRef      = useRef(null);
  const mobilePillarsRef  = useRef([]);
  const pathname          = usePathname();
  const isHome            = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);

  const isMobile = () =>
    typeof window !== "undefined" && window.matchMedia(MOBILE_QUERY).matches;

  // Stable ref callbacks so React doesn't null them out on re-render
  const mobileRefSetters = useMemo(
    () =>
      PILLARS.map((_, i) => (el) => {
        mobilePillarsRef.current[i] = el;
      }),
    []
  );

  // Runs before paint — instantly applies end state on back navigation,
  // or pre-hides the pillars/hamburger when the intro is about to play.
  useLayoutEffect(() => {
    if (!isHome || hasIntroPlayed()) {
      gsap.set(pillarsRef.current, { autoAlpha: 1 });
      if (!isMobile()) gsap.set(document.body, { paddingRight: "14rem" });
      const heroEl = document.getElementById("hero-blend");
      if (heroEl) gsap.set(heroEl, { display: "none" });
    } else {
      gsap.set([pillarsRef.current, hamburgerRef.current].filter(Boolean), {
        autoAlpha: 0,
      });
    }
  }, [isHome]);

  // Intro timeline (home, first visit per session)
  useEffect(() => {
    if (!isHome || hasIntroPlayed()) return;

    const ctx = gsap.context(() => {
      gsap.set(pillarsRef.current, { autoAlpha: 0 });
      gsap.set(hamburgerRef.current, { autoAlpha: 0 });

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
      tl.set(hamburgerRef.current, { autoAlpha: 1 }, "<");

      tl.to(swipeRefs.current, {
        clipPath: CLOSED_RIGHT,
        duration: 0.75,
        stagger: { each: 0.1, from: "end" },
        ease: "power3.inOut",
      }, "<");

      if (!isMobile()) {
        tl.to(document.body, {
          paddingRight: "14rem",
          duration: 0.75,
          ease: "power3.inOut",
        }, "<");
      }

      tl.set("#hero-blend", { display: "none" }, "<");
    });

    return () => ctx.revert();
  }, []);

  const runOpen = () => {
    setMenuOpen(true);
    const targets = mobilePillarsRef.current.filter(Boolean);
    if (!targets.length) return;
    gsap.fromTo(
      targets,
      { y: offscreenY() },
      {
        y: 0,
        duration: 0.55,
        stagger: { each: 0.08, from: "start" },
        ease: "power3.out",
        overwrite: true,
      }
    );
  };

  const runClose = (onDone) => {
    const targets = mobilePillarsRef.current.filter(Boolean);
    if (!targets.length) {
      setMenuOpen(false);
      onDone?.();
      return;
    }
    gsap.to(targets, {
      y: offscreenY(),
      duration: 0.55,
      stagger: { each: 0.08, from: "end" },
      ease: "power3.in",
      overwrite: true,
      onComplete: () => {
        setMenuOpen(false);
        onDone?.();
      },
    });
  };

  const handleToggleClick = () => {
    if (menuOpen) runClose();
    else runOpen();
  };

  const handlePillarClick = (e, hash) => {
    e.preventDefault();
    if (isHome) {
      const target = document.getElementById(hash);
      if (target) window.scrollTo({ top: target.offsetTop, behavior: "auto" });
    }
    runClose(() => {
      if (!isHome) window.location.href = `/#${hash}`;
    });
  };

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

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

      <button
        ref={hamburgerRef}
        type="button"
        className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ""}`}
        onClick={handleToggleClick}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
      >
        <span /><span /><span />
      </button>

      <nav className={styles.pillars} ref={pillarsRef}>
        {PILLARS.map(({ label, number, hash }) => (
          <a key={label} href={isHome ? `#${hash}` : `/#${hash}`} className={`${styles.pillar} ${styles[`pillar${label}`]}`}>
            <span className={styles.pillarText}>{number} {label}</span>
          </a>
        ))}
      </nav>

      <nav
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}
        aria-hidden={!menuOpen}
      >
        {PILLARS.map(({ label, number, hash }, i) => (
          <a
            key={label}
            ref={mobileRefSetters[i]}
            href={isHome ? `#${hash}` : `/#${hash}`}
            onClick={(e) => handlePillarClick(e, hash)}
            className={`${styles.mobilePillar} ${styles[`pillar${label}`]}`}
            tabIndex={menuOpen ? 0 : -1}
          >
            <span className={styles.mobilePillarNumber}>{number}</span>
            <span className={styles.mobilePillarLabel}>{label}</span>
          </a>
        ))}
      </nav>
    </>
  );
}
