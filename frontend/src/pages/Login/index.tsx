import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally { setLoading(false); }
  }

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-primary bg-gradient">
      <div className="card shadow p-4" style={{ width: 380 }}>
        <h4 className="fw-bold mb-1">TechNova Distribution Management System</h4>
        <p className="text-muted small mb-3">Sign in to continue</p>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button className="btn btn-primary w-100" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</button>
        </form>
        <p className="text-muted small mt-3 mb-0">
          Demo: admin@technova.com / sales@technova.com / warehouse@technova.com / accounts@technova.com — password: Password@123
        </p>
      </div>
    </div>
  );
}