export const FEATURED_CODE = 'rickcreator1987'
export const DISCOUNT_TYPES = ['percent', 'fixed']

export function normalizeCode(value) {
  return String(value ?? '').trim().toUpperCase()
}

export function money(value) {
  const rounded = Math.round((Number(value) || 0) * 100) / 100
  return `$${rounded.toFixed(2)}`
}

export function toCents(value) {
  return Math.round((Number(value) || 0) * 100)
}

export function fromCents(value) {
  return Math.round(Number(value) || 0) / 100
}

export function discountLabel(code) {
  if (!code) return ''
  if (code.type === 'percent') return `${code.value}% off`
  return `${money(code.value)} off`
}

export function defaultDiscounts(now = Date.now()) {
  const iso = (offsetDays) => new Date(now + offsetDays * 86400000).toISOString()
  return [
    {
      id: 'disc-rickcreator1987',
      code: FEATURED_CODE,
      type: 'percent',
      value: 100,
      minSubtotal: 0,
      maxUses: null,
      expiresAt: null,
      active: true,
      uses: 0,
      createdAt: iso(-38),
      note: 'Creator launch promo',
    },
    {
      id: 'disc-launch25',
      code: 'LAUNCH25',
      type: 'percent',
      value: 25,
      minSubtotal: 0,
      maxUses: null,
      expiresAt: iso(45),
      active: true,
      uses: 214,
      createdAt: iso(-21),
    },
    {
      id: 'disc-save10',
      code: 'SAVE10',
      type: 'fixed',
      value: 10,
      minSubtotal: 20,
      maxUses: null,
      expiresAt: null,
      active: true,
      uses: 63,
      createdAt: iso(-14),
    },
    {
      id: 'disc-early50',
      code: 'EARLY50',
      type: 'percent',
      value: 50,
      minSubtotal: 0,
      maxUses: 100,
      expiresAt: iso(18),
      active: true,
      uses: 87,
      createdAt: iso(-9),
    },
    {
      id: 'disc-bundle15',
      code: 'BUNDLE15',
      type: 'percent',
      value: 15,
      minSubtotal: 30,
      maxUses: null,
      expiresAt: null,
      active: true,
      uses: 31,
      createdAt: iso(-6),
    },
    {
      id: 'disc-summer20',
      code: 'SUMMER20',
      type: 'percent',
      value: 20,
      minSubtotal: 0,
      maxUses: null,
      expiresAt: iso(-4),
      active: true,
      uses: 118,
      createdAt: iso(-62),
    },
  ]
}

export function discountStatus(code, now = Date.now()) {
  if (!code.active) return { id: 'paused', label: 'Paused', tone: 'draft' }
  if (code.expiresAt && new Date(code.expiresAt).getTime() <= now) {
    return { id: 'expired', label: 'Expired', tone: 'draft' }
  }
  if (code.maxUses != null && (code.uses || 0) >= code.maxUses) {
    return { id: 'maxed', label: 'Maxed out', tone: 'draft' }
  }
  return { id: 'active', label: 'Active', tone: 'live' }
}

export function isDiscountActive(code, now = Date.now()) {
  return discountStatus(code, now).id === 'active'
}

export function evaluateDiscount(input, codes, context = {}) {
  const subtotalCents = Math.max(0, toCents(context.subtotal))
  const now = Number(context.now) || Date.now()
  const normalized = normalizeCode(input)

  if (!normalized) {
    return { ok: false, reason: 'Enter a promo code.' }
  }

  const code = (codes || []).find((candidate) => normalizeCode(candidate.code) === normalized)
  if (!code) {
    return { ok: false, reason: 'That promo code is not valid.' }
  }
  if (!code.active) {
    return { ok: false, reason: 'That promo code is paused.' }
  }
  if (code.expiresAt && new Date(code.expiresAt).getTime() <= now) {
    return { ok: false, reason: 'That promo code has expired.' }
  }

  const usedCount = context.usedCount ?? code.uses ?? 0
  if (code.maxUses != null && usedCount >= code.maxUses) {
    return { ok: false, reason: 'That promo code has reached its usage limit.' }
  }

  const minimumCents = toCents(code.minSubtotal)
  if (subtotalCents < minimumCents) {
    return { ok: false, reason: `Add ${money(fromCents(minimumCents - subtotalCents))} more to use this code.` }
  }

  if (context.productId && Array.isArray(code.productIds) && code.productIds.length > 0) {
    if (!code.productIds.includes(context.productId)) {
      return { ok: false, reason: 'That promo code does not apply to this product.' }
    }
  }

  const rawDiscountCents = code.type === 'percent'
    ? Math.round((subtotalCents * Number(code.value)) / 100)
    : toCents(code.value)
  const discountCents = Math.max(0, Math.min(rawDiscountCents, subtotalCents))

  if (discountCents <= 0) {
    return { ok: false, reason: 'That promo code does not apply to this order.' }
  }

  return {
    ok: true,
    code: code.code,
    type: code.type,
    value: code.value,
    label: discountLabel(code),
    discount: fromCents(discountCents),
    total: fromCents(subtotalCents - discountCents),
    isFree: discountCents >= subtotalCents,
  }
}

export function validateDiscountDraft(draft, codes = []) {
  const code = normalizeCode(draft.code)
  if (!/^[A-Z0-9][A-Z0-9_-]{2,31}$/.test(code)) {
    return { ok: false, error: 'Use 3–32 letters, numbers, dashes, or underscores.' }
  }
  if (codes.some((candidate) => normalizeCode(candidate.code) === code)) {
    return { ok: false, error: 'That promo code already exists.' }
  }
  if (!DISCOUNT_TYPES.includes(draft.type)) {
    return { ok: false, error: 'Choose a valid discount type.' }
  }

  const value = Number(draft.value)
  if (!Number.isFinite(value)) {
    return { ok: false, error: 'Enter a discount value.' }
  }
  if (draft.type === 'percent' && (!Number.isInteger(value) || value < 1 || value > 100)) {
    return { ok: false, error: 'Percent discounts must be whole numbers from 1 to 100.' }
  }
  if (draft.type === 'fixed' && (value < 0.01 || value > 10000)) {
    return { ok: false, error: 'Fixed discounts must be between $0.01 and $10,000.' }
  }

  const minSubtotal = Number(draft.minSubtotal ?? 0)
  if (!Number.isFinite(minSubtotal) || minSubtotal < 0) {
    return { ok: false, error: 'Minimum order must be zero or more.' }
  }

  const maxUses = draft.maxUses == null || draft.maxUses === '' ? null : Number(draft.maxUses)
  if (maxUses != null && (!Number.isInteger(maxUses) || maxUses < 1)) {
    return { ok: false, error: 'Max uses must be a whole number of 1 or more.' }
  }

  let expiresAt = null
  if (draft.expiresAt) {
    const parsed = new Date(draft.expiresAt)
    if (Number.isNaN(parsed.getTime())) {
      return { ok: false, error: 'Enter a valid expiry date.' }
    }
    expiresAt = parsed.toISOString()
  }

  return {
    ok: true,
    value: {
      code,
      type: draft.type,
      value: draft.type === 'fixed' ? Math.round(value * 100) / 100 : Math.round(value),
      minSubtotal: Math.round(minSubtotal * 100) / 100,
      maxUses,
      expiresAt,
    },
  }
}
