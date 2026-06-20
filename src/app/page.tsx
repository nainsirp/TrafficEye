"use client";

import { useState } from "react";
import LandingPage from "@/components/LandingPage";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  const [view, setView] = useState<"landing" | "dashboard">("landing");

  return (
    <div className="flex flex-col min-h-screen">
      {view === "landing" ? (
        <LandingPage onEnterDashboard={() => setView("dashboard")} />
      ) : (
        <Dashboard onExitDashboard={() => setView("landing")} />
      )}
    </div>
  );
}
