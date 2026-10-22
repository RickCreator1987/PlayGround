import { useMemo, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import ProductCard from '../components/ProductCard.jsx'
import { categories, steps, testimonials, formatCompact } from '../data.js'
import {
  ArrowRight,
  Check,
  Code,
  Copy,
  Download,
  Globe,
  Lock,
  Refresh,
  Search,
  Sparkle,
  Star,
  Tag,
  Zap,
  Logo,
  Terminal,
  Webhook,
} from '../components/Icons.jsx'

const logos = ['northstar', 'Lumen', 'vertex', 'FOLD', 'Orbital', 'paperlane']

const heroQr = 'https://cash.app/$mayamakes/49'

export default function Home({ products = [], onBuy, onNavigate, onSection, onToast, featuredPromo }) {
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [showAll, setShowAll] = useState(false)

  const copyPromo = async () => {
    if (!featuredPromo) return
    try {
      await navigator.clipboard.writeText(featuredPromo.code)
      onToast(`${featuredPromo.code} copied — use it at checkout.`)
    } catch {
      onToast(`Use code ${featuredPromo.code} at checkout.`)
    }
  }

  const liveProducts = useMemo(
    () => products.filter((product) => (product.status || 'Live') === 'Live'),
    [products],
  )
  const demoProduct = liveProducts.find((product) => product.id === 'nexus-ui') || liveProducts[0] || null

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return liveProducts.filter((product) => {
      const matchesCategory = category === 'All' || product.category === category
      const matchesQuery =
        !needle ||
        product.name.toLowerCase().includes(needle) ||
        product.creator.toLowerCase().includes(needle) ||
        product.category.toLowerCase().includes(needle) ||
        product.tagline.toLowerCase().includes(needle)
      return matchesCategory && matchesQuery
    })
  }, [category, query, liveProducts])

  const visible = showAll ? filtered : filtered.slice(0, 8)

  return (
    <main className="home">
      <section className="hero">
        <div className="hero-glow" aria-hidden="true" />
        <div className="shell hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="live-dot" />
              Now live with Cash App Pay
            </div>
            <h1>
              Sell your work.
              <br />
              Get paid in <span className="highlight">Cash App</span>.
            </h1>
            <p className="hero-lede">
              Cashport is the monetization platform for independent creators. Sell products,
              memberships, and licenses with a checkout your customers already trust — no Stripe,
              no card forms, just a scan and a $cashtag.
            </p>
            <div className="hero-actions">
              <button type="button" className="btn btn-primary btn-lg" onClick={() => onNavigate('dashboard')}>
                Start selling free <ArrowRight />
              </button>
              <button type="button" className="btn btn-outline btn-lg" onClick={() => onSection('products')}>
                Explore products
              </button>
            </div>
            <div className="hero-proof">
              <div className="avatar-stack" aria-hidden="true">
                <span className="avatar avatar-proof av-1">MC</span>
                <span className="avatar avatar-proof av-2">SR</span>
                <span className="avatar avatar-proof av-3">AY</span>
                <span className="avatar avatar-proof av-4">LP</span>
              </div>
              <div className="hero-proof-text">
                <span className="stars">
                  {[0, 1, 2, 3, 4].map((index) => (
                    <Star key={index} />
                  ))}
                </span>
                <span>Loved by 12,400+ independent creators</span>
              </div>
            </div>
          </div>

          <div className="hero-visual" aria-label="Cash App checkout preview">
            <div className="float-card float-paid">
              <span className="float-icon"><Check size={15} /></span>
              <span>
                Payment received
                <strong>+$49.00</strong>
              </span>
            </div>

            <div className="hero-checkout">
              <div className="hc-top">
                <span className="cash-badge"><Logo size={26} /></span>
                <span className="hc-title">Cash App Pay</span>
                <span className="hc-secure"><Lock size={11} /> secure</span>
              </div>

              <div className="hc-product">
                <span className="hc-thumb tone-lime">◈</span>
                <span className="hc-info">
                  <strong>Nexus UI Kit</strong>
                  <small>by Maya Chen · instant download</small>
                </span>
                <span className="hc-amount">$49</span>
              </div>

              <div className="hc-qr-wrap">
                <div className="hc-qr">
                  <QRCodeSVG
                    value={heroQr}
                    size={168}
                    bgColor="#ffffff"
                    fgColor="#0b0f0c"
                    level="M"
                    marginSize={2}
                  />
                  <span className="qr-corner tl" />
                  <span className="qr-corner tr" />
                  <span className="qr-corner bl" />
                  <span className="qr-corner br" />
                </div>
                <span className="hc-qr-caption">Scan with your Cash App camera</span>
              </div>

              <div className="hc-foot">
                <span className="hc-tag">
                  <span className="tag-dot" />
                  $mayamakes
                </span>
                <span className="hc-pay">Open Cash App</span>
              </div>
            </div>

            <div className="float-card float-payout">
              <span className="float-logo"><Logo size={24} /></span>
              <span>
                Payout sent
                <strong>$1,842.50</strong>
              </span>
              <span className="float-when">now</span>
            </div>

            <div className="float-chip">
              <Zap size={14} /> Settles instantly
            </div>
          </div>
        </div>

        <div className="shell logo-strip">
          <span className="logo-strip-label">Powering checkout for teams at</span>
          <div className="logo-row">
            {logos.map((name) => (
              <span key={name} className={`wordmark wordmark-${name.toLowerCase()}`}>{name}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="stats-band">
        <div className="shell stats-grid">
          <div className="stat">
            <strong>12,400+</strong>
            <span>creators on Cashport</span>
          </div>
          <div className="stat">
            <strong>$48.2m</strong>
            <span>sent to $cashtags</span>
          </div>
          <div className="stat">
            <strong>1.8s</strong>
            <span>average checkout</span>
          </div>
          <div className="stat">
            <strong>0</strong>
            <span>card fees or chargebacks</span>
          </div>
        </div>
      </section>

      {featuredPromo ? (
        <section className="promo-band-section" id="promo">
          <div className="shell">
            <div className="promo-band">
              <div className="promo-band-copy">
                <span className="promo-kicker"><Tag size={14} /> Launch promo</span>
                <h2>Any product. <span>100% off.</span></h2>
                <p>
                  Use <code>{featuredPromo.code}</code> at checkout. The total drops to $0 and your
                  license is delivered instantly — no Cash App approval, no card, no Stripe.
                </p>
                <div className="promo-points">
                  <span><Check size={13} /> Works on every product</span>
                  <span><Check size={13} /> Unlimited uses</span>
                  <span><Check size={13} /> License delivered instantly</span>
                </div>
              </div>
              <div className="promo-band-action">
                <button type="button" className="promo-code-button" onClick={copyPromo}>
                  <code>{featuredPromo.code}</code>
                  <Copy size={16} />
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => demoProduct && onBuy(demoProduct)}
                  disabled={!demoProduct}
                >
                  {demoProduct ? `Try it on ${demoProduct.name}` : 'Explore products'} <ArrowRight />
                </button>
                <span className="promo-fine">Applied instantly in checkout · demo mode</span>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="section products-section" id="products">
        <div className="shell">
          <div className="section-head products-head">
            <div>
              <div className="section-kicker"><Sparkle size={15} /> Community marketplace</div>
              <h2>Fresh from the community</h2>
              <p>Independent work, priced fairly, delivered the moment the payment lands.</p>
            </div>
            <div className="market-meta">
              <span className="live-pill"><span className="live-dot" /> {liveProducts.length} {liveProducts.length === 1 ? 'product' : 'products'} live</span>
            </div>
          </div>

          <div className="product-toolbar">
            <div className="chips" role="tablist" aria-label="Filter by category">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={category === item}
                  className={`chip ${category === item ? 'is-active' : ''}`}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <label className="searchbox">
              <Search size={17} />
              <span className="sr-only">Search products</span>
              <input
                type="search"
                placeholder="Search products, creators…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
          </div>

          {visible.length > 0 ? (
            <div className="product-grid">
              {visible.map((product) => (
                <ProductCard key={product.id} product={product} onBuy={onBuy} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Search size={26} />
              <h3>No products match that search</h3>
              <p>Try a different category, or clear the search to see everything.</p>
              <button type="button" className="btn btn-outline" onClick={() => { setQuery(''); setCategory('All') }}>
                Clear filters
              </button>
            </div>
          )}

          {!showAll && filtered.length > 8 ? (
            <div className="center-row">
              <button type="button" className="btn btn-outline" onClick={() => setShowAll(true)}>
                Load more products <ArrowRight />
              </button>
            </div>
          ) : null}
        </div>
      </section>

      <section className="section how-section" id="how">
        <div className="shell">
          <div className="section-head centered">
            <div className="section-kicker"><Zap size={15} /> Three steps to paid</div>
            <h2>From idea to Cash App in an afternoon</h2>
            <p>No payment processor applications. No merchant account. No waiting for a payout cycle.</p>
          </div>

          <div className="steps">
            {steps.map((step, index) => (
              <div className="step-card" key={step.number}>
                <div className="step-top">
                  <span className="step-icon">
                    {step.icon === 'spark' ? <Sparkle /> : step.icon === 'cash' ? <Logo size={22} /> : <Zap />}
                  </span>
                  <span className="step-number">{step.number}</span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
                {index < steps.length - 1 ? <span className="step-connector" aria-hidden="true" /> : null}
              </div>
            ))}
          </div>

          <div className="how-note">
            <Lock size={16} />
            <span>
              Cash App handles the money. Cashport handles delivery, licenses, receipts, refunds, and the API.
            </span>
            <button type="button" className="text-link" onClick={() => onNavigate('docs')}>
              Read the docs <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      <section className="cash-section" id="creators">
        <div className="shell cash-grid">
          <div className="cash-copy">
            <div className="section-kicker light"><Logo size={18} /> Built on Cash App</div>
            <h2>Checkout that feels like sending a friend money.</h2>
            <p>
              Your customers do not need to dig out a card or remember a password. They scan,
              confirm in Cash App, and get their download before they close the app.
            </p>
            <ul className="check-list">
              <li><span><Check size={15} /></span> One QR code for desktop, one tap on mobile</li>
              <li><span><Check size={15} /></span> Payments settle straight to your $cashtag</li>
              <li><span><Check size={15} /></span> No card networks, no chargebacks, no 2.9% + 30¢</li>
              <li><span><Check size={15} /></span> Instant license delivery and webhooks on payment</li>
            </ul>
            <div className="cash-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => demoProduct && onBuy(demoProduct)}
                disabled={!demoProduct}
              >
                Try a Cash App checkout <ArrowRight />
              </button>
              <button type="button" className="btn btn-dark-outline" onClick={() => onNavigate('docs')}>
                See the API
              </button>
            </div>
          </div>

          <div className="cash-visual">
            <div className="cash-phone">
              <div className="phone-bar">
                <span className="phone-notch" />
                <span className="phone-time">9:41</span>
                <span className="phone-signal">●●●</span>
              </div>
              <div className="phone-screen">
                <div className="phone-head">
                  <span className="phone-avatar">MC</span>
                  <span>
                    <strong>Nexus UI Kit</strong>
                    <small>$mayamakes</small>
                  </span>
                </div>
                <div className="phone-amount">$49.00</div>
                <div className="phone-qr">
                  <QRCodeSVG
                    value={heroQr}
                    size={148}
                    bgColor="#ffffff"
                    fgColor="#0b0f0c"
                    level="M"
                    marginSize={2}
                  />
                </div>
                <div className="phone-label">Scan to pay with Cash App</div>
                <div className="phone-button">Pay $49.00</div>
                <div className="phone-foot">Protected by Cash App · Demo checkout</div>
              </div>
            </div>
            <div className="cash-note cash-note-top">
              <span className="note-dot" />
              <span><strong>Order paid</strong> · $49.00</span>
            </div>
            <div className="cash-note cash-note-bottom">
              <Download size={15} />
              <span><strong>License issued</strong> · instantly</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section testimonials-section">
        <div className="shell">
          <div className="section-head">
            <div>
              <div className="section-kicker"><Star size={14} /> Creator stories</div>
              <h2>People are making a living here</h2>
            </div>
            <p className="section-aside">Real numbers from creators who moved their checkout to Cashport.</p>
          </div>
          <div className="testimonial-grid">
            {testimonials.map((item) => (
              <figure className="testimonial" key={item.name}>
                <div className="quote-mark" aria-hidden="true">“</div>
                <blockquote>{item.quote}</blockquote>
                <figcaption>
                  <span className="avatar avatar-quote">{item.initials}</span>
                  <span>
                    <strong>{item.name}</strong>
                    <small>{item.role}</small>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section ecosystem-section">
        <div className="shell">
          <div className="section-head centered">
            <div className="section-kicker"><Code size={15} /> More than a checkout</div>
            <h2>Everything Polar does, settled in Cash App</h2>
          </div>
          <div className="feature-grid">
            <div className="feature-card">
              <span className="feature-icon"><Refresh /></span>
              <h3>Subscriptions</h3>
              <p>Recurring memberships with customer-managed cancellation and automatic Cash App payment requests.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon"><Terminal /></span>
              <h3>Licenses & downloads</h3>
              <p>Signed license keys, secure file delivery, and seat limits issued the moment a payment is confirmed.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon"><Webhook /></span>
              <h3>Webhooks & API</h3>
              <p>Typed events for orders, refunds, subscriptions, and payouts. Build on top of every sale.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon"><Globe /></span>
              <h3>US-wide checkout</h3>
              <p>Every checkout works wherever Cash App does. No merchant onboarding, no card underwriting.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="shell">
          <div className="cta-card">
            <div className="cta-glow" aria-hidden="true" />
            <div className="cta-copy">
              <span className="cta-eyebrow">No monthly fee · 2.9% + 30¢ per sale</span>
              <h2>Your next product could be paid for by tonight.</h2>
              <p>Set up a store, share one link, and watch payments land in your Cash App.</p>
            </div>
            <div className="cta-actions">
              <button type="button" className="btn btn-primary btn-lg" onClick={() => onNavigate('dashboard')}>
                Create your store <ArrowRight />
              </button>
              <button type="button" className="btn btn-dark-outline btn-lg" onClick={() => onSection('products')}>
                Browse the marketplace
              </button>
              <span className="cta-fine">Free to start · No card required · Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      <div className="shell disclaimer">
        <p>
          Cashport is an independent product demo. It is not affiliated with, endorsed by, or connected to
          Cash App or Block, Inc. No real payments are processed. {formatCompact(12400)} creators is a fictional stat.
        </p>
      </div>
    </main>
  )
}
