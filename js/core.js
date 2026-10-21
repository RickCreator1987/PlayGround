import { seedProducts, seedOrders, seedCustomers, seedPayouts } from './data.js';

export const state = {
  products: seedProducts.map((product) => ({ ...product })),
  orders: seedOrders.map((order) => ({ ...order })),
  customers: seedCustomers.map((customer) => ({ ...customer })),
  payouts: seedPayouts.map((payout) => ({ ...payout })),
  balance: 4280.5,
  productQuery: '',
  productType: 'all',
  productView: 'grid',
  orderFilter: 'all',
  orderQuery: '',
  customerQuery: '',
  chartRange: '30d',
  settings: { cashAppPay: true, instantPayouts: true, autoLicense: true, receipts: true, newOrder: true, payouts: false },
  bannerDismissed: false,
  revealKey: false,
  checkoutDiscount: 0,
  activeRoute: 'home',
};

export const money = (value, decimals = 2) => '$' + Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
export const money0 = (value) => '$' + Math.round(Number(value || 0)).toLocaleString('en-US');

export const esc = (value) => String(value == null ? '' : value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));

export const initials = (name) => String(name || '?').split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();

export const avatarClass = (name) => 'av-' + (Array.from(String(name || '')).reduce((sum, character) => sum + character.charCodeAt(0), 0) % 6 + 1);

export const avatar = (name, extra = '') => `<span class="avatar ${avatarClass(name)} ${extra}" aria-hidden="true">${esc(initials(name))}</span>`;

export const productById = (id) => state.products.find((product) => product.id === id);

export const typeIcon = (type) => type === 'Membership' ? 'refresh' : type === 'Service' ? 'users' : type === 'Ebook' ? 'code' : 'download';

export const priceSuffix = (product) => product.type === 'Membership' ? '/ month' : 'one-time';

export const orderCounts = () => ({
  all: state.orders.length,
  paid: state.orders.filter((order) => order.status === 'paid').length,
  pending: state.orders.filter((order) => order.status === 'pending').length,
  refunded: state.orders.filter((order) => order.status === 'refunded').length,
});

export function statusPill(status) {
  const labels = { paid: 'Paid', pending: 'Pending', refunded: 'Refunded', failed: 'Failed' };
  return `<span class="status-pill ${status}">${labels[status] || status}</span>`;
}

export function productArt(product, className = '') {
  return `<div class="product-art ${product.art} ${className}">
    <span class="art-shape s1"></span><span class="art-shape s2"></span>
    <span class="art-mark">${esc(product.mark)}</span>
  </div>`;
}

export function stars(count = 5) {
  return `<span class="stars" aria-label="${count} out of 5 stars">${Array.from({ length: count }, () => '<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2.5 2.9 5.9 6.5.9-4.7 4.6 1.1 6.4-5.8-3-5.8 3 1.1-6.4L2.6 9.3l6.5-.9Z"/></svg>').join('')}</span>`;
}

export function brand(href = '#/') {
  return `<a class="brand" href="${href}" aria-label="Cashly home"><span class="brand-mark">$</span><span class="brand-word">cashly</span></a>`;
}

export function smoothPath(points) {
  if (!points.length) return '';
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
  return d;
}

let chartSeq = 0;

export function areaChart(values, labels) {
  const width = 720;
  const height = 226;
  const top = 18;
  const bottom = 16;
  const pad = 8;
  const max = Math.max(...values) * 1.14;
  const points = values.map((value, index) => [
    pad + (index * (width - pad * 2)) / (values.length - 1),
    top + (1 - value / max) * (height - top - bottom),
  ]);
  const line = smoothPath(points);
  const area = `${line} L${points[points.length - 1][0].toFixed(1)},${height} L${points[0][0].toFixed(1)},${height} Z`;
  const gradientId = 'chartGrad' + (++chartSeq);
  const grid = [0, 0.25, 0.5, 0.75, 1].map((fraction) => {
    const y = top + (height - top - bottom) * fraction;
    return `<line x1="0" y1="${y.toFixed(1)}" x2="${width}" y2="${y.toFixed(1)}" stroke="#edf0ea" stroke-width="1" stroke-dasharray="3 6"/>`;
  }).join('');
  const pointMarks = points.map((point, index) => `<circle cx="${point[0].toFixed(1)}" cy="${point[1].toFixed(1)}" r="10" fill="transparent"><title>${labels[index]}: ${money0(values[index])}</title></circle><circle class="chart-point" cx="${point[0].toFixed(1)}" cy="${point[1].toFixed(1)}" r="3.2" fill="#fff" stroke="#0aa943" stroke-width="2"/>`).join('');
  const last = points[points.length - 1];
  return `<div class="chart-holder" id="chart-body">
    <svg class="chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Revenue over the selected period">
      <defs><linearGradient id="${gradientId}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#00d54b" stop-opacity=".28"/><stop offset="100%" stop-color="#00d54b" stop-opacity="0"/></linearGradient></defs>
      ${grid}
      <path d="${area}" fill="url(#${gradientId})"/>
      <path d="${line}" fill="none" stroke="#0aa943" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
      ${pointMarks}
      <circle cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="7" fill="#00d54b" opacity=".2"/>
    </svg>
    <div class="chart-labels">${labels.map((label) => `<span>${label}</span>`).join('')}</div>
  </div>`;
}

export function sparkline(values, width = 92, height = 30) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const points = values.map((value, index) => [
    2 + (index * (width - 4)) / (values.length - 1),
    3 + (1 - (value - min) / (max - min || 1)) * (height - 6),
  ]);
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" aria-hidden="true"><path d="${smoothPath(points)}" stroke="#0aa943" stroke-width="1.7" stroke-linecap="round" opacity=".7"/></svg>`;
}

export function qrSvg(seed, n = 25) {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index++) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  const random = () => {
    hash ^= hash << 13;
    hash ^= hash >>> 17;
    hash ^= hash << 5;
    return (hash >>> 0) / 4294967296;
  };
  const finderAt = (x, y, originX, originY) => {
    if (x < originX || x > originX + 6 || y < originY || y > originY + 6) return null;
    const dx = x - originX;
    const dy = y - originY;
    const edge = dx === 0 || dx === 6 || dy === 0 || dy === 6;
    const core = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
    return edge || core ? 1 : 0;
  };
  const cells = [];
  const logoMin = Math.floor(n / 2) - 3;
  const logoMax = Math.floor(n / 2) + 3;
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const finder = finderAt(x, y, 0, 0) ?? finderAt(x, y, n - 7, 0) ?? finderAt(x, y, 0, n - 7);
      let on;
      if (finder !== null) on = finder;
      else if (x >= logoMin && x <= logoMax && y >= logoMin && y <= logoMax) on = 0;
      else if (x === 6 || y === 6) on = (x + y) % 2 === 0 ? 1 : 0;
      else on = random() > 0.52 ? 1 : 0;
      if (on) cells.push(`<rect x="${x}" y="${y}" width="1" height="1"/>`);
    }
  }
  const center = n / 2;
  return `<svg viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges" role="img" aria-label="Cash App payment QR code">
    <rect width="${n}" height="${n}" fill="#fff"/>
    <g fill="#0b0d0b">${cells.join('')}</g>
    <rect x="${center - 3.2}" y="${center - 3.2}" width="6.4" height="6.4" rx="1.2" fill="#00d54b"/>
    <text x="${center}" y="${center + 1.6}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="4.4" font-weight="800" fill="#06140a">$</text>
  </svg>`;
}

export function randomKey() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segment = () => Array.from({ length: 4 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
  return `CASHLY-${segment()}-${segment()}-${segment()}`;
}

export function randomRef() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return 'CA-' + Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
}
