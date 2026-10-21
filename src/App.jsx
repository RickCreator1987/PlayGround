import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import CheckoutModal from './components/CheckoutModal.jsx'
import Home from './pages/Home.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Docs from './pages/Docs.jsx'
import { FEATURED_CODE, defaultDiscounts, isDiscountActive, normalizeCode } from './lib/discounts.js'

const STORAGE_KEY = 'cashport.orders.v1'
const CODES_KEY = 'cashport.codes.v1'

function readRoute() {
  const path = window.location.hash.replace(/^#\/?/, '')
  if (path.startsWith('dashboard')) return 'dashboard'
  if (path.startsWith('docs')) return 'docs'
  return 'home'
}

function loadOrders() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function loadCodes() {
  const seeded = defaultDiscounts()
  try {
    const parsed = JSON.parse(window.localStorage.getItem(CODES_KEY) || 'null')
    if (Array.isArray(parsed)) {
      const hasFeatured = parsed.some((code) => normalizeCode(code.code) === normalizeCode(FEATURED_CODE))
      return hasFeatured ? parsed : [seeded[0], ...parsed]
    }
  } catch {
    // Fall through to the seeded demo codes.
  }
  return seeded
}

export default function App() {
  const [route, setRoute] = useState(readRoute)
  const [orders, setOrders] = useState(loadOrders)
  const [codes, setCodes] = useState(loadCodes)
  const [activeProduct, setActiveProduct] = useState(null)
  const [toast, setToast] = useState(null)
  const [ready, setReady] = useState(false)
  const toastTimer = useRef(null)

  useEffect(() => {
    setReady(true)
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
    const onHashChange = () => {
      setRoute(readRoute())
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
    const frame = window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' }))
    return () => window.cancelAnimationFrame(frame)
  }, [route])

  useEffect(() => () => clearTimeout(toastTimer.current), [])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
    } catch {
      // Storage can be unavailable in private modes; the demo still works in memory.
    }
  }, [orders])

  useEffect(() => {
    try {
      window.localStorage.setItem(CODES_KEY, JSON.stringify(codes))
    } catch {
      // Storage can be unavailable in private modes; the demo still works in memory.
    }
  }, [codes])

  const showToast = useCallback((message) => {
    setToast({ id: Date.now(), message })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 3200)
  }, [])

  const navigate = useCallback((next) => {
    const hash = next === 'home' ? '#/' : `#/${next}`
    if (window.location.hash !== hash) window.location.hash = hash
    setRoute(next)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  const goToSection = useCallback(
    (section) => {
      const scroll = () => {
        document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      if (route !== 'home') {
        navigate('home')
        window.setTimeout(scroll, 90)
      } else {
        scroll()
      }
    },
    [route, navigate],
  )

  const handlePaid = useCallback((order) => {
    setOrders((current) => [order, ...current].slice(0, 40))
    if (order.code) {
      setCodes((current) => current.map((code) => (
        normalizeCode(code.code) === normalizeCode(order.code)
          ? { ...code, uses: (code.uses || 0) + 1 }
          : code
      )))
    }
  }, [])

  const featuredPromo = useMemo(
    () => codes.find((code) => normalizeCode(code.code) === normalizeCode(FEATURED_CODE) && isDiscountActive(code)) || null,
    [codes],
  )

  const closeCheckout = useCallback(() => setActiveProduct(null), [])

  return (
    <div className="app" data-app-ready={ready ? 'true' : 'false'}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header route={route} onNavigate={navigate} onSection={goToSection} />

      <div id="main-content">
        {route === 'home' ? (
          <Home
            onBuy={setActiveProduct}
            onNavigate={navigate}
            onSection={goToSection}
            onToast={showToast}
            featuredPromo={featuredPromo}
          />
        ) : null}

        {route === 'dashboard' ? (
          <Dashboard
            orders={orders}
            codes={codes}
            onCodesChange={setCodes}
            onNavigate={navigate}
            onToast={showToast}
          />
        ) : null}

        {route === 'docs' ? <Docs onNavigate={navigate} onToast={showToast} /> : null}
      </div>

      {route !== 'dashboard' ? (
        <Footer onNavigate={navigate} onSection={goToSection} onToast={showToast} />
      ) : null}

      {activeProduct ? (
        <CheckoutModal product={activeProduct} codes={codes} onClose={closeCheckout} onPaid={handlePaid} />
      ) : null}

      {toast ? (
        <div className="toast" role="status" key={toast.id}>
          <span className="toast-icon">✓</span>
          <span>{toast.message}</span>
        </div>
      ) : null}
    </div>
  )
}
