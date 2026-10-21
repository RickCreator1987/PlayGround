import { useState } from 'react'
import {
  ArrowRight,
  Check,
  Code,
  Lock,
  Logo,
  Terminal,
  Webhook,
  Zap,
} from '../components/Icons.jsx'

const nav = [
  { id: 'quickstart', label: 'Quickstart' },
  { id: 'checkout', label: 'Checkout API' },
  { id: 'webhooks', label: 'Webhooks' },
  { id: 'licenses', label: 'Licenses' },
  { id: 'payouts', label: 'Payouts' },
]

const samples = {
  curl: `curl https://api.cashport.app/v1/checkouts \\
  -H "Authorization: Bearer cp_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "product_id": "prod_nexus_ui",
    "customer_email": "ari@studio.co",
    "success_url": "https://mayamakes.co/thanks"
  }'`,
  node: `import Cashport from '@cashport/node'

const cashport = new Cashport(process.env.CASHPORT_KEY)

const checkout = await cashport.checkouts.create({
  productId: 'prod_nexus_ui',
  customerEmail: 'ari@studio.co',
  successUrl: 'https://mayamakes.co/thanks',
})

// Redirect the customer to checkout.url
console.log(checkout.url)`,
  python: `from cashport import Cashport

cashport = Cashport("cp_live_...")

checkout = cashport.checkouts.create(
    product_id="prod_nexus_ui",
    customer_email="ari@studio.co",
    success_url="https://mayamakes.co/thanks",
)

print(checkout.url)`,
}

const response = `{
  "id": "ch_8b2f9c",
  "object": "checkout",
  "product_id": "prod_nexus_ui",
  "amount": 4900,
  "currency": "usd",
  "cashtag": "$mayamakes",
  "status": "open",
  "url": "https://cashport.app/checkout/ch_8b2f9c",
  "payment_link": "https://cash.app/$mayamakes/49",
  "expires_at": "2026-10-21T12:30:00Z"
}`

export default function Docs({ onNavigate, onToast }) {
  const [tab, setTab] = useState('node')
  const [active, setActive] = useState('quickstart')

  const copy = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text)
      onToast(`${label} copied.`)
    } catch {
      onToast('Copy failed in this browser.')
    }
  }

  return (
    <main className="docs-page">
      <div className="shell docs-hero">
        <div>
          <span className="section-kicker"><Terminal size={15} /> Developer docs</span>
          <h1>The Cashport API</h1>
          <p>
            Everything you need to sell a product, issue a license, and get paid to a $cashtag.
            Cashport wraps Cash App Pay in a developer-friendly REST API.
          </p>
          <div className="docs-hero-actions">
            <button type="button" className="btn btn-primary" onClick={() => onToast('Sandbox key generated (demo): cp_test_9f2a1c.')}>
              Get a sandbox key <ArrowRight />
            </button>
            <button type="button" className="btn btn-outline" onClick={() => onNavigate('dashboard')}>
              Open the dashboard
            </button>
          </div>
        </div>
        <div className="docs-hero-card">
          <div className="docs-card-top">
            <span><Logo size={22} /> Cash App Pay</span>
            <span className="docs-live"><span className="live-dot" /> sandbox</span>
          </div>
          <pre>{`POST /v1/checkouts`}</pre>
          <div className="docs-card-row"><span>Amount</span><strong>$49.00</strong></div>
          <div className="docs-card-row"><span>Destination</span><strong>$mayamakes</strong></div>
          <div className="docs-card-row"><span>Status</span><strong className="green">succeeded</strong></div>
        </div>
      </div>

      <div className="shell docs-grid">
        <aside className="docs-side">
          <span className="docs-side-label">Guide</span>
          {nav.map((item) => (
            <button
              key={item.id}
              type="button"
              className={active === item.id ? 'is-active' : ''}
              onClick={() => setActive(item.id)}
            >
              {item.label}
            </button>
          ))}
          <div className="docs-side-note">
            <Lock size={15} />
            <span>Payments are authorized by the customer inside Cash App, then captured server-side.</span>
          </div>
        </aside>

        <div className="docs-body">
          {active === 'quickstart' ? (
            <>
              <section className="docs-section">
                <h2>Quickstart</h2>
                <p>Create a product in the dashboard, then create a checkout from your server. The customer approves the payment in Cash App and Cashport delivers the product.</p>
                <div className="quick-steps">
                  <div><span>1</span><p><strong>Install the SDK</strong><code>npm i @cashport/node</code></p></div>
                  <div><span>2</span><p><strong>Create a checkout</strong><code>cashport.checkouts.create()</code></p></div>
                  <div><span>3</span><p><strong>Listen for the payment</strong><code>order.paid webhook</code></p></div>
                </div>
              </section>
              <section className="docs-section">
                <h2>Authentication</h2>
                <p>Use a secret key on the server. Publishable keys are only for rendering the checkout button in the browser.</p>
                <div className="callout">
                  <Lock size={16} />
                  <span>Never expose <code>cp_live_…</code> keys in client-side code.</span>
                </div>
              </section>
            </>
          ) : null}

          {active === 'checkout' ? (
            <>
              <section className="docs-section">
                <h2>Create a checkout</h2>
                <p>Sessions expire after 30 minutes. The response includes a hosted <code>url</code> and a direct <code>payment_link</code> for Cash App.</p>
                <div className="code-card">
                  <div className="code-tabs">
                    {['node', 'curl', 'python'].map((item) => (
                      <button
                        key={item}
                        type="button"
                        className={tab === item ? 'is-active' : ''}
                        onClick={() => setTab(item)}
                      >
                        {item}
                      </button>
                    ))}
                    <button type="button" className="copy-btn" onClick={() => copy(samples[tab], 'Code sample')}>
                      <Code size={13} /> Copy
                    </button>
                  </div>
                  <pre>{samples[tab]}</pre>
                </div>
              </section>
              <section className="docs-section">
                <h2>Response</h2>
                <div className="code-card">
                  <div className="code-tabs">
                    <span className="code-title">200 OK</span>
                    <button type="button" className="copy-btn" onClick={() => copy(response, 'Response')}>
                      <Code size={13} /> Copy
                    </button>
                  </div>
                  <pre>{response}</pre>
                </div>
              </section>
              <section className="docs-section">
                <h2>Checkout lifecycle</h2>
                <div className="lifecycle">
                  {['open', 'pending', 'succeeded', 'delivered'].map((state, index) => (
                    <div className="lifecycle-step" key={state}>
                      <span className="lifecycle-dot">{index < 3 ? <Check size={10} /> : <Zap size={10} />}</span>
                      <code>{state}</code>
                    </div>
                  ))}
                </div>
              </section>
            </>
          ) : null}

          {active === 'webhooks' ? (
            <section className="docs-section">
              <h2>Webhooks</h2>
              <p>Cashport signs each delivery with an HMAC-SHA256 signature in the <code>Cashport-Signature</code> header. Verify it before trusting the payload.</p>
              <div className="code-card">
                <div className="code-tabs"><span className="code-title">order.paid</span></div>
                <pre>{`{
  "id": "evt_9f2a1c",
  "type": "order.paid",
  "created": 1792585080,
  "data": {
    "order_id": "CP-8041",
    "product_id": "prod_nexus_ui",
    "amount": 4900,
    "currency": "usd",
    "customer_email": "ari@studio.co",
    "cashtag": "$mayamakes",
    "license_key": "CP-8F2A-11BC-90DE"
  }
}`}</pre>
              </div>
              <div className="event-list">
                {['order.paid', 'order.refunded', 'subscription.created', 'subscription.canceled', 'license.issued', 'payout.sent'].map((event) => (
                  <span key={event}><Webhook size={13} /> {event}</span>
                ))}
              </div>
            </section>
          ) : null}

          {active === 'licenses' ? (
            <section className="docs-section">
              <h2>Licenses</h2>
              <p>Every successful order can issue a signed license key with a seat limit and expiration. Validate a key from your product with one request.</p>
              <div className="code-card">
                <div className="code-tabs"><span className="code-title">POST /v1/licenses/verify</span></div>
                <pre>{`{
  "license_key": "CP-8F2A-11BC-90DE",
  "product_id": "prod_nexus_ui"
}

// 200 OK
{
  "valid": true,
  "seats": 1,
  "expires_at": null,
  "customer_email": "ari@studio.co"
}`}</pre>
              </div>
            </section>
          ) : null}

          {active === 'payouts' ? (
            <section className="docs-section">
              <h2>Payouts</h2>
              <p>Cash App payments settle to the creator’s $cashtag. Instant payouts are initiated from the dashboard or the API.</p>
              <div className="code-card">
                <div className="code-tabs"><span className="code-title">POST /v1/payouts</span></div>
                <pre>{`{
  "amount": 486240,
  "currency": "usd",
  "cashtag": "$mayamakes",
  "speed": "instant"
}`}</pre>
              </div>
              <div className="callout">
                <Logo size={16} />
                <span>Cash App is US-only for merchant payments. Buyers and creators must be in the United States.</span>
              </div>
            </section>
          ) : null}

          <div className="docs-next">
            <span>Ready to build?</span>
            <button type="button" className="btn btn-primary" onClick={() => onNavigate('dashboard')}>
              Create a product <ArrowRight />
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
