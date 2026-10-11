/**
 * modules/billing.js - Billing & Invoices Management
 */

export function renderBilling() {
  const store = window.appStore;
  const invoices = store.getInvoices();

  const totalBilled = invoices.reduce((acc, inv) => acc + inv.total, 0);
  const totalPaid = invoices.reduce((acc, inv) => {
    if (inv.paymentStatus === 'Paid') return acc + inv.total;
    if (inv.paymentStatus === 'Partially Paid') return acc + (inv.paidAmount || 0);
    return acc;
  }, 0);
  const outstanding = totalBilled - totalPaid;

  const container = document.createElement('div');
  container.className = 'billing-module-wrap';

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
        <div style="font-size: 11.5px; color: var(--color-slate-500); margin-top: 4px;">Copay and pending pre-auths</div>
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
          ${invoices.map(inv => `
            <tr class="invoice-row" data-invoice-id="${inv.id}">
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
                  View & Print
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  // Attach events
  container.querySelectorAll('.invoice-row').forEach(row => {
    row.addEventListener('click', (e) => {
      const invId = row.getAttribute('data-invoice-id');
      window.openInvoiceView(invId);
    });
  });

  const btnCreate = container.querySelector('#btn-create-invoice');
  if (btnCreate) {
    btnCreate.addEventListener('click', () => {
      window.openNewInvoiceModal();
    });
  }

  return container;
}

export function renderInvoicePreviewDrawer(invoiceId) {
  const store = window.appStore;
  const invoice = store.getInvoices().find(i => i.id === invoiceId);
  if (!invoice) return null;

  const content = document.createElement('div');
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
      <div style="margin-bottom: 24px; padding: 14px; background: var(--color-slate-50); border-radius: var(--radius-md);">
        <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Bill To Patient</div>
        <div style="font-size: 15px; font-weight: 700; color: var(--text-primary); margin-top: 2px;">${invoice.patientName}</div>
        <div style="font-size: 12px; color: var(--color-slate-600);">Patient ID: ${invoice.patientId}</div>
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
          <span style="font-family: var(--font-mono); color: var(--teal-800);">$${invoice.total}</span>
        </div>
      </div>

      <div style="margin-top: 30px; padding-top: 14px; border-top: 1px dashed var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
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
  return content;
}
