import { icon, cashLogo } from './icons.js';
import { avatar, brand, qrSvg, stars } from './core.js';

export function landing() {
  return `<div class="landing">
    <header class="site-header" data-header>
      <div class="header-inner">
        ${brand()}
        <nav class="site-nav" aria-label="Main">
          <a class="nav-link" href="#/" data-scroll="features">Product</a>
          <a class="nav-link" href="#/" data-scroll="cash-app">Cash App</a>
          <a class="nav-link" href="#/" data-scroll="pricing">Pricing</a>
          <a class="nav-link" href="#/dashboard">Dashboard</a>
          <a class="nav-link" href="#/checkout/shipfast">Checkout</a>
        </nav>
        <div class="header-actions">
          <button class="btn btn-ghost" type="button" data-action="toast" data-message="Sign in is not part of this demo">Sign in</button>
          <a class="btn btn-primary" href="#/dashboard">Start selling ${icon('arrow-right', 15)}</a>
          <button class="icon-btn menu-toggle" type="button" data-action="mobile-nav" aria-label="Open menu">${icon('menu', 18)}</button>
        </div>
      </div>
    </header>

    <main id="main">
      <section class="hero">
        <div class="hero-copy">
          <span class="eyebrow"><span class="chip">${icon('zap', 11)} New</span> Cash App Pay checkout is live <span class="sep hide-xs"></span><span class="hide-xs">Read the update</span> ${icon('chevron-right', 12)}</span>
          <h1>Sell anything.<br>Get paid in<br class="mobile-only"> <span class="accent">Cash App</span>.</h1>
          <p class="hero-sub">Cashly is the all-in-one platform for <strong>digital products, license keys and memberships</strong>. One link, instant delivery, and payouts straight to your $cashtag.</p>
          <div class="hero-actions">
            <a class="btn btn-primary btn-lg" href="#/dashboard">Start selling free ${icon('arrow-right', 16)}</a>
            <a class="btn btn-outline btn-lg" href="#/checkout/shipfast">${icon('card', 16)} See a live checkout</a>
          </div>
          <div class="hero-proof">
            <div class="avatar-stack">${avatar('Jordan Lee')}${avatar('Priya Shah')}${avatar('Ana Torres')}${avatar('Liam Chen')}</div>
            <div class="proof-copy">${stars(5)}<br><b>12,400+ creators</b> sell with Cashly</div>
          </div>
        </div>
        <div class="hero-visual">
          <div class="checkout-preview">
            <div class="cp-head">${brand('#/')}<span class="cp-secure">${icon('lock', 11)} Secure</span></div>
            <div class="cp-product">
              <span class="cp-thumb">JS</span>
              <div><div class="cp-name">Ship Fast — Next.js Course</div><div class="cp-meta">Instant access · Lifetime updates</div></div>
            </div>
            <div class="cp-line"><span>Total</span><span class="cp-total">$149.00</span></div>
            <button class="cp-pay" type="button" data-action="checkout" data-id="shipfast">${cashLogo(25)} Pay with Cash App ${icon('lock', 13)}</button>
            <div class="cp-or">or scan to pay</div>
            <div class="qr-row">${qrSvg('cashly-shipfast-hero', 21)}<div class="qr-copy"><b>Scan with Cash App</b>Open the app and confirm $149.00 to $cashlyhq.</div></div>
            <div class="cp-foot">${icon('shield', 12)} 256-bit encrypted · Powered by Cashly</div>
          </div>
          <div class="float-card float-success">
            <span class="check-ring">${icon('check', 16, 2.4)}</span>
            <div><div class="fs-label">Payment received</div><div class="fs-value">+$149.00</div></div>
          </div>
          <div class="float-card float-payout">
            ${cashLogo(32)}
            <div><div class="fs-label">Payout sent</div><div class="fs-value">$1,284.50</div><div class="fs-sub">to $cashlyhq</div></div>
          </div>
        </div>
      </section>

      <div class="stats-strip">
        <div class="stat"><div class="stat-value">12,400+</div><div class="stat-label">Creators selling</div></div>
        <div class="stat"><div class="stat-value">$48.2M</div><div class="stat-label">Paid out via Cash App</div></div>
        <div class="stat"><div class="stat-value">0%</div><div class="stat-label">Platform fee on Starter</div></div>
        <div class="stat"><div class="stat-value">1.2s</div><div class="stat-label">Average checkout</div></div>
      </div>

      <div class="logo-cloud">
        <span class="lc-label">Trusted by teams at</span>
        <div class="lc-marks">
          <span class="lc-mark">${icon('sparkles', 14)} Northwind</span>
          <span class="lc-mark">lumen</span>
          <span class="lc-mark">${icon('box', 14)} Swiftpress</span>
          <span class="lc-mark">ORBIT</span>
          <span class="lc-mark">Fable</span>
          <span class="lc-mark">${icon('globe', 14)} Monogram</span>
        </div>
      </div>

      <section class="section" id="features">
        <div class="section-head">
          <span class="section-kicker">The toolkit</span>
          <h2 class="section-title">Everything you need to sell digital, minus the busywork.</h2>
          <p class="section-sub">Storefront, checkout, delivery, licensing and payouts in one place. No plugins, no duct tape, no Stripe dashboard.</p>
        </div>
        <div class="feature-grid">
          <article class="feature-card"><div class="feature-icon">${cashLogo(23)}</div><h3 class="feature-title">Cash App checkout</h3><p class="feature-text">One-tap payment with QR fallback and automatic matching. Buyers confirm in the app they already use.</p></article>
          <article class="feature-card"><div class="feature-icon">${icon('key', 21)}</div><h3 class="feature-title">License keys</h3><p class="feature-text">Generate, deliver and validate keys on every successful payment. Revoke or reissue in a click.</p></article>
          <article class="feature-card"><div class="feature-icon">${icon('zap', 21)}</div><h3 class="feature-title">Instant payouts</h3><p class="feature-text">Cash out to your $cashtag in seconds, 24/7. No bank forms, no multi-day settlement windows.</p></article>
          <article class="feature-card"><div class="feature-icon">${icon('refresh', 21)}</div><h3 class="feature-title">Recurring revenue</h3><p class="feature-text">Memberships, pre-orders and renewal reminders. Keep your best customers coming back.</p></article>
          <article class="feature-card"><div class="feature-icon">${icon('filter', 21)}</div><h3 class="feature-title">Discounts & bundles</h3><p class="feature-text">Time-boxed codes, pay-what-you-want pricing and multi-product bundles that convert.</p></article>
          <article class="feature-card"><div class="feature-icon">${icon('code', 21)}</div><h3 class="feature-title">Webhooks & API</h3><p class="feature-text">Signed events, a typed API and a clean event log. Ship the custom flow your product needs.</p></article>
        </div>
      </section>

      <section class="section" id="cash-app">
        <div class="cashapp-panel">
          <div class="cashapp-copy">
            <span class="section-kicker">Why Cash App</span>
            <h2 class="section-title">The checkout your buyers already have.</h2>
            <p class="section-sub">No card forms. No 3D Secure loops. Buyers confirm in Cash App and the money lands in your balance — matched to the order automatically.</p>
            <ul class="tick-list">
              <li><span class="tick">${icon('check', 12, 2.4)}</span><span><b>Pay in two taps.</b> QR, payment link or deep link straight into the app.</span></li>
              <li><span class="tick">${icon('check', 12, 2.4)}</span><span><b>Payouts to $cashtag.</b> Withdraw your balance instantly, any day of the week.</span></li>
              <li><span class="tick">${icon('check', 12, 2.4)}</span><span><b>Reference matching.</b> Every payment is tied to an order and a license key.</span></li>
              <li><span class="tick">${icon('check', 12, 2.4)}</span><span><b>Works on every device.</b> Desktop QR and mobile deep links, out of the box.</span></li>
            </ul>
            <div class="cashapp-actions">
              <a class="btn btn-primary" href="#/checkout/shipfast">Explore the checkout ${icon('arrow-right', 15)}</a>
              <a class="btn btn-on-dark" href="#/payouts">See payout flow</a>
            </div>
          </div>
          <div class="phone-wrap">
            <div class="phone">
              <div class="phone-notch"></div>
              <div class="phone-screen">
                <div class="phone-status"><span>9:41</span><span class="sig">${icon('chart', 11)} 100%</span></div>
                <div class="cash-app-head">${cashLogo(34)}<span class="brandline">Cash App</span><span class="profile">MC</span></div>
                <div class="phone-body">
                  <div class="request-card">
                    <div class="request-label">Payment request</div>
                    <div class="request-name"><span class="req-avatar">$</span><div><div class="req-title">Cashly HQ</div><div class="req-sub">$cashlyhq</div></div></div>
                    <div class="request-amount">$149.00</div>
                    <div class="request-note">Ship Fast — Next.js Course</div>
                    <div class="request-actions"><div class="phone-pay">Pay $149.00</div><div class="phone-decline">Decline</div></div>
                    <div class="phone-meta">${icon('lock', 9)} Protected by Cash App</div>
                  </div>
                </div>
                <div class="phone-tabs">
                  <span class="phone-tab active">${cashLogo(18)}<span>Home</span></span>
                  <span class="phone-tab">${icon('card', 17)}<span>Card</span></span>
                  <span class="phone-tab">${icon('chart', 17)}<span>Investing</span></span>
                  <span class="phone-tab">${icon('users', 17)}<span>Profile</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="section-head center">
          <span class="section-kicker">How it works</span>
          <h2 class="section-title">From idea to first sale before your coffee cools.</h2>
          <p class="section-sub">No code, no merchant onboarding maze. Three steps and you are live.</p>
        </div>
        <div class="steps">
          <div class="step"><div class="step-num">1</div><h3 class="step-title">Create your product</h3><p class="step-text">Upload files, add a price, pick license keys or a membership. Cashly builds the checkout for you.</p></div>
          <div class="step"><div class="step-num">2</div><h3 class="step-title">Share one link</h3><p class="step-text">Drop your storefront link in a tweet, a newsletter or a DM. Buyers see a fast, branded checkout.</p></div>
          <div class="step"><div class="step-num">3</div><h3 class="step-title">Get paid in Cash App</h3><p class="step-text">Buyers confirm in Cash App. You get instant delivery, a license key and a payout to your $cashtag.</p></div>
        </div>
      </section>

      <section class="section" id="pricing">
        <div class="section-head center">
          <span class="section-kicker">Pricing</span>
          <h2 class="section-title">Simple pricing that scales with you.</h2>
          <p class="section-sub">Start free. Upgrade when your store starts doing real numbers.</p>
        </div>
        <div class="pricing-wrap">
          <article class="price-card">
            <div class="price-plan">Starter</div>
            <div class="price-desc">For your first product and your first 100 customers.</div>
            <div class="price-amount"><span class="num">$0</span><span class="per">/ month</span></div>
            <a class="btn btn-outline btn-block" href="#/dashboard">Start free</a>
            <ul class="price-features">
              <li>${icon('check', 14)} Up to 3 products</li>
              <li>${icon('check', 14)} Cash App checkout</li>
              <li>${icon('check', 14)} License keys & instant delivery</li>
              <li>${icon('check', 14)} 0% platform fee</li>
              <li>${icon('check', 14)} Weekly payouts to $cashtag</li>
            </ul>
          </article>
          <article class="price-card featured">
            <span class="price-badge">Most popular</span>
            <div class="price-plan">Scale</div>
            <div class="price-desc">For creators shipping products every month.</div>
            <div class="price-amount"><span class="num">$20</span><span class="per">/ month</span></div>
            <a class="btn btn-primary btn-block" href="#/dashboard">Start 14-day trial</a>
            <ul class="price-features">
              <li>${icon('check', 14)} Unlimited products & memberships</li>
              <li>${icon('check', 14)} Custom domain & branding</li>
              <li>${icon('check', 14)} Instant payouts, 24/7</li>
              <li>${icon('check', 14)} Webhooks, API & event log</li>
              <li>${icon('check', 14)} Discounts, bundles & pre-orders</li>
              <li>${icon('check', 14)} Priority support</li>
            </ul>
          </article>
          <article class="price-card">
            <div class="price-plan">Enterprise</div>
            <div class="price-desc">For teams with compliance and scale requirements.</div>
            <div class="price-amount"><span class="num">Custom</span></div>
            <a class="btn btn-outline btn-block" href="#/dashboard">Talk to us</a>
            <ul class="price-features">
              <li>${icon('check', 14)} SSO & audit logs</li>
              <li>${icon('check', 14)} Dedicated payout rails</li>
              <li>${icon('check', 14)} Migration & onboarding help</li>
              <li>${icon('check', 14)} 99.99% uptime SLA</li>
              <li>${icon('check', 14)} Named support engineer</li>
            </ul>
          </article>
        </div>
        <p class="price-foot">All plans: no platform fee on your first $1,000 each month. Cash App Pay processing rates apply.</p>
      </section>

      <section class="section">
        <div class="quote-grid">
          <article class="quote-card">
            <div class="quote-stars">${icon('star', 14)}${icon('star', 14)}${icon('star', 14)}${icon('star', 14)}${icon('star', 14)}</div>
            <p class="quote-text">“I moved my course off Gumroad on a Friday and made back the year’s fees by Monday. Checkout with Cash App is stupidly fast — people just pay.”</p>
            <div class="quote-person">${avatar('Ana Torres')}<div><div class="quote-name">Ana Torres</div><div class="quote-role">Design educator · 8,200 members</div></div></div>
          </article>
          <article class="quote-card dark">
            <div class="quote-stars">${icon('star', 14)}${icon('star', 14)}${icon('star', 14)}${icon('star', 14)}${icon('star', 14)}</div>
            <p class="quote-text">“Payouts hit my $cashtag before the support ticket would have been answered anywhere else.”</p>
            <div class="quote-person">${avatar('Liam Chen')}<div><div class="quote-name">Liam Chen</div><div class="quote-role">Indie hacker · Northline</div></div></div>
          </article>
        </div>
      </section>

      <section class="section">
        <div class="cta-band">
          <h2 class="cta-title">Ready when you are.</h2>
          <p class="cta-sub">Create your store, drop a link, and get paid in Cash App. It takes about three minutes.</p>
          <div class="cta-actions">
            <a class="btn btn-primary btn-lg" href="#/dashboard">Start selling free ${icon('arrow-right', 16)}</a>
            <a class="btn btn-on-dark btn-lg" href="#/checkout/shipfast">Open the checkout demo</a>
          </div>
          <p class="cta-note">No card required · Demo data · Cash App Pay sandbox</p>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-grid">
          <div class="footer-brand">
            ${brand('#/')}
            <p class="footer-tag">The commerce platform for creators who would rather ship than chase payments.</p>
            <span class="footer-status"><span class="dot"></span> All systems operational</span>
          </div>
          <div class="footer-col"><h4>Product</h4><ul>
            <li><a href="#/" data-scroll="features">Features</a></li>
            <li><a href="#/" data-scroll="pricing">Pricing</a></li>
            <li><a href="#/checkout/shipfast">Checkout demo</a></li>
            <li><a href="#/dashboard">Dashboard</a></li>
          </ul></div>
          <div class="footer-col"><h4>Resources</h4><ul>
            <li><button type="button" data-action="toast" data-message="Docs are not included in this demo">Documentation</button></li>
            <li><button type="button" data-action="toast" data-message="Changelog is not included in this demo">Changelog</button></li>
            <li><button type="button" data-action="toast" data-message="Support is not included in this demo">Support</button></li>
            <li><button type="button" data-action="toast" data-message="All systems operational">Status</button></li>
          </ul></div>
          <div class="footer-col"><h4>Company</h4><ul>
            <li><button type="button" data-action="toast" data-message="About page is not included in this demo">About</button></li>
            <li><button type="button" data-action="toast" data-message="Terms are not included in this demo">Terms</button></li>
            <li><button type="button" data-action="toast" data-message="Privacy policy is not included in this demo">Privacy</button></li>
            <li><button type="button" data-action="toast" data-message="Say hello at hello@cashly.demo">Contact</button></li>
          </ul></div>
        </div>
        <div class="footer-bottom">
          <span>© 2026 Cashly Labs, Inc. Demo experience with sample data.</span>
          <div class="footer-legal"><span>Cash App is a trademark of Block, Inc.</span><span>Built for the Cash App checkout experiment.</span></div>
        </div>
      </div>
    </footer>
  </div>`;
}
