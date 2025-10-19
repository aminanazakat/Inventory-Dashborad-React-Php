import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { roleImages } from "../utils/roleImages";

export default function Layout() {
  const user = JSON.parse(localStorage.getItem("user"));
  const roleId = user?.role_id; // 1 = Admin, 2 = Sales, 3 = Purchase

  const getRoleImage = () => {
    if (user?.role_id === "1" || user?.role_id === 1) {
      return "/assets/img/admin.svg";
    } else if (user?.role_id === "2" || user?.role_id === 2) {
      return "/assets/img/Sales Manager.svg";
    } else if (user?.role_id === "3" || user?.role_id === 3) {
      return "/assets/img/Purchase Manager.svg";
    } else {
      return "/assets/img/admin.svg"; // fallback
    }
  };
 


  return (
    <div id="wrapper">
      {/* Sidebar */}
      <ul
        className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
        id="accordionSidebar"
      >
        <Link
          className="sidebar-brand d-flex align-items-center justify-content-center"
          to="/"
        >
          <div className="sidebar-brand-icon rotate-n-15">
            <i className="fas fa-boxes"></i>
          </div>
          <div className="sidebar-brand-text mx-3">IMS</div>
        </Link>

        <hr className="sidebar-divider my-0" />

        <li className="nav-item">
          <NavLink className="nav-link" to="/">
            <i className="fas fa-fw fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </NavLink>
        </li>

        <hr className="sidebar-divider" />
        <div className="sidebar-heading">Manage</div>

        {/* Products + Categories (Admin only) */}
        {roleId === 1 && (
          <>
            <li className="nav-item">
              <NavLink className="nav-link" to="/products">
                <i className="fas fa-box"></i>
                <span className="ms-1">Products</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/categories">
                <i className="fas fa-tags"></i>
                <span className="ms-2">Categories</span>
              </NavLink>
            </li>
          </>
        )}

        {/* Sales + Customers (Admin + Sales) */}
        {(roleId === 1 || roleId === 2) && (
          <>
            <li className="nav-item">
              <NavLink className="nav-link" to="/sales">
                <i className="fas fa-shopping-cart"></i>
                <span className="ms-2">Sales</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/customers">
                <i className="fas fa-user-friends"></i>
                <span className="ms-2">Customers</span>
              </NavLink>
            </li>
          </>
        )}

        {/* Purchases + Suppliers (Admin + Purchase) */}
        {(roleId === 1 || roleId === 3) && (
          <>
            <li className="nav-item">
              <NavLink className="nav-link" to="/suppliers">
                <i className="fas fa-users"></i>
                <span className="ms-2">Suppliers</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/purchases">
                <i className="fas fa-truck-loading"></i>
                <span className="ms-2">Purchases</span>
              </NavLink>
            </li>
          </>
        )}

        {/* Stock + Reports (Admin only) */}
        {roleId === 1 && (
          <>
            <li className="nav-item">
              <NavLink className="nav-link" to="/stock">
                <i className="fas fa-exchange-alt"></i>
                <span className="ms-2">Stock Movements</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/reports">
                <i className="fas fa-chart-bar"></i>
                <span className="ms-2">Reports</span>
              </NavLink>
            </li>
          </>
        )}

        <hr className="sidebar-divider d-none d-md-block" />

        {/* Users (Admin only) */}
        {roleId === 1 && (
          <li className="nav-item">
            <NavLink className="nav-link" to="/users">
              <i className="fas fa-user"></i>
              <span className="ms-2">Users</span>
            </NavLink>
          </li>
        )}
      </ul>

      {/* Content Wrapper */}
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          {/* Topbar */}
          <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
            <button
              id="sidebarToggleTop"
              className="btn btn-link d-md-none rounded-circle mr-3"
            >
              <i className="fa fa-bars" />
            </button>

            {/* Search */}
            <form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control bg-light border-0 small"
                  placeholder="Search for..."
                  aria-label="Search"
                  aria-describedby="basic-addon2"
                />
                <div className="input-group-append">
                  <button className="btn btn-primary" type="button">
                    <i className="fas fa-search fa-sm" />
                  </button>
                </div>
              </div>
            </form>

            {/* Topbar Navbar */}
            <ul className="navbar-nav ml-auto">
              {/* User Info */}
              <li className="nav-item dropdown no-arrow">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="userDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <span className="mr-2 d-none d-lg-inline text-gray-600 small">
                    {user?.full_name || "Guest"}
                  </span>
                  <img
                    src={getRoleImage()}
                    alt="Profile"
                    className="img-profile rounded-circle"
                  />
                </a>
                <div
                  className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                  aria-labelledby="userDropdown"
                >
                  <Link className="dropdown-item" to="/profile">
                    <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400" />
                    Profile
                  </Link>
                  <div className="dropdown-divider" />
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={() => {
                      localStorage.removeItem("user");
                      window.location.href = "/login";
                    }}
                  >
                    <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400" />
                    Logout
                  </a>
                </div>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="container-fluid">
          <Outlet />
        </div>

        {/* Footer */}
        <footer className="sticky-footer bg-white mt-auto">
          <div className="container my-auto">
            <div className="copyright text-center my-auto">
              <span>© {new Date().getFullYear()} IMS</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
