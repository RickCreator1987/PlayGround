export const products = [
  {
    id: 'nexus-ui',
    name: 'Nexus UI Kit',
    creator: 'Maya Chen',
    handle: '$mayamakes',
    price: 49,
    category: 'Design',
    sales: 1284,
    rating: 4.9,
    glyph: '◈',
    tone: 'lime',
    tagline: '280+ responsive components for shipping polished products fast.',
    description:
      'A complete Figma design system with variables, auto-layout components, dark mode, and production-ready tokens. Built for teams that care about the details.',
    includes: ['320 Figma components', 'Design tokens + variables', 'Light & dark themes', 'Lifetime updates'],
    license: 'Personal + commercial use',
  },
  {
    id: 'orbit-icons',
    name: 'Orbit Icon Pack',
    creator: 'Leo Park',
    handle: '$leopark',
    price: 29,
    category: 'Assets',
    sales: 3410,
    rating: 4.8,
    glyph: '✳',
    tone: 'dark',
    tagline: '1,600 pixel-perfect icons in six weights.',
    description:
      'A crisp, consistent icon library for product teams. Every icon ships as SVG, React, and Figma components with a 24px grid.',
    includes: ['1,600 icons', 'SVG + React components', 'Figma library', 'Free updates'],
    license: 'Unlimited projects',
  },
  {
    id: 'shipfast',
    name: 'Ship Fast with React',
    creator: 'Priya Patel',
    handle: '$priyabuilds',
    price: 129,
    category: 'Courses',
    sales: 842,
    rating: 4.9,
    glyph: '↯',
    tone: 'green',
    tagline: 'A 6-hour course on shipping real products, not demos.',
    description:
      'Go from blank repo to production in six focused modules. Covers architecture, auth, billing, testing, and the launch checklist Priya uses with every client.',
    includes: ['6 hours of video', 'Starter repository', 'Private community', 'Launch checklist'],
    license: 'Single seat',
  },
  {
    id: 'cashflow-os',
    name: 'Cashflow OS',
    creator: 'Maya Chen',
    handle: '$mayamakes',
    price: 19,
    interval: 'month',
    category: 'Memberships',
    sales: 523,
    rating: 4.8,
    glyph: '◐',
    tone: 'mint',
    tagline: 'A monthly operating system for independent designers.',
    description:
      'Templates, pricing calculators, and a candid monthly teardown of what is working in Maya’s studio. Cancel anytime from your Cash App subscription.',
    includes: ['Monthly teardown', 'Notion dashboard', 'Pricing calculators', 'Member Q&A'],
    license: 'Member access',
  },
  {
    id: 'saas-starter',
    name: 'SaaS Starter Kit',
    creator: 'Amina Yusuf',
    handle: '$aminaships',
    price: 199,
    category: 'Templates',
    sales: 311,
    rating: 5,
    glyph: '⌘',
    tone: 'iris',
    tagline: 'Auth, teams, billing, and emails wired up on day one.',
    description:
      'The boring parts of your next SaaS, already finished. A typed monorepo with multi-tenant auth, role-based access, transactional email, and a Cash App checkout flow.',
    includes: ['TypeScript monorepo', 'Multi-tenant auth', 'Cash App checkout', 'Deploy guide'],
    license: 'Unlimited commercial projects',
  },
  {
    id: 'pixelmint',
    name: 'Pixelmint Brushes',
    creator: 'Noa Kim',
    handle: '$noamakes',
    price: 24,
    category: 'Assets',
    sales: 2076,
    rating: 4.7,
    glyph: '✦',
    tone: 'peach',
    tagline: '48 textured brushes for Procreate and Photoshop.',
    description:
      'Soft grain, confident ink, and just enough chaos. Hand-made brushes that keep their texture at any canvas size.',
    includes: ['48 brushes', 'Procreate + Photoshop', 'Texture guide', 'Free updates'],
    license: 'Personal + commercial use',
  },
  {
    id: 'founder-notes',
    name: 'Founder Notes',
    creator: 'Sam Rivera',
    handle: '$samrivera',
    price: 8,
    interval: 'month',
    category: 'Memberships',
    sales: 1902,
    rating: 4.9,
    glyph: '¶',
    tone: 'butter',
    tagline: 'Weekly notes from building a company in public.',
    description:
      'One honest email every Friday: revenue numbers, product decisions, and the mistakes that did not make the launch post.',
    includes: ['Weekly essay', 'Open revenue dashboard', 'Archive access', 'Subscriber Q&A'],
    license: 'Member access',
  },
  {
    id: 'ledger-license',
    name: 'Ledger API License',
    creator: 'Orbit Labs',
    handle: '$orbitlabs',
    price: 99,
    interval: 'month',
    category: 'SaaS',
    sales: 145,
    rating: 4.9,
    glyph: '⬢',
    tone: 'slate',
    tagline: 'Usage-based billing infrastructure for indie products.',
    description:
      'A hosted usage meter and license server with webhooks, seats, and a tiny SDK. Designed for products that sell to developers.',
    includes: ['Licensed API access', 'Webhooks + seats', 'JS + Python SDK', 'Priority support'],
    license: 'Per product',
  },
]

export const draftProducts = [
  {
    id: 'design-dispatch',
    name: 'Design Dispatch',
    creator: 'Maya Chen',
    handle: '$mayamakes',
    price: 12,
    interval: 'month',
    category: 'Memberships',
    sales: 286,
    rating: 4.8,
    glyph: '✉',
    tone: 'butter',
    tagline: 'A monthly letter about running a small, profitable design studio.',
    description:
      'Behind-the-scenes notes on pricing, client work, and the systems Maya uses to keep a one-person studio calm and profitable.',
    includes: ['Monthly studio letter', 'Pricing templates', 'Archive access', 'Member Q&A'],
    license: 'Member access',
    status: 'Draft',
  },
]

export const categories = ['All', 'Design', 'Templates', 'Courses', 'SaaS', 'Assets', 'Memberships']

export const orders = [
  { id: 'CP-8041', buyer: 'Ari Gomez', email: 'ari@studio.co', product: 'Nexus UI Kit', amount: 49, date: '2 min ago', when: '2026-10-21T11:08:00Z', status: 'Paid' },
  { id: 'CP-8040', buyer: 'Jules Bennett', email: 'jules@north.co', product: 'Cashflow OS', amount: 19, date: '18 min ago', when: '2026-10-21T10:52:00Z', status: 'Paid' },
  { id: 'CP-8039', buyer: 'Rin Watanabe', email: 'rin@atelier.jp', product: 'Nexus UI Kit', amount: 49, date: '46 min ago', when: '2026-10-21T10:24:00Z', status: 'Paid' },
  { id: 'CP-8038', buyer: 'Milo Fraser', email: 'milo@fraser.dev', product: 'Nexus UI Kit', amount: 49, date: '1 hr ago', when: '2026-10-21T10:02:00Z', status: 'Paid' },
  { id: 'CP-8037', buyer: 'Sana Ali', email: 'sana@buildhouse.io', product: 'Cashflow OS', amount: 19, date: '2 hrs ago', when: '2026-10-21T09:14:00Z', status: 'Paid' },
  { id: 'CP-8036', buyer: 'Theo Marsh', email: 'theo@marsh.studio', product: 'Nexus UI Kit', amount: 49, date: '3 hrs ago', when: '2026-10-21T08:20:00Z', status: 'Paid' },
  { id: 'CP-8035', buyer: 'Ivy Cole', email: 'ivy@cole.design', product: 'Cashflow OS', amount: 19, date: '4 hrs ago', when: '2026-10-21T07:41:00Z', status: 'Paid' },
  { id: 'CP-8034', buyer: 'Noor Haddad', email: 'noor@haddad.co', product: 'Nexus UI Kit', amount: 49, date: '5 hrs ago', when: '2026-10-21T06:33:00Z', status: 'Paid' },
]

export const revenueSeries = [
  310, 280, 365, 340, 410, 388, 455, 430, 482, 460, 520, 498, 545, 610, 588, 640, 615, 690, 658,
  712, 700, 748, 720, 785, 760, 822, 804, 860, 842, 905,
]

export const dashboardProducts = [
  { id: 'nexus-ui', name: 'Nexus UI Kit', price: 49, sales: 1284, revenue: 62916, status: 'Live', tone: 'lime', glyph: '◈' },
  { id: 'cashflow-os', name: 'Cashflow OS', price: 19, interval: 'month', sales: 523, revenue: 9937, status: 'Live', tone: 'mint', glyph: '◐' },
  { id: 'design-dispatch', name: 'Design Dispatch', price: 12, interval: 'month', sales: 286, revenue: 3432, status: 'Draft', tone: 'butter', glyph: '✉' },
]

export const payouts = [
  { id: 'PO-2210', amount: 1842.5, status: 'Paid', date: 'Oct 20, 2026', tag: '$mayamakes' },
  { id: 'PO-2209', amount: 2210.0, status: 'Paid', date: 'Oct 18, 2026', tag: '$mayamakes' },
  { id: 'PO-2208', amount: 1640.75, status: 'Paid', date: 'Oct 15, 2026', tag: '$mayamakes' },
  { id: 'PO-2207', amount: 1988.25, status: 'Paid', date: 'Oct 12, 2026', tag: '$mayamakes' },
]

export const webhooks = [
  { event: 'order.paid', url: 'https://mayamakes.co/api/cashport', status: 'Active', last: '2 min ago' },
  { event: 'subscription.created', url: 'https://mayamakes.co/api/cashport', status: 'Active', last: '18 min ago' },
  { event: 'license.issued', url: 'https://mayamakes.co/api/licenses', status: 'Active', last: '46 min ago' },
]

export const testimonials = [
  {
    quote:
      'I switched my checkout to Cashport on a Tuesday. By Friday I had more sales than my best Stripe month — and the money was already in my Cash App.',
    name: 'Maya Chen',
    role: 'Designer, 12.8k customers',
    initials: 'MC',
  },
  {
    quote:
      'The checkout is one scan. No card forms, no failed payments from people who lost their wallet. My conversion rate went up 31%.',
    name: 'Sam Rivera',
    role: 'Writer, $14k MRR',
    initials: 'SR',
  },
  {
    quote:
      'Licenses, webhooks, subscriptions, payouts — it is the developer platform I wanted to build and did not have to.',
    name: 'Amina Yusuf',
    role: 'Founder, Orbit Labs',
    initials: 'AY',
  },
]

export const steps = [
  {
    number: '01',
    title: 'Create your product',
    body: 'Upload files, write a description, set a price. One-time, subscription, or pay-what-you-want. Live in under two minutes.',
    icon: 'spark',
  },
  {
    number: '02',
    title: 'Share one Cash App checkout',
    body: 'Every product gets a clean checkout link and QR code. Customers scan, confirm in Cash App, and land back on your receipt.',
    icon: 'cash',
  },
  {
    number: '03',
    title: 'Get paid to your $cashtag',
    body: 'Payments settle to your Cash App balance. Cashport handles delivery, licenses, receipts, refunds, and the API.',
    icon: 'zap',
  },
]

export function formatMoney(value, interval) {
  const whole = Number.isInteger(value) ? value : value.toFixed(2)
  return `$${whole}${interval ? `/${interval}` : ''}`
}

export function formatCompact(value) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}m`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`
  return String(value)
}
