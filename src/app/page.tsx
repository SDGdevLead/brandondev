import HeroBlend from '@/components/HeroBlend/HeroBlend'
import styles from './page.module.css'

const WORKS = [
  { id: '01', title: 'Apps', category: 'Web & Mobile Applications', year: '', accent: 'primary' },
  { id: '02', title: 'Sites', category: 'Marketing & Portfolio Sites', year: '', accent: 'accent'  },
  { id: '03', title: 'Tools', category: 'Dev Tools & Utilities', year: '', accent: 'surface' },
]

const SKILLS = [
  { label: 'React & TypeScript',    detail: 'Hooks · Context · Custom libs'     },
  { label: 'Next.js & Astro',       detail: 'App Router · SSR · ISR'            },
  { label: 'Figma & UI/UX Design',  detail: 'Components · Prototyping · Flows'  },
  { label: 'CSS & Design Systems',  detail: 'Tokens · Accessibility · WCAG 2.2' },
  { label: 'Git & Dev Tooling',     detail: 'GitHub · CI/CD · Testing'          },
]

export default function Home() {
  return (
    <main>
      <HeroBlend />

      <div className={styles.sections}>

        {/* ── Projects ─────────────────────────────────────────── */}
        <section id="work" className={styles.section}>
          <header className={styles.sectionHead}>
            <span className={styles.sectionNum}>01</span>
            <h2 className={styles.sectionTitle}>PROJECTS</h2>
          </header>
          <div className={styles.workGrid}>
            {WORKS.map(w => (
              <article key={w.id} className={`${styles.workCard} ${styles[`workCard_${w.accent}`]}`}>
                <div className={styles.workCardThumb} />
                <footer className={styles.workCardFoot}>
                  <div>
                    <p className={styles.workCardTitle}>{w.title}</p>
                    <p className={styles.workCardMeta}>{w.category}</p>
                  </div>
                </footer>
              </article>
            ))}
          </div>
        </section>

        {/* ── Personal ────────────────────────────────────────── */}
        <section id="about" className={styles.section}>
          <header className={styles.sectionHead}>
            <span className={styles.sectionNum}>02</span>
            <h2 className={styles.sectionTitle}>Personal</h2>
          </header>
          <div className={styles.aboutText}>
            <p className={styles.aboutLead}>
              I&apos;m a web developer and designer based in Ottawa, ON, building
              digital experiences where thoughtful design meets clean, expressive code.
            </p>
            <p className={styles.aboutBody}>
              With a background in psychology and front-end development, I bring a
              human-centred perspective to every project — from full website overhauls
              and design systems to AI-powered tools. I work across React, Next.js,
              TypeScript, and Figma to take ideas from concept to launch.
            </p>
            <p className={styles.aboutCredentials}>
              Google UX Design Certificate · Front-End Development, University of Calgary · BA Psychology, Trent University
            </p>
          </div>
        </section>

        {/* ── Professional ───────────────────────────────────────── */}
        <section id="skills" className={styles.section}>
          <header className={styles.sectionHead}>
            <span className={styles.sectionNum}>03</span>
            <h2 className={styles.sectionTitle}>Professional</h2>
          </header>
          <ul className={styles.skillList}>
            {SKILLS.map((s) => (
              <li key={s.label} className={styles.skillItem}>
                
                <span className={styles.skillLabel}>{s.label}</span>
                <span className={styles.skillDetail}>{s.detail}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Contact ──────────────────────────────────────── */}
        {/* <section id="contact" className={styles.section}>
          <header className={styles.sectionHead}>
            <span className={styles.sectionNum}>04</span>
            <h2 className={styles.sectionTitle}>Contact</h2>
          </header>
          <div className={styles.contactInner}>
            <p className={styles.contactLead}>Let&apos;s work<br />together.</p>
            <a href="mailto:brandon.ohboil@icloud.com" className={styles.contactEmail}>
              brandon.ohboil@icloud.com
            </a>
          </div>
        </section> */}

      </div>
    </main>
  )
}
