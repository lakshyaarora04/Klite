<div align="center">
  <img src="./public/favicon.svg" alt="Klite Logo" width="120" />
</div>

<h1 align="center">Klite: The Hyperlocal B2B Exchange</h1>

<p align="center">
  <strong>A high-fidelity, editorial-style B2B marketplace prototype designed to visualize the future of hyperlocal supply chains.</strong>
</p>

<p align="center">
  <a href="#overview">Overview</a> •
  <a href="#design-system">Design System</a> •
  <a href="#core-features">Core Features</a> •
  <a href="#technology-stack">Technology Stack</a> •
  <a href="#system-architecture">System Architecture</a> •
  <a href="#getting-started">Getting Started</a>
</p>

---

## 📖 Overview

Klite is a production-grade front-end prototype designed to rethink B2B commerce. Instead of traditional, spreadsheet-like interfaces, Klite embraces an editorial, premium aesthetic. Build specifically for small to mid-sized businesses, the platform manages high-volume inventory discovery, real-time negotiation, and immediate hyperlocal logistics without overwhelming the user.

## ✨ Design System: "The Curated Architect"

The interface explicitly rejects typical boxy, widget-heavy corporate Dashboards in favor of a **"Boutique"** software approach:
- **Surface Hierarchy:** Utilizes a strict "No-Line" rule. UI separation is handled by subtle tonal shifts and deep layered drop-shadows rather than generic 1px borders.
- **Color Palette:** Grounded in a professional "Forest & Slate" signature (deep architectural greens and neutral grays) emphasizing stability and trust.
- **Typography:** A dual-font approach pairing the display dominance of *Manrope* against the utilitarian readability of *Inter*.

## 🚀 Core Features

1. **Editorial Discoverability:** A card-based, tag-driven inventory exploration feed emphasizing product storytelling alongside hardcore technical specs.
2. **Instant Negotiation Simulation:** Real-time B2B counter-offer interface designed like a consumer chat app. Buyers can send counter-bids and get simulated vendor responses instantly.
3. **Logistical Visualization:** An active HTML5 Canvas-based map that traces order logistics dynamically alongside a live financial and GST breakout.
4. **"The Office" Command Center:** A personalized dashboard aggregating active inventory listings, revenue metrics, and pending dispatch pipelines.

---

## 💻 Technology Stack

**“Blazing fast, zero-bloat architecture.”**

*   **Core Framework:** **Vite.js** environment driving a pure Vanilla JavaScript (ES6+) Single Page Application (SPA). To optimize raw rendering speed and bypass the overhead of virtual-DOMs, no heavy frontend frameworks (like React or Vue) are used.
*   **Styling Engine:** Completely custom-built CSS3 Token System leveraging advanced CSS Variables, Grid/Flexbox layouts, and calculated CSS animations to maintain the strict premium visual hierarchy.
*   **Rendering:** Modular HTML5 with programmatic DOM injection and dynamic event delegation.

---

## ⚙️ System Architecture (Algorithms)

This prototype acts as a completely self-contained ecosystem reflecting what a live server environment would do:

- **State-Driven SPA Router:** The application utilizes a customized asynchronous JavaScript routing algorithm pivoting around a global state object. When navigating, the system intercepts logic pathways, calculates current memory payloads, and repaints the DOM dynamically without page reloads.
- **Subtotal & Financial Matrices:** Bypassing static mockups, the cart logic operates interactively. The app calculates running subtotals based on simulated batch quantities, injects dynamic 18% GST variables, and processes a live "logistics transport fee" pushing the finalized transaction payload seamlessly to the Map tracking view. 
- **Algorithmic Canvas Rendering:** The live Logistics Map completely ignores bloated third-party Map layers (Google/Mapbox). Instead, it draws vectors on the raw **HTML5 `<canvas>` API**, utilizing trigonometry to continuously loop logistics vehicle movements over a localized X/Y matrix grid.
- **Real-Time Simulation Protocol:** The core module runs concurrent asynchronous event loop intervals updating simulated "market insights", "shipment delays", and local pricing indexes while actively altering the UI notification stream.

---

## 🛠 Getting Started

To run this application locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/lakshyaarora04/Klite.git
   cd Klite
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Spin up the development server:**
   ```bash
   npm run dev
   ```

4. **View locally:**
   Open the Local network location provided by Vite in the terminal (usually `http://localhost:5173/`).

---

<p align="center">
  <i>Built for the modern hyperlocal supply chain.</i>
</p>
