import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import React from "react";
import Header from "@/components/organisms/Header";

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="pt-16">
        <Outlet />
      </main>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
)
}