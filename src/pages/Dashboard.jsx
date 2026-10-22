import { useMemo, useState } from 'react'
import {
  orders as seedOrders,
  payouts as seedPayouts,
  webhooks as seedWebhooks,
  revenueSeries,
  formatMoney,
  formatCompact,
} from '../data.js'
import {
  ArrowRight,
  Card,
  Cart,
  Check,
  Code,
  Copy,
  Download,
  Logo,
  Plus,
  Sparkle,
  Tag,
  Trash,
  Users,
  Webhook,
  Zap,
  Globe,
  Refresh,
} from '../components/Icons.jsx'
import ProductForm from '../components/ProductForm.jsx'
import {
  FEATURED_CODE,
  discountLabel,
  discountStatus,
  isDiscountActive,
  normalizeCode,
  validateDiscountDraft,
} from '../lib/discounts.js'
import { createProductId, normalizeProductDraft, productStyle } from '../lib/products.js'

const navItems = [
  { id: 'overview', label: 'Overview', icon: Sparkle },
  { id: 'products', label: 'Products', icon: Cart },
  { id: 'discounts', label: 'Discounts', icon: Tag },
  { id: 'orders', label: 'Orders', icon: Card },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'payouts', label: 'Payouts', icon: Logo },
  { id: 'webhooks', label: 'Webhooks', icon: Webhook },
]

const chartLabels = ['Oct 1', 'Oct 8', 'Oct 15', 'Oct 22', 'Oct 30']

function buildChart(values, width = 720, height = 210) {
  const max = Math.ceil(Math.max(...values) / 200) * 200
  const paddingX = 4
  const paddingY = 10
  const usableW = width - paddingX * 2
  const usableH = height - paddingY * 2
  const points = values.map((value, index) => {
    const x = paddingX + (index / (values.length - 1)) * usableW
    const y = paddingY + (1 - value / max) * usableH
    return [x, y]
  })
  const line = points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = `${line} L${width - paddingX},${height} L${paddingX},${height} Z`
  return { line, area, max, points }
}

function salesLabel(value) {
  const count = Number(value) || 0
  return `${count.toLocaleString()} ${count === 1 ? 'sale' : 'sales'}`
}

function Trend({ value, label }) {
  return (
    <span className={`trend ${value >= 0 ? 'up' : 'down'}`}>
      {value >= 0 ? '↑' : '↓'} {Math.abs(value)}% <span>{label}</span>
    </span>
  )
}

export default function Dashboard({ orders, codes = [], products = [], onCodesChange, onProductsChange, onNavigate, onToast }) {
  const [section, setSection] = useState('overview')
  const [showDiscountForm, setShowDiscountForm] = useState(false)
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const allOrders = useMemo(() => [...orders, ...seedOrders], [orders])
  const chart = useMemo(() => buildChart(revenueSeries), [])
  const featuredCode = useMemo(
    () => codes.find((code) => normalizeCode(code.code) === normalizeCode(FEATURED_CODE)) || null,
    [codes],
  )
  const activeDiscounts = useMemo(() => codes.filter((code) => isDiscountActive(code)).length, [codes])
  const myProducts = useMemo(() => products.filter((product) => product.creator === 'Maya Chen'), [products])
  const liveProducts = myProducts.filter((product) => (product.status || 'Live') === 'Live').length
  const draftProducts = myProducts.length - liveProducts

  const customers = useMemo(() => {
    const map = new Map()
    for (const order of allOrders) {
      const key = order.email
      const current = map.get(key) || {
        name: order.buyer,
        email: order.email,
        orders: 0,
        spend: 0,
        last: order.date,
      }
      current.orders += 1
      current.spend += order.amount
      map.set(key, current)
    }
    return [...map.values()].sort((a, b) => b.spend - a.spend)
  }, [allOrders])

  const copyEndpoint = async () => {
    try {
      await navigator.clipboard.writeText('https://api.cashport.app/v1/webhooks')
      onToast('Webhook endpoint copied.')
    } catch {
      onToast('Copy failed — endpoint is https://api.cashport.app/v1/webhooks')
    }
  }

  const cashOut = () => {
    onToast('Payout of $4,862.40 sent to $mayamakes (demo).')
  }

  const copyDiscount = async (code) => {
    try {
      await navigator.clipboard.writeText(code)
      onToast(`${code} copied.`)
    } catch {
      onToast(`Code is ${code}.`)
    }
  }

  const createDiscount = (draft) => {
    const entry = {
      ...draft,
      id: `disc-${Date.now().toString(36)}`,
      uses: 0,
      active: true,
      createdAt: new Date().toISOString(),
    }
    onCodesChange([entry, ...codes])
    setShowDiscountForm(false)
    onToast(`Discount ${entry.code} created.`)
  }

  const isLocked = (code) => normalizeCode(code.code) === normalizeCode(FEATURED_CODE)

  const toggleDiscount = (code) => {
    if (isLocked(code)) {
      onToast('rickcreator1987 is the required launch promo and stays active.')
      return
    }
    onCodesChange(codes.map((candidate) => (
      candidate.id === code.id ? { ...candidate, active: !candidate.active } : candidate
    )))
    onToast(`${code.code} ${code.active ? 'paused' : 'resumed'}.`)
  }

  const deleteDiscount = (code) => {
    if (isLocked(code)) {
      onToast('rickcreator1987 is the required launch promo and cannot be deleted.')
      return
    }
    if (!window.confirm(`Delete promo code ${code.code}?`)) return
    onCodesChange(codes.filter((candidate) => candidate.id !== code.id))
    onToast(`${code.code} deleted.`)
  }

  const openProductForm = (product = null) => {
    setSection('products')
    setEditingProduct(product)
    setShowProductForm(true)
  }

  const closeProductForm = () => {
    setShowProductForm(false)
    setEditingProduct(null)
  }

  const saveProduct = (draft) => {
    const result = normalizeProductDraft(draft)
    if (!result.ok) return result
    const value = result.value

    if (editingProduct) {
      onProductsChange(products.map((product) => (
        product.id === editingProduct.id ? { ...product, ...value } : product
      )))
      onToast(`${value.name} updated.`)
    } else {
      const entry = {
        ...value,
        ...productStyle(value.category),
        id: createProductId(value.name, products),
        creator: 'Maya Chen',
        handle: '$mayamakes',
        sales: 0,
        rating: 5,
        revenue: 0,
        createdAt: new Date().toISOString(),
      }
      onProductsChange([entry, ...products])
      onToast(`${value.name} ${value.status === 'Live' ? 'is live on your storefront.' : 'saved as a draft.'}`)
    }

    closeProductForm()
    return { ok: true }
  }

  const deleteProduct = (product) => {
    if (!window.confirm(`Delete ${product.name}? Existing orders will be kept.`)) return
    onProductsChange(products.filter((candidate) => candidate.id !== product.id))
    closeProductForm()
    onToast(`${product.name} deleted.`)
  }

  return (
    <main className="dashboard">
      <div className="shell dashboard-grid">
        <aside className="dash-side">
          <div className="store-card">
            <span className="store-avatar">MC</span>
            <div>
              <strong>Maya Makes</strong>
              <span>$mayamakes</span>
            </div>
            <span className="store-live"><span className="live-dot" /> live</span>
          </div>

          <nav className="dash-nav" aria-label="Creator studio">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`dash-nav-item ${section === item.id ? 'is-active' : ''}`}
                  onClick={() => {
                    setSection(item.id)
                    closeProductForm()
                  }}
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                  {item.id === 'orders' ? <span className="nav-count">{allOrders.length}</span> : null}
                  {item.id === 'discounts' ? <span className="nav-count">{activeDiscounts}</span> : null}
                </button>
              )
            })}
          </nav>

          <div className="dash-side-foot">
            <div className="side-tip">
              <Zap size={15} />
              <p><strong>Instant payouts are on.</strong> Cash App payouts usually land in under a minute.</p>
            </div>
            <button type="button" className="btn btn-outline btn-block" onClick={() => onNavigate('home')}>
              View storefront <ArrowRight size={14} />
            </button>
          </div>
        </aside>

        <div className="dash-main">
          <div className="dash-topline">
            <div>
              <span className="crumbs">Creator studio <span>/</span> {navItems.find((item) => item.id === section)?.label}</span>
              <h1>
                {section === 'overview' ? 'Good morning, Maya.' : navItems.find((item) => item.id === section)?.label}
              </h1>
              <p className="dash-sub">
                {section === 'overview'
                  ? 'Here is what is happening with your store today. Payments are settling to $mayamakes.'
                  : section === 'products'
                    ? 'Manage what you sell, prices, and delivery.'
                    : section === 'discounts'
                      ? 'Percentage and fixed-amount promo codes, with limits and expiry.'
                      : section === 'orders'
                        ? 'Every payment that landed in your Cash App.'
                        : section === 'customers'
                          ? 'The people buying your work, ranked by lifetime spend.'
                          : section === 'payouts'
                            ? 'Transfers from Cashport to your Cash App balance.'
                            : 'Send signed events to your endpoint when things happen.'}
              </p>
            </div>
            <div className="dash-actions">
              <button type="button" className="btn btn-outline" onClick={() => onNavigate('home')}>
                <Globe size={15} /> Storefront
              </button>
              <button type="button" className="btn btn-primary" onClick={() => openProductForm()}>
                <Sparkle size={15} /> New product
              </button>
            </div>
          </div>

          {section === 'overview' ? (
            <>
              <div className="balance-card">
                <div className="balance-copy">
                  <span className="balance-label">Available balance</span>
                  <strong className="balance-value">$4,862.40</strong>
                  <span className="balance-sub">
                    <span className="live-dot" /> Settled to $mayamakes · last payout 2h ago
                  </span>
                  <div className="balance-actions">
                    <button type="button" className="btn btn-primary" onClick={cashOut}>
                      <Zap size={15} /> Cash out instantly
                    </button>
                    <button type="button" className="btn btn-dark-outline" onClick={() => setSection('payouts')}>
                      Payout settings
                    </button>
                  </div>
                </div>
                <div className="balance-art">
                  <div className="balance-chip">
                    <span className="chip-logo"><Logo size={30} /></span>
                    <span className="chip-label">CASH APP</span>
                    <span className="chip-tag">$mayamakes</span>
                    <span className="chip-number">•••• 8041</span>
                  </div>
                  <span className="balance-orbit orbit-a" />
                  <span className="balance-orbit orbit-b" />
                </div>
              </div>

              <div className="metric-grid">
                <div className="metric-card">
                  <span className="metric-label">Revenue · 30 days</span>
                  <strong>$8,420.13</strong>
                  <Trend value={18.2} label="vs last month" />
                </div>
                <div className="metric-card">
                  <span className="metric-label">Sales</span>
                  <strong>173</strong>
                  <Trend value={12.4} label="vs last month" />
                </div>
                <div className="metric-card">
                  <span className="metric-label">Customers</span>
                  <strong>1,642</strong>
                  <Trend value={6.1} label="vs last month" />
                </div>
                <div className="metric-card">
                  <span className="metric-label">Checkout conversion</span>
                  <strong>4.8%</strong>
                  <Trend value={0.9} label="vs last month" />
                </div>
              </div>

              <div className="dash-columns">
                <div className="panel chart-panel">
                  <div className="panel-head">
                    <div>
                      <h3>Revenue</h3>
                      <span className="panel-sub">Daily gross volume · last 30 days</span>
                    </div>
                    <div className="chart-legend"><span className="legend-dot" /> Cash App payments</div>
                  </div>
                  <div className="chart-wrap">
                    <div className="chart-y">
                      <span>$800</span>
                      <span>$400</span>
                      <span>$0</span>
                    </div>
                    <svg viewBox="0 0 720 210" className="chart" role="img" aria-label="Revenue trending upward over the last 30 days">
                      <defs>
                        <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00d54b" stopOpacity="0.32" />
                          <stop offset="100%" stopColor="#00d54b" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <line x1="0" y1="10" x2="720" y2="10" className="grid-line" />
                      <line x1="0" y1="105" x2="720" y2="105" className="grid-line" />
                      <line x1="0" y1="200" x2="720" y2="200" className="grid-line" />
                      <path d={chart.area} fill="url(#revenueFill)" />
                      <path d={chart.line} className="chart-line" />
                      <circle cx={chart.points[chart.points.length - 1][0]} cy={chart.points[chart.points.length - 1][1]} r="5" className="chart-dot" />
                    </svg>
                    <div className="chart-x">
                      {chartLabels.map((label) => <span key={label}>{label}</span>)}
                    </div>
                  </div>
                </div>

                <div className="panel side-panel">
                  <div className="panel-head">
                    <h3>Top products</h3>
                    <button type="button" className="text-link" onClick={() => setSection('products')}>
                      Manage <ArrowRight size={13} />
                    </button>
                  </div>
                  <div className="top-products">
                    {myProducts.slice(0, 3).map((product) => (
                      <div className="top-product" key={product.id}>
                        <span className={`mini-thumb tone-${product.tone}`}>{product.glyph}</span>
                        <div className="top-product-info">
                          <strong>{product.name}</strong>
                          <span>{salesLabel(product.sales)} · {product.status || 'Live'}</span>
                        </div>
                        <span className="top-product-rev">${formatCompact(product.revenue ?? product.price * product.sales)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="payout-mini">
                    <div className="payout-mini-head">
                      <span><Logo size={18} /> Next payout</span>
                      <span className="payout-mini-amount">$1,204.80</span>
                    </div>
                    <div className="payout-progress"><span style={{ width: '68%' }} /></div>
                    <span className="payout-mini-sub">68% of the $1,770 daily threshold reached</span>
                  </div>
                </div>
              </div>

              <div className="panel orders-panel">
                <div className="panel-head">
                  <div>
                    <h3>Recent orders</h3>
                    <span className="panel-sub">The latest payments to your Cash App</span>
                  </div>
                  <button type="button" className="text-link" onClick={() => setSection('orders')}>
                    View all <ArrowRight size={13} />
                  </button>
                </div>
                <OrderTable orders={allOrders.slice(0, 6)} />
              </div>
            </>
          ) : null}

          {section === 'products' ? (
            <div className="panel">
              <div className="panel-head">
                <div>
                  <h3>Your products</h3>
                  <span className="panel-sub">
                    {myProducts.length} {myProducts.length === 1 ? 'product' : 'products'} · {liveProducts} live · {draftProducts} draft
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => (showProductForm ? closeProductForm() : openProductForm())}
                >
                  {showProductForm ? 'Close form' : <><Plus size={14} /> New product</>}
                </button>
              </div>

              {showProductForm ? (
                <ProductForm
                  product={editingProduct}
                  onSave={saveProduct}
                  onDelete={deleteProduct}
                  onCancel={closeProductForm}
                />
              ) : null}

              <div className="stack-list">
                {myProducts.length ? myProducts.map((product) => (
                  <div className="product-row" key={product.id}>
                    <span className={`mini-thumb tone-${product.tone}`}>{product.glyph}</span>
                    <div className="product-row-info">
                      <strong>{product.name}</strong>
                      <span>{formatMoney(product.price, product.interval)} · {salesLabel(product.sales)}</span>
                    </div>
                    <span className={`status-pill ${(product.status || 'Live') === 'Live' ? 'is-live' : 'is-draft'}`}>
                      {product.status || 'Live'}
                    </span>
                    <span className="product-row-rev">${(product.revenue ?? product.price * product.sales).toLocaleString()}</span>
                    <button
                      type="button"
                      className="icon-btn row-action"
                      onClick={() => openProductForm(product)}
                      aria-label={`Edit ${product.name}`}
                      title={`Edit ${product.name}`}
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )) : (
                  <div className="empty-state">
                    <h3>No products yet</h3>
                    <p>Create your first product and it will appear on your storefront.</p>
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => openProductForm()}>
                      <Plus size={14} /> Create product
                    </button>
                  </div>
                )}
              </div>
              <div className="panel-foot-note">
                <Refresh size={14} /> Products are delivered instantly after Cash App confirmation.
              </div>
            </div>
          ) : null}

          {section === 'discounts' ? (
            <>
              {featuredCode ? (
                <div className="discount-feature">
                  <div className="discount-feature-copy">
                    <span className="discount-feature-kicker"><Sparkle size={14} /> Creator launch promo</span>
                    <div className="discount-feature-code">
                      <code>{featuredCode.code}</code>
                      <span className="status-pill is-live">{discountLabel(featuredCode)}</span>
                    </div>
                    <p>
                      100% off any product. A zero-dollar total skips Cash App and issues the
                      license immediately.
                    </p>
                  </div>
                  <div className="discount-feature-actions">
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => copyDiscount(featuredCode.code)}>
                      <Copy size={14} /> Copy code
                    </button>
                    <span>{(featuredCode.uses || 0).toLocaleString()} uses · unlimited</span>
                  </div>
                </div>
              ) : null}

              <div className="panel">
                <div className="panel-head">
                  <div>
                    <h3>Discount codes</h3>
                    <span className="panel-sub">{codes.length} codes · {activeDiscounts} active</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => setShowDiscountForm((value) => !value)}
                  >
                    {showDiscountForm ? 'Close form' : <><Plus size={14} /> Create code</>}
                  </button>
                </div>

                {showDiscountForm ? (
                  <DiscountForm
                    codes={codes}
                    onCreate={createDiscount}
                    onCancel={() => setShowDiscountForm(false)}
                  />
                ) : null}

                <div className="table-scroll">
                  <table className="data-table discount-table">
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Discount</th>
                        <th>Min order</th>
                        <th>Uses</th>
                        <th>Expires</th>
                        <th>Status</th>
                        <th className="num">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {codes.length ? codes.map((code) => {
                        const status = discountStatus(code)
                        const featured = normalizeCode(code.code) === normalizeCode(FEATURED_CODE)
                        return (
                          <tr key={code.id} className={featured ? 'discount-row-featured' : ''}>
                            <td>
                              <span className="discount-code-cell">
                                <code>{code.code}</code>
                                {featured ? <span className="discount-badge">100%</span> : null}
                              </span>
                              <small className="discount-created">
                                Created {new Date(code.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </small>
                            </td>
                            <td>{discountLabel(code)}</td>
                            <td>{code.minSubtotal ? formatMoney(code.minSubtotal) : <span className="muted">None</span>}</td>
                            <td>
                              {(code.uses || 0).toLocaleString()}
                              {code.maxUses != null ? <span className="muted"> / {code.maxUses}</span> : null}
                            </td>
                            <td>
                              {code.expiresAt
                                ? new Date(code.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                : <span className="muted">Never</span>}
                            </td>
                            <td>
                              <span className={`status-pill ${status.tone === 'live' ? 'is-live' : 'is-draft'}`}>
                                {status.label}
                              </span>
                            </td>
                            <td className="num">
                              <div className="discount-actions">
                                <button
                                  type="button"
                                  className="mini-action"
                                  onClick={() => copyDiscount(code.code)}
                                  aria-label={`Copy ${code.code}`}
                                >
                                  <Copy size={13} />
                                </button>
                                <button
                                  type="button"
                                  className="mini-action"
                                  onClick={() => toggleDiscount(code)}
                                  disabled={featured}
                                  title={featured ? 'Required launch promo' : undefined}
                                >
                                  {code.active ? 'Pause' : 'Resume'}
                                </button>
                                <button
                                  type="button"
                                  className="mini-action danger"
                                  onClick={() => deleteDiscount(code)}
                                  disabled={featured}
                                  title={featured ? 'Required launch promo' : undefined}
                                  aria-label={`Delete ${code.code}`}
                                >
                                  <Trash size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      }) : (
                        <tr>
                          <td colSpan="7"><div className="empty-state">No discount codes yet.</div></td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="panel-foot-note">
                  <Sparkle size={14} /> Codes apply to the product subtotal. 100% codes complete the order without a Cash App payment.
                </div>
              </div>
            </>
          ) : null}

          {section === 'orders' ? (
            <div className="panel">
              <div className="panel-head">
                <div>
                  <h3>All orders</h3>
                  <span className="panel-sub">{allOrders.length} payments · {formatMoney(allOrders.reduce((sum, order) => sum + order.amount, 0))} gross</span>
                </div>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => onToast('CSV export queued (demo).')}>
                  <Download size={14} /> Export
                </button>
              </div>
              <OrderTable orders={allOrders} full />
            </div>
          ) : null}

          {section === 'customers' ? (
            <div className="panel">
              <div className="panel-head">
                <div>
                  <h3>Customers</h3>
                  <span className="panel-sub">{customers.length} unique buyers · {formatMoney(customers.reduce((sum, customer) => sum + customer.spend, 0))} lifetime</span>
                </div>
              </div>
              <div className="customer-list">
                {customers.map((customer) => (
                  <div className="customer-row" key={customer.email}>
                    <span className="avatar">{customer.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span>
                    <div className="customer-info">
                      <strong>{customer.name}</strong>
                      <span>{customer.email}</span>
                    </div>
                    <span className="customer-orders">{customer.orders} order{customer.orders === 1 ? '' : 's'}</span>
                    <span className="customer-spend">{formatMoney(customer.spend)}</span>
                    <span className="customer-last">{customer.last}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {section === 'payouts' ? (
            <>
              <div className="balance-card compact">
                <div className="balance-copy">
                  <span className="balance-label">Available to pay out</span>
                  <strong className="balance-value">$4,862.40</strong>
                  <span className="balance-sub">Destination · Cash App <strong>$mayamakes</strong></span>
                  <div className="balance-actions">
                    <button type="button" className="btn btn-primary" onClick={cashOut}>
                      <Zap size={15} /> Cash out instantly
                    </button>
                  </div>
                </div>
                <div className="balance-art">
                  <div className="balance-chip">
                    <span className="chip-logo"><Logo size={30} /></span>
                    <span className="chip-label">CASH APP</span>
                    <span className="chip-tag">$mayamakes</span>
                    <span className="chip-number">•••• 8041</span>
                  </div>
                </div>
              </div>
              <div className="panel">
                <div className="panel-head">
                  <div>
                    <h3>Payout history</h3>
                    <span className="panel-sub">Instant transfers to your Cash App balance</span>
                  </div>
                </div>
                <div className="table-scroll">
                  <table className="data-table">
                    <thead>
                      <tr><th>Payout</th><th>Destination</th><th>Date</th><th>Status</th><th className="num">Amount</th></tr>
                    </thead>
                    <tbody>
                      {seedPayouts.map((payout) => (
                        <tr key={payout.id}>
                          <td className="mono">{payout.id}</td>
                          <td>{payout.tag}</td>
                          <td>{payout.date}</td>
                          <td><span className="status-pill is-live"><Check size={11} /> {payout.status}</span></td>
                          <td className="num">{formatMoney(payout.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : null}

          {section === 'webhooks' ? (
            <>
              <div className="panel">
                <div className="panel-head">
                  <div>
                    <h3>Endpoint</h3>
                    <span className="panel-sub">Cashport signs every request with your webhook secret</span>
                  </div>
                  <button type="button" className="btn btn-outline btn-sm" onClick={copyEndpoint}>
                    <Code size={14} /> Copy URL
                  </button>
                </div>
                <div className="endpoint-box">
                  <span className="endpoint-method">POST</span>
                  <code>https://api.cashport.app/v1/webhooks</code>
                  <span className="endpoint-live"><span className="live-dot" /> listening</span>
                </div>
                <pre className="code-block">{`// order.paid
{
  "id": "evt_9f2a1c",
  "type": "order.paid",
  "data": {
    "order_id": "CP-8041",
    "product": "Nexus UI Kit",
    "amount": 4900,
    "currency": "usd",
    "cashtag": "$mayamakes"
  }
}`}</pre>
              </div>

              <div className="panel">
                <div className="panel-head">
                  <div>
                    <h3>Subscribed events</h3>
                    <span className="panel-sub">3 active endpoints</span>
                  </div>
                </div>
                <div className="stack-list">
                  {seedWebhooks.map((hook) => (
                    <div className="webhook-row" key={hook.event}>
                      <span className="webhook-icon"><Webhook size={16} /></span>
                      <div className="webhook-info">
                        <strong className="mono">{hook.event}</strong>
                        <span className="mono">{hook.url}</span>
                      </div>
                      <span className="status-pill is-live">{hook.status}</span>
                      <span className="webhook-last">{hook.last}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </main>
  )
}

function DiscountForm({ codes, onCreate, onCancel }) {
  const [error, setError] = useState('')

  const submit = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const type = String(data.get('type'))
    const maxRaw = String(data.get('maxUses') || '').trim()
    const expiresRaw = String(data.get('expires') || '').trim()
    const draft = {
      code: String(data.get('code') || ''),
      type,
      value: Number(data.get('value')),
      minSubtotal: Number(data.get('minSubtotal') || 0),
      maxUses: maxRaw ? Number(maxRaw) : null,
      expiresAt: expiresRaw ? new Date(`${expiresRaw}T23:59:59`).toISOString() : null,
    }
    const result = validateDiscountDraft(draft, codes)
    if (!result.ok) {
      setError(result.error)
      return
    }
    onCreate(result.value)
  }

  return (
    <form className="discount-form" onSubmit={submit}>
      <div className="discount-form-head">
        <strong>New promo code</strong>
        <span>Percent or fixed amount. Applies to every product.</span>
      </div>
      <div className="discount-form-grid">
        <label className="field">
          <span>Code</span>
          <input
            name="code"
            placeholder="SPRING25"
            maxLength={32}
            autoComplete="off"
            spellCheck="false"
            required
            onInput={(event) => {
              event.currentTarget.value = event.currentTarget.value.toUpperCase().replace(/[^A-Z0-9_-]/g, '')
            }}
          />
        </label>
        <label className="field">
          <span>Type</span>
          <select name="type" defaultValue="percent">
            <option value="percent">Percentage</option>
            <option value="fixed">Fixed amount (USD)</option>
          </select>
        </label>
        <label className="field">
          <span>Value</span>
          <input name="value" type="number" min="0.01" step="0.01" placeholder="25" required />
        </label>
        <label className="field">
          <span>Minimum order (USD)</span>
          <input name="minSubtotal" type="number" min="0" step="0.01" defaultValue="0" />
        </label>
        <label className="field">
          <span>Max uses</span>
          <input name="maxUses" type="number" min="1" step="1" placeholder="Unlimited" />
        </label>
        <label className="field">
          <span>Expiry date</span>
          <input name="expires" type="date" />
        </label>
      </div>
      <p className="discount-form-note">
        Percentages accept 1–100. Fixed values are dollars. A 100% code makes checkout free.
      </p>
      {error ? <p className="discount-form-error" role="alert">{error}</p> : null}
      <div className="discount-form-actions">
        <button type="button" className="btn btn-outline btn-sm" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary btn-sm"><Plus size={14} /> Create code</button>
      </div>
    </form>
  )
}

function OrderTable({ orders, full = false }) {
  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Product</th>
            <th>Code</th>
            <th>Method</th>
            <th>Status</th>
            <th className="num">Amount</th>
            {full ? <th>When</th> : null}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="mono">{order.id}</td>
              <td>
                <span className="buyer">
                  <span className="avatar avatar-xs">{order.buyer.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span>
                  <span>
                    <strong>{order.buyer}</strong>
                    <small>{order.email}</small>
                  </span>
                </span>
              </td>
              <td>{order.product}</td>
              <td>
                {order.code
                  ? <span className="order-code">{order.code}</span>
                  : <span className="muted">—</span>}
              </td>
              <td>
                {order.method === 'Promo'
                  ? <span className="method method-promo"><Tag size={16} /> Promo</span>
                  : <span className="method"><Logo size={16} /> Cash App</span>}
              </td>
              <td>
                <span className={`status-pill ${order.status === 'Free' ? 'is-free' : 'is-live'}`}>
                  <Check size={11} /> {order.status}
                </span>
              </td>
              <td className="num">
                {formatMoney(order.amount, order.interval)}
                {order.discount > 0 ? <small className="order-discount">−{formatMoney(order.discount)}</small> : null}
              </td>
              {full ? <td className="muted">{order.date}</td> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
