import { Star, ArrowRight } from './Icons.jsx'
import { formatCompact, formatMoney } from '../data.js'

export default function ProductCard({ product, onBuy }) {
  return (
    <button type="button" className="product-card" onClick={() => onBuy(product)}>
      <span className={`product-art tone-${product.tone}`}>
        <span className="art-grid" aria-hidden="true" />
        <span className="art-glyph" aria-hidden="true">{product.glyph}</span>
        <span className="art-type">{product.category}</span>
        {product.interval ? <span className="art-badge">Subscription</span> : null}
      </span>
      <span className="product-body">
        <span className="product-creator">
          <span className="avatar avatar-sm">{product.creator.split(' ').map((part) => part[0]).join('')}</span>
          <span>{product.creator}</span>
          <span className="creator-handle">{product.handle}</span>
        </span>
        <span className="product-name">{product.name}</span>
        <span className="product-tagline">{product.tagline}</span>
        <span className="product-meta">
          <span className="rating">
            <Star /> {product.rating}
          </span>
          <span className="meta-dot">·</span>
          <span>{formatCompact(product.sales)} sold</span>
        </span>
        <span className="product-foot">
          <span className="price">
            {formatMoney(product.price, product.interval)}
          </span>
          <span className="buy-pill">
            Buy <ArrowRight size={14} />
          </span>
        </span>
      </span>
    </button>
  )
}
