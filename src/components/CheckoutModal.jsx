import { useEffect, useMemo, useRef, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { ArrowRight, Check, Download, Lock, X, Logo, Card, Zap } from './Icons.jsx'
import { formatMoney } from '../data.js'
import { evaluateDiscount, normalizeCode } from '../lib/discounts.js'

function makeOrder(product, email, promo) {
  const suffix = Math.floor(1000 + Math.random() * 9000)
  const license = `CP-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
  const subtotal = product.price
  const discount = promo?.ok ? promo.discount : 0
  const amount = Math.max(0, Math.round((subtotal - discount) * 100) / 100)
  return {
    id: `CP-${suffix}`,
    buyer: email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
    email,
    product: product.name,
    amount,
    subtotal,
    discount,
    code: promo?.ok ? promo.code : null,
    interval: amount === 0 ? null : product.interval || null,
    date: 'just now',
    when: new Date().toISOString(),
    status: amount === 0 ? 'Free' : 'Paid',
    method: amount === 0 ? 'Promo' : 'Cash App',
    license,
    cashtag: product.handle,
  }
}

export default function CheckoutModal({ product, codes = [], onClose, onPaid }) {
  const [step, setStep] = useState('details')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [order, setOrder] = useState(null)
  const [promoInput, setPromoInput] = useState('')
  const [promo, setPromo] = useState(null)
  const [promoError, setPromoError] = useState('')
  const emailRef = useRef(null)
  const promoRef = useRef(null)

  const subtotal = product.price
  const discount = promo?.ok ? promo.discount : 0
  const total = Math.max(0, Math.round((subtotal - discount) * 100) / 100)
  const isFree = total === 0

  const subtotalLabel = useMemo(() => formatMoney(subtotal, product.interval), [subtotal, product.interval])
  const totalLabel = useMemo(() => formatMoney(total, total === 0 ? undefined : product.interval), [total, product.interval])
  const paymentLink = `https://cash.app/${product.handle}/${Number.isInteger(total) ? total : total.toFixed(2)}`

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    const timer = setTimeout(() => emailRef.current?.focus(), 120)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKeyDown)
      clearTimeout(timer)
    }
  }, [onClose])

  useEffect(() => {
    if (step !== 'processing') return undefined
    const timer = setTimeout(() => {
      const next = makeOrder(product, email, promo)
      setOrder(next)
      onPaid(next)
      setStep('success')
    }, 1700)
    return () => clearTimeout(timer)
  }, [step, product, email, promo, onPaid])

  const applyPromo = (value = promoInput) => {
    const raw = String(value || '').trim()
    if (!raw) {
      setPromo(null)
      setPromoError('Enter a promo code.')
      return
    }
    const result = evaluateDiscount(raw, codes, { subtotal, productId: product.id })
    if (!result.ok) {
      setPromo(null)
      setPromoError(result.reason)
      return
    }
    setPromo(result)
    setPromoError('')
    setPromoInput(result.code)
  }

  const removePromo = () => {
    setPromo(null)
    setPromoInput('')
    setPromoError('')
    promoRef.current?.focus()
  }

  const onPromoChange = (event) => {
    const next = event.target.value
    setPromoInput(next)
    if (promo && normalizeCode(next) !== normalizeCode(promo.code)) {
      setPromo(null)
    }
    if (promoError) setPromoError('')
  }

  const continueToPay = (event) => {
    event.preventDefault()
    const value = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      setError('Enter a valid email so we can deliver the product.')
      emailRef.current?.focus()
      return
    }
    setError('')
    setEmail(value)

    if (isFree) {
      const next = makeOrder(product, value, promo)
      setOrder(next)
      onPaid(next)
      setStep('success')
      return
    }
    setStep('pay')
  }

  const downloadReceipt = () => {
    if (!order) return
    const body = [
      'CASHPORT RECEIPT',
      '================',
      `Order: ${order.id}`,
      `Date: ${new Date(order.when).toLocaleString()}`,
      `Product: ${order.product}`,
      `Seller: ${product.creator} (${order.cashtag})`,
      `Buyer: ${order.email}`,
      `Subtotal: ${formatMoney(order.subtotal)}`,
      `Discount: ${order.discount ? `-${formatMoney(order.discount)} (${order.code})` : 'None'}`,
      `Total: ${formatMoney(order.amount, order.interval)}`,
      `License: ${order.license}`,
      '',
      'Demo receipt. No real payment was processed.',
    ].join('\n')
    const blob = new Blob([body], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${order.id}-receipt.txt`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const flow = isFree
    ? [{ id: 'details', label: 'Details' }, { id: 'success', label: 'Delivered' }]
    : [{ id: 'details', label: 'Details' }, { id: 'pay', label: 'Pay' }, { id: 'success', label: 'Delivered' }]
  const activeIndex = step === 'processing' ? flow.findIndex((item) => item.id === 'pay') : flow.findIndex((item) => item.id === step)

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <div className="checkout-modal" role="dialog" aria-modal="true" aria-label={`Checkout for ${product.name}`}>
        <div className="modal-head">
          <div className="modal-steps">
            {flow.map((item, index) => {
              const state = index < activeIndex ? 'done' : index === activeIndex ? 'current' : 'todo'
              return (
                <span key={item.id} className={`modal-step ${state}`}>
                  <span className="modal-step-dot">{index < activeIndex ? <Check size={10} /> : index + 1}</span>
                  <span className="modal-step-label">{item.label}</span>
                </span>
              )
            })}
          </div>
          <button type="button" className="icon-btn modal-close" onClick={onClose} aria-label="Close checkout">
            <X />
          </button>
        </div>

        {step === 'details' ? (
          <form className="modal-body" onSubmit={continueToPay}>
            <div className="checkout-product">
              <span className={`checkout-thumb tone-${product.tone}`}>{product.glyph}</span>
              <div>
                <span className="checkout-kicker">Instant digital delivery</span>
                <h3>{product.name}</h3>
                <p>by {product.creator} · {product.handle}</p>
              </div>
              <span className="checkout-price">{subtotalLabel}</span>
            </div>

            <div className="checkout-includes">
              {product.includes.slice(0, 3).map((item) => (
                <span key={item}><Check size={12} /> {item}</span>
              ))}
            </div>

            <label className={`field ${error ? 'has-error' : ''}`}>
              <span>Email for delivery</span>
              <input
                ref={emailRef}
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
              {error ? <small className="field-error">{error}</small> : <small>Receipt and download link are sent here.</small>}
            </label>

            <div className={`field promo-field ${promoError ? 'has-error' : ''}`}>
              <span>Promo code <em className="optional">optional</em></span>
              <div className="promo-input-row">
                <input
                  ref={promoRef}
                  type="text"
                  value={promoInput}
                  onChange={onPromoChange}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      applyPromo()
                    }
                  }}
                  placeholder="Enter code"
                  autoComplete="off"
                  spellCheck="false"
                  aria-label="Promo code"
                  aria-live="polite"
                />
                <button type="button" className="btn btn-outline btn-sm promo-apply" onClick={() => applyPromo()}>
                  Apply
                </button>
              </div>
              {promoError ? <small className="field-error" role="alert">{promoError}</small> : null}
              {!promoError && promo ? (
                <small className="promo-success">
                  <Check size={12} /> <strong>{promo.code}</strong> applied — {promo.label}
                  <button type="button" className="promo-remove" onClick={removePromo}>Remove</button>
                </small>
              ) : null}
              {!promoError && !promo ? (
                <small>
                  Try <button type="button" className="inline-code" onClick={() => {
                    setPromoInput('rickcreator1987')
                    applyPromo('rickcreator1987')
                  }}>rickcreator1987</button> for 100% off.
                </small>
              ) : null}
            </div>

            <div className="checkout-summary">
              <div><span>Subtotal</span><span>{subtotalLabel}</span></div>
              {discount > 0 ? (
                <div className="summary-discount">
                  <span>Discount <code>{promo.code}</code></span>
                  <span>−{formatMoney(discount)}</span>
                </div>
              ) : null}
              <div><span>Cashport fee</span><span className="fee">Included</span></div>
              <div className="summary-total"><span>Total</span><span>{totalLabel}</span></div>
            </div>

            {isFree ? (
              <div className="checkout-free-note">
                <Zap size={14} />
                <span>100% off applied. No Cash App approval needed — your license is issued immediately.</span>
              </div>
            ) : null}

            <button type="submit" className="btn btn-primary btn-block btn-lg">
              {isFree ? <><Download size={16} /> Claim for free</> : <>Continue to Cash App <ArrowRight /></>}
            </button>
            <p className="secure-note">
              <Lock size={12} /> {isFree ? 'Free promo claim · demo mode, no payment required.' : 'You will confirm the payment inside Cash App. Demo mode — no real charge.'}
            </p>
          </form>
        ) : null}

        {step === 'pay' ? (
          <div className="modal-body pay-body">
            <div className="pay-head">
              <span className="cash-badge"><Logo size={28} /></span>
              <div>
                <h3>Scan to pay {totalLabel}</h3>
                <p>Open Cash App, tap the scan icon, and confirm.</p>
              </div>
            </div>

            <div className="pay-qr">
              <QRCodeSVG
                value={paymentLink}
                size={212}
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

            <div className="pay-tag">
              <span className="tag-dot" />
              <span>Paying <strong>{product.handle}</strong></span>
              <span className="pay-amount">{totalLabel}</span>
            </div>

            <a className="btn btn-primary btn-block btn-lg" href={paymentLink} target="_blank" rel="noreferrer">
              <Logo size={20} /> Open Cash App <ArrowRight />
            </a>
            <button type="button" className="btn btn-outline btn-block" onClick={() => setStep('processing')}>
              I have sent the payment
            </button>

            <div className="waiting">
              <span className="waiting-dot" />
              Listening for payment confirmation…
            </div>
            <p className="secure-note">
              <Card size={12} /> Demo checkout · the QR points to cash.app, but no money moves.
            </p>
          </div>
        ) : null}

        {step === 'processing' ? (
          <div className="modal-body processing-body">
            <div className="spinner" aria-hidden="true" />
            <h3>Confirming with Cash App</h3>
            <p>Verifying the payment and preparing your download. This usually takes a second.</p>
            <div className="processing-row">
              <span><Check size={12} /> Payment detected</span>
              <span className="processing-active"><span className="waiting-dot" /> Issuing license…</span>
            </div>
          </div>
        ) : null}

        {step === 'success' && order ? (
          <div className="modal-body success-body">
            <span className="success-check"><Check size={30} /></span>
            <span className="success-kicker">{order.amount === 0 ? 'Claimed for free' : 'Payment received'}</span>
            <h3>You own {order.product}.</h3>
            <p>
              We sent the download and receipt to <strong>{order.email}</strong>. Your license is ready below.
            </p>

            <div className="license-card">
              <div className="license-top">
                <span>License key</span>
                <span className="license-status"><span className="live-dot" /> active</span>
              </div>
              <code>{order.license}</code>
              <div className="license-meta">
                <span>{product.license}</span>
                <span>Order {order.id}</span>
              </div>
            </div>

            {order.discount > 0 ? (
              <div className="success-discount">
                <span>Promo {order.code}</span>
                <strong>−{formatMoney(order.discount)}</strong>
              </div>
            ) : null}

            <div className="success-total">
              <span>{order.amount === 0 ? 'Free with promo' : 'Paid with Cash App'}</span>
              <strong>{formatMoney(order.amount, order.interval)}</strong>
            </div>

            <div className="success-actions">
              <button type="button" className="btn btn-primary btn-lg" onClick={onClose}>
                <Download size={16} /> Done
              </button>
              <button type="button" className="btn btn-outline btn-lg" onClick={downloadReceipt}>
                Receipt
              </button>
            </div>

            <div className="upsell">
              <Zap size={15} />
              <span>This order is now visible in the creator dashboard.</span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
