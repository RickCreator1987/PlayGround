import test from 'node:test'
import assert from 'node:assert/strict'
import {
  discountLabel,
  discountStatus,
  evaluateDiscount,
  defaultDiscounts,
  normalizeCode,
  validateDiscountDraft,
} from '../src/lib/discounts.js'

const now = Date.parse('2026-10-21T12:00:00Z')
const codes = [
  { code: 'rickcreator1987', type: 'percent', value: 100, active: true, minSubtotal: 0, maxUses: null, expiresAt: null },
  { code: 'LAUNCH25', type: 'percent', value: 25, active: true, minSubtotal: 0, maxUses: null, expiresAt: null },
  { code: 'SAVE10', type: 'fixed', value: 10, active: true, minSubtotal: 20, maxUses: null, expiresAt: null },
  { code: 'CAPPED', type: 'fixed', value: 50, active: true, minSubtotal: 0, maxUses: null, expiresAt: null },
  { code: 'LIMITED', type: 'percent', value: 10, active: true, minSubtotal: 0, maxUses: 2, uses: 2, expiresAt: null },
  { code: 'OLD', type: 'percent', value: 20, active: true, minSubtotal: 0, maxUses: null, expiresAt: '2026-01-01T00:00:00.000Z' },
  { code: 'PAUSED', type: 'percent', value: 15, active: false, minSubtotal: 0, maxUses: null, expiresAt: null },
]

test('rickcreator1987 is seeded as a 100% discount', () => {
  const seeded = defaultDiscounts(now)
  const featured = seeded.find((code) => code.code === 'rickcreator1987')
  assert.ok(featured)
  assert.equal(featured.type, 'percent')
  assert.equal(featured.value, 100)
  assert.equal(featured.active, true)
  assert.equal(featured.maxUses, null)
})

test('rickcreator1987 drops any total to zero', () => {
  const result = evaluateDiscount('rickcreator1987', codes, { subtotal: 49, now })
  assert.equal(result.ok, true)
  assert.equal(result.discount, 49)
  assert.equal(result.total, 0)
  assert.equal(result.isFree, true)
  assert.equal(result.label, '100% off')
})

test('codes match regardless of case or surrounding whitespace', () => {
  assert.equal(normalizeCode('  RickCreator1987 '), 'RICKCREATOR1987')
  const result = evaluateDiscount('  LaUnCh25 ', codes, { subtotal: 49, now })
  assert.equal(result.ok, true)
  assert.equal(result.discount, 12.25)
  assert.equal(result.total, 36.75)
})

test('fixed discounts respect the minimum order', () => {
  const tooSmall = evaluateDiscount('SAVE10', codes, { subtotal: 15, now })
  assert.equal(tooSmall.ok, false)
  assert.match(tooSmall.reason, /Add \$5\.00 more/)

  const valid = evaluateDiscount('SAVE10', codes, { subtotal: 20, now })
  assert.equal(valid.ok, true)
  assert.equal(valid.discount, 10)
  assert.equal(valid.total, 10)
})

test('fixed discounts never push a total below zero', () => {
  const result = evaluateDiscount('CAPPED', codes, { subtotal: 30, now })
  assert.equal(result.ok, true)
  assert.equal(result.discount, 30)
  assert.equal(result.total, 0)
})

test('usage limits, expiry, pause, and unknown codes are rejected', () => {
  assert.match(evaluateDiscount('LIMITED', codes, { subtotal: 49, now }).reason, /usage limit/)
  assert.match(evaluateDiscount('OLD', codes, { subtotal: 49, now }).reason, /expired/)
  assert.match(evaluateDiscount('PAUSED', codes, { subtotal: 49, now }).reason, /paused/)
  assert.match(evaluateDiscount('NOPE', codes, { subtotal: 49, now }).reason, /not valid/)
  assert.match(evaluateDiscount('', codes, { subtotal: 49, now }).reason, /Enter a promo code/)
})

test('discount labels and statuses are human readable', () => {
  assert.equal(discountLabel({ type: 'percent', value: 25 }), '25% off')
  assert.equal(discountLabel({ type: 'fixed', value: 10 }), '$10.00 off')
  assert.equal(discountStatus({ active: false }, now).label, 'Paused')
  assert.equal(discountStatus({ active: true, expiresAt: '2026-01-01T00:00:00.000Z' }, now).label, 'Expired')
  assert.equal(discountStatus({ active: true, maxUses: 2, uses: 2 }, now).label, 'Maxed out')
  assert.equal(discountStatus({ active: true, uses: 0 }, now).label, 'Active')
})

test('draft validation normalizes and accepts a valid percentage code', () => {
  const result = validateDiscountDraft({
    code: ' spring25 ',
    type: 'percent',
    value: 25,
    minSubtotal: 0,
    maxUses: 50,
    expiresAt: '2027-01-01T00:00:00.000Z',
  }, codes)
  assert.equal(result.ok, true)
  assert.equal(result.value.code, 'SPRING25')
  assert.equal(result.value.maxUses, 50)
})

test('draft validation blocks duplicates and out-of-range values', () => {
  assert.match(
    validateDiscountDraft({ code: 'launch25', type: 'percent', value: 10, minSubtotal: 0, maxUses: null, expiresAt: null }, codes).error,
    /already exists/,
  )
  assert.match(
    validateDiscountDraft({ code: 'BIG', type: 'percent', value: 150, minSubtotal: 0, maxUses: null, expiresAt: null }, codes).error,
    /1 to 100/,
  )
  assert.match(
    validateDiscountDraft({ code: 'BAD CODE', type: 'percent', value: 10, minSubtotal: 0, maxUses: null, expiresAt: null }, codes).error,
    /letters, numbers/,
  )
})
