import { useEffect, useState } from "react";
import { getDashboardSummary } from "../../services/dashboard.service";
import { useAuth } from "../../hooks/useAuth";
import type { DashboardSummary } from "../types";

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => { getDashboardSummary().then(setSummary); }, []);

  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  const cards = [
    { label: "Total Customers", value: summary?.totalCustomers ?? "—" },
    { label: "Total Products", value: summary?.totalProducts ?? "—" },
    { label: "Low Stock", value: summary?.lowStock ?? "—", danger: (summary?.lowStock ?? 0) > 0 },
    { label: "Today's Challans", value: summary?.todaysChallans ?? "—" },
    { label: "Total Inventory Value", value: summary ? fmt(summary.totalInventoryValue) : "—" },
  ];

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Welcome, {user?.name}</h3>
        <span className="badge bg-primary-subtle text-primary">{user?.role}</span>
      </div>
      <div className="row g-3">
        {cards.map((c) => (
          <div className="col-md-3" key={c.label}>
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <div className="text-muted small">{c.label}</div>
                <div className={`fs-3 fw-bold ${c.danger ? "text-danger" : "text-primary"}`}>{c.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}