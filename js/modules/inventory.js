/**
 * modules/inventory.js - Clinic Consumables & Inventory with Low Stock Alerts
 */

export function renderInventory() {
  const store = window.appStore;
  let activeCategory = 'all';

  const container = document.createElement('div');
  container.className = 'inventory-wrap';

  function renderView() {
    const inventory = store.getInventory();
    const lowStockItems = inventory.filter(i => i.quantity <= i.threshold);

    const filtered = inventory.filter(item => {
      return activeCategory === 'all' || item.category.toLowerCase() === activeCategory.toLowerCase();
    });

    const totalSKUs = inventory.length;
    const totalLowStock = lowStockItems.length;

    container.innerHTML = `
      <!-- Top Metrics -->
      <div class="kpi-row" style="margin-bottom: 22px;">
        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Total Tracked SKUs</span>
            <div class="kpi-icon-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
            </div>
          </div>
          <div class="kpi-val">${totalSKUs}</div>
          <div class="kpi-footer">Clinical consumables & medications</div>
        </div>

        <div class="kpi-card ${totalLowStock > 0 ? 'kpi-highlight' : ''}" style="${totalLowStock > 0 ? 'border-color: rgba(217, 119, 6, 0.4); background: linear-gradient(135deg, #FFF 60%, #FFFBEB 100%);' : ''}">
          <div class="kpi-top">
            <span class="kpi-label">Low Stock Warnings</span>
            <div class="kpi-icon-wrap" style="background: var(--amber-50); color: var(--amber-700);">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
          </div>
          <div class="kpi-val" style="color: var(--amber-700);">${totalLowStock} Items</div>
          <div class="kpi-footer">Below minimum reorder threshold</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Supplies Valuation</span>
            <div class="kpi-icon-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
          </div>
          <div class="kpi-val">$8,420</div>
          <div class="kpi-footer">Estimated on-hand clinical asset value</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Preferred Vendors</span>
            <div class="kpi-icon-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            </div>
          </div>
          <div class="kpi-val">3 Vendors</div>
          <div class="kpi-footer">Henry Schein, Patterson, Benco</div>
        </div>
      </div>

      <!-- Low Stock Warning Banner -->
      ${totalLowStock > 0 ? `
        <div class="inventory-alert-banner">
          <div style="display: flex; align-items: center; gap: 12px;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--amber-700)" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <div>
              <strong style="color: var(--amber-800); font-size: 13.5px;">AUTOMATED REORDER NOTICE:</strong>
              <span style="font-size: 13px; color: var(--color-slate-700); margin-left: 4px;">
                ${lowStockItems.map(i => `${i.name} (${i.quantity} left, min ${i.threshold})`).join('; ')}
              </span>
            </div>
          </div>
          <button class="btn btn-secondary btn-sm" id="btn-reorder-all" style="background:#FFF; border-color:var(--amber-400); color:var(--amber-800); font-weight:700;">
            1-Click Vendor Restock Order
          </button>
        </div>
      ` : ''}

      <!-- Toolbar & Category Filter -->
      <div class="patients-toolbar">
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button class="btn btn-secondary btn-sm ${activeCategory === 'all' ? 'active' : ''}" data-cat="all">All (${inventory.length})</button>
          <button class="btn btn-secondary btn-sm ${activeCategory === 'anesthetics' ? 'active' : ''}" data-cat="anesthetics">Anesthetics</button>
          <button class="btn btn-secondary btn-sm ${activeCategory === 'infection control' ? 'active' : ''}" data-cat="infection control">Infection Control</button>
          <button class="btn btn-secondary btn-sm ${activeCategory === 'restorative' ? 'active' : ''}" data-cat="restorative">Restorative</button>
          <button class="btn btn-secondary btn-sm ${activeCategory === 'endodontics' ? 'active' : ''}" data-cat="endodontics">Endodontics</button>
          <button class="btn btn-secondary btn-sm ${activeCategory === 'disposables' ? 'active' : ''}" data-cat="disposables">Disposables</button>
        </div>

        <button class="btn btn-primary" id="btn-add-inventory-item">
          + Add Stock Item
        </button>
      </div>

      <!-- Inventory Table -->
      <div class="table-container">
        <table class="table-modern">
          <thead>
            <tr>
              <th>Supply Item / Material</th>
              <th>Category</th>
              <th>Quantity in Stock</th>
              <th>Reorder Threshold</th>
              <th>Unit / Packaging</th>
              <th>Supplier</th>
              <th>Status</th>
              <th style="text-align: right;">Adjust Stock</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(item => `
              <tr>
                <td>
                  <strong style="color: var(--text-primary); font-size: 13.5px;">${item.name}</strong>
                  <div style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono);">${item.id}</div>
                </td>
                <td style="font-size: 12.5px;">${item.category}</td>
                <td>
                  <span style="font-size: 15px; font-weight: 800; font-family: var(--font-mono); color: ${item.quantity <= item.threshold ? 'var(--crimson-600)' : 'var(--text-primary)'};">
                    ${item.quantity}
                  </span>
                </td>
                <td style="font-family: var(--font-mono); font-size: 13px; color: var(--color-slate-600);">
                  ${item.threshold}
                </td>
                <td style="font-size: 12px; color: var(--text-muted);">${item.unit}</td>
                <td style="font-size: 12.5px; font-weight: 500;">${item.supplier}</td>
                <td>
                  <span class="badge badge-${item.status.includes('Alert') ? 'alert' : 'confirmed'}">
                    ${item.status}
                  </span>
                </td>
                <td style="text-align: right;">
                  <div class="stock-stepper">
                    <button class="btn-stepper btn-sub" data-item-id="${item.id}" title="Deduct stock">-</button>
                    <button class="btn-stepper btn-add" data-item-id="${item.id}" title="Add stock">+</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    // Category pills
    container.querySelectorAll('[data-cat]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        activeCategory = btn.getAttribute('data-cat');
        renderView();
      });
    });

    // Steppers (+ / -)
    container.querySelectorAll('.btn-sub').forEach(btn => {
      btn.addEventListener('click', () => {
        const itemId = btn.getAttribute('data-item-id');
        store.adjustInventory(itemId, -1);
        renderView();
      });
    });

    container.querySelectorAll('.btn-add').forEach(btn => {
      btn.addEventListener('click', () => {
        const itemId = btn.getAttribute('data-item-id');
        store.adjustInventory(itemId, 1);
        renderView();
      });
    });

    // 1-Click reorder
    const btnReorder = container.querySelector('#btn-reorder-all');
    if (btnReorder) {
      btnReorder.addEventListener('click', () => {
        const lowItems = store.getInventory().filter(i => i.quantity <= i.threshold);
        lowItems.forEach(i => {
          store.adjustInventory(i.id, 10);
        });
        window.showToast("✓ Restock PO automatically generated & sent to Henry Schein / Patterson Dental", "success");
        renderView();
      });
    }

    // Add item modal trigger
    const btnAddItem = container.querySelector('#btn-add-inventory-item');
    if (btnAddItem) {
      btnAddItem.addEventListener('click', () => {
        const name = prompt("Enter Name of New Clinical Supply Item:", "Prophy Paste Mint Medium");
        if (name) {
          const newItem = {
            id: "inv-item-" + (store.data.inventory.length + 1),
            name: name,
            category: "Prophylaxis",
            quantity: 10,
            threshold: 3,
            unit: "Boxes (200 cups/box)",
            supplier: "Henry Schein",
            costPerUnit: 28.00,
            status: "In Stock"
          };
          store.data.inventory.push(newItem);
          store.saveData();
          window.showToast(`Added ${name} to clinical inventory.`, "success");
          renderView();
        }
      });
    }
  }

  renderView();
  return container;
}
