import React from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="app-shell d-flex">
      <Sidebar />
      <div className="app-body flex-grow-1">
        <Topbar />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
};

export default Layout;

