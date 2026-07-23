import { useEffect, useState, FormEvent } from "react";
import * as userService from "../../services/user.service";
import type { User, Role } from "../types";

const EMPTY = { name: "", email: "", password: "", role: "SALES" as const };

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");

  async function fetchData() { setUsers(await userService.getUsers()); }
  useEffect(() => { fetchData(); }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault(); setError("");
    try { await userService.createUser(form); setForm(EMPTY); setShowForm(false); fetchData(); }
    catch (err: any) { setError(err.response?.data?.message || "Failed to create user"); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this user?")) return;
    await userService.deleteUser(id); fetchData();
  }

  return (
    <>
      <div className="d-flex justify-content-between mb-3">
        <h3>Users</h3>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add User</button>
      </div>
      {showForm && (
        <div className="card p-3 mb-3">
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="row g-2">
              <div className="col-md-6"><label className="form-label">Name</label>
                <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="col-md-6"><label className="form-label">Email</label>
                <input type="email" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
              <div className="col-md-6"><label className="form-label">Temporary Password</label>
                <input type="password" className="form-control" minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></div>
              <div className="col-md-6"><label className="form-label">Role</label>
                <select className="form-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as any })}>
                  <option value="ADMIN">Admin</option><option value="SALES">Sales</option><option value="WAREHOUSE">Warehouse</option><option value="ACCOUNTS">Accounts</option>
                </select></div>
            </div>
            <div className="mt-3">
              <button className="btn btn-primary me-2">Create</button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      <div className="card p-3">
        <table className="table table-hover align-middle">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th></th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td><td>{u.email}</td><td><span className="badge bg-primary">{u.role}</span></td>
                <td><button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(u.id)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
