import { motion, useMotionValue, useSpring, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { cv } from './data/cv'

/* ── Password Gate ── */
function PasswordGate({ onUnlock }) {
  const [value, setValue] = useState('')
  const [shake, setShake] = useState(false)

  const submit = e => {
    e.preventDefault()
    if (value === 'hello') {
      window.scrollTo(0, 0)
      onUnlock()
    } else {
      setShake(true)
      setValue('')
      setTimeout(() => setShake(false), 600)
    }
  }

  return (
    <motion.div
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        background: 'rgba(0,0,0,0.82)',
        backdropFilter: 'blur(48px)',
        WebkitBackdropFilter: 'blur(48px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 24px',
      }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
    >
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, width: '100%', maxWidth: 600 }}>
        <motion.input
          autoFocus
          type="password"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Password"
          animate={shake ? { x: [0, -18, 18, -12, 12, 0] } : { x: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: 'clamp(32px, 6.75vw, 69px)',
            fontWeight: 500,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            color: '#ffffff',
            width: '100%',
            textAlign: 'center',
            caretColor: '#ffffff',
            fontFamily: 'inherit',
          }}
        />
        <motion.button
          type="submit"
          whileHover={{ opacity: 0.5 }}
          transition={{ duration: 0.2 }}
          style={{
            background: '#ffffff',
            border: 'none',
            borderRadius: 0,
            padding: '12px 40px',
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: '0',
            textTransform: 'none',
            color: '#0a0a0a',
            cursor: 'none',
            fontFamily: 'inherit',
          }}
        >
          Login
        </motion.button>
      </form>
    </motion.div>
  )
}

/* ── Responsive hook ── */
function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 768)
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  return mobile
}

/* ── Cursor ── */
function Cursor() {
  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const [mode, setMode] = useState('default')

  const sx = useSpring(x, { stiffness: 600, damping: 35 })
  const sy = useSpring(y, { stiffness: 600, damping: 35 })

  useEffect(() => {
    const onMove = e => {
      x.set(e.clientX)
      y.set(e.clientY)
      const el = document.elementFromPoint(e.clientX, e.clientY)
      if (el?.closest('[data-cursor="gallery"]')) {
        setMode(e.clientX < window.innerWidth / 2 ? 'gallery-left' : 'gallery-right')
      } else if (el?.closest('a')) {
        setMode('link')
      } else {
        setMode('default')
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const size = mode === 'link' ? 120 : 75
  const arrow = mode === 'gallery-left' ? '←' : mode === 'gallery-right' ? '→' : mode === 'default' ? '↓' : ''

  return (
    <motion.div
      style={{
        position: 'fixed', top: 0, left: 0,
        x: sx, y: sy,
        translateX: '-50%', translateY: '-50%',
        background: '#ffffff', borderRadius: '50%',
        mixBlendMode: 'difference', pointerEvents: 'none', zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      animate={{ width: size, height: size }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.span
        style={{ fontSize: 22, fontWeight: 500, color: '#000000', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}
        animate={{ opacity: mode === 'default' || mode.startsWith('gallery') ? 1 : 0, scale: mode === 'default' || mode.startsWith('gallery') ? 1 : 0.5 }}
        transition={{ duration: 0.15 }}
      >
        {arrow}
      </motion.span>
    </motion.div>
  )
}

/* ── Glass Link ── */
function GlassLink({ href, style, children, download, target, rel, white }) {
  const [hovered, setHovered] = useState(false)
  const hoverColor = white ? '#ffffff' : '#007AFF'
  const pillBg = white ? 'rgba(255,255,255,0.12)' : 'rgba(0,122,255,0.08)'
  const pillBorder = white ? 'rgba(255,255,255,0.3)' : 'rgba(0,122,255,0.22)'
  return (
    <a
      href={href} download={download} target={target} rel={rel}
      style={{ ...style, color: hovered ? hoverColor : style.color, transition: 'color 0.25s', textDecoration: 'none' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{ position: 'relative', display: 'inline-block' }}>
        <AnimatePresence>
          {hovered && (
            <motion.span
              style={{
                position: 'absolute', inset: '-10px -18px',
                borderRadius: '100px',
                background: pillBg,
                border: `1px solid ${pillBorder}`,
                backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
                zIndex: 0, pointerEvents: 'none', display: 'block',
              }}
              initial={{ scaleX: 0.4, scaleY: 0.2, opacity: 0 }}
              animate={{ scaleX: 1, scaleY: 1, opacity: 1 }}
              exit={{ scaleX: 0.4, scaleY: 0.2, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 38 }}
            />
          )}
        </AnimatePresence>
        <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
      </span>
    </a>
  )
}

const fade = (delay = 0) => ({
  initial: { opacity: 0, filter: 'blur(32px)' },
  whileInView: { opacity: 1, filter: 'blur(0px)' },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 1.4, delay, ease: [0.16, 1, 0.3, 1] },
})

/* ── Header ── */
function Header({ m, headerRef, textWhite }) {
  const wrap = {
    padding: m ? '56px 0 64px' : '108px 0 180px',
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 0,
  }
  const W = { maxWidth: 1200, margin: '0 auto', padding: m ? '0 20px' : '0 80px' }
  const col = textWhite ? '#ffffff' : '#0a0a0a'
  const line = {
    display: 'block',
    fontSize: m ? 'clamp(21px, 7vw, 31px)' : 'clamp(42px, 6vw, 60px)',
    fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1.15, color: col,
    margin: 0, transition: 'color 0.4s ease',
  }
  const link = { ...line }

  return (
    <header ref={headerRef} style={wrap}>
      <div style={W}>
        <motion.div
          initial={{ opacity: 0, filter: 'blur(32px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p style={line}>{cv.name}</p>
          <p style={{ ...line, whiteSpace: m ? 'normal' : 'nowrap' }}>{cv.title}</p>
          <GlassLink href={`tel:${cv.contact.phone}`} style={link} white={textWhite}>{cv.contact.phone}</GlassLink>
          <GlassLink href={`mailto:${cv.contact.email}`} style={link} white={textWhite}>{cv.contact.email}</GlassLink>
          <GlassLink href="/amy-peet-cv.pdf" download target="_blank" rel="noopener noreferrer" style={link} white={textWhite}>Download resume</GlassLink>
        </motion.div>
      </div>
    </header>
  )
}

/* ── Gallery ── */
const images = [
  { src: '/gallery/BarberOsgerby_Alphabet_01.jpg', caption: 'Barber Osgerby - Alphabet Exhibition, Milan Triennale, 2026' },
  { src: '/gallery/SAVOIA5.jpg', caption: '' },
  { src: '/gallery/P7483_302.jpg', caption: '' },
  { src: '/gallery/P7483_511.jpg', caption: '' },
  { src: '/gallery/A31_FW20_OpticWhite01B-1.jpg', caption: '' },
  { src: '/gallery/Screenshot 2026-05-10 at 09.35.28.png', caption: 'Andrew Gallimore by Rankin, 2015, published by Rankin Photography Ltd' },
  { src: '/gallery/Caroline Saulnier by Rankin 2012, published by Rankin Photography Ltd.png' },
  { src: '/gallery/More by Rankin, A retrospective 2013, Published by teNeues .png' },
  { src: '/gallery/F*ck Y*u Rankin, 2014, Published by Rankin Publishing Ltd.png' },
  { src: '/gallery/New Fashion Photography, 2013, Published by Prestel.jpg' },
]

const caption = ({ src, caption }) => caption ?? src.split('/').pop().replace(/\.[^.]+$/, '')

function Gallery({ m }) {
  const trackRef = useRef(null)
  const [index, setIndex] = useState(0)

  const onClick = e => {
    const goLeft = e.clientX < window.innerWidth / 2
    const next = goLeft ? Math.max(0, index - 1) : Math.min(images.length - 1, index + 1)
    if (next === index) return
    setIndex(next)
    trackRef.current.querySelectorAll('[data-slide]')[next].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
  }

  const px = m ? 20 : 80
  const [galleryLeft, setGalleryLeft] = useState(px)
  useEffect(() => {
    const calc = () => setGalleryLeft(window.innerWidth > 1200 ? Math.round((window.innerWidth - 1200) / 2) + px : px)
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [px])

  return (
    <motion.div
      style={{ width: '100%', marginBottom: m ? 56 : 120 }}
      initial={{ opacity: 0, filter: 'blur(32px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 1.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        ref={trackRef}
        data-cursor="gallery"
        style={{
          display: 'flex', gap: 12,
          overflowX: 'auto', overflowY: 'hidden',
          cursor: 'none',
          paddingLeft: galleryLeft, paddingRight: px,
          scrollbarWidth: 'none', msOverflowStyle: 'none',
        }}
        onClick={onClick}
      >
        {images.map((img, i) => (
          <div key={img.src} data-slide={i} style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ height: m ? '35vh' : '60vh', maxHeight: m ? 280 : 600 }}>
              <img src={img.src} alt="" style={{ height: '100%', width: 'auto', display: 'block', objectFit: 'cover', userSelect: 'none' }} draggable={false} />
            </div>
            {caption(img) && <p style={{ fontSize: m ? 13 : 12, fontWeight: 400, color: '#0a0a0a', letterSpacing: '0.01em', lineHeight: 1.4, whiteSpace: 'nowrap' }}>{caption(img)}</p>}
          </div>
        ))}
      </div>
    </motion.div>
  )
}

/* ── Section heading ── */
function SectionHeading({ children, m, delay = 0 }) {
  return (
    <motion.h2
      style={{
        fontSize: m ? 'clamp(24px, 7vw, 32px)' : 'clamp(42px, 6vw, 60px)',
        fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1.1,
        color: '#0a0a0a', marginBottom: m ? 24 : 42,
      }}
      {...fade(delay)}
    >
      {children}
    </motion.h2>
  )
}

/* ── Profile ── */
function Profile({ m }) {
  const W = { maxWidth: 1200, margin: '0 auto', padding: m ? '0 20px' : '0 80px' }
  return (
    <section style={{ padding: m ? '0 0 112px' : '0 0 216px' }}>
      <div style={W}>
        <SectionHeading m={m}>Personal profile</SectionHeading>
        <motion.p style={{ fontSize: m ? 16 : 18, lineHeight: 1.7, color: '#555555' }} {...fade(0.05)}>
          {cv.profile}
        </motion.p>
      </div>
    </section>
  )
}

/* ── Experience ── */
function Experience({ m }) {
  const W = { maxWidth: 1200, margin: '0 auto', padding: m ? '0 20px' : '0 80px' }
  return (
    <section style={{ padding: m ? '0 0 112px' : '0 0 216px' }}>
      <div style={W}>
        <SectionHeading m={m}>Professional experience</SectionHeading>
        {cv.experience.map((job, i) => (
          <motion.div key={job.company} style={{ marginBottom: m ? 36 : 60 }} {...fade(i * 0.06)}>
            {job.url ? (
              <GlassLink href={job.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', fontSize: m ? 'clamp(18px, 5vw, 24px)' : 'clamp(30px, 4.2vw, 42px)', fontWeight: 500, letterSpacing: '-0.03em', marginBottom: 4, color: '#0a0a0a' }}>{job.company}</GlassLink>
            ) : (
              <h3 style={{ fontSize: m ? 'clamp(18px, 5vw, 24px)' : 'clamp(30px, 4.2vw, 42px)', fontWeight: 500, letterSpacing: '-0.03em', marginBottom: 4, color: '#0a0a0a' }}>{job.company}</h3>
            )}
            <p style={{ fontSize: m ? 17 : 21, fontWeight: 700, marginBottom: m ? 12 : 21, color: '#0a0a0a' }}>{job.role} | {job.period}</p>
            <ul style={{ listStyle: 'none', display: m ? 'flex' : 'grid', gridTemplateColumns: '1fr 1fr', flexDirection: 'column', gap: m ? 8 : 15 }}>
              {job.bullets.map(b => (
                <li key={b.label} style={{ color: '#0a0a0a' }}>
                  <p style={{ fontSize: m ? 17 : 20, fontWeight: 700, marginBottom: m ? 4 : 6 }}>{b.label}</p>
                  <p style={{ fontSize: m ? 15 : 18, lineHeight: 1.6, color: '#555555' }}>{b.text}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ── Skills ── */
function Skills({ m }) {
  const W = { maxWidth: 1200, margin: '0 auto', padding: m ? '0 20px' : '0 80px' }
  return (
    <section style={{ padding: m ? '0 0 112px' : '0 0 216px' }}>
      <div style={W}>
        <SectionHeading m={m}>Skills &amp; expertise</SectionHeading>
        <div style={{ display: m ? 'flex' : 'grid', gridTemplateColumns: '1fr 1fr', flexDirection: 'column', gap: m ? 0 : 40 }}>
          {cv.skills.map((g, i) => (
            <motion.div key={g.category} style={{ marginBottom: m ? 28 : 0 }} {...fade(i * 0.06)}>
              <p style={{ fontSize: m ? 17 : 20, fontWeight: 700, marginBottom: m ? 6 : 10, color: '#0a0a0a' }}>{g.category}</p>
              <p style={{ fontSize: m ? 15 : 18, lineHeight: 1.7, color: '#555555' }}>{g.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Education ── */
function Education({ m }) {
  const W = { maxWidth: 1200, margin: '0 auto', padding: m ? '0 20px' : '0 80px' }
  return (
    <section style={{ padding: m ? '0 0 112px' : '0 0 216px' }}>
      <div style={W}>
        <SectionHeading m={m}>Education</SectionHeading>
        {cv.education.map((e, i) => (
          <motion.div key={e.degree} style={{ marginBottom: m ? 20 : 30 }} {...fade(i * 0.06)}>
            <p style={{ fontSize: m ? 'clamp(16px, 4vw, 20px)' : 'clamp(24px, 3vw, 30px)', fontWeight: 500, letterSpacing: '-0.02em', marginBottom: 2, color: '#0a0a0a' }}>{e.degree}</p>
            <p style={{ fontSize: m ? 14 : 18, color: '#555555' }}>{e.institution} — {e.grade}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ── Circle Reveal ── */
function CircleReveal() {
  const size = useMotionValue(0)
  const springSize = useSpring(size, { stiffness: 280, damping: 35, mass: 0.5 })
  const dim = useTransform(springSize, v => `${v}vw`)

  useEffect(() => {
    let lastScrollY = window.scrollY
    const update = () => {
      const scrolled = window.scrollY
      const isScrollingUp = scrolled < lastScrollY
      lastScrollY = scrolled
      if (isScrollingUp) {
        size.set(0)
      } else {
        const total = document.body.scrollHeight - window.innerHeight
        const p = Math.max(0, Math.min(1, (scrolled / total - 0.78) / 0.22))
        size.set(p * 320)
      }
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <motion.div style={{
      position: 'fixed', bottom: 0, left: '50%',
      translateX: '-50%', translateY: '50%',
      width: dim, height: dim,
      borderRadius: '50%',
      background: '#ffffff',
      mixBlendMode: 'difference',
      pointerEvents: 'none',
      zIndex: 9998,
      filter: 'blur(36px)',
      willChange: 'width, height',
    }} />
  )
}

/* ── Footer ── */
function Footer({ m }) {
  const line = {
    display: 'block',
    fontSize: m ? 'clamp(21px, 7vw, 31px)' : 'clamp(42px, 6vw, 60px)',
    fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1.15, color: '#0a0a0a',
    margin: 0,
  }
  const link = { ...line }

  const W = { maxWidth: 1200, margin: '0 auto', padding: m ? '0 20px' : '0 80px', width: '100%' }

  return (
    <footer style={{
      minHeight: '100vh', background: '#f7f7f5',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      padding: m ? '56px 0 48px' : '108px 0 80px',
    }}>
      <div style={W}>
        <motion.div {...fade()}>
          <p style={line}>{cv.name}</p>
          <p style={{ ...line, whiteSpace: m ? 'normal' : 'nowrap' }}>{cv.title}</p>
          <GlassLink href={`tel:${cv.contact.phone}`} style={link}>{cv.contact.phone}</GlassLink>
          <GlassLink href={`mailto:${cv.contact.email}`} style={link}>{cv.contact.email}</GlassLink>
          <GlassLink href="/amy-peet-cv.pdf" download target="_blank" rel="noopener noreferrer" style={link}>Download resume</GlassLink>
        </motion.div>
      </div>
      <div style={W}>
        <motion.p style={{ fontSize: m ? 12 : 13, color: '#0a0a0a', opacity: 0.4 }} {...fade(0.1)}>© {new Date().getFullYear()} Amy Peet</motion.p>
      </div>
    </footer>
  )
}

/* ── Root ── */
export default function App() {
  const m = useIsMobile()
  const [unlocked, setUnlocked] = useState(false)
  const headerRef = useRef(null)
  const [headerH, setHeaderH] = useState(0)
  const [textWhite, setTextWhite] = useState(false)

  useEffect(() => {
    const measure = () => { if (headerRef.current) setHeaderH(headerRef.current.offsetHeight) }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [m])

  useEffect(() => {
    if (!headerH) return
    const update = () => setTextWhite(window.scrollY >= headerH)
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [headerH])

  return (
    <>
      <AnimatePresence>
        {!unlocked && <PasswordGate onUnlock={() => setUnlocked(true)} />}
      </AnimatePresence>
      {!m && <Cursor />}
      {!m && <CircleReveal />}
      <main style={{ position: 'relative', zIndex: 1, background: '#f7f7f5', paddingTop: headerH }}>
        <Header m={m} headerRef={headerRef} textWhite={textWhite} />
        <Gallery m={m} />
        <Profile m={m} />
        <Experience m={m} />
        <Skills m={m} />
        <Education m={m} />
        <Footer m={m} />
      </main>
    </>
  )
}
