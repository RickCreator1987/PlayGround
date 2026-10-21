import { icon, cashLogo } from './icons.js';
import { avatar, brand, esc, money, state } from './core.js';

export function checkoutView(product) {
  const discount = state.checkoutDiscount;
  const subtotal = product.price;
  const discountValue = subtotal * discount;
  const total = subtotal - discountValue;
  return `<div class="checkout-shell">
    <header class="checkout-header">
      <div class="header-inner">
        ${brand('#/')}
        <span class="secure-note">${icon('lock', 12)} <span>Secure checkout</span></span>
      </div>
    </header>
    <main class="checkout-main" id="main">
      <div class="checkout-grid">
        <section class="order-summary">
          <a class="back-link" href="#/dashboard">${icon('arrow-left', 14)} Back to Cashly HQ</a>
          <div class="co-art ${product.art}">
            <span class="art-shape s1"></span><span class="art-shape s2"></span>
            <span class="co-mark">${esc(product.mark)}</span>
          </div>
          <div class="co-kicker">${esc(product.type)} · Instant delivery</div>
          <h1 class="co-title">${esc(product.name)}</h1>
          <p class="co-desc">${esc(product.desc)}</p>
          <ul class="co-includes">
            ${product.includes.map((item) => `<li>${icon('check', 14, 2.2)} ${esc(item)}</li>`).join('')}
          </ul>
          <div class="co-seller">
            ${avatar('Miles Carter')}
            <div><b>Cashly HQ <span class="status-pill paid" style="margin-left:4px">Verified</span></b><span>12,400 customers · usually replies in an hour</span></div>
          </div>
          <div class="secure-box">${icon('shield', 20)}<div><b>Secure, private checkout</b><span>Payment is confirmed inside Cash App. Card details are never stored by Cashly.</span></div></div>
        </section>

        <section class="pay-card">
          <div class="pay-head"><div><div class="pay-title">Complete your order</div><div class="pay-sub">You’ll confirm the payment in Cash App.</div></div><span class="pay-secure">${icon('lock', 10)} Encrypted</span></div>
          <div class="pay-field"><label for="checkout-name">Full name</label><input class="input" id="checkout-name" autocomplete="name" placeholder="Jordan Lee"></div>
          <div class="pay-field"><label for="checkout-email">Email for delivery</label><input class="input" id="checkout-email" type="email" autocomplete="email" placeholder="you@example.com"></div>
          <div class="pay-field">
            <label for="discount-code">Discount code</label>
            <div class="discount-row"><input class="input" id="discount-code" placeholder="Try CASH10" value="${discount ? 'CASH10' : ''}"><button class="btn btn-outline" type="button" data-action="apply-discount">Apply</button></div>
          </div>
          <div class="pay-field" style="margin-top:16px">
            <label>Payment method</label>
            <div class="method selected" role="radio" aria-checked="true" tabindex="0">
              <span class="method-logo cash">${cashLogo(24)}</span>
              <span class="method-body"><span class="method-name">Cash App Pay</span><span class="method-desc">Pay from your Cash App balance or linked card</span></span>
              <span class="method-radio"></span>
            </div>
            <div class="method disabled" role="radio" aria-checked="false" aria-disabled="true">
              <span class="method-logo card">${icon('card', 18)}</span>
              <span class="method-body"><span class="method-name">Credit or debit card <span class="soon">Soon</span></span><span class="method-desc">Cash App is the only payment method for now</span></span>
              <span class="method-radio"></span>
            </div>
          </div>
          <div class="summary-lines">
            <div class="line"><span>Subtotal</span><b id="sum-subtotal">${money(subtotal)}</b></div>
            <div class="line discount ${discount ? '' : 'hide'}" id="discount-line"><span>Discount (CASH10)</span><b id="discount-value">-${money(discountValue)}</b></div>
            <div class="line"><span>Platform fee</span><b>$0.00</b></div>
          </div>
          <div class="total-line"><span>Total</span><b id="sum-total">${money(total)}</b></div>
          <button class="btn btn-primary btn-block pay-btn" id="pay-button" type="button" data-action="pay">${cashLogo(22)}<span id="pay-btn-label">Pay ${money(total)} with Cash App</span>${icon('lock', 14)}</button>
          <p class="pay-note">${icon('info', 12)} After you tap pay, scan the QR or open Cash App to approve ${money(total)} to $cashlyhq. Your download and license key are delivered instantly.</p>
          <div class="powered">${icon('shield', 12)} Powered by <b>Cashly</b> · Cash App Pay sandbox</div>
        </section>
      </div>
    </main>
  </div>`;
}

export function checkoutRecalc(product) {
  const discount = state.checkoutDiscount;
  const subtotal = product.price;
  const discountValue = subtotal * discount;
  const total = subtotal - discountValue;
  const subtotalNode = document.getElementById('sum-subtotal');
  const discountLine = document.getElementById('discount-line');
  const discountNode = document.getElementById('discount-value');
  const totalNode = document.getElementById('sum-total');
  const labelNode = document.getElementById('pay-btn-label');
  if (!subtotalNode || !totalNode || !labelNode) return;
  subtotalNode.textContent = money(subtotal);
  discountNode.textContent = '-' + money(discountValue);
  discountLine.classList.toggle('hide', discount <= 0);
  totalNode.textContent = money(total);
  labelNode.textContent = `Pay ${money(total)} with Cash App`;
  return total;
}
