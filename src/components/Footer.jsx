import { Logo, ArrowRight } from './Icons.jsx'

export default function Footer({ onNavigate, onSection, onToast }) {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-top">
          <div className="footer-brand">
            <button type="button" className="brand brand-footer" onClick={() => onNavigate('home')}>
              <Logo />
              <span className="brand-name">cashport</span>
            </button>
            <p>
              The creator monetization platform built on Cash App. Sell what you make, keep more of what you earn.
            </p>
            <div className="footer-status">
              <span className="status-dot" />
              All systems operational
            </div>
          </div>
          <div className="footer-links">
            <div>
              <h4>Product</h4>
              <button type="button" onClick={() => onSection('products')}>Discover</button>
              <button type="button" onClick={() => onNavigate('dashboard')}>Creator studio</button>
              <button type="button" onClick={() => onSection('how')}>How it works</button>
              <button type="button" onClick={() => onNavigate('docs')}>Documentation</button>
            </div>
            <div>
              <h4>Developers</h4>
              <button type="button" onClick={() => onNavigate('docs')}>API reference</button>
              <button type="button" onClick={() => onNavigate('docs')}>Webhooks</button>
              <button type="button" onClick={() => onNavigate('docs')}>Licenses</button>
              <button type="button" onClick={() => onToast('Status page is not part of this demo.')}>Status</button>
            </div>
            <div>
              <h4>Company</h4>
              <button type="button" onClick={() => onToast('About page is not part of this demo.')}>About</button>
              <button type="button" onClick={() => onToast('Blog is not part of this demo.')}>Blog</button>
              <button type="button" onClick={() => onToast('Careers page is not part of this demo.')}>Careers</button>
              <button type="button" onClick={() => onToast('Say hello at hello@cashport.app')}>Contact</button>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Cashport, Inc. Not affiliated with Cash App or Block, Inc.</p>
          <div className="footer-legal">
            <button type="button" onClick={() => onToast('Privacy policy is not part of this demo.')}>Privacy</button>
            <button type="button" onClick={() => onToast('Terms are not part of this demo.')}>Terms</button>
            <button type="button" className="footer-cta" onClick={() => onNavigate('dashboard')}>
              Start selling <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
