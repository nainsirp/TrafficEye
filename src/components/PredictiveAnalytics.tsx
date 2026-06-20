"use client";

import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { 
  TrendingUp, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  Sliders, 
  Brain,
  AlertTriangle,
  ArrowRight
} from "lucide-react";

interface Hotspot {
  id: string;
  name: string;
  type: string;
  riskPct: number;
  peakHour: string;
  status: "Normal" | "Elevated" | "Critical";
  coors: { top: string; left: string };
}

const mockHotspots: Hotspot[] = [
  {
    id: "JUNC-A",
    name: "Junction A (MG Road Crossroads)",
    type: "Red-Light Risk",
    riskPct: 82,
    peakHour: "09:00 - 10:30",
    status: "Critical",
    coors: { top: "35%", left: "45%" }
  },
  {
    id: "JUNC-B",
    name: "Junction B (Outer Ring Flyover)",
    type: "Helmet Violation Risk",
    riskPct: 76,
    peakHour: "18:00 - 19:30",
    status: "Elevated",
    coors: { top: "65%", left: "25%" }
  },
  {
    id: "JUNC-C",
    name: "Junction C (Central Market Gate)",
    type: "Wrong-Side Driving Risk",
    riskPct: 58,
    peakHour: "13:00 - 14:30",
    status: "Elevated",
    coors: { top: "45%", left: "70%" }
  },
  {
    id: "JUNC-D",
    name: "Junction D (Tech Park Boulevard)",
    type: "Illegal Parking Risk",
    riskPct: 35,
    peakHour: "12:00 - 13:30",
    status: "Normal",
    coors: { top: "20%", left: "60%" }
  }
];

// Predictive timeline chart data (Next 12 hours)
const timelineData = [
  { hour: "14:00", risk: 42, flow: 120 },
  { hour: "15:00", risk: 48, flow: 130 },
  { hour: "16:00", risk: 55, flow: 165 },
  { hour: "17:00", risk: 72, flow: 210 },
  { hour: "18:00", risk: 85, flow: 240 }, // Peak
  { hour: "19:00", risk: 80, flow: 220 },
  { hour: "20:00", risk: 65, flow: 180 },
  { hour: "21:00", risk: 48, flow: 140 },
  { hour: "22:00", risk: 38, flow: 100 },
  { hour: "23:00", risk: 30, flow: 80 },
];

export default function PredictiveAnalytics() {
  const [activeHotspot, setActiveHotspot] = useState<Hotspot>(mockHotspots[0]);
  const [modelMode, setModelMode] = useState<string>("neural");

  const getStatusColor = (status: Hotspot["status"]) => {
    switch (status) {
      case "Normal": return "text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20";
      case "Elevated": return "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20";
      case "Critical": return "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20";
    }
  };

  const getRiskPulseColor = (risk: number) => {
    if (risk > 80) return "bg-[#EF4444] pulse-glow-danger";
    if (risk > 60) return "bg-[#F59E0B]";
    return "bg-[#22C55E]";
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Alert */}
      <div className="glass-panel rounded-3xl p-5 border-l-4 border-l-[#EF4444] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-center justify-center text-[#EF4444] shrink-0 animate-pulse">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-mono uppercase">Predictive Peak Anomaly Warning</h4>
            <p className="text-zinc-400 text-xs font-light mt-0.5">
              LSTM Forecast models indicate a <span className="text-[#EF4444] font-bold">82% violation probability spike</span> at Junction A within the next 45 minutes.
            </p>
          </div>
        </div>
        <button 
          onClick={() => setActiveHotspot(mockHotspots[0])}
          className="bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-xs font-mono font-bold px-4 py-2 rounded-xl hover:bg-[#EF4444]/20 transition-all flex items-center gap-1.5 cursor-pointer w-max shrink-0"
        >
          Isolate Zone
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Grid: Future Hotspot Map & Curve Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Map Vector Panel (Col 7) */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 flex flex-col gap-6 relative overflow-hidden">
          
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#00D4FF]" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">Predictive Anomaly Heatmap</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">MODEL_FORECAST // T+60M</span>
          </div>

          {/* Interactive Blueprint Map Vector */}
          <div className="flex-1 min-h-[300px] rounded-2xl bg-zinc-950 border border-white/5 relative overflow-hidden flex items-center justify-center">
            
            {/* Map lines */}
            <svg className="w-full h-full opacity-10 absolute" viewBox="0 0 300 180">
              {/* Complex road meshes */}
              <path d="M 20 20 L 280 20 M 20 90 L 280 90 M 20 160 L 280 160 M 50 10 L 50 170 M 150 10 L 150 170 M 250 10 L 250 170" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
              <path d="M 20 20 L 280 160 M 280 20 L 20 160" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
              <circle cx="150" cy="90" r="40" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            </svg>

            {/* Pulsing Hotspots Nodes */}
            {mockHotspots.map((hs) => (
              <button
                key={hs.id}
                onClick={() => setActiveHotspot(hs)}
                style={{ top: hs.coors.top, left: hs.coors.left }}
                className={`absolute group flex flex-col items-center cursor-pointer transition-transform hover:scale-110 active:scale-95`}
              >
                {/* Concentric rings */}
                <div className="relative w-8 h-8 flex items-center justify-center">
                  <span className={`absolute inset-0 rounded-full opacity-20 border border-current animate-ping ${
                    hs.riskPct > 80 ? "text-[#EF4444]" : hs.riskPct > 60 ? "text-[#F59E0B]" : "text-[#22C55E]"
                  }`} />
                  <span className={`w-3.5 h-3.5 rounded-full border border-white/40 flex items-center justify-center ${getRiskPulseColor(hs.riskPct)}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </span>
                </div>
                {/* Label tooltips */}
                <div className="absolute top-8 bg-zinc-950/90 border border-white/10 px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-mono text-zinc-300 w-max z-20 pointer-events-none">
                  {hs.name.split(" ")[0]} ({hs.riskPct}%)
                </div>
              </button>
            ))}

            {/* Scanning radar visual overlay */}
            <div className="laser-scanner" />
            <div className="absolute bottom-3 left-3 bg-[#111827]/80 px-2 py-1 rounded border border-white/5 text-[9px] font-mono text-[#00D4FF]">
              SYSTEM: AI PREDICTIVE OVERLAY // 1H WINDOW
            </div>
          </div>

        </div>

        {/* Prediction Data & Curves (Col 5) */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 flex flex-col justify-between">
          
          <div className="space-y-6">
            
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div>
                <h4 className="font-outfit font-extrabold text-lg text-white">Probability Forecast</h4>
                <p className="text-zinc-500 text-[10px]">Statistical curve for isolated junction.</p>
              </div>
              <span className={`text-[10px] font-mono border px-2 py-0.5 rounded font-bold uppercase ${getStatusColor(activeHotspot.status)}`}>
                {activeHotspot.status} Risk
              </span>
            </div>

            {/* Statistics */}
            <div className="space-y-3 font-mono bg-[#111827]/70 border border-white/5 p-4 rounded-2xl">
              <div className="flex justify-between text-xs pb-1 border-b border-white/5">
                <span className="text-zinc-500">Selected Node</span>
                <span className="text-zinc-200 font-bold">{activeHotspot.id}</span>
              </div>
              <div className="flex justify-between text-xs pb-1 border-b border-white/5">
                <span className="text-zinc-500">Zone Name</span>
                <span className="text-zinc-300 font-light truncate max-w-[150px]">{activeHotspot.name}</span>
              </div>
              <div className="flex justify-between text-xs pb-1 border-b border-white/5">
                <span className="text-zinc-500">Flag Category</span>
                <span className="text-[#00D4FF] font-bold">{activeHotspot.type}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Peak Risk Hours</span>
                <span className="text-[#F59E0B] font-bold">{activeHotspot.peakHour}</span>
              </div>
            </div>

            {/* Recharts Curve Chart */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-zinc-400 uppercase font-mono tracking-wide">12-Hour Risk Curve (%)</h5>
              <div className="h-[140px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timelineData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={activeHotspot.status === "Critical" ? "#EF4444" : "#F59E0B"} stopOpacity={0.4}/>
                        <stop offset="95%" stopColor={activeHotspot.status === "Critical" ? "#EF4444" : "#F59E0B"} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="hour" stroke="#4b5563" fontSize={9} tickLine={false} />
                    <YAxis stroke="#4b5563" fontSize={9} tickLine={false} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#111827", borderColor: "rgba(255,255,255,0.08)", borderRadius: "8px" }}
                      labelStyle={{ color: "#fff", fontSize: "10px" }}
                      itemStyle={{ fontSize: "10px" }}
                    />
                    <Area type="monotone" dataKey="risk" stroke={activeHotspot.status === "Critical" ? "#EF4444" : "#F59E0B"} strokeWidth={2} fillOpacity={1} fill="url(#colorRisk)" name="Risk Probability" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Forecast Neural core */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-3.5 mt-4">
            <Brain className="w-5 h-5 text-purple-400 shrink-0" />
            <div>
              <h6 className="text-[10px] text-zinc-400 uppercase font-mono font-bold">Neural Engine: Conv-LSTM Network</h6>
              <span className="text-[10px] text-zinc-500 font-light block leading-relaxed">
                Spatial-temporal modeling processes historical sensor densities to project violation probabilities.
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
