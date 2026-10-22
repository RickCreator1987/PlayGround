import { useState } from 'react'
import { Plus, Trash } from './Icons.jsx'
import { PRODUCT_CATEGORIES, PRODUCT_STATUSES } from '../lib/products.js'

export default function ProductForm({ product, onSave, onDelete, onCancel }) {
  const [error, setError] = useState('')
  const editing = Boolean(product)

  const submit = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const result = onSave({
      name: data.get('name'),
      price: data.get('price'),
      interval: data.get('interval') || null,
      category: data.get('category'),
      status: data.get('status'),
      tagline: data.get('tagline'),
      description: data.get('description'),
      includes: data.get('includes'),
      license: data.get('license'),
    })
    if (!result.ok) setError(result.error)
  }

  return (
    <form className="product-form" onSubmit={submit}>
      <div className="product-form-head">
        <div>
          <strong>{editing ? `Edit ${product.name}` : 'New product'}</strong>
          <span>{editing ? 'Update the listing, pricing, and delivery details.' : 'Publish a digital product to your storefront.'}</span>
        </div>
        {editing ? (
          <span className={`status-pill ${(product.status || 'Live') === 'Live' ? 'is-live' : 'is-draft'}`}>
            {product.status || 'Live'}
          </span>
        ) : null}
      </div>

      <div className="product-form-grid">
        <label className="field product-field-wide">
          <span>Product name</span>
          <input
            name="name"
            defaultValue={product?.name || ''}
            placeholder="e.g. Portfolio Template Pack"
            maxLength={70}
            autoFocus={!editing}
            required
          />
        </label>

        <label className="field">
          <span>Price (USD)</span>
          <input
            name="price"
            type="number"
            min="0.01"
            max="100000"
            step="0.01"
            defaultValue={product?.price ?? ''}
            placeholder="49"
            required
          />
        </label>

        <label className="field">
          <span>Billing</span>
          <select name="interval" defaultValue={product?.interval || ''}>
            <option value="">One-time payment</option>
            <option value="month">Monthly subscription</option>
          </select>
        </label>

        <label className="field">
          <span>Category</span>
          <select name="category" defaultValue={product?.category || PRODUCT_CATEGORIES[0]}>
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Status</span>
          <select name="status" defaultValue={product?.status || 'Live'}>
            {PRODUCT_STATUSES.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </label>

        <label className="field product-field-wide">
          <span>Tagline</span>
          <input
            name="tagline"
            defaultValue={product?.tagline || ''}
            placeholder="One line that explains what customers get."
            maxLength={140}
            required
          />
        </label>

        <label className="field product-field-wide">
          <span>Description</span>
          <textarea
            name="description"
            defaultValue={product?.description || ''}
            placeholder="Tell customers what this product is, who it is for, and what makes it useful."
            rows={3}
            maxLength={2000}
          />
        </label>

        <label className="field product-field-wide">
          <span>What's included</span>
          <textarea
            name="includes"
            defaultValue={(product?.includes || []).join('\n')}
            placeholder={'Source files\nLicense\nLifetime updates'}
            rows={4}
            required
          />
          <small>One item per line. These appear on the checkout.</small>
        </label>

        <label className="field product-field-wide">
          <span>License</span>
          <input
            name="license"
            defaultValue={product?.license || 'Personal + commercial use'}
            placeholder="e.g. Personal + commercial use"
            maxLength={80}
          />
        </label>
      </div>

      {error ? <p className="product-form-error" role="alert">{error}</p> : null}

      <div className="product-form-actions">
        {editing ? (
          <button type="button" className="btn btn-outline btn-sm product-delete" onClick={() => onDelete(product)}>
            <Trash size={14} /> Delete
          </button>
        ) : <span />}
        <div className="product-form-buttons">
          <button type="button" className="btn btn-outline btn-sm" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn btn-primary btn-sm">
            <Plus size={14} /> {editing ? 'Save product' : 'Create product'}
          </button>
        </div>
      </div>
    </form>
  )
}
