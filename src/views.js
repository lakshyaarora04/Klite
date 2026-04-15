// ═══════════════════════════════════════════
// INVENTORY EXCHANGE — View Renderers
// Each function returns HTML for a view
// ═══════════════════════════════════════════
import { PRODUCTS, CATEGORIES, NEGOTIATIONS, ORDERS, VENDORS } from './data.js';
import { predictProductSignals } from './aiModels.js';

export function renderBrowse(filter = '') {
  const filtered = filter ? PRODUCTS.filter(p => p.category === filter) : PRODUCTS;
  return `
    <div class="browse-page">
      <div class="browse-hero animate-in">
        <h1>The Hyperlocal<br>B2B Exchange.</h1>
        <p>Optimize your supply chain by discovering essential surplus from verified local partners. High-quality inventory, reduced logistics, sustainable growth.</p>
      </div>

      <div class="category-grid">
        ${CATEGORIES.map((c, i) => `
          <div class="category-card animate-in animate-in-delay-${i+1}" data-action="filter-category" data-category="${c.id}">
            <img src="${c.image}" alt="${c.name}" loading="lazy" />
            <div class="overlay">
              <span class="label-text">Category</span>
              <h3>${c.name}</h3>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="search-bar animate-in animate-in-delay-3">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" id="browse-search" placeholder="Find by SKU, material, or provider..." />
        <div class="filter-chip" data-action="filter-chip" data-filter="distance">📍 Within 50km</div>
        <div class="filter-chip" data-action="filter-chip" data-filter="price">💰 Price Range</div>
        <div class="filter-chip active" data-action="filter-chip" data-filter="more">☰ More Filters</div>
      </div>

      <div class="product-grid" id="product-grid">
        ${filtered.map((p, i) => renderProductCard(p, i)).join('')}
      </div>

      <button class="fab" id="fab-add" aria-label="Add Listing" title="List New Inventory">+</button>
    </div>
  `;
}

export function renderProductCard(p, i = 0) {
  return `
    <div class="product-card animate-in animate-in-delay-${(i % 4) + 1}" data-action="view-product" data-product-id="${p.id}">
      <div class="img-wrap">
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
        <span class="badge ${p.badgeClass}">${p.badge}</span>
      </div>
      <div class="card-body">
        <div class="card-row">
          <span class="product-title">${p.name}</span>
          <span class="product-price">${p.currency}${p.price.toLocaleString()}<span>/${p.unit}</span></span>
        </div>
        <div class="product-location">📍 ${p.location}</div>
        <div class="card-footer">
          <div>
            <div class="stock-label">Current Stock</div>
            <div class="stock-value">${p.stock}</div>
          </div>
          <button class="btn-secondary btn-sm" data-action="negotiate-product" data-product-id="${p.id}">Negotiate</button>
        </div>
      </div>
    </div>
  `;
}

export function renderProductDetail(productId) {
  const p = PRODUCTS.find(x => x.id === productId) || PRODUCTS[0];
  const signals = predictProductSignals(p);
  const deltaLabel = `${signals.deltaPct > 0 ? '+' : ''}${signals.deltaPct}%`;
  const specEntries = Object.entries(p.specs);
  const chartData = [
    { label: '01 Oct', light: 55, dark: 48 },
    { label: '08 Oct', light: 62, dark: 58 },
    { label: '15 Oct', light: 50, dark: 60 },
    { label: '22 Oct', light: 45, dark: 52 },
    { label: 'Today', light: 40, dark: 85 }
  ];

  return `
    <div class="product-detail">
      <div class="breadcrumb animate-in">
        <a href="#" data-navigate="browse">Commodities</a>
        <span class="sep">›</span>
        <a href="#" data-navigate="browse">${CATEGORIES.find(c => c.id === p.category)?.name || 'All'}</a>
        <span class="sep">›</span>
        <span>${p.name}</span>
      </div>

      <div class="detail-grid">
        <div class="detail-gallery animate-in">
          <img src="${p.image}" alt="${p.name}" class="main-img" id="main-product-img" />
          <div class="thumb-row">
            <img src="${p.image}" alt="thumb 1" class="thumb active" data-action="set-thumb" />
            <img src="${p.image}" alt="thumb 2" class="thumb" data-action="set-thumb" style="filter: brightness(0.9) saturate(1.2);" />
            <img src="${p.image}" alt="thumb 3" class="thumb" data-action="set-thumb" style="filter: hue-rotate(15deg);" />
          </div>
        </div>

        <div class="detail-info animate-in animate-in-delay-1">
          <div class="badge-row">
            <span class="badge ${p.badgeClass}">${p.badge}</span>
            <span class="location">📍 ${p.location}</span>
          </div>
          <h1>${p.name}</h1>
          <div class="price">${p.currency}${p.price.toLocaleString()} <span>/ ${p.unit}</span></div>

          <div class="vendor-row" data-action="view-vendor">
            <div class="vendor-avatar">${p.vendor.initials}</div>
            <div>
              <div class="vendor-name">${p.vendor.name}</div>
              <div class="vendor-rating">⭐ ${p.vendor.rating} (${p.vendor.trades} trades)</div>
            </div>
            <button class="btn-tertiary btn-sm" style="margin-left:auto;">View Store</button>
          </div>

          <div class="action-row">
            <button class="btn-primary" data-action="buy-now" data-product-id="${p.id}">🛒 Buy Now</button>
            <button class="btn-secondary" data-action="negotiate-product" data-product-id="${p.id}">✨ Bargain</button>
            <button class="btn-tertiary" data-action="sell-similar">📋 Sell Similar</button>
          </div>

          <div class="specs-grid">
            ${specEntries.map(([k, v]) => `
              <div class="spec-card">
                <div class="spec-label">${k}</div>
                <div class="spec-value">${v}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="market-analysis animate-in animate-in-delay-2">
        <div class="chart-header">
          <div>
            <h2>Market Analysis</h2>
            <div class="subtitle">Price movement for ${p.name} over 30 days</div>
          </div>
          <div class="trend-badges">
            <span class="badge badge-ready">Trend: ${signals.trend}</span>
            <span class="badge badge-new">${deltaLabel} weekly forecast</span>
            <span class="badge badge-verified" style="background: linear-gradient(45deg, #10b981, #059669); color: white; border: none; box-shadow: 0 2px 8px rgba(16,185,129,0.2);">✨ Cortex AI: ${signals.confidence}% confidence | Demand ${signals.demandIndex}/100</span>
          </div>
        </div>
        <div class="chart-container" id="price-chart">
          ${chartData.map(d => `
            <div class="chart-bar-group">
              <div class="chart-bar-pair">
                <div class="chart-bar light" style="height: ${d.light}%" data-value="${d.light}">
                  <div class="chart-tooltip">${p.currency}${Math.round(p.price * d.light / 100)}</div>
                </div>
                <div class="chart-bar ${d.label === 'Today' ? 'highlight' : 'dark'}" style="height: ${d.dark}%" data-value="${d.dark}">
                  <div class="chart-tooltip">Now: ${p.currency}${Math.round(p.price * d.dark / 100)}</div>
                </div>
              </div>
              <span class="chart-label">${d.label}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="detail-bottom animate-in animate-in-delay-3">
        <div class="detail-section">
          <h3>Logistics & Compliance</h3>
          <div class="info-item">
            <div class="info-item-icon">🚚</div>
            <div>
              <div class="info-item-title">Shipping Terms</div>
              <div class="info-item-desc">Free delivery within Pune city limits. Express PCMC & outskirts available. Estimated delivery 1-2 business days.</div>
            </div>
          </div>
          <div class="info-item">
            <div class="info-item-icon">✅</div>
            <div>
              <div class="info-item-title">Certifications</div>
              <div class="info-item-desc">FSSAI Certified. ISO 22000 Compliant. Lab and quality certificates provided on order.</div>
            </div>
          </div>
        </div>
        <div class="detail-section">
          <h3>Product Story</h3>
          <p class="story-text">${p.description}</p>
          <div class="metric-row">
            <div class="metric-card">
              <div class="metric-value">A+</div>
              <div class="metric-label">Quality Index</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">350s</div>
              <div class="metric-label">Process Time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderNegotiation() {
  const neg = NEGOTIATIONS[0];
  const p = PRODUCTS.find(x => x.id === neg.productId) || PRODUCTS[3];

  return `
    <div class="negotiate-layout">
      <div class="negotiate-sidebar">
        <div class="neg-product-card animate-in">
          <div class="neg-product-header">
            <div class="neg-product-icon">📦</div>
            <div>
              <div style="font: var(--headline-sm);">${p.name}</div>
              <div style="font: var(--body-sm); color: var(--on-surface-variant);">Batch ${p.specs.Batch || p.specs['Batch'] || '#XC-9001'}</div>
            </div>
          </div>
          <div class="neg-product-img" style="position:relative;">
            <img src="${p.image}" alt="${p.name}" style="width:100%;height:180px;object-fit:cover;border-radius:var(--radius-sm);" />
            <span class="badge badge-verified" style="position:absolute;top:0.75rem;left:0.75rem;">LOCAL VERIFIED</span>
          </div>
          <div class="neg-price-section">
            <div class="neg-price-label">List Price</div>
            <div class="neg-price-value">${p.currency}${p.price.toLocaleString()}.00</div>
          </div>
          <div class="neg-qty-section">
            <div class="neg-price-label">Quantity</div>
            <div style="font: var(--headline-sm); margin-top: 0.15rem;">${p.stock}</div>
          </div>
          <div class="neg-terms">
            <h4>ℹ️ Deal Terms</h4>
            <div class="terms-row"><span class="terms-label">Shipping</span><span class="terms-value">Free (Pune City)</span></div>
            <div class="terms-row"><span class="terms-label">Payment</span><span class="terms-value">Net 15</span></div>
            <div class="terms-row"><span class="terms-label">Lead Time</span><span class="terms-value">1 Business Day</span></div>
          </div>
        </div>
      </div>

      <div class="negotiate-chat animate-in animate-in-delay-1">
        <div class="chat-header">
          <div class="chat-header-left">
            <div class="chat-avatar green">${neg.vendorInitials}</div>
            <div>
              <div class="chat-vendor-name">Negotiation with ${neg.vendor}</div>
              <div class="chat-status">Active Session</div>
            </div>
          </div>
          <div class="chat-id">ID: ${neg.id}</div>
        </div>

        <div class="chat-messages" id="chat-messages">
          <div class="chat-date">Negotiation Started — ${neg.messages[0].date}</div>
          ${neg.messages.map(m => renderMessage(m, neg.vendor)).join('')}
        </div>

        <div class="chat-actions">
          <button class="btn-primary" id="btn-accept-offer" data-action="accept-offer">✅ Accept Offer</button>
          <button class="btn-secondary" id="btn-counter" data-action="counter-offer">✏️ Counter</button>
          <button class="btn-tertiary" id="btn-ai-suggest" data-action="ai-suggest" style="border-color:#10b981; color:#059669;">✨ Auto-Counter</button>
          <button class="btn-tertiary" id="btn-decline" data-action="decline-offer" style="margin-left:auto;">❌ Decline</button>
        </div>
      </div>
    </div>
  `;
}

function renderMessage(m, vendorName) {
  const isYou = m.sender === 'you';
  return `
    <div class="msg-group" style="display:flex;flex-direction:column;${isYou ? 'align-items:flex-end;' : ''}">
      <div class="msg-sender">${isYou ? '' : vendorName + ' '}<span class="time">${m.time}</span>${isYou ? ' <strong>Your Proposal</strong>' : ''}</div>
      <div class="msg-bubble ${isYou ? 'outgoing' : 'incoming'}">
        <div class="msg-price">${isYou ? '🏷️' : '💵'} ₹${m.price.toLocaleString()}.00 ${m.isNew ? '<span class="badge badge-new" style="font-size:0.65rem;">NEW OFFER</span>' : ''}</div>
        <div class="msg-text">${m.text}</div>
      </div>
      ${isYou ? '<div class="msg-status">✓✓ Delivered & Read</div>' : ''}
    </div>
  `;
}

export function renderLogistics(orderId) {
  // Dynamic: pick order from data, default to first
  const order = orderId ? ORDERS.find(o => o.id === orderId) : ORDERS[0];
  const subtotal = order?.subtotal || 0;
  const logistics = order?.logistics || 0;
  const total = subtotal + logistics;
  const displayId = order?.id || 'IX-50412';
  const productName = order?.product || 'Refined Sunflower Oil';

  return `
    <div class="logistics-page">
      <div class="logistics-hero animate-in">
        <span class="badge badge-success">✅ Transaction Secured</span>
        <h1>The deal is closed.</h1>
        <p>Order <strong>#${displayId}</strong> has been finalized. Your logistics partner is already on the move.</p>
      </div>

      <div class="logistics-grid">
        <div class="map-card animate-in animate-in-delay-1">
          <div class="map-placeholder" id="logistics-map">
            <canvas id="map-canvas"></canvas>
            <div class="map-driver-badge">
              <div class="driver-avatar">RK</div>
              <div>
                <div class="driver-name">Rajesh Kulkarni</div>
                <div class="driver-role">Logistics Specialist</div>
              </div>
              <div class="eta-badge">
                <div class="eta-label">Estimated Arrival</div>
                <div class="eta-value" id="eta-time">14:20 PM</div>
              </div>
            </div>
          </div>
          <div class="map-actions">
            <button class="btn-primary" data-action="contact-driver">📞 Contact Driver</button>
            <button class="btn-secondary" data-action="view-route">🗺️ View Route</button>
          </div>
        </div>

        <div class="logistics-sidebar">
          <div class="logistics-info-card animate-in animate-in-delay-2">
            <h3>Order Logistics</h3>
            <div class="logistics-detail-item">
              <div class="logistics-detail-icon">🚛</div>
              <div>
                <div class="logistics-detail-label">Carrier</div>
                <div class="logistics-detail-value">Pune Express Logistics</div>
              </div>
            </div>
            <div class="logistics-detail-item">
              <div class="logistics-detail-icon">📦</div>
              <div>
                <div class="logistics-detail-label">Product</div>
                <div class="logistics-detail-value">${productName}</div>
              </div>
            </div>
            <div class="logistics-detail-item">
              <div class="logistics-detail-icon">📍</div>
              <div>
                <div class="logistics-detail-label">Drop-off</div>
                <div class="logistics-detail-value">Kothrud Warehouse, Pune</div>
              </div>
            </div>
          </div>

          <div class="financial-card animate-in animate-in-delay-3">
            <h3>Financial Summary</h3>
            <div class="financial-row"><span>Subtotal</span><span>₹${subtotal.toLocaleString('en-IN')}</span></div>
            <div class="financial-row"><span>Logistics Fee</span><span>₹${logistics.toLocaleString('en-IN')}</span></div>
            <div class="financial-row"><span>GST (18%)</span><span>₹${Math.round(subtotal * 0.18).toLocaleString('en-IN')}</span></div>
            <div class="financial-total">
              <span class="label">Total Paid</span>
              <span class="value">₹${(total + Math.round(subtotal * 0.18)).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="timeline-section animate-in animate-in-delay-3">
        <h2>Shipment Timeline</h2>
        <div class="timeline-grid">
          <div class="timeline-list">
            <div class="timeline-item">
              <div class="timeline-dot complete"></div>
              <div class="timeline-content">
                <div class="timeline-title">Pickup Complete</div>
                <div class="timeline-desc">Departed from Pimpri-Chinchwad warehouse</div>
              </div>
              <div class="timeline-time">12:45 PM</div>
            </div>
            <div class="timeline-item">
              <div class="timeline-dot complete"></div>
              <div class="timeline-content">
                <div class="timeline-title">Transit — Hinjewadi Bypass</div>
                <div class="timeline-desc">Crossed Wakad checkpoint, en route to Kothrud</div>
              </div>
              <div class="timeline-time">13:12 PM</div>
            </div>
            <div class="timeline-item">
              <div class="timeline-dot pending" id="dot-arrival"></div>
              <div class="timeline-content">
                <div class="timeline-title" style="color: var(--outline);">Destination Arrival</div>
                <div class="timeline-desc">Kothrud warehouse final scanning</div>
              </div>
              <div class="timeline-time" style="color:var(--outline);">Pending</div>
            </div>
          </div>

          <div class="docs-card animate-in animate-in-delay-4">
            <div class="doc-icon">📋</div>
            <h3>Digital Documents Ready</h3>
            <p>Download your manifest, GST invoice, and verified quality certificates.</p>
            <button class="btn-primary" data-action="download-docs">⬇️ Download PDF Pack</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderOffice() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const bestProduct = PRODUCTS
    .map(product => ({ product, signals: predictProductSignals(product) }))
    .sort((a, b) => b.signals.deltaPct - a.signals.deltaPct)[0];

  return `
    <div class="office-page">
      <div class="office-welcome animate-in">
        <div class="greeting">${greeting}, Deepak</div>
        <h1>Your Office</h1>
      </div>

      <div class="stats-grid">
        <div class="stat-card animate-in animate-in-delay-1">
          <div class="stat-icon">📊</div>
          <div class="stat-value" data-counter="47">0</div>
          <div class="stat-label">Active Listings</div>
          <div class="stat-change up">↑ 12% this week</div>
        </div>
        <div class="stat-card animate-in animate-in-delay-2">
          <div class="stat-icon">🤝</div>
          <div class="stat-value" data-counter="12">0</div>
          <div class="stat-label">Open Negotiations</div>
          <div class="stat-change up">↑ 3 new today</div>
        </div>
        <div class="stat-card animate-in animate-in-delay-3">
          <div class="stat-icon">💰</div>
          <div class="stat-value" data-counter="7" data-prefix="₹" data-suffix=".4L">₹0L</div>
          <div class="stat-label">Monthly Revenue</div>
          <div class="stat-change up">↑ 23% MoM</div>
        </div>
        <div class="stat-card animate-in animate-in-delay-4">
          <div class="stat-icon">⭐</div>
          <div class="stat-value">4.8</div>
          <div class="stat-label">Vendor Rating</div>
          <div class="stat-change up">↑ Excellent</div>
        </div>
      </div>

      <div class="office-grid">
        <div class="recent-orders animate-in animate-in-delay-2">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
            <h2>Recent Orders</h2>
            <button class="btn-tertiary btn-sm" data-navigate="browse">View All</button>
          </div>
          ${ORDERS.map(o => `
            <div class="order-item" data-action="view-order" data-order-id="${o.id}">
              <img src="${o.image}" alt="${o.product}" class="order-img" />
              <div class="order-info">
                <div class="order-name">${o.product}</div>
                <div class="order-detail">${o.vendor} · #${o.id}</div>
              </div>
              <div>
                <div class="order-amount">${o.amount}</div>
                <div class="order-status"><span class="badge ${o.statusClass}" style="font-size:0.6rem;">${o.status}</span></div>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="quick-actions animate-in animate-in-delay-3">
          <div class="quick-action-card" data-navigate="browse">
            <h3>🔍 Browse Market</h3>
            <p>Discover new surplus inventory from verified local vendors.</p>
          </div>
          <div class="quick-action-card" data-action="new-listing">
            <h3>📦 New Listing</h3>
            <p>List your surplus stock and connect with buyers.</p>
          </div>
          <div class="quick-action-card" data-navigate="negotiate">
            <h3>🤝 Active Deals</h3>
            <p>Resume ongoing negotiations and close pending offers.</p>
          </div>
          <div class="quick-action-card" data-navigate="logistics">
            <h3>🚚 Track Shipments</h3>
            <p>Monitor deliveries and access shipping documents.</p>
          </div>
          <div class="quick-action-card" style="background: linear-gradient(145deg, #f0fdf4, #e8f5e9); border: 1px solid #bbf7d0;">
            <h3 style="color:#059669;">✨ Cortex AI Insights</h3>
            <p>Model signal: <strong>${bestProduct.product.name}</strong> has a projected ${bestProduct.signals.deltaPct > 0 ? 'price rise' : 'price drop'} of <strong>${bestProduct.signals.deltaPct > 0 ? '+' : ''}${bestProduct.signals.deltaPct}%</strong> next week with ${bestProduct.signals.confidence}% confidence. <a href="#" style="color:#10b981; font-weight:bold; display:block; margin-top:0.5rem;" data-action="view-product" data-product-id="${bestProduct.product.id}">Action Insight →</a></p>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderNetwork() {
  return `
    <div class="network-page">
      <div class="network-header animate-in">
        <h1>Your Network</h1>
        <p>Verified partners in your hyperlocal supply chain ecosystem.</p>
      </div>
      <div class="vendor-grid">
        ${VENDORS.map((v, i) => `
          <div class="vendor-card animate-in animate-in-delay-${(i % 4) + 1}">
            <div class="v-avatar">${v.initials}</div>
            <div class="v-name">${v.name}</div>
            <div class="v-type">${v.type}</div>
            ${v.verified ? '<span class="badge badge-verified" style="margin-bottom:0.75rem;">VERIFIED</span>' : '<span class="badge badge-pending" style="margin-bottom:0.75rem;">PENDING</span>'}
            <div class="v-stats">
              <div><div class="v-stat-value">${v.trades.toLocaleString()}</div><div class="v-stat-label">Trades</div></div>
              <div><div class="v-stat-value">⭐ ${v.rating}</div><div class="v-stat-label">Rating</div></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
