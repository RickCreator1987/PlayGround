import { icon, cashLogo } from './icons.js';
import { areaChart, avatar, esc, money, productById, qrSvg, randomKey, randomRef, state, statusPill } from './core.js';
import { chartData } from './data.js';
import { landing } from './landing.js';
import { customersView, customerRows, filteredCustomers, filteredOrders, orderRows, ordersView, overview } from './dashboard.js';
import { analyticsView, filteredProducts, payoutsView, productCards, productsView, settingsView } from './catalog.js';
import { checkoutView, checkoutRecalc } from './checkout.js';
import { dashboardShell } from './shell.js';

const app = document.getElementById('app');
const modalRoot = document.getElementById('modal-root');
const routeNames = ['home', 'dashboard', 'products', 'orders', 'customers', 'payouts', 'analytics', 'settings', 'checkout'];
const titles = {
  home: 'Cashly — sell digital products with Cash App',
  dashboard: 'Overview · Cashly',
  products: 'Products · Cashly',
  orders: 'Orders · Cashly',
  customers: 'Customers · Cashly',
  payouts: 'Payouts · Cashly',
  analytics: 'Analytics · Cashly',
  settings: 'Settings · Cashly',
  checkout: 'Checkout · Cashly',
};
const views = {
  dashboard: overview,
  products: productsView,
  orders: ordersView,
  customers: customersView,
  payouts: payoutsView,
  analytics: analyticsView,
  settings: settingsView,
};

let cashTimer = null;
let cashTimeout = null;
let checkoutCtx = { product: null, total: 0, name: '', email: '' };
let lastRouteKey = '';

function parseRoute() {
  const raw = location.hash.replace(/^#\/?/, '').split('?')[0];
  const parts = raw.split('/').filter(Boolean);
  const name = parts[0] || 'home';
  return { name: routeNames.includes(name) ? name : 'home', param: parts[1] || '' };
}

function render() {
  const route = parseRoute();
  const routeKey = route.name + '/' + route.param;
  if (routeKey !== lastRouteKey) closeModal();
  lastRouteKey = routeKey;
  state.activeRoute = route.name;
  document.body.classList.remove('nav-open');

  if (route.name === 'home') {
    app.innerHTML = landing();
  } else if (route.name === 'checkout') {
    const product = productById(route.param) || state.products[0];
    checkoutCtx.product = product;
    checkoutCtx.total = product.price * (1 - state.checkoutDiscount);
    app.innerHTML = checkoutView(product);
  } else {
    app.innerHTML = dashboardShell(route.name, views[route.name]());
  }

  document.title = titles[route.name] || titles.home;
  window.scrollTo(0, 0);
  document.body.dataset.appReady = 'true';
  requestAnimationFrame(() => {
    document.body.dataset.appReady = 'true';
  });
}

function toast(message, isError = false) {
  const root = document.getElementById('toast-root');
  const element = document.createElement('div');
  element.className = 'toast' + (isError ? ' error' : '');
  element.innerHTML = `<span class="toast-icon">${icon(isError ? 'x' : 'check', 12, 2.4)}</span><span>${esc(message)}</span>`;
  root.appendChild(element);
  setTimeout(() => {
    element.classList.add('leaving');
    setTimeout(() => element.remove(), 240);
  }, 3200);
}

function openModal(markup, options = {}) {
  modalRoot.innerHTML = `<div class="modal-overlay ${options.drawer ? 'drawer-overlay' : ''}">${markup}</div>`;
  document.body.classList.add('no-scroll');
}

function closeModal() {
  if (cashTimer) clearInterval(cashTimer);
  if (cashTimeout) clearTimeout(cashTimeout);
  cashTimer = null;
  cashTimeout = null;
  modalRoot.innerHTML = '';
  document.body.classList.remove('no-scroll');
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const area = document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    try { document.execCommand('copy'); } catch { /* clipboard unavailable */ }
    area.remove();
  }
  toast('Copied to clipboard');
}

function productMark(name) {
  const words = String(name).trim().split(/\s+/).filter(Boolean);
  if (words.length > 1) return words.slice(0, 3).map((word) => word[0]).join('').toUpperCase();
  return String(name).slice(0, 2).toUpperCase();
}

function openProductModal(id) {
  const product = id ? productById(id) : null;
  const types = ['Digital download', 'Ebook', 'Membership', 'Service'];
  openModal(`<div class="modal wide" role="dialog" aria-modal="true" aria-labelledby="product-modal-title">
    <div class="modal-head">
      <div><h2 class="modal-title" id="product-modal-title">${product ? 'Edit product' : 'New product'}</h2><p class="modal-sub">${product ? 'Changes apply to your storefront immediately.' : 'Add a digital product, membership or service.'}</p></div>
      <button class="modal-close" type="button" data-action="close-modal" aria-label="Close">${icon('x', 17)}</button>
    </div>
    <form data-form="product">
      <div class="modal-body">
        <input type="hidden" id="product-id" value="${product ? product.id : ''}">
        <div class="field"><label for="product-name">Name</label><input class="input" id="product-name" required value="${product ? esc(product.name) : ''}" placeholder="e.g. Design Systems Course"></div>
        <div class="field-row">
          <div class="field"><label for="product-product-type">Type</label><select class="input" id="product-product-type">${types.map((type) => `<option ${product && product.type === type ? 'selected' : ''}>${type}</option>`).join('')}</select></div>
          <div class="field"><label for="product-price">Price (USD)</label><input class="input" id="product-price" type="number" min="0" step="0.01" required value="${product ? product.price : '49'}"></div>
        </div>
        <div class="field"><label for="product-desc">Description</label><textarea class="input" id="product-desc" placeholder="What does the buyer get?">${product ? esc(product.desc) : ''}</textarea></div>
        <div class="field"><label for="product-keys">License keys to issue</label><input class="input" id="product-keys" type="number" min="0" step="1" value="${product ? product.keys : '100'}"><span class="field-hint">Leave at 0 for services or memberships.</span></div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" type="button" data-action="close-modal">Cancel</button>
        <button class="btn btn-primary" type="submit">${product ? 'Save changes' : 'Create product'}</button>
      </div>
    </form>
  </div>`);
}

function saveProductForm(form) {
  const id = form.querySelector('#product-id').value;
  const name = form.querySelector('#product-name').value.trim();
  if (!name) return;
  const type = form.querySelector('#product-product-type').value;
  const price = Math.max(0, parseFloat(form.querySelector('#product-price').value) || 0);
  const desc = form.querySelector('#product-desc').value.trim();
  const keys = Math.max(0, parseInt(form.querySelector('#product-keys').value, 10) || 0);

  if (id) {
    const product = productById(id);
    if (!product) return;
    Object.assign(product, { name, type, price, desc, keys, mark: productMark(name) });
    closeModal();
    render();
    toast('Product updated');
    return;
  }

  const baseId = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'product';
  let newId = baseId;
  let suffix = 2;
  while (productById(newId)) newId = `${baseId}-${suffix++}`;
  const artOptions = ['art-green', 'art-lilac', 'art-orange', 'art-blue', 'art-pink', 'art-ink'];
  state.products.unshift({
    id: newId,
    name,
    type,
    price,
    sales: 0,
    revenue: 0,
    active: true,
    art: artOptions[Math.floor(Math.random() * artOptions.length)],
    mark: productMark(name),
    desc: desc || 'A new Cashly product. Edit the description to tell buyers what they get.',
    includes: ['Instant delivery', 'License key', 'Lifetime updates', '30-day support'],
    keys,
  });
  closeModal();
  render();
  toast('Product created');
}

function openOrderDrawer(id) {
  const order = state.orders.find((item) => item.id === id);
  if (!order) return;
  const net = order.amount - (order.amount * 0.029 + 0.3);
  const paid = order.status === 'paid';
  const pending = order.status === 'pending';
  const refunded = order.status === 'refunded';
  openModal(`<div class="modal drawer" role="dialog" aria-modal="true" aria-labelledby="order-title">
    <div class="modal-head">
      <div class="order-detail-head">${avatar(order.name)}<div><h2 class="modal-title" id="order-title">Order #${order.id}</h2><p class="modal-sub">${order.date} · Cash App</p></div></div>
      <button class="modal-close" type="button" data-action="close-modal" aria-label="Close">${icon('x', 17)}</button>
    </div>
    <div class="modal-body">
      <div style="display:flex;align-items:center;gap:8px">${statusPill(order.status)}<span style="font-size:11.5px;color:var(--muted)">${esc(order.note)}</span></div>
      <div class="detail-grid">
        <div class="detail-box"><div class="db-label">Amount</div><div class="db-value">${money(order.amount)}</div></div>
        <div class="detail-box"><div class="db-label">Net after fees</div><div class="db-value">${money(net)}</div></div>
        <div class="detail-box"><div class="db-label">Payment method</div><div class="db-value">Cash App</div></div>
        <div class="detail-box"><div class="db-label">Reference</div><div class="db-value">${order.ref}</div></div>
      </div>
      <div class="detail-box" style="margin-top:10px"><div class="db-label">Product</div><div class="db-value">${esc(order.product)}</div></div>
      <div class="detail-box" style="margin-top:10px"><div class="db-label">Customer</div><div class="db-value">${esc(order.name)} · ${esc(order.email)}</div><div style="font-size:11px;color:var(--muted);margin-top:2px">${esc(order.cashtag)}</div></div>
      <div class="timeline">
        <div class="tl-item"><span class="tl-dot">${icon('card', 11)}</span><div class="tl-body"><div class="tl-title">Checkout created</div><div class="tl-time">${order.date} · ${esc(order.product)}</div></div></div>
        <div class="tl-item"><span class="tl-dot ${paid ? '' : 'pending'}">${icon(paid ? 'check' : 'clock', 11)}</span><div class="tl-body"><div class="tl-title">${paid ? 'Payment approved in Cash App' : pending ? 'Cash App request sent' : 'Payment refunded'}</div><div class="tl-time">${order.ref} · ${esc(order.note)}</div></div></div>
        <div class="tl-item"><span class="tl-dot ${paid ? '' : 'pending'}">${icon('key', 11)}</span><div class="tl-body"><div class="tl-title">${paid ? 'License key delivered' : pending ? 'Waiting for payment' : 'License revoked'}</div><div class="tl-time">${paid ? 'Delivered automatically to the customer' : pending ? 'The customer has not confirmed yet' : 'Access removed after refund'}</div></div></div>
        <div class="tl-item"><span class="tl-dot">${icon('mail', 11)}</span><div class="tl-body"><div class="tl-title">Receipt emailed</div><div class="tl-time">Sent to ${esc(order.email)}</div></div></div>
      </div>
      ${order.license ? `<div><div class="db-label" style="font-size:9.5px;text-transform:uppercase;letter-spacing:.07em;color:var(--muted-2);font-weight:700">License key</div><div class="license-box"><code>${order.license}</code><button class="icon-btn plain" type="button" data-action="copy" data-copy="${order.license}" aria-label="Copy license">${icon('copy', 15)}</button></div></div>` : ''}
    </div>
    <div class="modal-foot">
      <button class="btn btn-ghost" type="button" data-action="close-modal">Close</button>
      <div style="display:flex;gap:8px">
        ${refunded ? '' : `<button class="btn ${paid ? 'btn-danger' : 'btn-outline'}" type="button" ${paid ? `data-action="refund" data-id="${order.id}"` : 'data-action="toast" data-message="Reminder sent to customer"'}">${paid ? 'Refund' : 'Send reminder'}</button>`}
        <button class="btn btn-outline" type="button" data-action="toast" data-message="Receipt re-sent to the customer">Resend receipt</button>
      </div>
    </div>
  </div>`, { drawer: true });
}

function openCashOut() {
  openModal(`<div class="modal" role="dialog" aria-modal="true" aria-labelledby="cashout-title">
    <div class="modal-head"><div><h2 class="modal-title" id="cashout-title">Cash out</h2><p class="modal-sub">Instant transfer to $cashlyhq</p></div><button class="modal-close" type="button" data-action="close-modal" aria-label="Close">${icon('x', 17)}</button></div>
    <div class="modal-body">
      <div class="detail-box" style="display:flex;align-items:center;gap:10px;margin-bottom:16px">${cashLogo(26)}<div><div class="db-label">Available balance</div><div class="db-value">${money(state.balance)}</div></div></div>
      <div class="field"><label for="cashout-amount">Amount to cash out</label><input class="input" id="cashout-amount" type="number" min="1" step="0.01" value="${state.balance.toFixed(2)}"></div>
      <div class="field" style="margin-bottom:0"><label>Destination</label><div class="api-key" style="font-family:var(--font)"><span style="flex:1;display:flex;align-items:center;gap:7px">${cashLogo(16)} $cashlyhq</span><span class="status-pill paid">Instant</span></div></div>
      <p style="font-size:10.5px;color:var(--muted);margin-top:10px">A 1.5% instant transfer fee applies (max $15). Demo only — no real money moves.</p>
    </div>
    <div class="modal-foot"><button class="btn btn-ghost" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="button" data-action="confirm-cashout">Cash out</button></div>
  </div>`);
}

function confirmCashOut() {
  const input = document.getElementById('cashout-amount');
  const amount = parseFloat(input.value);
  if (!Number.isFinite(amount) || amount <= 0) {
    toast('Enter an amount greater than zero', true);
    return;
  }
  if (amount > state.balance + 0.001) {
    toast('Amount is higher than your available balance', true);
    return;
  }
  state.balance = Math.max(0, state.balance - amount);
  const payoutId = 'PO-' + (8900 + state.payouts.length);
  state.payouts.unshift({ id: payoutId, date: 'Oct 21, 2026', amount, dest: '$cashlyhq', ref: randomRef(), status: 'paid' });
  closeModal();
  render();
  toast(`${money(amount)} sent to $cashlyhq`);
}

function openCashApp() {
  const product = checkoutCtx.product || state.products[0];
  const total = checkoutCtx.total;
  const email = (document.getElementById('checkout-email')?.value || '').trim() || 'jordan@hey.com';
  const name = (document.getElementById('checkout-name')?.value || '').trim() || 'Jordan Lee';
  checkoutCtx = { ...checkoutCtx, product, total, email, name };
  openModal(`<div class="modal cash-modal" role="dialog" aria-modal="true" aria-labelledby="cash-modal-title">
    <div class="modal-head"><span></span><button class="modal-close" type="button" data-action="close-modal" aria-label="Close">${icon('x', 17)}</button></div>
    <div class="modal-body" id="cash-flow">
      <div class="cm-brand">${cashLogo(36)} Cash App</div>
      <h2 class="cm-title" id="cash-modal-title">Pay Cashly HQ</h2>
      <p class="cm-sub">Scan the code or open Cash App to approve.</p>
      <div class="cm-qr">${qrSvg('checkout-' + product.id + '-' + total, 25)}</div>
      <div class="cm-amount">${money(total)}</div>
      <div class="cm-cashtag">${icon('dollar', 12)} $cashlyhq</div>
      <a class="btn btn-primary btn-block cm-open" href="https://cash.app/$cashlyhq/${total.toFixed(2)}" target="_blank" rel="noopener">${cashLogo(20)} Open Cash App</a>
      <button class="btn btn-outline btn-block cm-confirm" type="button" data-action="cash-confirm">I’ve sent the payment</button>
      <div class="cm-timer">${icon('clock', 12)} Request expires in <b id="cash-timer">04:59</b></div>
      <p class="cm-demo">Demo checkout. No money moves and no real Cash App request is created.</p>
    </div>
  </div>`);
  let remaining = 299;
  const timer = document.getElementById('cash-timer');
  cashTimer = setInterval(() => {
    remaining = Math.max(0, remaining - 1);
    if (timer) timer.textContent = String(Math.floor(remaining / 60)).padStart(2, '0') + ':' + String(remaining % 60).padStart(2, '0');
    if (remaining === 0 && cashTimer) {
      clearInterval(cashTimer);
      cashTimer = null;
    }
  }, 1000);
}

function confirmCashPayment() {
  if (cashTimer) clearInterval(cashTimer);
  cashTimer = null;
  const flow = document.getElementById('cash-flow');
  if (!flow) return;
  flow.innerHTML = `<div class="cm-spinner"></div><h2 class="cm-title">Confirming with Cash App…</h2><p class="cm-sub">Matching your payment reference and issuing your license.</p>`;
  cashTimeout = setTimeout(finalizeCashPayment, 1650);
}

function finalizeCashPayment() {
  const { product, total, email, name } = checkoutCtx;
  const nextId = String(Math.max(...state.orders.map((order) => parseInt(order.id, 10) || 0)) + 1);
  const ref = randomRef();
  const license = randomKey();
  state.orders.unshift({
    id: nextId,
    name,
    email,
    product: product.name,
    amount: total,
    status: 'paid',
    ref,
    date: 'Oct 21, Just now',
    cashtag: '$' + name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 14),
    license,
    note: 'Paid with Cash App balance',
  });
  product.sales += 1;
  product.revenue += total;
  product.keys += 1;
  state.balance += total - (total * 0.029 + 0.3);

  const flow = document.getElementById('cash-flow');
  if (!flow) return;
  const colors = ['#00d54b', '#0b0d0b', '#19e65f', '#f2c94c', '#7ecf96'];
  const confetti = Array.from({ length: 16 }, (_, index) => `<span class="confetti" style="left:${6 + index * 5.7}%;background:${colors[index % colors.length]};animation-delay:${(index % 6) * 0.07}s"></span>`).join('');
  flow.style.position = 'relative';
  flow.innerHTML = `${confetti}
    <div class="success-check">${icon('check', 28, 2.4)}</div>
    <h2 class="success-title">Payment received</h2>
    <p class="success-sub">Receipt and download link sent to ${esc(email)}.</p>
    <div class="success-key"><div class="sk-label">Your license key</div><code>${license}<button class="icon-btn plain" type="button" data-action="copy" data-copy="${license}" aria-label="Copy license key">${icon('copy', 14)}</button></code></div>
    <div class="success-actions">
      <button class="btn btn-primary" type="button" data-action="download">${icon('download', 15)} Download files</button>
      <button class="btn btn-outline" type="button" data-action="cash-success-orders">View order</button>
    </div>
    <p class="cm-demo">Order #${nextId} · ${money(total)} · ${ref} · Demo only</p>`;
}

function applyDiscount() {
  const input = document.getElementById('discount-code');
  const code = (input?.value || '').trim().toUpperCase();
  if (!checkoutCtx.product) return;
  if (code === 'CASH10') {
    state.checkoutDiscount = 0.1;
    const total = checkoutRecalc(checkoutCtx.product);
    if (typeof total === 'number') checkoutCtx.total = total;
    toast('CASH10 applied — 10% off');
  } else {
    toast('That code is not valid. Try CASH10.', true);
  }
}

function updateProductGrid() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;
  grid.innerHTML = productCards(filteredProducts());
}

function updateOrderRows() {
  const body = document.getElementById('order-rows');
  if (body) body.innerHTML = orderRows(filteredOrders());
}

function updateCustomerRows() {
  const body = document.getElementById('customer-rows');
  if (body) body.innerHTML = customerRows(filteredCustomers());
}

function switchChart(range) {
  if (!chartData[range]) return;
  state.chartRange = range;
  const value = document.getElementById('chart-value');
  const holder = document.getElementById('chart-holder');
  if (value) value.textContent = chartData[range].value;
  if (holder) holder.innerHTML = areaChart(chartData[range].values, chartData[range].labels);
  document.querySelectorAll('[data-action="chart-range"]').forEach((button) => button.classList.toggle('active', button.dataset.range === range));
}

function mobileNav() {
  openModal(`<div class="modal" role="dialog" aria-modal="true" aria-label="Menu">
    <div class="modal-head"><div><h2 class="modal-title">Menu</h2><p class="modal-sub">Cashly demo</p></div><button class="modal-close" type="button" data-action="close-modal" aria-label="Close">${icon('x', 17)}</button></div>
    <div class="modal-body" style="display:grid;gap:4px">
      <a class="side-link" href="#/dashboard" style="color:var(--ink);height:44px">${icon('home', 17)} Overview</a>
      <a class="side-link" href="#/products" style="color:var(--ink);height:44px">${icon('box', 17)} Products</a>
      <a class="side-link" href="#/orders" style="color:var(--ink);height:44px">${icon('receipt', 17)} Orders</a>
      <a class="side-link" href="#/checkout/shipfast" style="color:var(--ink);height:44px">${icon('card', 17)} Checkout demo</a>
      <a class="side-link" href="#/" style="color:var(--ink);height:44px">${icon('arrow-left', 17)} Back to landing</a>
    </div>
    <div class="modal-foot"><a class="btn btn-primary btn-block" href="#/dashboard">Open dashboard</a></div>
  </div>`);
}

function handlingAction(element, event) {
  const action = element.dataset.action;
  if (!action) return;
  if (element.tagName === 'A' && action !== 'checkout') return;
  event.preventDefault();

  switch (action) {
    case 'toast':
      toast(element.dataset.message || 'Done');
      break;
    case 'mobile-nav':
      mobileNav();
      break;
    case 'close-modal':
      closeModal();
      break;
    case 'toggle-nav':
      document.body.classList.toggle('nav-open');
      break;
    case 'close-nav':
      document.body.classList.remove('nav-open');
      break;
    case 'checkout':
      location.hash = '#/checkout/' + element.dataset.id;
      break;
    case 'new-product':
      openProductModal(null);
      break;
    case 'edit-product':
      openProductModal(element.dataset.id);
      break;
    case 'toggle-product': {
      const product = productById(element.dataset.id);
      if (!product) break;
      product.active = !product.active;
      element.classList.toggle('on', product.active);
      element.setAttribute('aria-checked', String(product.active));
      const label = element.nextSibling;
      if (label) label.textContent = product.active ? 'Active' : 'Paused';
      toast(`${product.name} ${product.active ? 'is live' : 'paused'}`);
      break;
    }
    case 'order':
      openOrderDrawer(element.dataset.id);
      break;
    case 'order-filter':
      state.orderFilter = element.dataset.filter;
      render();
      break;
    case 'product-view':
      state.productView = element.dataset.view;
      document.getElementById('product-grid')?.classList.toggle('list', state.productView === 'list');
      document.querySelectorAll('[data-action="product-view"]').forEach((button) => button.classList.toggle('active', button.dataset.view === state.productView));
      break;
    case 'chart-range':
      switchChart(element.dataset.range);
      break;
    case 'dismiss-banner':
      state.bannerDismissed = true;
      element.closest('.setup-banner')?.remove();
      break;
    case 'cashout':
      openCashOut();
      break;
    case 'confirm-cashout':
      confirmCashOut();
      break;
    case 'refund': {
      const order = state.orders.find((item) => item.id === element.dataset.id);
      if (!order) break;
      order.status = 'refunded';
      order.note = 'Refunded to Cash App';
      closeModal();
      render();
      toast(`${money(order.amount)} refunded to ${order.cashtag}`);
      break;
    }
    case 'pay': {
      const product = checkoutCtx.product;
      if (!product) break;
      const total = checkoutRecalc(product);
      if (typeof total === 'number') checkoutCtx.total = total;
      openCashApp();
      break;
    }
    case 'cash-confirm':
      confirmCashPayment();
      break;
    case 'apply-discount':
      applyDiscount();
      break;
    case 'download':
      toast('Your download started (demo)');
      break;
    case 'cash-success-orders':
      closeModal();
      location.hash = '#/orders';
      if (parseRoute().name === 'orders') render();
      break;
    case 'copy':
      copyText(element.dataset.copy || '');
      break;
    case 'settings-tab': {
      const target = document.getElementById(element.dataset.target);
      document.querySelectorAll('.settings-nav button').forEach((button) => button.classList.toggle('active', button === element));
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      break;
    }
    case 'toggle-setting': {
      const key = element.dataset.setting;
      if (!(key in state.settings)) break;
      state.settings[key] = !state.settings[key];
      element.classList.toggle('on', state.settings[key]);
      element.setAttribute('aria-checked', String(state.settings[key]));
      toast('Setting saved');
      break;
    }
    case 'reveal-key': {
      state.revealKey = !state.revealKey;
      const code = document.getElementById('api-key-value');
      if (code) code.textContent = state.revealKey ? 'cashly_sk_live_92Fk7QpLm4Vx8TzR3Nw6' : 'cashly_sk_live_••••••••••••••••••••';
      break;
    }
    case 'payouts':
      location.hash = '#/payouts';
      break;
    default:
      break;
  }
}

document.addEventListener('click', (event) => {
  const actionElement = event.target.closest('[data-action]');
  if (actionElement) {
    handlingAction(actionElement, event);
    return;
  }
  const overlay = event.target.closest('.modal-overlay');
  if (overlay && event.target === overlay) closeModal();
});

document.addEventListener('click', (event) => {
  const link = event.target.closest('[data-scroll]');
  if (!link) return;
  event.preventDefault();
  const targetId = link.dataset.scroll;
  if (parseRoute().name !== 'home') {
    location.hash = '#/';
    setTimeout(() => document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
  } else {
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

document.addEventListener('input', (event) => {
  const target = event.target;
  if (target.id === 'product-search') {
    state.productQuery = target.value;
    updateProductGrid();
  } else if (target.id === 'order-search') {
    state.orderQuery = target.value;
    updateOrderRows();
  } else if (target.id === 'customer-search') {
    state.customerQuery = target.value;
    updateCustomerRows();
  }
});

document.addEventListener('change', (event) => {
  if (event.target.id === 'product-type') {
    state.productType = event.target.value;
    updateProductGrid();
  }
});

document.addEventListener('submit', (event) => {
  const form = event.target.closest('[data-form]');
  if (!form) return;
  event.preventDefault();
  if (form.dataset.form === 'product') saveProductForm(form);
  else if (form.dataset.form === 'profile') toast('Store profile saved');
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (modalRoot.children.length) closeModal();
    else document.body.classList.remove('nav-open');
  }
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    const search = document.getElementById('global-search');
    if (search) {
      event.preventDefault();
      search.focus();
    }
  }
  if (event.key === 'Enter' && event.target.id === 'global-search') {
    state.orderQuery = event.target.value;
    if (parseRoute().name === 'orders') render();
    else location.hash = '#/orders';
  }
  if (event.key === 'Enter' && event.target.id === 'discount-code') {
    event.preventDefault();
    applyDiscount();
  }
});

window.addEventListener('scroll', () => {
  const header = document.querySelector('[data-header]');
  if (header) header.classList.toggle('scrolled', window.scrollY > 8);
}, { passive: true });

window.addEventListener('hashchange', render);
render();
