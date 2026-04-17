"use client";

// ======================================================
// Shell visual principal do dashboard
// Responsável por:
// - organizar a sidebar no desktop
// - exibir header no topo
// - exibir navegação inferior no mobile
// - manter o conteúdo com espaçamento premium
// ======================================================

import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileBottomNav from "./MobileBottomNav";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex min-h-screen w-full flex-1 flex-col">
          <div className="hidden lg:block">
            <Header />
          </div>

          <main className="flex-1 px-0 pb-0 pt-0 md:px-0 md:pb-0 lg:px-8 lg:pb-10 lg:pt-6">
            <div className="w-full">{children}</div>
          </main>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
}
