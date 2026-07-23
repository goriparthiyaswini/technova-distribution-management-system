import { useEffect, useState, FormEvent } from "react";
import * as customerService from "../../services/customer.service";
import type { Customer } from "../types";

const EMPTY: Omit<Customer, "id"> = { name: "", phone: "", email: "", business: "", gst: "", address: "", status: "ACTIVE", notes: "" };

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);

  async function fetchData() {
    setCustomers(await customerService.getCustomers(search || undefined, status || undefined));
  }

  useEffect(() => {
    const t = setTimeout(fetchData, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status]);

  function openAdd() { setEditingId(null); setForm(EMPTY); setShowForm(true); }
  function openEdit(c: Customer) { setEditingId(c.id); setForm({ ...EMPTY, ...c }); setShowForm(true); }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (editingId) await customerService.updateCustomer(editingId, form);
    else await customerService.createCustomer(form);
    setShowForm(false); fetchData();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this customer?")) return;
    await customerService.deleteCustomer(id); fetchData();
  }

  return (
    <>
      <div className="d-flex justify-content-between mb-3">
        <h3>Customers</h3>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Customer</button>
      </div>

      {showForm && (
        <div className="card mb-3 p-3">
          <form onSubmit={handleSubmit}>
            <div className="row g-2">
              <div className="col-md-6"><label className="form-label">Name</label>
                <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="col-md-6"><label className="form-label">Phone</label>
                <input className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required /></div>
              <div className="col-md-6"><label className="form-label">Email</label>
                <input type="email" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div className="col-md-6"><label className="form-label">Business Name</label>
                <input className="form-control" value={form.business} onChange={(e) => setForm({ ...form, business: e.target.value })} /></div>
              <div className="col-md-6"><label className="form-label">GST Number</label>
                <input className="form-control" value={form.gst} onChange={(e) => setForm({ ...form, gst: e.target.value })} /></div>
              <div className="col-md-6"><label className="form-label">Status</label>
                <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })}>
                  <option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option>
                </select></div>
              <div className="col-12"><label className="form-label">Address</label>
                <input className="form-control" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
              <div className="col-12"><label className="form-label">Follow-up Notes</label>
                <textarea className="form-control" rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
            </div>
            <div className="mt-3">
              <button className="btn btn-primary me-2">Save</button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card p-3">
        <div className="d-flex gap-2 mb-3">
          <input className="form-control" style={{ maxWidth: 280 }} placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="form-select" style={{ maxWidth: 160 }} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Statuses</option><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option>
          </select>
        </div>
        <table className="table table-hover align-middle">
          <thead><tr><th>Name</th><th>Business</th><th>Phone</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td><td>{c.business || "—"}</td><td>{c.phone}</td>
                <td><span className={`badge ${c.status === "ACTIVE" ? "bg-success" : "bg-secondary"}`}>{c.status}</span></td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(c)}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}