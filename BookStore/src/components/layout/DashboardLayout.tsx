"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/dashboard/FloatingActions";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="min-h-screen bg-[#f3f3f9]">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {mobileOpen && (
        <>
          <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
            <Sidebar onNavigate={closeMobile} />
          </div>
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={closeMobile}
            aria-hidden
          />
        </>
      )}

      <div className="flex min-h-screen flex-col lg:ml-[250px]">
        <Header onToggleSidebar={() => setMobileOpen((v) => !v)} />
        <main className="flex-1 px-4 py-4 sm:px-6">{children}</main>
        <Footer />
      </div>

      <FloatingActions />
    </div>
  );
}
