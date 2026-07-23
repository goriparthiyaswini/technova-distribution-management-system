import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaUsers, FaBoxOpen, FaWarehouse, FaFileInvoice, FaUserShield } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import type { Role } from "../types";

interface NavItem { to: string; label: string; icon: JSX.Element; roles?: Role[]; }

const NAV_ITEMS: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
  { to: "/customers", label: "Customers", icon: <FaUsers />, roles: ["ADMIN", "SALES"] },
  { to: "/products", label: "Products", icon: <FaBoxOpen />, roles: ["ADMIN", "WAREHOUSE"] },
  { to: "/inventory", label: "Inventory", icon: <FaWarehouse />, roles: ["ADMIN", "WAREHOUSE"] },
  { to: "/challans", label: "Sales Challans", icon: <FaFileInvoice />, roles: ["ADMIN", "SALES", "ACCOUNTS"] },
  { to: "/users", label: "Users", icon: <FaUserShield />, roles: ["ADMIN"] },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const items = NAV_ITEMS.filter((i) => !i.roles || (user && i.roles.includes(user.role)));

  return (
    <div className="bg-white border-end vh-100 position-fixed d-flex flex-column" style={{ width: 240 }}>
      <div className="p-3 border-bottom">
        <h5 className="text-primary mb-0 fw-bold">TechNova</h5>
        <small className="text-muted">Distribution Mgmt System</small>
      </div>
      <nav className="flex-grow-1 p-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `d-flex align-items-center gap-2 px-3 py-2 rounded text-decoration-none mb-1 ${isActive ? "bg-primary text-white" : "text-dark"}`}
          >
            {item.icon} {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-top">
        <div className="fw-semibold small">{user?.name}</div>
        <div className="text-muted small mb-2">{user?.role}</div>
        <button className="btn btn-outline-secondary btn-sm w-100" onClick={logout}>Logout</button>
      </div>
    </div>
  );
}