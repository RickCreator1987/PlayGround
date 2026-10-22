import assert from 'node:assert/strict'
import test from 'node:test'
import { createProductId, normalizeProductDraft, productStyle } from '../src/lib/products.js'

const validDraft = {
  name: '  Portfolio Pack  ',
  price: '39.999',
  interval: 'month',
  category: 'Templates',
  status: 'Live',
  tagline: 'A polished portfolio in one weekend.',
  description: 'Everything you need to launch.',
  includes: 'Figma source\nLicense\nFigma source\n\n',
  license: '',
}

test('normalizes a valid product draft', () => {
  const result = normalizeProductDraft(validDraft)
  assert.equal(result.ok, true)
  assert.deepEqual(result.value, {
    name: 'Portfolio Pack',
    price: 40,
    interval: 'month',
    category: 'Templates',
    status: 'Live',
    tagline: 'A polished portfolio in one weekend.',
    description: 'Everything you need to launch.',
    includes: ['Figma source', 'License'],
    license: 'Personal + commercial use',
  })
})

test('draft status is allowed and one-time billing clears the interval', () => {
  const result = normalizeProductDraft({ ...validDraft, interval: '', status: 'Draft' })
  assert.equal(result.ok, true)
  assert.equal(result.value.interval, null)
  assert.equal(result.value.status, 'Draft')
})

test('rejects missing or invalid product fields', () => {
  assert.equal(normalizeProductDraft({ ...validDraft, name: '' }).ok, false)
  assert.equal(normalizeProductDraft({ ...validDraft, price: '0' }).ok, false)
  assert.equal(normalizeProductDraft({ ...validDraft, category: 'Nope' }).ok, false)
  assert.equal(normalizeProductDraft({ ...validDraft, tagline: '' }).ok, false)
  assert.equal(normalizeProductDraft({ ...validDraft, includes: '\n\n' }).ok, false)
})

test('creates readable unique product ids', () => {
  const products = [{ id: 'portfolio-pack' }, { id: 'portfolio-pack-2' }]
  assert.equal(createProductId('Portfolio Pack', products), 'portfolio-pack-3')
  assert.equal(createProductId('  ✦  ', []), 'product')
  assert.equal(createProductId('Brand New Kit', products), 'brand-new-kit')
})

test('derives product presentation from the category', () => {
  assert.deepEqual(productStyle('Design'), { tone: 'lime', glyph: '◈' })
  assert.deepEqual(productStyle('Unknown'), { tone: 'butter', glyph: '✳' })
})
