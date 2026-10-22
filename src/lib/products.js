import { categories } from '../data.js'

export const PRODUCT_STATUSES = ['Live', 'Draft']
export const PRODUCT_CATEGORIES = categories.filter((category) => category !== 'All')

const CATEGORY_STYLE = {
  Design: { tone: 'lime', glyph: '◈' },
  Templates: { tone: 'iris', glyph: '⌘' },
  Courses: { tone: 'green', glyph: '↯' },
  SaaS: { tone: 'slate', glyph: '⬢' },
  Assets: { tone: 'peach', glyph: '✦' },
  Memberships: { tone: 'mint', glyph: '◐' },
}

export function productStyle(category) {
  return CATEGORY_STYLE[category] || { tone: 'butter', glyph: '✳' }
}

export function createProductId(name, products = []) {
  const base = String(name ?? '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'product'
  const ids = new Set((products || []).map((product) => product.id))
  if (!ids.has(base)) return base
  let suffix = 2
  while (ids.has(`${base}-${suffix}`)) suffix += 1
  return `${base}-${suffix}`
}

export function normalizeProductDraft(draft = {}) {
  const name = String(draft.name ?? '').trim()
  if (name.length < 2 || name.length > 70) {
    return { ok: false, error: 'Product name must be between 2 and 70 characters.' }
  }

  const price = Math.round(Number(draft.price) * 100) / 100
  if (!Number.isFinite(price) || price <= 0) {
    return { ok: false, error: 'Enter a price greater than zero.' }
  }
  if (price > 100000) {
    return { ok: false, error: 'Price must be $100,000 or less.' }
  }

  const category = String(draft.category ?? '')
  if (!PRODUCT_CATEGORIES.includes(category)) {
    return { ok: false, error: 'Choose a product category.' }
  }

  const interval = draft.interval === 'month' ? 'month' : null
  const status = PRODUCT_STATUSES.includes(draft.status) ? draft.status : 'Live'

  const tagline = String(draft.tagline ?? '').trim()
  if (tagline.length < 3 || tagline.length > 140) {
    return { ok: false, error: 'Tagline must be between 3 and 140 characters.' }
  }

  const description = String(draft.description ?? '').trim().slice(0, 2000)
  const rawIncludes = Array.isArray(draft.includes)
    ? draft.includes
    : String(draft.includes ?? '').split(/\r?\n/)
  const includes = [...new Set(rawIncludes.map((item) => String(item).trim()).filter(Boolean))].slice(0, 10)
  if (includes.length === 0) {
    return { ok: false, error: 'Add at least one item customers receive.' }
  }

  const license = String(draft.license ?? '').trim().slice(0, 80) || 'Personal + commercial use'

  return {
    ok: true,
    value: {
      name,
      price,
      interval,
      category,
      status,
      tagline,
      description,
      includes,
      license,
    },
  }
}
