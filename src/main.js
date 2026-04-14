// ═══════════════════════════════════════════
// INVENTORY EXCHANGE — Main Application
// SPA Router, Event Handlers, Real-time Sim
// ═══════════════════════════════════════════
import './style.css';
import { PRODUCTS, NOTIFICATIONS, ORDERS } from './data.js';
import {
  renderBrowse, renderProductDetail, renderNegotiation,
  renderLogistics, renderOffice, renderNetwork
} from './views.js';

// ── State ──
const state = {
  currentView: 'browse',
  notifications: [...NOTIFICATIONS],
  categoryFilter: '',
  searchQuery: ''
};

// ── DOM References ──
const appMain = document.getElementById('app-main');
const navLinks = document.querySelectorAll('.nav-link');
const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
const notifPanel = document.getElementById('notification-panel');
const notifList = document.getElementById('notif-list');
const notifDot = document.getElementById('notification-dot');
const profileDropdown = document.getElementById('profile-dropdown');
const modalOverlay = document.getElementById('modal-overlay');
const modalContent = document.getElementById('modal-content');
const toastContainer = document.getElementById('toast-container');

// ── Router ──
function navigate(view, params = {}) {
  state.currentView = view;
  closeAllDropdowns();

  let html = '';
  switch (view) {
    case 'browse': html = renderBrowse(state.categoryFilter); break;
    case 'product': html = renderProductDetail(params.productId); break;
    case 'negotiate': html = renderNegotiation(); break;
    case 'logistics': html = renderLogistics(params.orderId); break;
    case 'office': html = renderOffice(); break;
    case 'network': html = renderNetwork(); break;
    default: html = renderBrowse();
  }

  appMain.innerHTML = html;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  updateNavState(view);
  afterRender(view);
}

function updateNavState(view) {
  navLinks.forEach(l => {
    l.classList.toggle('active', l.dataset.navigate === view);
  });
  bottomNavItems.forEach(b => {
    const target = b.dataset.navigate;
    b.classList.toggle('active', target === view || (view === 'product' && target === 'browse'));
  });
}

function afterRender(view) {
  // Counter animations for office
  if (view === 'office') {
    setTimeout(() => animateCounters(), 300);
  }
  // Map canvas for logistics
  if (view === 'logistics') {
    setTimeout(() => drawMap(), 200);
    startEtaCountdown();
  }
  // Search handler for browse
  if (view === 'browse') {
    const searchInput = document.getElementById('browse-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.toLowerCase();
        filterProducts();
      });
    }
  }
}

// ── Counter Animation ──
function animateCounters() {
  document.querySelectorAll('[data-counter]').forEach(el => {
    const target = parseInt(el.dataset.counter);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    let current = 0;
    const step = Math.ceil(target / 30);
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      el.textContent = `${prefix}${current}${suffix}`;
    }, 40);
  });
}

// ── Map Drawing ──
function drawMap() {
  const canvas = document.getElementById('map-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.parentElement.offsetWidth;
  canvas.height = canvas.parentElement.offsetHeight;
  const w = canvas.width, h = canvas.height;

  // Background
  ctx.fillStyle = '#e8ede5';
  ctx.fillRect(0, 0, w, h);

  // Grid roads
  ctx.strokeStyle = '#d4ddd6';
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 60) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y < h; y += 60) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }

  // Main roads
  ctx.strokeStyle = '#c8d4cb';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(0, h * 0.3); ctx.lineTo(w, h * 0.6); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(w * 0.4, 0); ctx.lineTo(w * 0.5, h); ctx.stroke();

  // Green area
  ctx.fillStyle = 'rgba(180, 239, 214, 0.3)';
  ctx.beginPath();
  ctx.arc(w * 0.3, h * 0.5, 80, 0, Math.PI * 2);
  ctx.fill();

  // Truck dot (animated)
  let dotX = w * 0.35, dotY = h * 0.45;
  function animateDot() {
    ctx.fillStyle = '#e8ede5';
    ctx.fillRect(dotX - 12, dotY - 12, 24, 24);
    // Redraw roads over
    ctx.strokeStyle = '#d4ddd6'; ctx.lineWidth = 1;
    dotX += 0.3;
    dotY += 0.1 * Math.sin(dotX / 30);
    ctx.fillStyle = '#003426';
    ctx.beginPath();
    ctx.arc(dotX, dotY, 6, 0, Math.PI * 2);
    ctx.fill();
    // Pulse ring
    ctx.strokeStyle = 'rgba(0, 52, 38, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(dotX, dotY, 10 + Math.sin(Date.now() / 300) * 4, 0, Math.PI * 2);
    ctx.stroke();
    if (dotX < w * 0.7) requestAnimationFrame(animateDot);
  }
  animateDot();
}

// ── ETA Countdown ──
function startEtaCountdown() {
  const etaEl = document.getElementById('eta-time');
  if (!etaEl) return;
  let mins = 42;
  const interval = setInterval(() => {
    mins--;
    if (mins <= 0) { clearInterval(interval); mins = 0; }
    const h = 14, m = mins;
    etaEl.textContent = `${h}:${String(m).padStart(2, '0')} PM`;
    if (mins === 38) {
      const dot = document.getElementById('dot-arrival');
      if (dot) { dot.classList.remove('pending'); dot.classList.add('complete'); }
      showToast('📍 Destination arrival confirmed!', 'success');
    }
  }, 8000);
}

// ── Product Filtering ──
function filterProducts() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;
  let filtered = PRODUCTS;
  if (state.categoryFilter) filtered = filtered.filter(p => p.category === state.categoryFilter);
  if (state.searchQuery) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(state.searchQuery) ||
      p.vendor.name.toLowerCase().includes(state.searchQuery) ||
      p.location.toLowerCase().includes(state.searchQuery)
    );
  }
  grid.innerHTML = filtered.length > 0
    ? filtered.map((p, i) => {
        // Import inline to avoid circular
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
      }).join('')
    : '<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--outline);">No products match your search.</div>';
}

// ── Toast Notifications ──
function showToast(message, type = 'info') {
  const icons = { info: 'ℹ️', success: '✅', error: '❌', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span class="toast-icon">${icons[type]}</span><span>${message}</span>`;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// ── Notification Panel ──
function renderNotifications() {
  const unread = state.notifications.filter(n => n.unread).length;
  notifDot.classList.toggle('hidden', unread === 0);
  notifList.innerHTML = state.notifications.map(n => `
    <div class="notif-item ${n.unread ? 'unread' : ''}" data-notif-id="${n.id}">
      <div class="notif-icon ${n.iconClass}">${n.icon}</div>
      <div class="notif-body">
        <div class="notif-title">${n.title}</div>
        <div class="notif-desc">${n.desc}</div>
        <div class="notif-time">${n.time}</div>
      </div>
    </div>
  `).join('');
}

function closeAllDropdowns() {
  notifPanel.classList.add('hidden');
  profileDropdown.classList.add('hidden');
}

// ── Modal ──
function showModal(html) {
  modalContent.innerHTML = html;
  modalOverlay.classList.remove('hidden');
}
function closeModal() {
  modalOverlay.classList.add('hidden');
}

// ── Event Delegation ──
document.addEventListener('click', (e) => {
  const target = e.target.closest('[data-navigate]');
  if (target) {
    e.preventDefault();
    const view = target.dataset.navigate;
    state.categoryFilter = '';
    navigate(view);
    return;
  }

  const action = e.target.closest('[data-action]');
  if (action) {
    e.preventDefault();
    e.stopPropagation();
    handleAction(action.dataset.action, action.dataset);
    return;
  }

  // Notifications toggle
  if (e.target.closest('#nav-notifications')) {
    e.stopPropagation();
    profileDropdown.classList.add('hidden');
    notifPanel.classList.toggle('hidden');
    renderNotifications();
    return;
  }

  // Profile toggle
  if (e.target.closest('#nav-profile')) {
    e.stopPropagation();
    notifPanel.classList.add('hidden');
    profileDropdown.classList.toggle('hidden');
    return;
  }

  // Modal close
  if (e.target === modalOverlay) {
    closeModal();
    return;
  }

  // Close dropdowns on outside click
  if (!e.target.closest('.notification-panel') && !e.target.closest('.profile-dropdown')) {
    closeAllDropdowns();
  }
});

function handleAction(action, dataset) {
  switch (action) {
    case 'view-product':
      navigate('product', { productId: dataset.productId });
      break;

    case 'negotiate-product':
      showToast('Starting negotiation session...', 'info');
      setTimeout(() => navigate('negotiate'), 600);
      break;

    case 'buy-now':
      showModal(`
        <div class="counter-modal">
          <h2>🛒 Confirm Purchase</h2>
          <p style="margin-bottom:1rem;color:var(--on-surface-variant);">You're about to purchase this item. The vendor will be notified immediately.</p>
          <div style="background:var(--surface-container-low);border-radius:var(--radius-sm);padding:1rem;margin-bottom:1rem;">
            <div style="font:var(--headline-md);color:var(--primary);">₹${PRODUCTS.find(p => p.id === dataset.productId)?.price.toLocaleString('en-IN') || '0'}.00</div>
            <div style="font:var(--body-sm);color:var(--outline);margin-top:0.25rem;">+ GST & logistics fees apply</div>
          </div>
          <div class="input-group">
            <label>Quantity</label>
            <input type="number" id="buy-qty" class="input-field" value="10" min="1" max="1000" />
          </div>
          <div class="btn-row">
            <button class="btn-primary" data-action="confirm-purchase" data-product-id="${dataset.productId}">Confirm Order</button>
            <button class="btn-tertiary" onclick="document.getElementById('modal-overlay').classList.add('hidden')">Cancel</button>
          </div>
        </div>
      `);
      break;

    case 'confirm-purchase': {
      closeModal();
      const p = PRODUCTS.find(x => x.id === dataset.productId) || PRODUCTS[0];
      const qty = parseInt(document.getElementById('buy-qty')?.value || '10');
      const subtotal = p.price * qty;
      const newOrderId = 'IX-' + Math.floor(10000 + Math.random() * 90000);
      
      ORDERS.unshift({
        id: newOrderId, product: p.name, vendor: p.vendor.name, 
        amount: '₹' + subtotal.toLocaleString('en-IN'), status: 'In Transit', 
        statusClass: 'badge-pending', image: p.image, subtotal: subtotal, logistics: 350
      });

      showToast('Order placed successfully! Redirecting to logistics...', 'success');
      setTimeout(() => navigate('logistics', { orderId: newOrderId }), 1500);
      break;
    }

    case 'accept-offer': {
      const newOrderId = 'IX-' + Math.floor(10000 + Math.random() * 90000);
      const subtotal = 1780 * 10;
      ORDERS.unshift({
        id: newOrderId, product: 'Refined Sunflower Oil', vendor: 'Kanchi Foods Pvt. Ltd.', 
        amount: '₹' + subtotal.toLocaleString('en-IN'), status: 'In Transit', 
        statusClass: 'badge-pending', image: '/images/cooking_oil.png', subtotal: subtotal, logistics: 350
      });
      showToast('🎉 Offer accepted! Deal closed at ₹1,780/tin', 'success');
      setTimeout(() => navigate('logistics', { orderId: newOrderId }), 1500);
      break;
    }

    case 'counter-offer':
      showModal(`
        <div class="counter-modal">
          <h2>✏️ Counter Offer</h2>
          <div class="current-offer">Current offer from Kanchi Foods: <strong>₹1,780/tin</strong></div>
          <div class="input-group">
            <label>Your Counter Price (₹)</label>
            <input type="number" class="input-field" id="counter-price" placeholder="Enter amount..." value="1790" />
          </div>
          <div class="input-group">
            <label>Message (optional)</label>
            <textarea class="input-field" id="counter-message" rows="3" placeholder="Add a note to your counter..."
              style="resize:vertical;">I can agree to ₹1,790 per tin for 300 units with same-day dispatch from Pimpri.</textarea>
          </div>
          <div class="btn-row">
            <button class="btn-primary" data-action="send-counter">Send Counter</button>
            <button class="btn-tertiary" onclick="document.getElementById('modal-overlay').classList.add('hidden')">Cancel</button>
          </div>
        </div>
      `);
      break;

    case 'send-counter': {
      const price = document.getElementById('counter-price')?.value || '11650';
      const msg = document.getElementById('counter-message')?.value || '';
      closeModal();
      // Add message to chat
      const chatMessages = document.getElementById('chat-messages');
      if (chatMessages) {
        const newMsg = document.createElement('div');
        newMsg.className = 'msg-group animate-in';
        newMsg.style.cssText = 'display:flex;flex-direction:column;align-items:flex-end;';
        newMsg.innerHTML = `
          <div class="msg-sender"><span class="time">Just now</span> <strong>Your Proposal</strong></div>
          <div class="msg-bubble outgoing">
            <div class="msg-price">🏷️ ₹${parseInt(price).toLocaleString('en-IN')}.00</div>
            <div class="msg-text">${msg || 'Counter offer submitted.'}</div>
          </div>
          <div class="msg-status">✓ Sent</div>
        `;
        chatMessages.appendChild(newMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
      showToast(`Counter offer of ₹${parseInt(price).toLocaleString('en-IN')} sent!`, 'success');
      // Simulate vendor response after delay
      setTimeout(() => {
        if (document.getElementById('chat-messages')) {
          simulateVendorResponse(parseInt(price));
        }
      }, 5000);
      break;
    }

    case 'decline-offer':
      showModal(`
        <div class="counter-modal">
          <h2>❌ Decline Offer</h2>
          <p style="margin-bottom:1rem;color:var(--on-surface-variant);">Are you sure you want to decline this offer from Kanchi Foods? This will end the negotiation session.</p>
          <div class="btn-row">
            <button class="btn-danger btn-primary" data-action="confirm-decline" style="background:var(--error);">Confirm Decline</button>
            <button class="btn-tertiary" onclick="document.getElementById('modal-overlay').classList.add('hidden')">Go Back</button>
          </div>
        </div>
      `);
      break;

    case 'confirm-decline':
      closeModal();
      showToast('Negotiation declined. Returning to marketplace.', 'warning');
      setTimeout(() => navigate('browse'), 1500);
      break;

    case 'sell-similar':
      showToast('Listing form will open shortly...', 'info');
      setTimeout(() => showNewListingModal(), 500);
      break;

    case 'new-listing':
      showNewListingModal();
      break;

    case 'contact-driver':
      showToast('📞 Connecting to Rajesh Kulkarni...', 'info');
      setTimeout(() => showToast('Call connected! Duration: live', 'success'), 2000);
      break;

    case 'view-route':
      showToast('🗺️ Opening full route map...', 'info');
      break;

    case 'download-docs':
      showToast('📄 Generating PDF pack...', 'info');
      setTimeout(() => showToast('✅ Documents ready for download!', 'success'), 2000);
      break;

    case 'view-order': {
      const oid = dataset.orderId;
      navigate('logistics', { orderId: oid });
      break;
    }

    case 'view-vendor':
      showToast('Opening vendor store...', 'info');
      break;

    case 'filter-category':
      state.categoryFilter = dataset.category;
      navigate('browse');
      break;

    case 'filter-chip':
      e?.target?.closest('.filter-chip')?.classList.toggle('active');
      showToast(`Filter "${dataset.filter}" toggled`, 'info');
      break;

    case 'set-thumb': {
      const thumbs = document.querySelectorAll('.thumb');
      thumbs.forEach(t => t.classList.remove('active'));
      e?.target?.classList.add('active');
      const mainImg = document.getElementById('main-product-img');
      if (mainImg && e?.target) {
        mainImg.style.filter = e.target.style.filter;
      }
      break;
    }
  }
}

// ── Simulate Vendor Response ──
function simulateVendorResponse(yourPrice) {
  const chatMessages = document.getElementById('chat-messages');
  if (!chatMessages) return;

  const responsePrice = Math.round((yourPrice + 1780) / 2 / 10) * 10;
  const newMsg = document.createElement('div');
  newMsg.className = 'msg-group animate-in';
  newMsg.innerHTML = `
    <div class="msg-sender">Kanchi Foods Pvt. Ltd. <span class="time">Just now</span></div>
    <div class="msg-bubble incoming">
      <div class="msg-price">💵 ₹${responsePrice.toLocaleString('en-IN')}.00 <span class="badge badge-new" style="font-size:0.65rem;">NEW OFFER</span></div>
      <div class="msg-text">"We appreciate the negotiation. ₹${responsePrice.toLocaleString('en-IN')}/tin for 300 units — final offer. We can dispatch from Pimpri warehouse today."</div>
    </div>
  `;
  chatMessages.appendChild(newMsg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  showToast(`💰 New offer from Kanchi Foods: ₹${responsePrice.toLocaleString('en-IN')}`, 'info');

  // Add notification
  state.notifications.unshift({
    id: Date.now(), icon: '💰', iconClass: 'green',
    title: 'New Counter Offer',
    desc: `Kanchi Foods sent ₹${responsePrice.toLocaleString('en-IN')}/tin for Sunflower Oil`,
    time: 'Just now', unread: true
  });
  notifDot.classList.remove('hidden');
}

// ── New Listing Modal ──
function showNewListingModal() {
  showModal(`
    <div class="counter-modal">
      <h2>📦 Create New Listing</h2>
      <div class="input-group">
        <label>Product Name</label>
        <input type="text" class="input-field" placeholder="e.g., Organic Turmeric Powder" />
      </div>
      <div class="input-group">
        <label>Category</label>
        <select class="input-field">
          <option>Groceries & FMCG</option>
          <option>Stationery & Office</option>
          <option>Household & Cleaning</option>
        </select>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
        <div class="input-group">
          <label>Price (₹)</label>
          <input type="number" class="input-field" placeholder="0.00" />
        </div>
        <div class="input-group">
          <label>Quantity</label>
          <input type="number" class="input-field" placeholder="0" />
        </div>
      </div>
      <div class="input-group">
        <label>Description</label>
        <textarea class="input-field" rows="3" placeholder="Describe your product..." style="resize:vertical;"></textarea>
      </div>
      <div class="btn-row">
        <button class="btn-primary" onclick="document.getElementById('modal-overlay').classList.add('hidden');document.querySelector('.toast-container').innerHTML+='<div class=\\'toast\\'>✅ Listing created successfully!</div>';">Publish Listing</button>
        <button class="btn-tertiary" onclick="document.getElementById('modal-overlay').classList.add('hidden')">Cancel</button>
      </div>
    </div>
  `);
}

// ── Settings Modal ──
document.getElementById('profile-settings')?.addEventListener('click', (e) => {
  e.preventDefault();
  closeAllDropdowns();
  showModal(`
    <div class="settings-content">
      <h2>⚙️ Settings</h2>
      <div class="setting-group">
        <label>Company Name</label>
        <input type="text" class="input-field" value="Arora Industries Pvt. Ltd." />
      </div>
      <div class="setting-group">
        <label>Email</label>
        <input type="email" class="input-field" value="deepak@example.com" />
      </div>
      <div class="toggle-row">
        <span>Email Notifications</span>
        <div class="toggle-switch active" data-action="toggle"></div>
      </div>
      <div class="toggle-row">
        <span>Push Notifications</span>
        <div class="toggle-switch active" data-action="toggle"></div>
      </div>
      <div class="toggle-row">
        <span>Auto-accept verified orders</span>
        <div class="toggle-switch" data-action="toggle"></div>
      </div>
      <div style="margin-top:1.5rem;">
        <button class="btn-primary" onclick="document.getElementById('modal-overlay').classList.add('hidden')">Save Changes</button>
      </div>
    </div>
  `);
});

// Toggle switches
document.addEventListener('click', (e) => {
  if (e.target.closest('.toggle-switch')) {
    e.target.closest('.toggle-switch').classList.toggle('active');
  }
});

// Logout
document.getElementById('profile-logout')?.addEventListener('click', (e) => {
  e.preventDefault();
  closeAllDropdowns();
  showToast('Logged out successfully. Redirecting...', 'info');
  setTimeout(() => navigate('browse'), 1500);
});

// Mark all notifications read
document.getElementById('notif-clear')?.addEventListener('click', () => {
  state.notifications.forEach(n => n.unread = false);
  renderNotifications();
  showToast('All notifications marked as read', 'success');
});

// FAB click
document.addEventListener('click', (e) => {
  if (e.target.closest('#fab-add')) {
    showNewListingModal();
  }
});

// Nav search
document.getElementById('nav-search')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    state.searchQuery = e.target.value.toLowerCase();
    navigate('browse');
    setTimeout(() => {
      const searchInput = document.getElementById('browse-search');
      if (searchInput) searchInput.value = state.searchQuery;
      filterProducts();
    }, 100);
  }
});

// ── Real-time Simulation ──
function startRealtimeSimulation() {
  // Periodic stock updates
  setInterval(() => {
    PRODUCTS.forEach(p => {
      const change = Math.random() > 0.5 ? 1 : -1;
      p.price = Math.max(1, p.price + change * Math.round(p.price * 0.002));
    });
    // If on browse page, subtly notify
    if (state.currentView === 'browse' && Math.random() > 0.7) {
      const randomProduct = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
      showToast(`📈 ${randomProduct.name} price updated to ${randomProduct.currency}${randomProduct.price.toLocaleString()}`, 'info');
    }
  }, 30000);

  // Periodic new notifications
  const fakeNotifs = [
    { icon: '📦', iconClass: 'orange', title: 'New Inventory Alert', desc: 'Fresh stock of organic dal available in Hadapsar' },
    { icon: '🤝', iconClass: 'green', title: 'Partnership Request', desc: 'Deccan Paper Mills wants to connect' },
    { icon: '📊', iconClass: 'blue', title: 'Market Insight', desc: 'Basmati rice prices trending up 2.1% in Pune' },
    { icon: '🚚', iconClass: 'blue', title: 'Delivery Update', desc: 'Your shipment crossed Hinjewadi checkpoint' }
  ];

  setTimeout(() => {
    const notif = fakeNotifs[Math.floor(Math.random() * fakeNotifs.length)];
    state.notifications.unshift({
      ...notif, id: Date.now(), time: 'Just now', unread: true
    });
    notifDot.classList.remove('hidden');
    showToast(`🔔 ${notif.title}`, 'info');
  }, 15000);

  setInterval(() => {
    const notif = fakeNotifs[Math.floor(Math.random() * fakeNotifs.length)];
    state.notifications.unshift({
      ...notif, id: Date.now(), time: 'Just now', unread: true
    });
    notifDot.classList.remove('hidden');
  }, 45000);
}

// ── Initialize ──
navigate('browse');
renderNotifications();
startRealtimeSimulation();

console.log('🏗️ InventoryExchange — The Hyperlocal B2B Exchange loaded.');
