import { useEffect, useState } from 'react'
import { Logo, ArrowRight, Menu, X } from './Icons.jsx'

export default function Header({ route, onNavigate, onSection }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [route])

  const link = (label, section) => (
    <button
      type="button"
      className="nav-link"
      onClick={() => {
        setOpen(false)
        onSection(section)
      }}
    >
      {label}
    </button>
  )

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="shell header-inner">
        <button type="button" className="brand" onClick={() => onNavigate('home')} aria-label="Cashport home">
          <Logo />
          <span className="brand-name">cashport</span>
          <span className="brand-badge">beta</span>
        </button>

        <nav className="desktop-nav" aria-label="Main navigation">
          {route === 'home' ? (
            <>
              {link('Discover', 'products')}
              {link('How it works', 'how')}
              {link('For creators', 'creators')}
            </>
          ) : (
            <span className="nav-context">Creator studio</span>
          )}
          <button type="button" className="nav-link" onClick={() => onNavigate('dashboard')}>
            Dashboard
          </button>
          <button type="button" className="nav-link" onClick={() => onNavigate('docs')}>
            Docs
          </button>
        </nav>

        <div className="header-actions">
          <button type="button" className="btn btn-ghost header-signin" onClick={() => onNavigate('dashboard')}>
            Sign in
          </button>
          <button type="button" className="btn btn-primary header-cta" onClick={() => onNavigate('dashboard')}>
            Start selling
            <ArrowRight />
          </button>
          <button
            type="button"
            className="icon-btn menu-btn"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={20} /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mobile-menu">
          <div className="shell">
            {route === 'home' ? (
              <>
                {link('Discover', 'products')}
                {link('How it works', 'how')}
                {link('For creators', 'creators')}
              </>
            ) : null}
            <button type="button" className="mobile-link" onClick={() => onNavigate('dashboard')}>
              Dashboard
            </button>
            <button type="button" className="mobile-link" onClick={() => onNavigate('docs')}>
              Docs
            </button>
            <button type="button" className="btn btn-primary btn-block" onClick={() => onNavigate('dashboard')}>
              Start selling
              <ArrowRight />
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
