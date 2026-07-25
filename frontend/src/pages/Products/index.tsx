import { useEffect, useState, type FormEvent } from "react";
import * as productService from "../../services/product.service";
import type { Product } from "../../types";


const EMPTY = { name: "", sku: "", category: "", price: 0, minStock: 5, warehouse: "Main Warehouse, Hyderabad" };

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");

  async function fetchData() { setProducts(await productService.getProducts(search || undefined)); }

  useEffect(() => {
    const t = setTimeout(fetchData, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function openAdd() { setEditingId(null); setForm(EMPTY); setError(""); setShowForm(true); }
  function openEdit(p: Product) {
    setEditingId(p.id);
    setForm({ name: p.name, sku: p.sku, category: p.category || "", price: p.price, minStock: p.minStock, warehouse: p.warehouse || "" });
    setError(""); setShowForm(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault(); setError("");
    try {
      if (editingId) await productService.updateProduct(editingId, form);
      else await productService.createProduct(form);
      setShowForm(false); fetchData();
    } catch (err: any) { setError(err.response?.data?.message || "Failed to save"); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    await productService.deleteProduct(id); fetchData();
  }

  return (
    <>
      <div className="d-flex justify-content-between mb-3">
        <h3>Products</h3>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Product</button>
      </div>

      {showForm && (
        <div className="card mb-3 p-3">
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="row g-2">
              <div className="col-md-6"><label className="form-label">Name</label>
                <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="col-md-6"><label className="form-label">SKU</label>
                <input className="form-control" value={form.sku} disabled={!!editingId} onChange={(e) => setForm({ ...form, sku: e.target.value })} required /></div>
              <div className="col-md-6"><label className="form-label">Category</label>
                <input className="form-control" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
              <div className="col-md-6"><label className="form-label">Price (₹)</label>
                <input type="number" min={0} step="0.01" className="form-control" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required /></div>
              <div className="col-md-6"><label className="form-label">Minimum Stock</label>
                <input type="number" min={0} className="form-control" value={form.minStock} onChange={(e) => setForm({ ...form, minStock: Number(e.target.value) })} /></div>
              <div className="col-md-6"><label className="form-label">Warehouse</label>
                <input className="form-control" value={form.warehouse} onChange={(e) => setForm({ ...form, warehouse: e.target.value })} /></div>
            </div>
            <div className="mt-3">
              <button className="btn btn-primary me-2">Save</button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card p-3">
        <input className="form-control mb-3" style={{ maxWidth: 280 }} placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <table className="table table-hover align-middle">
          <thead><tr><th>Name</th><th>SKU</th><th>Category</th><th>Price</th><th>Stock</th><th></th></tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td><td>{p.sku}</td><td>{p.category || "—"}</td>
                <td>₹{Number(p.price).toLocaleString("en-IN")}</td>
                <td>{p.stock} {p.stock <= p.minStock && <span className="badge bg-danger ms-1">Low</span>}</td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(p)}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}