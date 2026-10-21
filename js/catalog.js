import { icon, cashLogo } from './icons.js';
import { esc, money, money0, priceSuffix, state, statusPill, typeIcon } from './core.js';
import { pageHead } from './shell.js';

export function productCards(list) {
  if (!list.length) return `<div class="empty-state">${icon('search', 24)}<p style="margin-top:8px">No products match that search.</p></div>`;
  return list.map((product) => {
    const weekOrders = state.orders.filter((order) => order.product === product.name && order.status === 'paid').length;
    return `<article class="product-card">
      <button class="product-art ${product.art}" type="button" data-action="edit-product" data-id="${product.id}" aria-label="Edit ${esc(product.name)}">
        <span class="art-shape s1"></span><span class="art-shape s2"></span><span class="art-mark">${esc(product.mark)}</span>
      </button>
      <div class="pc-body">
        <div class="pc-type">${icon(typeIcon(product.type), 11)} ${esc(product.type)}</div>
        <h3 class="pc-title">${esc(product.name)}</h3>
        <div class="pc-meta"><span>${product.sales} sales</span><span class="dot"></span><span>${weekOrders} this week</span></div>
        <div class="pc-price">${money(product.price)} <span>${priceSuffix(product)}</span></div>
      </div>
      <div class="pc-foot">
        <div class="pc-rev" style="display:flex;align-items:center;gap:7px"><button class="switch ${product.active ? 'on' : ''}" type="button" role="switch" aria-checked="${product.active}" aria-label="Toggle ${esc(product.name)}" data-action="toggle-product" data-id="${product.id}"></button>${product.active ? 'Active' : 'Paused'}</div>
        <button class="icon-btn plain" type="button" data-action="edit-product" data-id="${product.id}" aria-label="Edit product">${icon('chevron-right', 16)}</button>
      </div>
    </article>`;
  }).join('');
}

export function filteredProducts() {
  const query = state.productQuery.trim().toLowerCase();
  return state.products.filter((product) => {
    const matchesQuery = !query || product.name.toLowerCase().includes(query) || product.type.toLowerCase().includes(query);
    const matchesType = state.productType === 'all' || product.type === state.productType;
    return matchesQuery && matchesType;
  });
}

export function productsView() {
  const totalRevenue = state.products.reduce((sum, product) => sum + product.revenue, 0);
  const totalKeys = state.products.reduce((sum, product) => sum + product.keys, 0);
  const active = state.products.filter((product) => product.active).length;
  return `${pageHead('Products', 'Digital downloads, memberships and services.', `
    <button class="btn btn-outline" type="button" data-action="copy" data-copy="https://cashly.shop/cashlyhq">${icon('external', 15)} Storefront</button>
    <button class="btn btn-primary" type="button" data-action="new-product">${icon('plus', 15)} New product</button>`)}
    <div class="summary-strip">
      <div class="mini-stat"><div class="ms-label">Active products</div><div class="ms-value">${active}</div><div class="ms-sub">${state.products.length} total</div></div>
      <div class="mini-stat"><div class="ms-label">Product revenue</div><div class="ms-value">${money0(totalRevenue)}</div><div class="ms-sub">All time</div></div>
      <div class="mini-stat"><div class="ms-label">License keys issued</div><div class="ms-value">${totalKeys.toLocaleString('en-US')}</div><div class="ms-sub">Auto-delivered</div></div>
      <div class="mini-stat"><div class="ms-label">Avg. price</div><div class="ms-value">${money(Math.round(state.products.reduce((sum, product) => sum + product.price, 0) / state.products.length))}</div><div class="ms-sub">Across all products</div></div>
    </div>
    <div class="filters">
      <label class="filter-input">${icon('search', 15)}<input id="product-search" type="search" placeholder="Search products…" value="${esc(state.productQuery)}" aria-label="Search products"></label>
      <select class="select" id="product-type" aria-label="Filter by type">
        <option value="all">All types</option>
        ${['Digital download', 'Ebook', 'Membership', 'Service'].map((type) => `<option value="${type}" ${state.productType === type ? 'selected' : ''}>${type}</option>`).join('')}
      </select>
      <div class="view-toggle" role="group" aria-label="View">
        <button type="button" class="${state.productView === 'grid' ? 'active' : ''}" data-action="product-view" data-view="grid" aria-label="Grid view">${icon('grid', 14)}</button>
        <button type="button" class="${state.productView === 'list' ? 'active' : ''}" data-action="product-view" data-view="list" aria-label="List view">${icon('list', 15)}</button>
      </div>
    </div>
    <div class="product-grid ${state.productView === 'list' ? 'list' : ''}" id="product-grid">${productCards(filteredProducts())}</div>`;
}

export function payoutsView() {
  return `${pageHead('Payouts', 'Cash out your balance to $cashlyhq, any time.', `
    <button class="btn btn-outline" type="button" data-action="toast" data-message="Payout schedule is set to instant">${icon('clock', 15)} Schedule</button>
    <button class="btn btn-primary" type="button" data-action="cashout">${icon('zap', 15)} Cash out now</button>`)}
    <div class="payout-hero">
      <div class="payout-inner">
        <div class="payout-balance">
          <div class="pb-label">${cashLogo(18)} Available to cash out</div>
          <div class="pb-amount" id="payout-balance">${money(state.balance)}</div>
          <div class="pb-sub">Instant transfer to $cashlyhq · 2.9% + 30¢ processing already applied</div>
        </div>
        <div class="payout-stats">
          <div class="ps-item"><div class="ps-label">Pending</div><div class="ps-value">${money(1840.2)}</div></div>
          <div class="ps-item"><div class="ps-label">Paid out</div><div class="ps-value">$48,210.60</div></div>
          <div class="ps-item"><div class="ps-label">Next payout</div><div class="ps-value">Oct 23</div></div>
        </div>
      </div>
    </div>
    <div class="dash-grid" style="margin-bottom:12px">
      <div class="card">
        <div class="card-head"><div><div class="card-title">Payout destination</div><div class="card-sub">Where your money lands</div></div><button class="btn btn-sm btn-outline" type="button" data-action="toast" data-message="Payout destination editing is not part of this demo">Edit</button></div>
        <div class="destination-card"><span class="dest-logo">${cashLogo(26)}</span><div class="dest-copy"><b>$cashlyhq</b><span>Cash App · verified · instant transfers on</span></div><span class="status-pill paid">Active</span></div>
      </div>
      <div class="card">
        <div class="card-head"><div><div class="card-title">Instant payouts</div><div class="card-sub">Cash out in seconds, 24/7</div></div><button class="switch on big" type="button" role="switch" aria-checked="true" aria-label="Instant payouts" data-action="toggle-setting" data-setting="instantPayouts"></button></div>
        <p style="font-size:12px;color:var(--muted);line-height:1.6">Payouts usually arrive in under 30 seconds. A 1.5% instant transfer fee applies, capped at $15.</p>
      </div>
    </div>
    <div class="card">
      <div class="card-head"><div><div class="card-title">Payout history</div><div class="card-sub">Transfers to $cashlyhq</div></div><button class="icon-btn plain" type="button" data-action="toast" data-message="Statement export queued" aria-label="Export">${icon('download', 16)}</button></div>
      <div class="table-wrap"><table class="data-table">
        <thead><tr><th>Payout</th><th>Date</th><th>Destination</th><th class="hide-mobile">Reference</th><th>Amount</th><th>Status</th></tr></thead>
        <tbody>${state.payouts.map((payout) => `<tr>
          <td><div class="order-id">${payout.id}</div></td>
          <td><span class="order-date">${payout.date}</span></td>
          <td><span class="cell-pay">${cashLogo(15)} ${esc(payout.dest)}</span></td>
          <td class="hide-mobile"><span class="order-date">${payout.ref}</span></td>
          <td class="amount-cell">${money(payout.amount)}</td>
          <td>${statusPill('paid')}</td>
        </tr>`).join('')}</tbody>
      </table></div>
    </div>`;
}

export function analyticsView() {
  const bars = [
    { label: 'Sep 29', value: 42 }, { label: 'Oct 2', value: 55 }, { label: 'Oct 5', value: 48 },
    { label: 'Oct 8', value: 68 }, { label: 'Oct 11', value: 61 }, { label: 'Oct 14', value: 84 },
    { label: 'Oct 17', value: 72 }, { label: 'Oct 20', value: 96 },
  ];
  const top = state.products.slice().sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  return `${pageHead('Analytics', 'How buyers find you and what they pay for.', `
    <select class="select" aria-label="Analytics range"><option>Last 30 days</option><option>Last 7 days</option><option>Last 90 days</option></select>
    <button class="btn btn-primary" type="button" data-action="toast" data-message="Report export queued">${icon('download', 15)} Export report</button>`)}
    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-top"><span class="kpi-label">Storefront visitors</span><span class="kpi-icon">${icon('globe', 15)}</span></div><div class="kpi-value">12,480</div><div class="kpi-bottom"><span class="kpi-delta up">${icon('arrow-up-right', 10)} +18.1%</span><span class="kpi-vs">vs last month</span></div></div>
      <div class="kpi"><div class="kpi-top"><span class="kpi-label">Checkout starts</span><span class="kpi-icon">${icon('card', 15)}</span></div><div class="kpi-value">1,146</div><div class="kpi-bottom"><span class="kpi-delta up">${icon('arrow-up-right', 10)} +6.4%</span><span class="kpi-vs">vs last month</span></div></div>
      <div class="kpi"><div class="kpi-top"><span class="kpi-label">Paid orders</span><span class="kpi-icon">${icon('receipt', 15)}</span></div><div class="kpi-value">487</div><div class="kpi-bottom"><span class="kpi-delta up">${icon('arrow-up-right', 10)} +8.2%</span><span class="kpi-vs">vs last month</span></div></div>
      <div class="kpi"><div class="kpi-top"><span class="kpi-label">Conversion rate</span><span class="kpi-icon">${icon('zap', 15)}</span></div><div class="kpi-value">3.8%</div><div class="kpi-bottom"><span class="kpi-delta down">${icon('arrow-right', 10)} -0.4%</span><span class="kpi-vs">vs last month</span></div></div>
    </div>
    <div class="analytics-grid" style="margin-bottom:12px">
      <div class="card">
        <div class="card-head"><div><div class="card-title">Revenue by day</div><div class="card-sub">Gross volume this month</div></div><div class="range-tabs"><button class="range-tab active" type="button" data-action="toast" data-message="Showing daily revenue">Daily</button><button class="range-tab" type="button" data-action="toast" data-message="Weekly view is not part of this demo">Weekly</button></div></div>
        <div class="bar-chart">${bars.map((bar, index) => `<div class="bar-col"><span class="bar-tooltip">${money0(bar.value * 31)}</span><div class="bar-fill-wrap"><div class="bar-fill ${index === bars.length - 1 ? 'hot' : ''}" style="height:${bar.value}%"></div></div><span class="bar-label">${bar.label}</span></div>`).join('')}</div>
      </div>
      <div class="card">
        <div class="card-head"><div><div class="card-title">Traffic sources</div><div class="card-sub">Where buyers come from</div></div></div>
        <div class="donut-wrap">
          <div class="donut"><div class="donut-center"><div><b>12.4k</b><span>visitors</span></div></div></div>
          <div class="legend">
            <div class="legend-row"><span class="sw" style="background:#00d54b"></span> Twitter / X <b>42%</b></div>
            <div class="legend-row"><span class="sw" style="background:#0f1a12"></span> Direct <b>26%</b></div>
            <div class="legend-row"><span class="sw" style="background:#7ecf96"></span> Newsletter <b>17%</b></div>
            <div class="legend-row"><span class="sw" style="background:#d9e6da"></span> Other <b>15%</b></div>
          </div>
        </div>
        <div style="margin-top:18px;padding-top:16px;border-top:1px solid var(--line)">
          <div class="card-sub" style="margin-bottom:7px">Checkout funnel</div>
          <div class="funnel">
            <div class="funnel-step"><span class="funnel-label">Storefront</span><span class="funnel-track"><span class="funnel-fill" style="width:100%">12,480</span></span><span class="funnel-val">100%</span></div>
            <div class="funnel-step"><span class="funnel-label">Checkout</span><span class="funnel-track"><span class="funnel-fill" style="width:46%">1,146</span></span><span class="funnel-val">9.2%</span></div>
            <div class="funnel-step"><span class="funnel-label">Cash App open</span><span class="funnel-track"><span class="funnel-fill" style="width:32%">684</span></span><span class="funnel-val">5.5%</span></div>
            <div class="funnel-step"><span class="funnel-label">Paid</span><span class="funnel-track"><span class="funnel-fill" style="width:22%">487</span></span><span class="funnel-val">3.9%</span></div>
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-head"><div><div class="card-title">Top products</div><div class="card-sub">Revenue and conversion by product</div></div><a class="card-foot-link" href="#/products">All products ${icon('arrow-right', 12)}</a></div>
      <div class="table-wrap"><table class="data-table">
        <thead><tr><th>Product</th><th>Revenue</th><th>Sales</th><th class="hide-mobile">Checkout conversion</th><th class="hide-mobile">Avg. order</th></tr></thead>
        <tbody>${top.map((product, index) => `<tr class="clickable" data-action="edit-product" data-id="${product.id}">
          <td><div class="cell-user"><span class="mini-art ${product.art}">${esc(product.mark)}</span><div><div class="cell-name">${esc(product.name)}</div><div class="cell-sub">${esc(product.type)}</div></div></div></td>
          <td class="amount-cell">${money(product.revenue)}</td>
          <td>${product.sales}</td>
          <td class="hide-mobile">${(4.2 - index * 0.4).toFixed(1)}%</td>
          <td class="hide-mobile">${money(product.price)}</td>
        </tr>`).join('')}</tbody>
      </table></div>
    </div>`;
}

function toggle(setting, label) {
  return `<button class="switch ${state.settings[setting] ? 'on' : ''} big" type="button" role="switch" aria-checked="${state.settings[setting]}" aria-label="${label}" data-action="toggle-setting" data-setting="${setting}"></button>`;
}

export function settingsView() {
  return `${pageHead('Settings', 'Storefront, payments and developer access.', `
    <button class="btn btn-outline" type="button" data-action="toast" data-message="Settings are simulated in this demo">${icon('refresh', 15)} Reset</button>`)}
    <div class="settings-grid">
      <nav class="settings-nav" aria-label="Settings sections">
        <button class="active" type="button" data-action="settings-tab" data-target="store-profile">Store profile</button>
        <button type="button" data-action="settings-tab" data-target="payments">Payments</button>
        <button type="button" data-action="settings-tab" data-target="payouts-settings">Payouts</button>
        <button type="button" data-action="settings-tab" data-target="api-keys">API keys</button>
        <button type="button" data-action="settings-tab" data-target="notifications">Notifications</button>
      </nav>
      <div class="settings-body">
        <section class="settings-card" id="store-profile">
          <h3>Store profile</h3>
          <p class="sc-sub">This appears on your storefront and receipts.</p>
          <form data-form="profile">
            <div class="field-row">
              <div class="field"><label for="store-name">Store name</label><input class="input" id="store-name" value="Cashly HQ"></div>
              <div class="field"><label for="store-slug">Storefront slug</label><input class="input" id="store-slug" value="cashlyhq"></div>
            </div>
            <div class="field"><label for="store-email">Support email</label><input class="input" id="store-email" type="email" value="hello@cashly.demo"></div>
            <div class="field"><label for="store-desc">Description</label><textarea class="input" id="store-desc">Digital products for indie builders. Courses, UI kits and memberships — delivered instantly via Cash App.</textarea><span class="field-hint">Shown on your storefront and in search results.</span></div>
            <button class="btn btn-primary btn-sm" type="submit">Save changes</button>
          </form>
        </section>

        <section class="settings-card" id="payments">
          <h3>Payments</h3>
          <p class="sc-sub">Cash App Pay is your primary checkout. Processing is handled by Cash App.</p>
          <div class="integration">
            <span class="int-logo">${cashLogo(26)}</span>
            <div class="int-copy"><b>Cash App Pay <span class="status-pill paid">Connected</span></b><span>$cashlyhq · verified merchant · sandbox mode</span></div>
            <button class="btn btn-sm btn-outline" type="button" data-action="toast" data-message="Cash App account management opens in the Cash App dashboard">Manage</button>
          </div>
          <div class="setting-row"><div class="sr-body"><div class="sr-title">Enable Cash App Pay</div><div class="sr-text">Show Cash App as the primary payment method at checkout.</div></div>${toggle('cashAppPay', 'Enable Cash App Pay')}</div>
          <div class="setting-row"><div class="sr-body"><div class="sr-title">Auto-deliver license keys</div><div class="sr-text">Issue a license key and download link the moment a payment clears.</div></div>${toggle('autoLicense', 'Auto-deliver license keys')}</div>
          <div class="setting-row" style="padding-bottom:0"><div class="sr-body"><div class="sr-title">Pay Kit fallback</div><div class="sr-text">If Cash App Pay is unavailable, show a $cashtag payment link.</div></div><button class="btn btn-sm btn-outline" type="button" data-action="copy" data-copy="https://cash.app/$cashlyhq">Copy link</button></div>
        </section>

        <section class="settings-card" id="payouts-settings">
          <h3>Payouts</h3>
          <p class="sc-sub">Where and how fast your money arrives.</p>
          <div class="field"><label for="payout-tag">Payout $cashtag</label><input class="input" id="payout-tag" value="$cashlyhq"></div>
          <div class="setting-row"><div class="sr-body"><div class="sr-title">Instant payouts</div><div class="sr-text">Cash out 24/7 for a 1.5% fee, capped at $15.</div></div>${toggle('instantPayouts', 'Instant payouts')}</div>
          <div class="setting-row" style="padding-bottom:0"><div class="sr-body"><div class="sr-title">Weekly payout schedule</div><div class="sr-text">Automatic payout every Friday at 9:00 AM ET.</div></div><button class="btn btn-sm btn-outline" type="button" data-action="toast" data-message="Payout schedule is not editable in this demo">Edit schedule</button></div>
        </section>

        <section class="settings-card" id="api-keys">
          <h3>API keys</h3>
          <p class="sc-sub">Use these keys to create checkouts and verify events from your backend.</p>
          <div class="field"><label>Live secret key</label>
            <div class="api-key"><code id="api-key-value">${state.revealKey ? 'cashly_sk_live_92Fk7QpLm4Vx8TzR3Nw6' : 'cashly_sk_live_••••••••••••••••••••'}</code><button class="icon-btn plain" type="button" data-action="reveal-key" aria-label="Reveal key">${icon('key', 15)}</button><button class="icon-btn plain" type="button" data-action="copy" data-copy="cashly_sk_live_92Fk7QpLm4Vx8TzR3Nw6" aria-label="Copy key">${icon('copy', 15)}</button></div>
          </div>
          <div class="field" style="margin-bottom:16px"><label>Webhook signing secret</label>
            <div class="api-key"><code>whsec_••••••••••••••••••</code><button class="icon-btn plain" type="button" data-action="copy" data-copy="whsec_cashly_demo" aria-label="Copy webhook secret">${icon('copy', 15)}</button></div>
          </div>
          <div class="webhook-row"><span class="status-pill paid">Live</span><code>https://api.cashly.demo/webhooks/cashapp</code><span class="status-pill paid">Active</span></div>
          <div class="webhook-row"><span class="status-pill pending">Test</span><code>https://api.cashly.demo/webhooks/test</code><span class="status-pill pending">Active</span></div>
        </section>

        <section class="settings-card" id="notifications">
          <h3>Notifications</h3>
          <p class="sc-sub">Choose what lands in your inbox.</p>
          <div class="setting-row"><div class="sr-body"><div class="sr-title">New order</div><div class="sr-text">Email me when a Cash App payment clears.</div></div>${toggle('newOrder', 'New order emails')}</div>
          <div class="setting-row"><div class="sr-body"><div class="sr-title">Customer receipts</div><div class="sr-text">Send buyers a receipt and download link automatically.</div></div>${toggle('receipts', 'Customer receipts')}</div>
          <div class="setting-row" style="padding-bottom:0"><div class="sr-body"><div class="sr-title">Payout confirmations</div><div class="sr-text">Email me every time money hits my $cashtag.</div></div>${toggle('payouts', 'Payout confirmations')}</div>
        </section>
      </div>
    </div>`;
}
