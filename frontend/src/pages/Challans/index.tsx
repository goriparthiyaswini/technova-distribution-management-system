import { useEffect, useState, type FormEvent } from "react";
import * as challanService from "../../services/challan.service";
import * as customerService from "../../services/customer.service";
import * as productService from "../../services/product.service";
import type { Customer, Product, Challan } from "../../types";

export default function Challans() {
  const [challans, setChallans] = useState<Challan[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState([{ productId: "", qty: 1 }]);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState<{ id: string; message: string } | null>(null);

  async function fetchAll() {
    setChallans(await challanService.getChallans(statusFilter || undefined));
    setCustomers(await customerService.getCustomers());
    setProducts(await productService.getProducts());
  }
  useEffect(() => { fetchAll(); }, [statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  function resetForm() { setCustomerId(""); setItems([{ productId: "", qty: 1 }]); setError(""); }

  async function handleCreate(e: FormEvent) {
    e.preventDefault(); setError("");
    const valid = items.filter((i) => i.productId && i.qty > 0);
    if (!customerId || valid.length === 0) { setError("Select a customer and at least one product."); return; }
    try {
      await challanService.createChallan({ customerId, items: valid });
      setShowForm(false); resetForm(); fetchAll();
    } catch (err: any) { setError(err.response?.data?.message || "Failed to create challan"); }
  }

  async function handleStatus(id: string, status: "CONFIRMED" | "CANCELLED") {
    setActionError(null);
    try { await challanService.setChallanStatus(id, status); fetchAll(); }
    catch (err: any) { setActionError({ id, message: err.response?.data?.message || "Action failed" }); }
  }

  return (
    <>
      <div className="d-flex justify-content-between mb-3">
        <h3>Sales Challans</h3>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>+ New Challan</button>
      </div>

      {showForm && (
        <div className="card p-3 mb-3">
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <form onSubmit={handleCreate}>
            <div className="mb-3">
              <label className="form-label">Customer</label>
              <select className="form-select" value={customerId} onChange={(e) => setCustomerId(e.target.value)} required>
                <option value="">Select customer</option>
                {customers.map((c) => <option key={c.id} value={c.id}>{c.name} {c.business ? `— ${c.business}` : ""}</option>)}
              </select>
            </div>
            <label className="form-label">Products</label>
            {items.map((item, i) => (
              <div key={i} className="d-flex gap-2 mb-2">
                <select className="form-select" value={item.productId}
                  onChange={(e) => setItems(items.map((it, idx) => idx === i ? { ...it, productId: e.target.value } : it))}>
                  <option value="">Select product</option>
                  {products.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.sku}) — stock: {p.stock}</option>)}
                </select>
                <input type="number" min={1} className="form-control" style={{ maxWidth: 100 }} value={item.qty}
                  onChange={(e) => setItems(items.map((it, idx) => idx === i ? { ...it, qty: Number(e.target.value) } : it))} />
                {items.length > 1 && <button type="button" className="btn btn-outline-danger" onClick={() => setItems(items.filter((_, idx) => idx !== i))}>Remove</button>}
              </div>
            ))}
            <button type="button" className="btn btn-sm btn-outline-secondary mb-3" onClick={() => setItems([...items, { productId: "", qty: 1 }])}>+ Add product</button>
            <div>
              <button className="btn btn-primary me-2">Save as Draft</button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card p-3">
        <select className="form-select mb-3" style={{ maxWidth: 180 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option><option value="DRAFT">Draft</option><option value="CONFIRMED">Confirmed</option><option value="CANCELLED">Cancelled</option>
        </select>
        <table className="table table-hover align-middle">
          <thead><tr><th>Challan No</th><th>Customer</th><th>Items</th><th>Qty</th><th>Status</th><th>Created</th><th></th></tr></thead>
          <tbody>
            {challans.map((c) => (
              <tr key={c.id}>
                <td className="fw-semibold">{c.challanNo}</td><td>{c.customer.name}</td>
                <td className="text-muted small">{c.items.map((i) => `${i.product.name} x${i.qty}`).join(", ")}</td>
                <td>{c.items.reduce((s, i) => s + i.qty, 0)}</td>
                <td><span className={`badge ${c.status === "CONFIRMED" ? "bg-success" : c.status === "CANCELLED" ? "bg-danger" : "bg-warning text-dark"}`}>{c.status}</span></td>
                <td>{new Date(c.createdAt).toLocaleDateString("en-IN")}</td>
                <td>
                  {c.status === "DRAFT" && (
                    <>
                      <button className="btn btn-sm btn-success me-1" onClick={() => handleStatus(c.id, "CONFIRMED")}>Confirm</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleStatus(c.id, "CANCELLED")}>Cancel</button>
                      {actionError?.id === c.id && <div className="text-danger small mt-1">{actionError.message}</div>}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}