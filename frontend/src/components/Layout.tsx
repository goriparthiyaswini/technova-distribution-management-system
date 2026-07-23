import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div className="d-flex">
      <Sidebar />
      <main className="flex-grow-1 p-4" style={{ marginLeft: 240 }}>
        <Outlet />
      </main>
    </div>
  );
}