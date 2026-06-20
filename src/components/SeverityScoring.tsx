"use client";

import { useEffect, useState } from "react";
import { 
  Activity, 
  ShieldAlert, 
  Scale, 
  DollarSign, 
  TrafficCone,
  Zap,
  TrendingUp
} from "lucide-react";

interface ScoringRule {
  id: string;
  name: string;
  score: number;
  severity: "Low" | "Medium" | "High" | "Critical";
  baseFine: number;
  multiplier: number;
  desc: string;
  metrics: { label: string; value: string; pct: number }[];
}

const scoringRules: ScoringRule[] = [
  {
    id: "RULE-01",
    name: "Wrong-Side Driving",
    score: 95,
    severity: "Critical",
    baseFine: 200,
    multiplier: 2.5,
    desc: "Driving against traffic vectors poses immediate head-on crash risks. Fines are amplified due to high potential delta velocities.",
    metrics: [
      { label: "Velocity Delta Risk", value: "98/100", pct: 98 },
      { label: "Lane Density Factor", value: "1.8x", pct: 80 },
      { label: "Pedestrian Zone Proximity", value: "High Impact", pct: 90 },
      { label: "Collision Index Rating", value: "95%", pct: 95 }
    ]
  },
  {
    id: "RULE-02",
    name: "Red-Light Violation",
    score: 88,
    severity: "High",
    baseFine: 150,
    multiplier: 2.0,
    desc: "Entering active intersections during opposing lane green light phases. Bypasses signal timing windows.",
    metrics: [
      { label: "Intersection Encroachment", value: "88/100", pct: 88 },
      { label: "Opposing Traffic Speed", value: "54 km/h", pct: 60 },
      { label: "Signal Phase Delay", value: "1.4s late", pct: 75 },
      { label: "Offender Record Factor", value: "First Strike", pct: 10 }
    ]
  },
  {
    id: "RULE-03",
    name: "Triple Riding Violation",
    score: 68,
    severity: "Medium",
    baseFine: 100,
    multiplier: 1.5,
    desc: "Overloading light two-wheeled vehicles shifts center of gravity, degrading chassis braking efficiencies and control.",
    metrics: [
      { label: "Mass Balance Deficit", value: "68/100", pct: 68 },
      { label: "Passenger Load Count", value: "3 riders", pct: 70 },
      { label: "Helmet Usage Deficit", value: "Partial", pct: 50 },
      { label: "Chassis Strain Index", value: "Medium", pct: 40 }
    ]
  },
  {
    id: "RULE-04",
    name: "Helmet Non-Compliance",
    score: 42,
    severity: "Medium",
    baseFine: 50,
    multiplier: 1.2,
    desc: "Failure to wear an approved protective helmet. Poses direct life-safety hazards to the specific rider segment.",
    metrics: [
      { label: "Impact Safety Deficit", value: "90/100", pct: 90 },
      { label: "Rider Speed Rate", value: "42 km/h", pct: 42 },
      { label: "Junction Speed Zone", value: "50 km/h Limit", pct: 30 },
      { label: "Attribution Certainty", value: "97.3%", pct: 97 }
    ]
  },
  {
    id: "RULE-05",
    name: "Illegal Stationary Parking",
    score: 25,
    severity: "Low",
    baseFine: 40,
    multiplier: 1.0,
    desc: "Parking in marked no-stopping or emergency zones. Obstructs peripheral site scopes and lane widths.",
    metrics: [
      { label: "Obstruction Index", value: "25/100", pct: 25 },
      { label: "Obstruction Duration", value: "182 seconds", pct: 50 },
      { label: "Lane Capacity Impact", value: "-12% Flow", pct: 20 },
      { label: "Public Tow Eligibility", value: "Pending", pct: 15 }
    ]
  }
];

export default function SeverityScoring() {
  const [activeRule, setActiveRule] = useState<ScoringRule>(scoringRules[0]);
  const [gaugeValue, setGaugeValue] = useState(0);

  // Animate gauge sweep on selection
  useEffect(() => {
    setGaugeValue(0);
    const duration = 800; // ms
    const startTime = performance.now();
    const target = activeRule.score;

    let animId: number;

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing out quadratic
      const ease = progress * (2 - progress);
      setGaugeValue(Math.floor(ease * target));

      if (progress < 1) {
        animId = requestAnimationFrame(animate);
      }
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [activeRule]);

  const getSeverityColor = (sev: ScoringRule["severity"]) => {
    switch (sev) {
      case "Low": return "text-[#22C55E]";
      case "Medium": return "text-[#F59E0B]";
      case "High": return "text-orange-500";
      case "Critical": return "text-[#EF4444]";
    }
  };

  const getSeverityStroke = (sev: ScoringRule["severity"]) => {
    switch (sev) {
      case "Low": return "#22C55E";
      case "Medium": return "#F59E0B";
      case "High": return "#f97316";
      case "Critical": return "#EF4444";
    }
  };

  // SVG Gauge calculations
  const radius = 60;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (gaugeValue / 100) * circumference;

  const estimatedFine = activeRule.baseFine * activeRule.multiplier;

  return (
    <div className="space-y-6">
      
      {/* Selection Lists Sidebar Style */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Rule Selector list (Col 4) */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 flex flex-col gap-4">
          <div>
            <h4 className="font-outfit font-extrabold text-lg text-white">Hazard Matrix</h4>
            <p className="text-zinc-500 text-xs">Standardized violation types ranked by gravity scores.</p>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar">
            {scoringRules.map((rule) => (
              <button
                key={rule.id}
                onClick={() => setActiveRule(rule)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer text-left
                  ${activeRule.id === rule.id 
                    ? "bg-[#00D4FF]/10 border-[#00D4FF]/40 text-white" 
                    : "bg-white/5 border-transparent text-zinc-400 hover:text-white hover:bg-white/10"
                  }
                `}
              >
                <div className="space-y-1">
                  <h5 className="text-xs font-bold font-mono">{rule.name}</h5>
                  <span className={`text-[10px] uppercase font-mono font-bold ${getSeverityColor(rule.severity)}`}>
                    {rule.severity}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-base font-black font-mono">{rule.score}</span>
                  <span className="text-[9px] font-mono text-zinc-500 uppercase">Index</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Active Gauge and Details breakdown (Col 8) */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Gauge panel (Col 5 inside) */}
          <div className="md:col-span-5 glass-panel rounded-3xl p-6 flex flex-col items-center justify-center text-center gap-6 relative overflow-hidden">
            
            {/* Corner tags */}
            <div className="absolute top-4 left-4 text-[10px] font-mono text-zinc-500 uppercase">
              RADIAL_SWEEP
            </div>

            {/* Circular Gauge */}
            <div className="relative w-40 h-40 flex items-center justify-center mt-4">
              <svg className="w-full h-full transform -rotate-90">
                {/* Background Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="rgba(255,255,255,0.03)"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />
                {/* Foreground Active Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke={getSeverityStroke(activeRule.severity)}
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-75"
                />
              </svg>
              
              {/* Inner Text */}
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-mono font-black text-white">{gaugeValue}</span>
                <span className="text-[10px] font-mono text-zinc-500 uppercase font-semibold">Severity</span>
              </div>
            </div>

            {/* Severity tag text */}
            <div className="space-y-1">
              <h4 className={`text-lg font-outfit font-black uppercase ${getSeverityColor(activeRule.severity)}`}>
                {activeRule.severity} Index
              </h4>
              <p className="text-zinc-500 text-xs font-light px-4 leading-relaxed">
                {activeRule.desc}
              </p>
            </div>

          </div>

          {/* Details breakdown (Col 7 inside) */}
          <div className="md:col-span-7 glass-panel rounded-3xl p-6 flex flex-col justify-between">
            
            <div className="space-y-6">
              
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <h4 className="font-outfit font-extrabold text-base text-white">Risk Matrix Weightings</h4>
                <span className="text-[10px] font-mono text-[#00D4FF]">CALC_SYS_V4</span>
              </div>

              {/* Progress bars parameters */}
              <div className="space-y-4">
                {activeRule.metrics.map((m, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-zinc-500">{m.label}</span>
                      <span className="text-zinc-200 font-bold">{m.value}</span>
                    </div>
                    <div className="w-full h-1 bg-zinc-950 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-[#3B82F6] to-[#00D4FF]"
                        style={{ width: `${m.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Penalty Estimation panel */}
              <div className="bg-[#111827] border border-white/5 rounded-2xl p-4 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] font-mono text-zinc-500 uppercase block">Base Ticket Charge</span>
                  <span className="text-lg font-bold font-mono text-zinc-300 flex items-center">
                    <DollarSign className="w-4 h-4 text-zinc-500" />
                    {activeRule.baseFine}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-zinc-500 uppercase block">Hazard Multiplier</span>
                  <span className="text-lg font-bold font-mono text-[#00D4FF] flex items-center gap-1">
                    <Scale className="w-4 h-4 text-zinc-500" />
                    {activeRule.multiplier}x
                  </span>
                </div>
              </div>

            </div>

            {/* Total fine calculated banner */}
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between bg-gradient-to-r from-red-500/5 to-transparent p-3 rounded-xl border border-red-500/10">
              <div className="flex items-center gap-2">
                <Zap className="w-4.5 h-4.5 text-[#EF4444]" />
                <span className="text-xs font-bold text-white font-mono uppercase">ESTIMATED CITATION</span>
              </div>
              <span className="text-lg font-mono font-extrabold text-[#EF4444] tracking-tight">
                ${estimatedFine.toFixed(2)}
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
