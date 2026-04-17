"use client";

import { useLayoutEffect, useRef } from "react";
import styles from "@/app/page.module.css";
import { hasIntroPlayed } from "@/lib/introState";

export default function SectionsReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (hasIntroPlayed() && ref.current) {
      ref.current.style.animation = "none";
      ref.current.style.opacity = "1";
      ref.current.style.transform = "translateY(0)";
    }
  }, []);

  return (
    <div ref={ref} className={styles.sections}>
      {children}
    </div>
  );
}
