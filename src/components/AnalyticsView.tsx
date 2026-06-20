"use client";

import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { 
  TrendingUp, 
  CheckCircle, 
  Percent, 
  ShieldCheck, 
  Layers,
  Award
} from "lucide-react";

// Color Palette
const COLORS = ["#EF4444", "#3B82F6", "#00D4FF", "#F59E0B", "#8B5CF6"];

// 1. Violation Distribution Data
const distributionData = [
  { name: "Red Light Jump", value: 38 },
  { name: "Helmet Violation", value: 28 },
  { name: "Wrong Side Driving", value: 16 },
  { name: "Speeding Violation", value: 12 },
  { name: "Illegal Parking", value: 6 },
];

// 2. Monthly Growth Data
const growthData = [
  { month: "Jan", automated: 1200, manual: 850 },
  { month: "Feb", automated: 1450, manual: 720 },
  { month: "Mar", automated: 1800, manual: 640 },
  { month: "Apr", automated: 2200, manual: 510 },
  { month: "May", automated: 2700, manual: 420 },
  { month: "Jun", automated: 3200, manual: 310 },
];

// 3. Top Locations Data
const locationData = [
  { name: "Junction A", count: 980 },
  { name: "Junction B", count: 740 },
  { name: "Junction C", count: 620 },
  { name: "Junction D", count: 480 },
  { name: "Junction E", count: 320 },
];

// 4. Repeat Offenders Data
const offenderData = [
  { name: "First-Time", value: 78, color: "#22C55E" },
  { name: "1 Previous Offense", value: 14, color: "#3B82F6" },
  { name: "Multiple Offenses", value: 8, color: "#EF4444" },
];

export default function AnalyticsView() {
  return (
    <div className="space-y-6">
      
      {/* Overview Efficiency KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-[#22C55E] flex items-center justify-between">
          <div>
            <span className="text-zinc-500 text-xs uppercase font-mono tracking-wider font-semibold">Enforcement Efficiency</span>
            <h4 className="text-2xl font-black text-[#22C55E] font-mono">92.4% <span className="text-xs text-zinc-500 font-normal">(+4.2%)</span></h4>
          </div>
          <div className="p-3 bg-[#22C55E]/10 rounded-xl text-[#22C55E] border border-[#22C55E]/20">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-[#00D4FF] flex items-center justify-between">
          <div>
            <span className="text-zinc-500 text-xs uppercase font-mono tracking-wider font-semibold">AI Auto-Approval Rate</span>
            <h4 className="text-2xl font-black text-[#00D4FF] font-mono">84.2% <span className="text-xs text-zinc-500 font-normal">SaaS Filtered</span></h4>
          </div>
          <div className="p-3 bg-[#00D4FF]/10 rounded-xl text-[#00D4FF] border border-[#00D4FF]/20">
            <Percent className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-[#8B5CF6] flex items-center justify-between">
          <div>
            <span className="text-zinc-500 text-xs uppercase font-mono tracking-wider font-semibold">Daily Citations Dispatched</span>
            <h4 className="text-2xl font-black text-white font-mono">3,892 <span className="text-xs text-zinc-500 font-normal">Verified Packages</span></h4>
          </div>
          <div className="p-3 bg-[#8B5CF6]/10 rounded-xl text-[#8B5CF6] border border-[#8B5CF6]/20">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Violation Distribution (Donut) */}
        <div className="glass-panel rounded-3xl p-6 flex flex-col gap-4">
          <div>
            <h4 className="font-outfit font-extrabold text-white text-base">Violation Type Distribution</h4>
            <p className="text-zinc-500 text-xs">Categorical breakdown of total citation records for current quarter.</p>
          </div>
          <div className="h-[250px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${percent !== undefined ? (percent * 100).toFixed(0) : 0}%)`}
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#111827", borderColor: "rgba(255,255,255,0.08)", borderRadius: "8px" }}
                  itemStyle={{ fontSize: "11px", color: "#fff" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Monthly Growth (Area) */}
        <div className="glass-panel rounded-3xl p-6 flex flex-col gap-4">
          <div>
            <h4 className="font-outfit font-extrabold text-white text-base">Monthly Automated vs Manual Processing</h4>
            <p className="text-zinc-500 text-xs">Compares algorithmic enforcement scaling against human review constraints.</p>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAuto" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00D4FF" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorManual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#4b5563" fontSize={10} tickLine={false} />
                <YAxis stroke="#4b5563" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#111827", borderColor: "rgba(255,255,255,0.08)", borderRadius: "8px" }}
                  labelStyle={{ color: "#fff", fontSize: "11px" }}
                  itemStyle={{ fontSize: "11px" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Area type="monotone" dataKey="automated" stroke="#00D4FF" strokeWidth={2} fillOpacity={1} fill="url(#colorAuto)" name="AI Auto-Dispatched" />
                <Area type="monotone" dataKey="manual" stroke="#8B5CF6" strokeWidth={1} fillOpacity={1} fill="url(#colorManual)" name="Human Verified" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Top Locations (Horizontal Bar) */}
        <div className="glass-panel rounded-3xl p-6 flex flex-col gap-4">
          <div>
            <h4 className="font-outfit font-extrabold text-white text-base">Top Violation Junctions</h4>
            <p className="text-zinc-500 text-xs">Junction sensor nodes returning the highest concentration of anomalies.</p>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationData} layout="vertical" margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis type="number" stroke="#4b5563" fontSize={10} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#4b5563" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#111827", borderColor: "rgba(255,255,255,0.08)", borderRadius: "8px" }}
                  itemStyle={{ fontSize: "11px", color: "#fff" }}
                />
                <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]} name="Citations Issued">
                  {locationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Repeat Offenders (Pie) */}
        <div className="glass-panel rounded-3xl p-6 flex flex-col gap-4">
          <div>
            <h4 className="font-outfit font-extrabold text-white text-base">Offender History Index</h4>
            <p className="text-zinc-500 text-xs">Distinguishes first-time violations against chronic traffic rule repeat offenders.</p>
          </div>
          <div className="h-[250px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={offenderData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${percent !== undefined ? (percent * 100).toFixed(0) : 0}%)`}
                >
                  {offenderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#111827", borderColor: "rgba(255,255,255,0.08)", borderRadius: "8px" }}
                  itemStyle={{ fontSize: "11px", color: "#fff" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
