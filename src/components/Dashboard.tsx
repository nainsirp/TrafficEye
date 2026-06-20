"use client";

import { useState, useEffect } from "react";
import { 
  Eye, 
  Tv, 
  Activity, 
  MapPin, 
  FileText, 
  UserCheck, 
  TrendingUp, 
  LogOut,
  Cpu,
  Wifi,
  Shield,
  Layers,
  Database,
  Search,
  Bell
} from "lucide-react";

// Import sub-components (to be implemented next)
import LiveMonitor from "./LiveMonitor";
import DetectionCenter from "./DetectionCenter";
import LprModule from "./LprModule";
import XaiView from "./XaiView";
import SeverityScoring from "./SeverityScoring";
import PredictiveAnalytics from "./PredictiveAnalytics";
import DigitalTwin from "./DigitalTwin";
import AnalyticsView from "./AnalyticsView";

interface DashboardProps {
  onExitDashboard: () => void;
}

export default function Dashboard({ onExitDashboard }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<string>("live-monitor");
  const [systemTime, setSystemTime] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("Senior Operator");
  const [notifications, setNotifications] = useState<number>(3);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Tick the clock with a formatted timestamp
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSystemTime(
        now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
        " | " +
        now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }) +
        " UTC+5:30"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { id: "live-monitor", label: "Live Traffic Monitor", icon: Tv },
    { id: "detection-center", label: "Violation Detection Center", icon: UserCheck, badge: "Live Feed" },
    { id: "lpr-module", label: "License Plate Recognition", icon: Search },
    { id: "xai-view", label: "Explainable AI (XAI)", icon: Cpu },
    { id: "severity-scoring", label: "Severity Scoring", icon: Activity },
    { id: "predictive-analytics", label: "Predictive Analytics", icon: MapPin },
    { id: "digital-twin", label: "Digital Twin Visualization", icon: Layers },
    { id: "analytics-view", label: "Detailed Analytics Hub", icon: TrendingUp },
  ];

  const renderActiveView = () => {
    switch (activeTab) {
      case "live-monitor":
        return <LiveMonitor onGoToVerify={() => setActiveTab("detection-center")} />;
      case "detection-center":
        return <DetectionCenter />;
      case "lpr-module":
        return <LprModule />;
      case "xai-view":
        return <XaiView />;
      case "severity-scoring":
        return <SeverityScoring />;
      case "predictive-analytics":
        return <PredictiveAnalytics />;
      case "digital-twin":
        return <DigitalTwin />;
      case "analytics-view":
        return <AnalyticsView />;
      default:
        return <LiveMonitor onGoToVerify={() => setActiveTab("detection-center")} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0B1020] text-zinc-100 overflow-hidden font-sans">
      
      {/* SIDEBAR NAVIGATION */}
      <aside 
        className={`${
          sidebarOpen ? "w-72" : "w-20"
        } bg-[#111827]/80 backdrop-blur-xl border-r border-white/5 flex flex-col transition-all duration-300 ease-in-out relative z-30`}
      >
        {/* Brand/Logo Area */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 shrink-0 rounded-lg bg-gradient-to-tr from-[#3B82F6] to-[#00D4FF] flex items-center justify-center glow-border-cyan">
              <Eye className="w-6 h-6 text-[#0B1020] stroke-[2.5]" />
            </div>
            {sidebarOpen && (
              <div className="flex flex-col">
                <span className="font-outfit font-extrabold text-sm tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00D4FF]">
                  TRAFFIC-EYE
                </span>
                <span className="text-[10px] font-mono text-zinc-500 tracking-widest leading-none mt-0.5">
                  SYSTEM CORE
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs List */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all group duration-200 cursor-pointer
                  ${isActive 
                    ? "bg-gradient-to-r from-[#00D4FF]/10 to-[#3B82F6]/5 border border-[#00D4FF]/30 text-[#00D4FF] font-semibold" 
                    : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }
                `}
              >
                <Icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 duration-200 ${isActive ? "text-[#00D4FF]" : "text-zinc-400"}`} />
                {sidebarOpen && (
                  <span className="text-sm truncate flex-1 text-left">{item.label}</span>
                )}
                {sidebarOpen && item.badge && (
                  <span className="text-[9px] font-mono font-bold bg-[#EF4444]/20 text-[#EF4444] px-1.5 py-0.5 rounded border border-[#EF4444]/30 animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Exit/Return Button */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={onExitDashboard}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors cursor-pointer border border-transparent hover:border-[#EF4444]/20"
          >
            <LogOut className="w-5 h-5 shrink-0 stroke-[2]" />
            {sidebarOpen && (
              <span className="text-sm font-semibold">Exit Platform</span>
            )}
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* TOP NAVBAR HEADER */}
        <header className="h-16 shrink-0 bg-[#111827]/40 backdrop-blur-md border-b border-white/5 px-6 md:px-8 flex justify-between items-center relative z-20">
          {/* Collapse sidebar button */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer hidden md:block"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M4 6h16M4 12h12M4 18h16" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
            <span className="text-sm font-mono text-zinc-500 uppercase tracking-widest hidden sm:inline-block">
              {menuItems.find(item => item.id === activeTab)?.label}
            </span>
          </div>

          {/* Telemetries and System Status */}
          <div className="flex items-center gap-6">
            
            {/* Clock */}
            <span className="text-xs font-mono text-zinc-400 border border-white/5 bg-[#0B1020]/80 px-3.5 py-1.5 rounded-lg hidden lg:block shadow-inner">
              {systemTime || "Loading Clock..."}
            </span>

            {/* Health / Signal */}
            <div className="flex items-center gap-2 border border-white/5 bg-[#0b1020]/80 px-3.5 py-1.5 rounded-lg text-xs hidden md:flex">
              <Wifi className="w-3.5 h-3.5 text-[#22C55E]" />
              <span className="text-[#22C55E] font-semibold font-mono uppercase tracking-wider">SECURE LINK</span>
            </div>

            {/* User Role Selector */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end text-right hidden sm:flex">
                <span className="text-xs font-semibold text-zinc-200">Officer Nains</span>
                <select 
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  className="text-[10px] font-mono text-[#00D4FF] bg-transparent border-none focus:outline-none cursor-pointer uppercase font-bold"
                >
                  <option value="Senior Operator">Senior Operator</option>
                  <option value="Traffic Chief">Traffic Chief</option>
                  <option value="Municipal Admin">Admin (City Node)</option>
                </select>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#00D4FF] flex items-center justify-center text-[#0B1020] font-black text-xs cursor-default">
                N
              </div>
            </div>

            {/* Notification Center */}
            <button 
              onClick={() => setNotifications(0)} 
              className="relative p-1.5 rounded-lg border border-white/5 hover:bg-white/5 text-zinc-400 hover:text-white cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {notifications > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full bg-[#EF4444] text-[9px] font-bold text-white flex items-center justify-center border border-[#0B1020]">
                  {notifications}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* SUB-DASHBOARD CANVAS WINDOW */}
        <main className="flex-1 overflow-y-auto bg-[#0B1020] cyber-grid relative">
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#0B1020]/20 to-transparent pointer-events-none z-10" />
          <div className="p-6 md:p-8 relative z-20">
            {renderActiveView()}
          </div>
        </main>
      </div>
    </div>
  );
}
