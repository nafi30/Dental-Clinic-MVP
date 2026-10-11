/**
 * modules/billing.js - Billing & Invoices Management
 */

export function renderBilling() {
  const store = window.appStore;
  let statusFilter = 'all';
  let searchTerm = '';

  const container = document.createElement('div');
  container.className = 'billing-module-wrap';

  function renderView() {
    const invoices = store.getInvoices();

    const totalBilled = invoices.reduce((acc, inv) => acc + (Number(inv.total) || 0), 0);
    const totalPaid = invoices.reduce((acc, inv) => {
      if (inv.paymentStatus === 'Paid') return acc + (Number(inv.total) || 0);
      if (inv.paymentStatus === 'Partially Paid') return acc + (Number(inv.paidAmount) || 0);
      return acc;
    }, 0);
    const outstanding = Math.max(0, totalBilled - totalPaid);

    const paidCount = invoices.filter(i => i.paymentStatus === 'Paid').length;
    const unpaidCount = invoices.filter(i => i.paymentStatus !== 'Paid').length;

    const filtered = invoices.filter(inv => {
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'Paid' && inv.paymentStatus === 'Paid') ||
        (statusFilter === 'Unpaid' && inv.paymentStatus !== 'Paid');

      const matchesSearch = !searchTerm ||
        inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.patientName.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    });

    container.innerHTML = `
      <!-- Top Financial Summary Cards -->
      <div class="invoice-summary-bar">
        <div class="card" style="padding: 18px 22px;">
          <div style="font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">Total Billed (MTD)</div>
          <div style="font-size: 26px; font-weight: 800; color: var(--text-primary); font-family: var(--font-mono); margin-top: 4px;">
            $${totalBilled.toLocaleString()}
          </div>
          <div style="font-size: 11.5px; color: var(--color-slate-500); margin-top: 4px;">Across ${invoices.length} invoices</div>
        </div>

        <div class="card" style="padding: 18px 22px;">
          <div style="font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">Collected Revenue</div>
          <div style="font-size: 26px; font-weight: 800; color: var(--emerald-600); font-family: var(--font-mono); margin-top: 4px;">
            $${totalPaid.toLocaleString()}
          </div>
          <div style="font-size: 11.5px; color: var(--emerald-700); margin-top: 4px;">✓ Cleared payments</div>
        </div>

        <div class="card" style="padding: 18px 22px;">
          <div style="font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">Outstanding Patient Balance</div>
          <div style="font-size: 26px; font-weight: 800; color: var(--crimson-600); font-family: var(--font-mono); margin-top: 4px;">
            $${outstanding.toLocaleString()}
          </div>
          <div style="font-size: 11.5px; color: var(--color-slate-500); margin-top: 4px;">${unpaidCount} invoices with pending balance</div>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="patients-toolbar" style="margin-top: 20px;">
        <div>
          <h3 style="font-size: 16px; font-weight: 700; color: var(--text-primary);">Patient Invoices & Statements</h3>
          <p style="font-size: 12.5px; color: var(--text-muted);">Itemized statements, copay collections & payment records</p>
        </div>

        <button class="btn btn-primary" id="btn-create-invoice">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Generate Invoice
        </button>
      </div>

      <!-- Filters & Search Bar -->
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-bottom: 18px; flex-wrap: wrap;">
        <div class="search-box" style="width: 280px;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" id="invoice-search-input" class="form-input" placeholder="Search by patient or INV #..." value="${searchTerm}">
        </div>

        <div style="display: flex; gap: 8px;">
          <button class="btn btn-secondary btn-sm filter-btn ${statusFilter === 'all' ? 'active' : ''}" data-filter="all">
            All Invoices (${invoices.length})
          </button>
          <button class="btn btn-secondary btn-sm filter-btn ${statusFilter === 'Unpaid' ? 'active' : ''}" data-filter="Unpaid" style="${statusFilter === 'Unpaid' ? 'border-color: var(--amber-600); color: var(--amber-800);' : ''}">
            Unpaid / Pending (${unpaidCount})
          </button>
          <button class="btn btn-secondary btn-sm filter-btn ${statusFilter === 'Paid' ? 'active' : ''}" data-filter="Paid" style="${statusFilter === 'Paid' ? 'border-color: var(--emerald-600); color: var(--emerald-800);' : ''}">
            Paid (${paidCount})
          </button>
        </div>
      </div>

      <!-- Invoices Table -->
      <div class="table-container">
        <table class="table-modern">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Patient</th>
              <th>Date Issued</th>
              <th>Total Amount</th>
              <th>Payment Status</th>
              <th>Payment Method</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.length === 0 ? `
              <tr>
                <td colspan="7" style="text-align: center; padding: 36px; color: var(--text-muted);">
                  No invoices found matching your criteria.
                </td>
              </tr>
            ` : filtered.map(inv => `
              <tr class="invoice-row" data-invoice-id="${inv.id}" style="cursor: pointer;">
                <td style="font-family: var(--font-mono); font-weight: 700; color: var(--teal-800);">${inv.id}</td>
                <td style="font-weight: 600; color: var(--text-primary);">${inv.patientName}</td>
                <td>${inv.date}</td>
                <td style="font-weight: 800; font-family: var(--font-mono); font-size: 14px;">$${inv.total}</td>
                <td>
                  <span class="badge badge-${inv.paymentStatus.toLowerCase().replace(' ', '-')}">
                    <span class="badge-dot"></span>
                    ${inv.paymentStatus}
                  </span>
                </td>
                <td style="font-size: 12.5px; color: var(--color-slate-600);">${inv.paymentMethod}</td>
                <td style="text-align: right;">
                  <button class="btn btn-secondary btn-sm btn-view-invoice" data-invoice-id="${inv.id}" style="padding: 5px 12px;">
                    ${inv.paymentStatus === 'Paid' ? 'View & Print' : '💳 Pay / View'}
                  </button>
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
    // Row click
    container.querySelectorAll('.invoice-row').forEach(row => {
      row.addEventListener('click', (e) => {
        const invId = row.getAttribute('data-invoice-id');
        window.openInvoiceView(invId);
      });
    });

    container.querySelectorAll('.btn-view-invoice').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const invId = btn.getAttribute('data-invoice-id');
        window.openInvoiceView(invId);
      });
    });

    // Create Invoice button
    const btnCreate = container.querySelector('#btn-create-invoice');
    if (btnCreate) {
      btnCreate.addEventListener('click', () => {
        window.openNewInvoiceModal();
      });
    }

    // Search filter
    const searchInput = container.querySelector('#invoice-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value;
        renderView();
        const inputNow = container.querySelector('#invoice-search-input');
        if (inputNow) {
          inputNow.focus();
          inputNow.setSelectionRange(searchTerm.length, searchTerm.length);
        }
      });
    }

    // Tab filter buttons
    container.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        statusFilter = btn.getAttribute('data-filter');
        renderView();
      });
    });
  }

  renderView();
  return container;
}

export function renderInvoicePreviewDrawer(invoiceId) {
  const store = window.appStore;
  const invoice = store.getInvoices().find(i => i.id === invoiceId);
  if (!invoice) return null;

  const content = document.createElement('div');
  const isPaid = invoice.paymentStatus === 'Paid';
  const remainingDue = isPaid ? 0 : (invoice.total - (Number(invoice.paidAmount) || 0));

  content.innerHTML = `
    <div class="invoice-preview-sheet" id="printable-invoice">
      <div class="invoice-sheet-header">
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div class="clinic-logo-icon" style="width: 32px; height: 32px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a9 9 0 0 1 9 9c0 4.97-4.03 9-9 9s-9-4.03-9-9a9 9 0 0 1 9-9z"/></svg>
            </div>
            <strong style="font-size: 18px; color: var(--text-primary);">${store.data.clinic.name}</strong>
          </div>
          <div style="font-size: 12px; color: var(--text-muted); margin-top: 6px;">
            ${store.data.clinic.location} · Tel: ${store.data.clinic.phone}
          </div>
        </div>

        <div style="text-align: right;">
          <div style="font-size: 18px; font-weight: 800; color: var(--color-slate-900); font-family: var(--font-mono);">${invoice.id}</div>
          <div style="font-size: 12px; color: var(--text-muted);">Date: ${invoice.date}</div>
          <div style="margin-top: 6px;">
            <span class="badge badge-${invoice.paymentStatus.toLowerCase().replace(' ', '-')}">${invoice.paymentStatus}</span>
          </div>
        </div>
      </div>

      <!-- Bill To Patient -->
      <div style="margin-bottom: 24px; padding: 14px; background: var(--color-slate-50); border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Bill To Patient</div>
          <div style="font-size: 15px; font-weight: 700; color: var(--text-primary); margin-top: 2px;">${invoice.patientName}</div>
          <div style="font-size: 12px; color: var(--color-slate-600);">Patient ID: ${invoice.patientId}</div>
        </div>
        ${!isPaid ? `
          <button class="btn btn-primary btn-sm" id="btn-quick-collect" style="padding: 6px 14px;">
            💳 Collect Payment ($${remainingDue})
          </button>
        ` : `
          <span class="badge badge-confirmed" style="font-size: 12px; padding: 4px 10px;">✓ Paid in Full</span>
        `}
      </div>

      <!-- Line Items Table -->
      <table class="invoice-line-items">
        <thead>
          <tr>
            <th>Clinical Service / Procedure</th>
            <th style="text-align: center;">Qty</th>
            <th style="text-align: right;">Unit Price</th>
            <th style="text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items.map(it => `
            <tr>
              <td style="font-weight: 600; color: var(--text-primary);">${it.description}</td>
              <td style="text-align: center;">${it.quantity}</td>
              <td style="text-align: right; font-family: var(--font-mono);">$${it.unitPrice}</td>
              <td style="text-align: right; font-family: var(--font-mono); font-weight: 700;">$${it.quantity * it.unitPrice}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <!-- Totals -->
      <div class="invoice-totals-box">
        <div class="totals-row">
          <span>Subtotal:</span>
          <span style="font-family: var(--font-mono);">$${invoice.subtotal}</span>
        </div>
        <div class="totals-row">
          <span>Insurance Discount:</span>
          <span style="font-family: var(--font-mono);">$${invoice.discount}</span>
        </div>
        <div class="totals-row">
          <span>Tax / Surcharges:</span>
          <span style="font-family: var(--font-mono);">$${invoice.tax}</span>
        </div>
        <div class="totals-row grand-total">
          <span>Amount Due:</span>
          <span style="font-family: var(--font-mono); color: ${isPaid ? 'var(--emerald-700)' : 'var(--crimson-700)'};">$${isPaid ? 0 : remainingDue}</span>
        </div>
      </div>

      <!-- Payment Collection Form (If not paid) -->
      ${!isPaid ? `
        <div id="payment-collection-card" style="margin-top: 24px; padding: 18px; background: #F8FAFC; border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
            <div style="font-weight: 700; font-size: 14px; color: var(--text-primary); display: flex; align-items: center; gap: 6px;">
              <span>💳</span> Collect Patient Payment
            </div>
            <span style="font-size: 12px; font-weight: 600; color: var(--teal-800);">Remaining: $${remainingDue}</span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px;">
            <div>
              <label class="form-label" style="font-size: 11.5px;">Payment Method</label>
              <select class="form-select" id="pay-method-select" style="font-size: 13px;">
                <option value="Credit Card">Credit Card (Stripe Terminal)</option>
                <option value="Delta Dental Copay">Delta Dental Insurance Copay</option>
                <option value="Cash">Cash (Front Desk)</option>
                <option value="CareCredit / Check">CareCredit / Check</option>
              </select>
            </div>
            <div>
              <label class="form-label" style="font-size: 11.5px;">Amount to Collect ($)</label>
              <input type="number" class="form-input" id="pay-amount-input" value="${remainingDue}" min="1" max="${remainingDue}" style="font-size: 13px; font-family: var(--font-mono);">
            </div>
          </div>

          <button class="btn btn-primary" id="btn-process-payment" style="width: 100%; justify-content: center; font-weight: 700;">
            ✓ Record & Clear Payment of $${remainingDue}
          </button>
        </div>
      ` : ''}

      <div style="margin-top: 24px; padding-top: 14px; border-top: 1px dashed var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
        <div style="font-size: 12px; color: var(--text-muted);">
          Payment Method: <strong>${invoice.paymentMethod}</strong>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="window.print()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          Print Invoice
        </button>
      </div>
    </div>
  `;

  // Attach Payment Handler
  const btnProcess = content.querySelector('#btn-process-payment');
  const btnQuick = content.querySelector('#btn-quick-collect');

  const executePayment = () => {
    const methodSelect = content.querySelector('#pay-method-select');
    const amountInput = content.querySelector('#pay-amount-input');
    const method = methodSelect ? methodSelect.value : 'Credit Card';
    const amount = amountInput ? parseFloat(amountInput.value) : remainingDue;

    if (!amount || amount <= 0) {
      window.showToast("Please enter a valid payment amount.", "error");
      return;
    }

    store.payInvoice(invoice.id, method, amount);
    window.showToast(`Payment of $${amount.toFixed(2)} recorded for ${invoice.id}!`, "success");

    // Reopen drawer to reflect Paid state
    setTimeout(() => {
      window.openInvoiceView(invoice.id);
      if (typeof window.rerenderCurrentView === 'function') {
        window.rerenderCurrentView();
      }
    }, 150);
  };

  if (btnProcess) {
    btnProcess.addEventListener('click', executePayment);
  }
  if (btnQuick) {
    btnQuick.addEventListener('click', () => {
      const card = content.querySelector('#payment-collection-card');
      if (card) card.scrollIntoView({ behavior: 'smooth' });
    });
  }

  return content;
}
