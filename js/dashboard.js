import { icon, cashLogo } from './icons.js';
import { areaChart, avatar, esc, money, money0, orderCounts, state, statusPill } from './core.js';
import { chartData } from './data.js';
import { pageHead } from './shell.js';

export function chartCard(range) {
  const data = chartData[range];
  return `<div class="card">
    <div class="card-head">
      <div><div class="card-title">Revenue</div><div class="card-sub">Cash App payments, gross volume</div></div>
      <div class="range-tabs" role="tablist" aria-label="Revenue period">
        ${['7d', '30d', '90d'].map((key) => `<button class="range-tab ${range === key ? 'active' : ''}" type="button" data-action="chart-range" data-range="${key}">${key.toUpperCase()}</button>`).join('')}
      </div>
    </div>
    <div class="chart-value" id="chart-value">${data.value}</div>
    <div class="chart-meta"><span class="kpi-delta up">${icon('arrow-up-right', 10)} ${data.delta}</span><span class="muted">vs previous period</span></div>
    <div id="chart-holder">${areaChart(data.values, data.labels)}</div>
  </div>`;
}

function setupBanner() {
  if (state.bannerDismissed) return '';
  return `<div class="setup-banner">
    <div class="setup-icon">${icon('shield', 18)}</div>
    <div class="banner-body">
      <div class="banner-title">You’re almost ready to get paid</div>
      <div class="banner-text">Verify your identity to unlock instant payouts to your $cashtag.</div>
      <div class="banner-progress"><div class="progress-track"><div class="progress-fill" style="width:75%"></div></div><span class="banner-pct">3 of 4</span></div>
    </div>
    <button class="btn btn-sm btn-outline" type="button" data-action="toast" data-message="Identity verification is simulated in this demo">Verify identity</button>
    <button class="banner-dismiss" type="button" data-action="dismiss-banner" aria-label="Dismiss">${icon('x', 15)}</button>
  </div>`;
}

export function overview() {
  const kpis = [
    { label: 'Gross volume', value: '$18,420.00', delta: '+12.4%', up: true, icon: 'wallet', spark: [4, 6, 5, 8, 7, 9, 8, 11, 10, 13] },
    { label: 'Orders', value: '487', delta: '+8.2%', up: true, icon: 'receipt', spark: [6, 5, 7, 6, 8, 9, 8, 10, 12, 11] },
    { label: 'Avg. order value', value: '$37.84', delta: '+2.1%', up: true, icon: 'chart', spark: [5, 6, 6, 7, 6, 8, 7, 8, 9, 9] },
    { label: 'Checkout conversion', value: '3.8%', delta: '-0.4%', up: false, icon: 'zap', spark: [9, 8, 9, 7, 8, 7, 7, 6, 7, 6] },
  ];
  const recent = state.orders.slice(0, 5);
  const topProducts = state.products.slice().sort((a, b) => b.revenue - a.revenue).slice(0, 4);
  const maxRevenue = Math.max(...topProducts.map((product) => product.revenue));

  return `${pageHead('Overview', 'Here’s what’s happening at Cashly HQ.', `
    <select class="select" aria-label="Date range"><option>Last 30 days</option><option>Last 7 days</option><option>Last 90 days</option><option>This year</option></select>
    <button class="btn btn-outline" type="button" data-action="copy" data-copy="https://cashly.shop/cashlyhq">${icon('external', 15)} Share storefront</button>
    <button class="btn btn-primary" type="button" data-action="new-product">${icon('plus', 15)} New product</button>`)}
    ${setupBanner()}
    <div class="kpi-grid">
      ${kpis.map((kpi) => `<article class="kpi">
        <div class="kpi-top"><span class="kpi-label">${kpi.label}</span><span class="kpi-icon">${icon(kpi.icon, 15)}</span></div>
        <div class="kpi-value">${kpi.value}</div>
        <div class="kpi-bottom"><span class="kpi-delta ${kpi.up ? 'up' : 'down'}">${icon(kpi.up ? 'arrow-up-right' : 'arrow-right', 10)} ${kpi.delta}</span><span class="kpi-vs">vs last month</span></div>
        <div class="kpi-spark">${sparkSvg(kpi.spark)}</div>
      </article>`).join('')}
    </div>
    <div class="dash-grid">
      ${chartCard(state.chartRange)}
      <div class="balance-card">
        <div class="balance-top"><span class="balance-label">${cashLogo(22)} Cash App balance</span><span class="live-pill"><span class="dot"></span> Live</span></div>
        <div class="balance-amount" id="balance-amount">${money(state.balance)}</div>
        <div class="balance-sub">Available now · 2.9% + 30¢ processing</div>
        <span class="cash-tag">${cashLogo(14)} $cashlyhq</span>
        <div class="balance-actions">
          <button class="btn btn-primary" type="button" data-action="cashout">${icon('zap', 14)} Cash out</button>
          <a class="btn-icon" href="#/payouts" aria-label="View payouts">${icon('arrow-up-right', 15)}</a>
        </div>
        <div class="payout-next"><div><div class="pn-label">Next scheduled payout</div><div class="pn-value">${money(1840.2)} · Fri, Oct 23</div></div><span class="pn-ico">${icon('clock', 15)}</span></div>
      </div>
    </div>
    <div class="dash-grid">
      <div class="card">
        <div class="card-head"><div><div class="card-title">Recent orders</div><div class="card-sub">Latest Cash App payments</div></div><a class="card-foot-link" href="#/orders">View all ${icon('arrow-right', 12)}</a></div>
        <div class="table-wrap"><table class="data-table">
          <thead><tr><th>Order</th><th>Customer</th><th class="hide-mobile">Product</th><th class="hide-mobile">Payment</th><th>Amount</th><th>Status</th></tr></thead>
          <tbody>${recent.map((order) => `<tr class="clickable" data-action="order" data-id="${order.id}">
            <td><div class="order-id">#${order.id}</div><div class="order-date">${order.date}</div></td>
            <td><div class="cell-user">${avatar(order.name)}<div><div class="cell-name">${esc(order.name)}</div><div class="cell-sub">${esc(order.email)}</div></div></div></td>
            <td class="hide-mobile cell-product">${esc(order.product)}</td>
            <td class="hide-mobile"><span class="cell-pay">${cashLogo(17)} Cash App</span></td>
            <td class="amount-cell">${money(order.amount)}</td>
            <td>${statusPill(order.status)}</td>
          </tr>`).join('')}</tbody>
        </table></div>
      </div>
      <div class="card">
        <div class="card-head"><div><div class="card-title">Top products</div><div class="card-sub">By revenue this month</div></div><button class="icon-btn plain" type="button" data-action="toast" data-message="Analytics export is not part of this demo" aria-label="More">${icon('more', 16)}</button></div>
        <div class="top-products">
          ${topProducts.map((product) => `<div class="product-row">
            <span class="mini-art ${product.art}">${esc(product.mark)}</span>
            <div class="pr-body"><div class="pr-name">${esc(product.name)}</div><div class="product-bar"><span style="width:${Math.round((product.revenue / maxRevenue) * 100)}%"></span></div></div>
            <div class="pr-val"><div class="pr-rev">${money0(product.revenue)}</div><div class="pr-sales">${product.sales} sales</div></div>
          </div>`).join('')}
        </div>
        <a class="card-foot-link" href="#/products">Manage products ${icon('arrow-right', 12)}</a>
      </div>
    </div>`;
}

function sparkSvg(values) {
  const width = 92;
  const height = 30;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const points = values.map((value, index) => [2 + (index * (width - 4)) / (values.length - 1), 3 + (1 - (value - min) / (max - min || 1)) * (height - 6)]);
  let d = `M${points[0][0]},${points[0][1]}`;
  for (let index = 0; index < points.length - 1; index++) {
    const p0 = points[index - 1] || points[index];
    const p1 = points[index];
    const p2 = points[index + 1];
    const p3 = points[index + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" aria-hidden="true"><path d="${d}" stroke="#0aa943" stroke-width="1.7" stroke-linecap="round" opacity=".7"/></svg>`;
}

export function orderRows(list) {
  if (!list.length) return `<tr><td colspan="7"><div class="empty-state">${icon('search', 22)}<p style="margin-top:6px">No orders match these filters.</p></div></td></tr>`;
  return list.map((order) => `<tr class="clickable" data-action="order" data-id="${order.id}">
    <td><div class="order-id">#${order.id}</div><div class="order-date">${order.date}</div></td>
    <td><div class="cell-user">${avatar(order.name)}<div><div class="cell-name">${esc(order.name)}</div><div class="cell-sub">${esc(order.email)}</div></div></div></td>
    <td class="hide-mobile cell-product">${esc(order.product)}</td>
    <td class="hide-mobile"><span class="cell-pay">${cashLogo(16)} <span>Cash App<br><span style="font-size:9.5px;color:var(--muted-2)">${order.ref}</span></span></span></td>
    <td class="amount-cell">${money(order.amount)}</td>
    <td>${statusPill(order.status)}</td>
    <td>${icon('chevron-right', 14)}</td>
  </tr>`).join('');
}

export function filteredOrders() {
  const query = state.orderQuery.trim().toLowerCase();
  return state.orders.filter((order) => {
    const matchesStatus = state.orderFilter === 'all' || order.status === state.orderFilter;
    const blob = [order.id, order.name, order.email, order.product, order.ref, order.cashtag].join(' ').toLowerCase();
    return matchesStatus && (!query || blob.includes(query));
  });
}

export function ordersView() {
  const counts = orderCounts();
  return `${pageHead('Orders', 'Every Cash App payment, matched to a customer and a product.', `
    <button class="btn btn-outline" type="button" data-action="toast" data-message="Export queued — you will get an email when it is ready">${icon('download', 15)} Export</button>
    <button class="btn btn-primary" type="button" data-action="copy" data-copy="https://cashly.shop/cashlyhq">${icon('external', 15)} Storefront</button>`)}
    <div class="card" style="padding-bottom:8px">
      <div class="orders-tabs" role="tablist">
        ${[['all', 'All'], ['paid', 'Paid'], ['pending', 'Pending'], ['refunded', 'Refunded']].map(([key, label]) => `<button class="orders-tab ${state.orderFilter === key ? 'active' : ''}" type="button" data-action="order-filter" data-filter="${key}">${label} <span class="tcount">${counts[key]}</span></button>`).join('')}
      </div>
      <div class="filters" style="margin-bottom:12px">
        <label class="filter-input">${icon('search', 15)}<input id="order-search" type="search" placeholder="Search orders, customers, refs…" value="${esc(state.orderQuery)}" aria-label="Search orders"></label>
        <select class="select" aria-label="Payment method"><option>All payment methods</option><option>Cash App</option></select>
        <button class="btn btn-outline btn-sm" type="button" data-action="toast" data-message="Filter panel is not part of this demo">${icon('filter', 14)} Filters</button>
      </div>
      <div class="table-wrap"><table class="data-table">
        <thead><tr><th>Order</th><th>Customer</th><th class="hide-mobile">Product</th><th class="hide-mobile">Payment</th><th>Amount</th><th>Status</th><th></th></tr></thead>
        <tbody id="order-rows">${orderRows(filteredOrders())}</tbody>
      </table></div>
    </div>`;
}

export function customerRows(list) {
  if (!list.length) return `<tr><td colspan="6"><div class="empty-state">${icon('search', 22)}<p style="margin-top:6px">No customers match that search.</p></div></td></tr>`;
  return list.map((customer) => `<tr class="clickable" data-action="toast" data-message="Customer profile for ${esc(customer.name)} is not part of this demo">
    <td><div class="cell-user">${avatar(customer.name)}<div><div class="cell-name">${esc(customer.name)}</div><div class="cell-sub">${esc(customer.email)}</div></div></div></td>
    <td><span class="cell-pay">${cashLogo(15)} ${esc(customer.cashtag)}</span></td>
    <td>${customer.orders}</td>
    <td class="amount-cell">${money(customer.ltv)}</td>
    <td class="hide-mobile"><span class="order-date">${customer.last}</span></td>
    <td><span class="status-pill ${customer.status === 'New' ? 'pending' : 'paid'}">${customer.status}</span></td>
  </tr>`).join('');
}

export function filteredCustomers() {
  const query = state.customerQuery.trim().toLowerCase();
  if (!query) return state.customers;
  return state.customers.filter((customer) => [customer.name, customer.email, customer.cashtag].join(' ').toLowerCase().includes(query));
}

export function customersView() {
  const ltv = state.customers.reduce((sum, customer) => sum + customer.ltv, 0);
  return `${pageHead('Customers', 'Everyone who has paid you through Cash App.', `
    <button class="btn btn-outline" type="button" data-action="toast" data-message="CSV export queued">${icon('download', 15)} Export</button>
    <button class="btn btn-primary" type="button" data-action="toast" data-message="Customer import is not part of this demo">${icon('plus', 15)} Add customer</button>`)}
    <div class="summary-strip">
      <div class="mini-stat"><div class="ms-label">Total customers</div><div class="ms-value">${state.customers.length}</div><div class="ms-sub">In this workspace</div></div>
      <div class="mini-stat"><div class="ms-label">Lifetime value</div><div class="ms-value">${money0(ltv)}</div><div class="ms-sub">Paid via Cash App</div></div>
      <div class="mini-stat"><div class="ms-label">Returning rate</div><div class="ms-value">68%</div><div class="ms-sub">Bought more than once</div></div>
      <div class="mini-stat"><div class="ms-label">Avg. orders</div><div class="ms-value">3.9</div><div class="ms-sub">Per customer</div></div>
    </div>
    <div class="card">
      <div class="filters" style="margin-bottom:12px"><label class="filter-input">${icon('search', 15)}<input id="customer-search" type="search" placeholder="Search customers or $cashtags…" value="${esc(state.customerQuery)}" aria-label="Search customers"></label>
      <select class="select" aria-label="Customer segment"><option>All customers</option><option>Returning</option><option>New</option></select></div>
      <div class="table-wrap"><table class="data-table">
        <thead><tr><th>Customer</th><th>Cash App</th><th>Orders</th><th>Lifetime value</th><th class="hide-mobile">Last order</th><th>Segment</th></tr></thead>
        <tbody id="customer-rows">${customerRows(filteredCustomers())}</tbody>
      </table></div>
    </div>`;
}
