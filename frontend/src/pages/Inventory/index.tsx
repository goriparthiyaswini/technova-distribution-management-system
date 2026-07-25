import { useEffect, useState, type FormEvent } from "react";
import * as inventoryService from "../../services/inventory.service";
import * as productService from "../../services/product.service";
import type { Product, InventoryMovement } from "../../types";

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [form, setForm] = useState({ productId: "", quantity: 1, type: "IN" as "IN" | "OUT", reason: "" });
  const [error, setError] = useState("");

  async function fetchAll() {
    setProducts(await productService.getProducts());
    setMovements(await inventoryService.getMovements());
  }
  useEffect(() => { fetchAll(); }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault(); setError("");
    try {
      await inventoryService.recordMovement(form);
      setForm({ productId: "", quantity: 1, type: "IN", reason: "" });
      fetchAll();
    } catch (err: any) { setError(err.response?.data?.message || "Failed to record movement"); }
  }

  return (
    <>
      <h3 className="mb-3">Inventory</h3>
      <div className="card p-3 mb-3">
        <h5>Record Stock Movement</h5>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="row g-2">
            <div className="col-md-4"><label className="form-label">Product</label>
              <select className="form-select" value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })} required>
                <option value="">Select product</option>
                {products.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.sku}) — stock: {p.stock}</option>)}
              </select></div>
            <div className="col-md-3"><label className="form-label">Type</label>
              <select className="form-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })}>
                <option value="IN">Stock IN</option><option value="OUT">Stock OUT</option>
              </select></div>
            <div className="col-md-2"><label className="form-label">Quantity</label>
              <input type="number" min={1} className="form-control" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} required /></div>
            <div className="col-md-3"><label className="form-label">Reason</label>
              <input className="form-control" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} /></div>
          </div>
          <button className="btn btn-primary mt-3">Record Movement</button>
        </form>
      </div>

      <div className="card p-3">
        <h5>Movement History</h5>
        <table className="table table-hover align-middle">
          <thead><tr><th>Product</th><th>Type</th><th>Qty</th><th>Reason</th><th>By</th><th>Date</th></tr></thead>
          <tbody>
            {movements.map((m) => (
              <tr key={m.id}>
                <td>{m.product.name} <span className="text-muted">({m.product.sku})</span></td>
                <td><span className={`badge ${m.type === "IN" ? "bg-success" : "bg-danger"}`}>{m.type}</span></td>
                <td>{m.quantity}</td><td className="text-muted small">{m.reason || "—"}</td>
                <td>{m.creator?.name || "—"}</td><td>{new Date(m.createdAt).toLocaleString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}