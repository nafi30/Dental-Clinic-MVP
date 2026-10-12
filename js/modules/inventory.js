/**
 * modules/inventory.js - Clinic Consumables & Inventory with Low Stock Alerts & Real Modal Creation
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
    const totalValuation = inventory.reduce((sum, item) => sum + (item.quantity * (item.costPerUnit || 0)), 0);

    // Dynamic distinct vendor count
    const vendors = new Set(inventory.map(i => i.supplier).filter(Boolean));

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

        <div class="kpi-card ${totalLowStock > 0 ? 'kpi-highlight' : ''}" style="${totalLowStock > 0 ? 'border: 1px solid #FDE68A; background: #FFFBEB;' : ''}">
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
          <div class="kpi-val" style="color: var(--teal-800);">$${Math.round(totalValuation).toLocaleString()}</div>
          <div class="kpi-footer">Live on-hand clinical asset value</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Preferred Vendors</span>
            <div class="kpi-icon-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            </div>
          </div>
          <div class="kpi-val">${vendors.size} Vendors</div>
          <div class="kpi-footer">${Array.from(vendors).slice(0, 3).join(', ')}</div>
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Stock Item
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
              <th>Unit Cost</th>
              <th>Status</th>
              <th style="text-align: right;">Adjust Stock</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(item => `
              <tr>
                <td>
                  <strong style="color: var(--text-primary); font-size: 13.5px;">${item.name}</strong>
                  <div style="font-size: 12px; color: var(--text-secondary); font-family: var(--font-mono);">${item.id}</div>
                </td>
                <td style="font-size: 13px;">${item.category}</td>
                <td>
                  <span style="font-size: 15px; font-weight: 800; font-family: var(--font-mono); color: ${item.quantity <= item.threshold ? 'var(--crimson-600)' : 'var(--text-primary)'};">
                    ${item.quantity}
                  </span>
                </td>
                <td style="font-family: var(--font-mono); font-size: 13px; color: var(--color-slate-600);">
                  ${item.threshold}
                </td>
                <td style="font-size: 12.5px; color: var(--text-secondary);">${item.unit}</td>
                <td style="font-size: 13px; font-weight: 500;">${item.supplier}</td>
                <td style="font-family: var(--font-mono); font-size: 13px; font-weight: 600; color: var(--teal-800);">$${(item.costPerUnit || 0).toFixed(2)}</td>
                <td>
                  <span class="badge badge-${item.status.includes('Alert') ? 'alert' : 'confirmed'}" style="font-size: 12.5px; padding: 4px 10px;">
                    ${item.status}
                  </span>
                </td>
                <td style="text-align: right;">
                  <div class="stepper-wrap" style="justify-content: flex-end;">
                    <button class="btn btn-secondary btn-sm btn-sub" data-item-id="${item.id}" title="Reduce stock count" style="width: 28px; height: 28px; padding: 0;">-</button>
                    <span style="font-family: var(--font-mono); font-weight: 700; min-width: 28px; text-align: center;">${item.quantity}</span>
                    <button class="btn btn-secondary btn-sm btn-add" data-item-id="${item.id}" title="Add stock count" style="width: 28px; height: 28px; padding: 0;">+</button>
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
        openAddInventoryModal();
      });
    }
  }

  function openAddInventoryModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';

    modal.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h2 class="modal-title" style="font-size: 16px;">Add New Clinical Supply Item</h2>
          <button class="modal-close-btn" id="btn-close-inv-modal">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Supply Item Name</label>
            <input type="text" class="form-input" id="new-inv-name" placeholder="e.g. Prophy Paste Mint Coarse (200/box)" required>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Category</label>
              <select class="form-select" id="new-inv-category">
                <option value="Restorative">Restorative</option>
                <option value="Anesthetics">Anesthetics</option>
                <option value="Infection Control">Infection Control</option>
                <option value="Endodontics">Endodontics</option>
                <option value="Disposables">Disposables</option>
                <option value="Sterilization">Sterilization</option>
                <option value="Prophylaxis">Prophylaxis</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Supplier / Vendor</label>
              <select class="form-select" id="new-inv-supplier">
                <option value="Henry Schein">Henry Schein</option>
                <option value="Patterson Dental">Patterson Dental</option>
                <option value="Benco Dental">Benco Dental</option>
                <option value="Darby Dental">Darby Dental</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Initial Quantity</label>
              <input type="number" class="form-input" id="new-inv-qty" value="10" min="0" required>
            </div>
            <div class="form-group">
              <label class="form-label">Reorder Alert Threshold</label>
              <input type="number" class="form-input" id="new-inv-threshold" value="3" min="1" required>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Unit / Packaging</label>
              <input type="text" class="form-input" id="new-inv-unit" placeholder="e.g. Boxes, Bottles, Packs" value="Boxes">
            </div>
            <div class="form-group">
              <label class="form-label">Cost Per Unit ($)</label>
              <input type="number" class="form-input" id="new-inv-cost" value="45.00" step="0.50">
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary btn-sm" id="btn-cancel-inv-modal">Cancel</button>
          <button class="btn btn-primary btn-sm" id="btn-submit-inv-modal">Save To Inventory</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const close = () => {
      modal.classList.remove('active');
      setTimeout(() => modal.remove(), 200);
    };

    modal.querySelector('#btn-close-inv-modal').addEventListener('click', close);
    modal.querySelector('#btn-cancel-inv-modal').addEventListener('click', close);

    modal.querySelector('#btn-submit-inv-modal').addEventListener('click', () => {
      const name = modal.querySelector('#new-inv-name').value.trim();
      if (!name) {
        alert('Please enter an item name.');
        return;
      }

      const category = modal.querySelector('#new-inv-category').value;
      const supplier = modal.querySelector('#new-inv-supplier').value;
      const quantity = parseInt(modal.querySelector('#new-inv-qty').value) || 0;
      const threshold = parseInt(modal.querySelector('#new-inv-threshold').value) || 3;
      const unit = modal.querySelector('#new-inv-unit').value || 'Units';
      const costPerUnit = parseFloat(modal.querySelector('#new-inv-cost').value) || 0;

      const newItem = {
        id: "inv-item-" + (store.data.inventory.length + 1),
        name,
        category,
        quantity,
        threshold,
        unit,
        supplier,
        costPerUnit,
        status: quantity <= threshold ? "Low Stock Alert" : "In Stock"
      };

      store.data.inventory.push(newItem);
      store.saveData();
      store.apiCall('/api/inventory', 'POST', newItem);
      store.addAuditLog("Inventory Item Added", `Added new SKU: ${name} (${quantity} ${unit})`);

      window.showToast(`✓ Added ${name} to clinical inventory.`, "success");
      close();
      renderView();
    });
  }

  renderView();
  return container;
}
