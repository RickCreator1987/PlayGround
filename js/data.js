export const seedProducts = [
  { id: 'shipfast', name: 'Ship Fast — Next.js Course', type: 'Digital download', price: 149, sales: 214, revenue: 31886, active: true, art: 'art-ink', mark: 'JS', desc: 'A project-based course for shipping production Next.js apps without the fluff. Six hours of build-along lessons, a production codebase and lifetime updates.', includes: ['42 video lessons', 'Production codebase', 'Lifetime updates', 'Private Discord'], keys: 214 },
  { id: 'uikit', name: 'Cashly UI Kit', type: 'Digital download', price: 79, sales: 342, revenue: 27018, active: true, art: 'art-lilac', mark: 'UI', desc: 'A 240-component Figma library with auto-layout, variables and a matching Tailwind preset. Built for shipping commerce interfaces fast.', includes: ['240 Figma components', 'Tailwind preset', 'Light and dark themes', 'Commercial license'], keys: 342 },
  { id: 'playbook', name: 'Indie Launch Playbook', type: 'Ebook', price: 29, sales: 512, revenue: 14848, active: true, art: 'art-orange', mark: 'IP', desc: 'The 180-page field guide to launching a paid digital product to your first 1,000 customers. Templates, scripts and launch checklists included.', includes: ['180-page PDF', 'Launch checklist', 'Email scripts', 'Notion workspace'], keys: 512 },
  { id: 'pro', name: 'Creator Pro', type: 'Membership', price: 19, sales: 186, revenue: 3534, active: true, art: 'art-green', mark: 'PRO', desc: 'A monthly membership for indie builders. Weekly office hours, teardown videos and a private community of 1,200 creators.', includes: ['Weekly office hours', 'Private community', 'Member teardowns', 'Cancel anytime'], keys: 186 },
  { id: 'audit', name: '1:1 Design Audit', type: 'Service', price: 250, sales: 24, revenue: 6000, active: true, art: 'art-blue', mark: 'DA', desc: 'A 60-minute teardown of your product with a written action plan. Includes a Loom walkthrough and a prioritized fix list.', includes: ['60-minute call', 'Loom teardown', 'Prioritized fix list', '7-day follow-up'], keys: 0 },
  { id: 'icons', name: 'Pixel Icon Pack', type: 'Digital download', price: 12, sales: 921, revenue: 11052, active: false, art: 'art-pink', mark: 'PX', desc: '1,200 hand-drawn 24px icons in outline and solid styles. Ships as SVG, React components and a Figma library.', includes: ['1,200 icons', 'SVG and React', 'Figma library', 'Free updates'], keys: 921 },
];

export const seedOrders = [
  { id: '1042', name: 'Jordan Lee', email: 'jordan@hey.com', product: 'Ship Fast — Next.js Course', amount: 149, status: 'paid', ref: 'CA-9F2K7Q', date: 'Oct 21, 10:42', cashtag: '$jordanlee', license: 'CASHLY-9F2K-7Q4M-2026', note: 'Paid with Cash App balance' },
  { id: '1041', name: 'Priya Shah', email: 'priya@studio.co', product: 'Cashly UI Kit', amount: 79, status: 'paid', ref: 'CA-4M8R1Z', date: 'Oct 21, 09:18', cashtag: '$priyashah', license: 'CASHLY-4M8R-1Z6T-2026', note: 'Paid with Cash App balance' },
  { id: '1040', name: 'Marcus Webb', email: 'marcus@webb.dev', product: 'Creator Pro', amount: 19, status: 'pending', ref: 'CA-7Q2L9V', date: 'Oct 21, 08:55', cashtag: '$marcuswebb', license: '', note: 'Cash App request sent' },
  { id: '1039', name: 'Ana Torres', email: 'ana@torres.studio', product: 'Indie Launch Playbook', amount: 29, status: 'paid', ref: 'CA-1V6N3B', date: 'Oct 20, 21:07', cashtag: '$anatorres', license: 'CASHLY-1V6N-3B8K-2026', note: 'Paid with Cash App balance' },
  { id: '1038', name: 'Liam Chen', email: 'liam@northline.io', product: '1:1 Design Audit', amount: 250, status: 'paid', ref: 'CA-8K3D5H', date: 'Oct 20, 18:32', cashtag: '$liamchen', license: 'CASHLY-8K3D-5H2P-2026', note: 'Paid with linked debit card' },
  { id: '1037', name: 'Sofia Reyes', email: 'sofia@reyes.design', product: 'Pixel Icon Pack', amount: 12, status: 'refunded', ref: 'CA-5T9W2C', date: 'Oct 20, 16:11', cashtag: '$sofiareyes', license: 'CASHLY-5T9W-2C7R-2026', note: 'Refunded to Cash App' },
  { id: '1036', name: 'Noah Kim', email: 'noah@kim.co', product: 'Ship Fast — Next.js Course', amount: 149, status: 'paid', ref: 'CA-3B7J6M', date: 'Oct 20, 14:48', cashtag: '$noahkim', license: 'CASHLY-3B7J-6M9X-2026', note: 'Paid with Cash App balance' },
  { id: '1035', name: 'Emma Novak', email: 'emma@novak.io', product: 'Cashly UI Kit', amount: 79, status: 'paid', ref: 'CA-6R1F4Q', date: 'Oct 20, 11:26', cashtag: '$emmanovak', license: 'CASHLY-6R1F-4Q8D-2026', note: 'Paid with Cash App balance' },
];

export const seedCustomers = [
  { name: 'Jordan Lee', email: 'jordan@hey.com', cashtag: '$jordanlee', orders: 6, ltv: 684, last: 'Oct 21, 2026', status: 'Returning' },
  { name: 'Priya Shah', email: 'priya@studio.co', cashtag: '$priyashah', orders: 4, ltv: 316, last: 'Oct 21, 2026', status: 'Returning' },
  { name: 'Marcus Webb', email: 'marcus@webb.dev', cashtag: '$marcuswebb', orders: 2, ltv: 48, last: 'Oct 21, 2026', status: 'New' },
  { name: 'Ana Torres', email: 'ana@torres.studio', cashtag: '$anatorres', orders: 8, ltv: 842, last: 'Oct 20, 2026', status: 'Returning' },
  { name: 'Liam Chen', email: 'liam@northline.io', cashtag: '$liamchen', orders: 3, ltv: 406, last: 'Oct 20, 2026', status: 'Returning' },
  { name: 'Sofia Reyes', email: 'sofia@reyes.design', cashtag: '$sofiareyes', orders: 5, ltv: 251, last: 'Oct 20, 2026', status: 'Returning' },
  { name: 'Noah Kim', email: 'noah@kim.co', cashtag: '$noahkim', orders: 1, ltv: 149, last: 'Oct 20, 2026', status: 'New' },
  { name: 'Emma Novak', email: 'emma@novak.io', cashtag: '$emmanovak', orders: 2, ltv: 158, last: 'Oct 20, 2026', status: 'Returning' },
];

export const seedPayouts = [
  { id: 'PO-8841', date: 'Oct 17, 2026', amount: 1840.2, dest: '$cashlyhq', ref: 'CA-P-88213', status: 'paid' },
  { id: 'PO-8820', date: 'Oct 10, 2026', amount: 2105.75, dest: '$cashlyhq', ref: 'CA-P-88104', status: 'paid' },
  { id: 'PO-8796', date: 'Oct 3, 2026', amount: 1562.4, dest: '$cashlyhq', ref: 'CA-P-88021', status: 'paid' },
  { id: 'PO-8771', date: 'Sep 26, 2026', amount: 980.1, dest: '$cashlyhq', ref: 'CA-P-87944', status: 'paid' },
];

export const chartData = {
  '7d': { value: '$5,020.40', delta: '+9.8%', labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], values: [1640, 2120, 1880, 2540, 2320, 3010, 2860] },
  '30d': { value: '$18,420.00', delta: '+12.4%', labels: ['Sep 22', 'Sep 25', 'Sep 28', 'Oct 1', 'Oct 4', 'Oct 7', 'Oct 10', 'Oct 13', 'Oct 16', 'Oct 19', 'Oct 21'], values: [760, 980, 840, 1240, 1080, 1420, 1310, 1620, 1510, 1840, 2100] },
  '90d': { value: '$48,210.60', delta: '+31.2%', labels: ['Aug', 'Aug', 'Sep', 'Sep', 'Sep', 'Oct', 'Oct', 'Oct', 'Oct', 'Oct', 'Oct'], values: [2900, 3120, 3860, 4020, 3980, 4210, 4650, 4520, 4980, 5120, 5480] },
};
