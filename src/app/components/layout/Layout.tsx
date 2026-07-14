import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout() {

  return (
    <div className="admin-layout">

      <Sidebar />

      <main className="main-content">

        <Navbar />

        <section className="page-container">
          <Outlet />
        </section>

      </main>

    </div>
  );
}