// ═══════════════════════════════════════════
// INVENTORY EXCHANGE — Data Store
// Simulated data for all views (Pune region)
// ═══════════════════════════════════════════

export const PRODUCTS = [
  {
    id: 'basmati-rice-001',
    name: 'Premium Basmati Rice',
    price: 2400, unit: '25kg bag', currency: '₹',
    image: '/images/rice_bags.png',
    badge: 'READY TO SHIP', badgeClass: 'badge-ready',
    location: 'Chakan MIDC, Pune (8.2 km away)',
    stock: '500 Bags',
    category: 'groceries',
    vendor: { name: 'Sahyadri Agro Traders', initials: 'SA', rating: 4.8, trades: '1,240' },
    specs: { 'Grain Length': '8.4mm', 'Aging': '2 Year Aged', 'Purity': '99.5%', 'Batch': '#BR-221' },
    description: 'Aged premium Basmati rice sourced from the foothills of the Himalayas. Double-polished for consistent grain quality, ideal for restaurants, caterers, and wholesale grocery retailers in the Pune region.'
  },
  {
    id: 'copier-paper-002',
    name: 'A4 Copier Paper (80 GSM)',
    price: 320, unit: 'ream', currency: '₹',
    image: '/images/office_paper.png',
    badge: 'BULK DEAL', badgeClass: 'badge-new',
    location: 'Hinjewadi Phase 2, Pune (5.1 km away)',
    stock: '4,000 Reams',
    category: 'stationery',
    vendor: { name: 'Pune Office Supplies', initials: 'PO', rating: 4.6, trades: '3,100' },
    specs: { 'GSM': '80 GSM', 'Brightness': '95%', 'Sheets': '500/ream', 'Batch': '#AP-650' },
    description: 'Premium quality A4 copier paper suitable for laser and inkjet printers. High brightness and smooth finish. Bulk pricing available for offices, colleges, and print shops across Pune.'
  },
  {
    id: 'sunflower-oil-003',
    name: 'Refined Sunflower Oil',
    price: 1850, unit: '15L tin', currency: '₹',
    image: '/images/cooking_oil.png',
    badge: 'EXPIRING SOON', badgeClass: 'badge-expiring',
    location: 'Pimpri-Chinchwad (3.6 km away)',
    stock: '800 Tins',
    category: 'groceries',
    vendor: { name: 'Kanchi Foods Pvt. Ltd.', initials: 'KF', rating: 4.7, trades: '2,800' },
    specs: { 'Volume': '15 Litres', 'Type': 'Refined', 'FSSAI': 'Certified', 'Batch': '#SO-418' },
    description: 'FSSAI certified refined sunflower oil in commercial 15L tins. Light, healthy, and ideal for commercial kitchens, restaurants, and hotel chains operating in the Pune metropolitan area.'
  },
  {
    id: 'detergent-004',
    name: 'Bulk Detergent Powder',
    price: 780, unit: '20kg bag', currency: '₹',
    image: '/images/soap_detergent.png',
    badge: 'LOCAL VERIFIED', badgeClass: 'badge-verified',
    location: 'Hadapsar Industrial Estate (11.4 km away)',
    stock: '1,200 Bags',
    category: 'household',
    vendor: { name: 'CleanEdge Distributors', initials: 'CD', rating: 4.5, trades: '1,900' },
    specs: { 'Weight': '20 kg', 'Type': 'Active Clean', 'Fragrance': 'Lemon Fresh', 'Batch': '#DP-334' },
    description: 'Commercial-grade laundry detergent powder for hotels, laundries, and housekeeping services. High-foam formula effective in hard water conditions common in the Pune region.'
  },
  {
    id: 'spices-masala-005',
    name: 'Garam Masala Blend',
    price: 540, unit: 'kg', currency: '₹',
    image: '/images/spices_masala.png',
    badge: 'PRO SELLER', badgeClass: 'badge-verified',
    location: 'Market Yard, Pune (6.8 km away)',
    stock: '350 kg',
    category: 'groceries',
    vendor: { name: 'Shree Masala Works', initials: 'SM', rating: 4.9, trades: '4,500' },
    specs: { 'Blend': '12-Spice Mix', 'Grind': 'Fine Powder', 'Shelf Life': '12 months', 'Batch': '#GM-712' },
    description: 'Authentic Pune-style garam masala blend using 12 whole spices. Freshly ground in small batches for maximum aroma and flavor. Trusted by restaurants and caterers across Maharashtra.'
  }
];

export const CATEGORIES = [
  { id: 'groceries', name: 'Groceries & FMCG', image: '/images/agriculture_hero.png' },
  { id: 'stationery', name: 'Stationery & Office', image: '/images/packaging_hero.png' },
  { id: 'household', name: 'Household & Cleaning', image: '/images/raw_materials_hero.png' }
];

export const NEGOTIATIONS = [
  {
    id: 'NEG-4412',
    productId: 'sunflower-oil-003',
    vendor: 'Kanchi Foods Pvt. Ltd.',
    vendorInitials: 'KF',
    status: 'active',
    messages: [
      { sender: 'vendor', price: 1750, text: "We can offer ₹1,750 per 15L tin for a bulk order of 200+ tins. Delivery within Pune city free of charge.", time: '10:45 AM', date: 'Apr 14' },
      { sender: 'you', price: 1800, text: "We need 300 tins. Can do ₹1,800 per tin with payment on Net 15 terms. We'll handle logistics from your warehouse.", time: '11:15 AM', date: 'Apr 14' },
      { sender: 'vendor', price: 1780, text: '"₹1,780 per tin for 300 units, Net 15 payment. Final offer — we can dispatch from Pimpri warehouse tomorrow morning."', time: 'Just now', date: 'Apr 14', isNew: true }
    ]
  }
];

export const ORDERS = [
  { id: 'IX-50412', product: 'Refined Sunflower Oil', vendor: 'Kanchi Foods Pvt. Ltd.', amount: '₹18,500', status: 'In Transit', statusClass: 'badge-pending', image: '/images/cooking_oil.png', subtotal: 18500, logistics: 250 },
  { id: 'IX-50408', product: 'Premium Basmati Rice', vendor: 'Sahyadri Agro Traders', amount: '₹24,000', status: 'Delivered', statusClass: 'badge-success', image: '/images/rice_bags.png', subtotal: 24000, logistics: 180 },
  { id: 'IX-50405', product: 'A4 Copier Paper (80 GSM)', vendor: 'Pune Office Supplies', amount: '₹6,400', status: 'Processing', statusClass: 'badge-pending', image: '/images/office_paper.png', subtotal: 6400, logistics: 80 },
  { id: 'IX-50401', product: 'Garam Masala Blend', vendor: 'Shree Masala Works', amount: '₹2,700', status: 'Completed', statusClass: 'badge-success', image: '/images/spices_masala.png', subtotal: 2700, logistics: 50 }
];

export const VENDORS = [
  { name: 'Sahyadri Agro Traders', initials: 'SA', type: 'Rice & Grains Wholesale', trades: 1240, rating: 4.8, verified: true },
  { name: 'Pune Office Supplies', initials: 'PO', type: 'Stationery & Office Products', trades: 3100, rating: 4.6, verified: true },
  { name: 'Kanchi Foods Pvt. Ltd.', initials: 'KF', type: 'Cooking Oil & Edibles', trades: 2800, rating: 4.7, verified: true },
  { name: 'CleanEdge Distributors', initials: 'CD', type: 'Household & Cleaning', trades: 1900, rating: 4.5, verified: true },
  { name: 'Shree Masala Works', initials: 'SM', type: 'Spices & Condiments', trades: 4500, rating: 4.9, verified: true },
  { name: 'Deccan Paper Mills', initials: 'DP', type: 'Paper & Packaging', trades: 780, rating: 4.4, verified: false }
];

export const NOTIFICATIONS = [
  { id: 1, icon: '💰', iconClass: 'green', title: 'New Counter Offer', desc: 'Kanchi Foods sent ₹1,780/tin for Sunflower Oil', time: '2 min ago', unread: true },
  { id: 2, icon: '🚚', iconClass: 'blue', title: 'Shipment Update', desc: 'Order #IX-50412 crossed Lonavala checkpoint', time: '15 min ago', unread: true },
  { id: 3, icon: '✅', iconClass: 'green', title: 'Deal Closed', desc: 'Basmati Rice order delivered to Kothrud warehouse', time: '1 hour ago', unread: false },
  { id: 4, icon: '📦', iconClass: 'orange', title: 'Stock Alert', desc: 'Sunflower Oil batch expiring in 14 days', time: '3 hours ago', unread: false }
];
