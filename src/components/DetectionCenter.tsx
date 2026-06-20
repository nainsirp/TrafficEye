"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  AlertCircle, 
  X, 
  UserCheck, 
  Clock, 
  ShieldAlert, 
  Camera, 
  FileText,
  BadgeAlert,
  Fingerprint
} from "lucide-react";

interface QueueItem {
  id: string;
  type: string;
  plate: string;
  confidence: number;
  time: string;
  camera: string;
  speed: string;
  vehicleClass: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  reason: string;
  // CSS mock visualization parameters
  mockType: "helmet" | "redlight" | "triple" | "wrongside" | "parking";
}

const initialQueue: QueueItem[] = [
  {
    id: "TR-2026-904",
    type: "Helmet Violation",
    plate: "KA03HA8841",
    confidence: 97.3,
    time: "14:12:05 UTC+5:30",
    camera: "CAM-08 (East Boulevard)",
    speed: "42 km/h",
    vehicleClass: "Two-Wheeler (Motorcycle)",
    severity: "Medium",
    reason: "Helmet not detected in rider head bounding box. Primary head segment classified bare.",
    mockType: "helmet"
  },
  {
    id: "TR-2026-905",
    type: "Red Light Jump",
    plate: "KA01AB1234",
    confidence: 98.7,
    time: "14:14:18 UTC+5:30",
    camera: "CAM-04 (HQ Junction)",
    speed: "64 km/h",
    vehicleClass: "Light Motor Vehicle (SUV)",
    severity: "High",
    reason: "Vehicle rear axle crossed stop line 1.4s after traffic signal transitioned to RED state.",
    mockType: "redlight"
  },
  {
    id: "TR-2026-906",
    type: "Triple Riding",
    plate: "MH12XY6789",
    confidence: 95.1,
    time: "14:15:30 UTC+5:30",
    camera: "CAM-04 (HQ Junction)",
    speed: "35 km/h",
    vehicleClass: "Two-Wheeler (Scooter)",
    severity: "High",
    reason: "Multi-instance passenger segment located on vehicle chassis. Detected count: 3 riders.",
    mockType: "triple"
  },
  {
    id: "TR-2026-907",
    type: "Wrong Side Driving",
    plate: "DL03CC5521",
    confidence: 99.4,
    time: "14:17:11 UTC+5:30",
    camera: "CAM-01 (North Expressway)",
    speed: "58 km/h",
    vehicleClass: "Light Motor Vehicle (Sedan)",
    severity: "Critical",
    reason: "Vehicle flow vector opposite to lane traffic direction constraint. Counter-flow detected.",
    mockType: "wrongside"
  },
  {
    id: "TR-2026-908",
    type: "Illegal Parking",
    plate: "HR26AD0099",
    confidence: 92.5,
    time: "14:19:02 UTC+5:30",
    camera: "CAM-12 (Central Square)",
    speed: "0 km/h",
    vehicleClass: "Light Motor Vehicle (Sedan)",
    severity: "Low",
    reason: "Vehicle stationary in designated 'NO PARKING' zone for duration exceeding 180 seconds.",
    mockType: "parking"
  }
];

export default function DetectionCenter() {
  const [queue, setQueue] = useState<QueueItem[]>(initialQueue);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [approvedCount, setApprovedCount] = useState(142);
  const [rejectedCount, setRejectedCount] = useState(8);
  const [direction, setDirection] = useState(0);

  const activeTicket = queue[currentIndex];

  const handleAction = (actionType: "approve" | "review" | "reject") => {
    if (!activeTicket) return;

    if (actionType === "approve") {
      setApprovedCount(prev => prev + 1);
    } else if (actionType === "reject") {
      setRejectedCount(prev => prev + 1);
    }

    setDirection(actionType === "approve" ? 1 : -1);

    setTimeout(() => {
      if (currentIndex < queue.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        // Recycle queue with random new IDs for presentation demo
        const recycled = queue.map(item => ({
          ...item,
          id: `TR-2026-${Math.floor(Math.random() * 9000) + 1000}`
        }));
        setQueue(recycled);
        setCurrentIndex(0);
      }
    }, 150);
  };

  const getSeverityBadge = (sev: QueueItem["severity"]) => {
    switch (sev) {
      case "Low": return "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20";
      case "Medium": return "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20";
      case "High": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "Critical": return "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20 animate-pulse";
    }
  };

  // Render mock violation camera feed overlay based on incident type
  const renderMockIncidentScene = (type: QueueItem["mockType"]) => {
    switch (type) {
      case "helmet":
        return (
          <div className="absolute inset-0 bg-[#0c1428] flex items-center justify-center p-6">
            {/* Road lines */}
            <div className="absolute bottom-0 left-[20%] right-[20%] top-0 bg-[#1f2937]/30 border-l border-r border-dashed border-white/10" />
            
            {/* Scooter representation */}
            <div className="relative w-40 h-40 flex flex-col items-center justify-center">
              {/* Rider Body */}
              <div className="w-16 h-24 bg-[#3B82F6]/90 border border-[#00D4FF]/40 rounded-3xl flex flex-col items-center pt-2 relative">
                {/* Bounding box around bare head */}
                <div className="absolute -top-10 w-14 h-14 border-2 border-[#EF4444] rounded-lg flex items-center justify-center glow-border-cyan">
                  <div className="w-10 h-10 rounded-full bg-amber-200 border border-amber-300 flex items-center justify-center">
                    <span className="text-[7px] text-zinc-800 font-extrabold font-mono leading-none text-center">NO HELMET</span>
                  </div>
                  <span className="absolute -top-4 left-0 bg-[#EF4444] text-[7px] font-mono font-bold text-white px-1 py-0.5 rounded leading-none">
                    HEAD: BARE (97.3%)
                  </span>
                </div>
                
                {/* ID Tag on rider */}
                <span className="text-[8px] font-mono text-white bg-zinc-950/80 px-1.5 py-0.5 rounded">RIDER_01</span>
              </div>
              
              {/* Scooter Wheels */}
              <div className="w-20 h-6 bg-zinc-800 border border-white/10 rounded-full mt-4 flex justify-between px-2">
                <div className="w-4 h-4 rounded-full bg-zinc-900 border border-[#00D4FF]" />
                <div className="w-4 h-4 rounded-full bg-zinc-900 border border-[#00D4FF]" />
              </div>
            </div>
          </div>
        );
      case "redlight":
        return (
          <div className="absolute inset-0 bg-[#0c1428] flex items-center justify-center p-6">
            {/* Intersection blueprint */}
            <div className="absolute top-[60%] left-0 right-0 h-1.5 bg-[#EF4444]/60 shadow-[0_0_10px_#EF4444] flex items-center justify-center">
              <span className="bg-[#EF4444] text-[7px] font-mono font-bold text-white px-2 py-0.5 rounded uppercase tracking-wider">STOP LINE // SIGNAL RED</span>
            </div>

            {/* SUV Representation */}
            <div className="absolute top-[40%] w-48 h-28 border border-[#EF4444]/60 bg-zinc-800/80 rounded-xl p-4 flex flex-col justify-between glow-border-cyan">
              <div className="flex justify-between items-start">
                <span className="bg-[#EF4444] text-[8px] font-mono font-bold text-white px-1.5 py-0.5 rounded">RED LIGHT JUMP</span>
                <span className="text-[9px] font-mono text-zinc-400">ID: VEH_8921</span>
              </div>
              <div className="border border-white/10 bg-black/80 rounded p-1.5 flex justify-between items-center">
                <span className="text-[10px] font-mono font-bold text-[#00D4FF]">KA01AB1234</span>
                <span className="text-[9px] font-mono text-zinc-500">LMV: SUV</span>
              </div>
            </div>
          </div>
        );
      case "triple":
        return (
          <div className="absolute inset-0 bg-[#0c1428] flex items-center justify-center p-6">
            <div className="relative w-44 h-44 flex flex-col items-center justify-center">
              {/* Scooter outline */}
              <div className="w-24 h-32 border border-[#00D4FF]/20 bg-zinc-900/50 rounded-xl relative flex flex-col items-center justify-center gap-2">
                
                {/* 3 Passenger Bounding Boxes */}
                <div className="w-16 h-10 border border-[#EF4444] bg-[#EF4444]/10 rounded flex items-center justify-center">
                  <span className="text-[7px] font-mono text-[#EF4444] font-bold">RIDER_1</span>
                </div>
                <div className="w-16 h-10 border border-[#EF4444] bg-[#EF4444]/10 rounded flex items-center justify-center">
                  <span className="text-[7px] font-mono text-[#EF4444] font-bold">PASSENGER_2</span>
                </div>
                <div className="w-16 h-10 border border-[#EF4444] bg-[#EF4444]/10 rounded flex items-center justify-center">
                  <span className="text-[7px] font-mono text-[#EF4444] font-bold">PASSENGER_3</span>
                </div>

                <span className="absolute -top-6 bg-[#EF4444] text-[7px] font-mono text-white px-2 py-0.5 rounded font-bold uppercase">
                  TRIPLE RIDING DETECTED (95.1%)
                </span>
              </div>
            </div>
          </div>
        );
      case "wrongside":
        return (
          <div className="absolute inset-0 bg-[#0c1428] flex items-center justify-center p-6">
            {/* Lane Directions */}
            <div className="absolute left-[30%] top-12 bottom-12 w-0.5 border-l border-dashed border-[#00D4FF]/20" />
            <div className="absolute right-[30%] top-12 bottom-12 w-0.5 border-r border-dashed border-[#00D4FF]/20" />

            {/* Direction Arrows */}
            <span className="absolute left-[15%] top-12 text-[#00D4FF]/20 text-4xl rotate-180">&#8595;</span>
            <span className="absolute right-[15%] top-12 text-[#00D4FF]/20 text-4xl">&#8595;</span>

            {/* Wrong Side Car */}
            <div className="absolute top-[35%] right-[10%] w-40 h-24 border-2 border-[#EF4444] bg-zinc-800 rounded-lg p-3 flex flex-col justify-between shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <div className="flex justify-between items-start">
                <span className="bg-[#EF4444] text-[8px] font-mono text-white px-1.5 py-0.5 rounded font-bold">COUNTER FLOW</span>
                <span className="text-4xl text-[#EF4444] font-bold leading-none">&#8593;</span>
              </div>
              <span className="text-[9px] font-mono text-zinc-400">PLATE: DL03CC5521</span>
            </div>
          </div>
        );
      case "parking":
        return (
          <div className="absolute inset-0 bg-[#0c1428] flex items-center justify-center p-6">
            {/* No Parking Sign visual */}
            <div className="absolute top-10 left-10 flex items-center gap-3 bg-zinc-900 border border-white/5 p-2 rounded-lg">
              <div className="w-8 h-8 rounded-full border-2 border-[#EF4444] flex items-center justify-center text-[#EF4444] font-extrabold text-sm relative">
                P
                <div className="absolute w-7 h-0.5 bg-[#EF4444] rotate-45" />
              </div>
              <span className="text-[8px] font-mono text-zinc-500 uppercase">Prohibited Zone // Cam-12</span>
            </div>

            {/* Parked Vehicle */}
            <div className="w-48 h-24 border border-[#EF4444] bg-zinc-800/80 rounded-lg p-3 flex flex-col justify-between glow-border-cyan relative">
              <span className="bg-[#EF4444] text-[8px] font-mono text-white px-1.5 py-0.5 rounded w-max font-bold">STATIONARY: 202s</span>
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-[#00D4FF]">HR26AD0099</span>
                <span className="text-zinc-500">ID: PARK_9081</span>
              </div>
              <span className="absolute -bottom-6 left-0 text-[8px] font-mono text-zinc-500">STABILITY VALUE: 100% (STATIONARY)</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Overview queue stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-[#3B82F6] flex items-center justify-between">
          <div>
            <span className="text-zinc-500 text-xs uppercase font-mono tracking-wider font-semibold">Remaining Queue</span>
            <h4 className="text-2xl font-black text-white font-mono">{queue.length - currentIndex} <span className="text-xs text-zinc-500 font-normal">Pending Tickets</span></h4>
          </div>
          <div className="p-3 bg-[#3B82F6]/10 rounded-xl text-[#3B82F6] border border-[#3B82F6]/20">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-[#22C55E] flex items-center justify-between">
          <div>
            <span className="text-zinc-500 text-xs uppercase font-mono tracking-wider font-semibold">Citations Approved</span>
            <h4 className="text-2xl font-black text-[#22C55E] font-mono">{approvedCount} <span className="text-xs text-zinc-500 font-normal">Tickets Issued</span></h4>
          </div>
          <div className="p-3 bg-[#22C55E]/10 rounded-xl text-[#22C55E] border border-[#22C55E]/20">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-[#EF4444] flex items-center justify-between">
          <div>
            <span className="text-zinc-500 text-xs uppercase font-mono tracking-wider font-semibold">Detections Rejected</span>
            <h4 className="text-2xl font-black text-[#EF4444] font-mono">{rejectedCount} <span className="text-xs text-zinc-500 font-normal">False Positives</span></h4>
          </div>
          <div className="p-3 bg-[#EF4444]/10 rounded-xl text-[#EF4444] border border-[#EF4444]/20">
            <X className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Review Layout */}
      {activeTicket ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Main evidence canvas panel (Col 8) */}
          <div className="lg:col-span-8 glass-panel rounded-3xl overflow-hidden flex flex-col relative min-h-[400px]">
            
            {/* Camera feed header bar */}
            <div className="p-4 border-b border-white/5 bg-[#111827]/40 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#00D4FF]" />
                <span className="text-sm font-semibold text-white">{activeTicket.camera}</span>
              </div>
              <span className="text-xs font-mono text-zinc-500">TICKET_ID: {activeTicket.id}</span>
            </div>

            {/* Render Simulated Camera Feed */}
            <div className="flex-1 relative bg-zinc-950 overflow-hidden min-h-[300px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTicket.id}
                  initial={{ opacity: 0, x: direction * 150 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -direction * 150 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0"
                >
                  {renderMockIncidentScene(activeTicket.mockType)}
                </motion.div>
              </AnimatePresence>

              {/* Grid overlay */}
              <div className="absolute inset-0 bg-[#00D4FF]/[0.01] pointer-events-none" />
              <div className="laser-scanner" />
              <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 rounded border border-white/10 text-[10px] font-mono text-zinc-400">
                AI CONFIDENCE: {activeTicket.confidence}%
              </div>
            </div>

            {/* Explanation bar */}
            <div className="p-4 border-t border-white/5 bg-[#111827]/40 flex items-center gap-3">
              <BadgeAlert className="w-5 h-5 text-orange-500 shrink-0" />
              <p className="text-zinc-300 text-xs font-light leading-relaxed">
                <span className="font-bold text-white uppercase font-mono mr-1">AI Inference:</span>
                {activeTicket.reason}
              </p>
            </div>
          </div>

          {/* Details Sidebar panel (Col 4) */}
          <div className="lg:col-span-4 glass-panel rounded-3xl p-6 flex flex-col justify-between">
            <div className="space-y-6">
              
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <h4 className="font-outfit font-extrabold text-lg text-white">Incident Profile</h4>
                <span className={`text-xs font-mono border px-2 py-0.5 rounded font-bold uppercase ${getSeverityBadge(activeTicket.severity)}`}>
                  {activeTicket.severity} Severity
                </span>
              </div>

              {/* Data Items list */}
              <div className="space-y-4">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-xs text-zinc-500 uppercase font-mono">Violation Classification</span>
                  <span className="text-xs font-bold text-white">{activeTicket.type}</span>
                </div>
                
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-xs text-zinc-500 uppercase font-mono">License Plate (OCR)</span>
                  <span className="text-xs font-mono font-black text-[#00D4FF] bg-[#00D4FF]/10 px-2 py-0.5 rounded border border-[#00D4FF]/20">
                    {activeTicket.plate}
                  </span>
                </div>

                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-xs text-zinc-500 uppercase font-mono">Telemetry Speed</span>
                  <span className="text-xs font-bold font-mono text-zinc-200">{activeTicket.speed}</span>
                </div>

                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-xs text-zinc-500 uppercase font-mono">Vehicle Category</span>
                  <span className="text-xs text-zinc-300 font-light">{activeTicket.vehicleClass}</span>
                </div>

                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-xs text-zinc-500 uppercase font-mono">Captured Timestamp</span>
                  <span className="text-[11px] font-mono text-zinc-400">{activeTicket.time}</span>
                </div>
              </div>

              {/* Registry Database Check simulation */}
              <div className="bg-[#111827]/70 border border-white/5 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                  <Fingerprint className="w-4 h-4 text-[#3B82F6]" />
                  <span className="text-xs font-bold text-zinc-300 font-mono">MVA Registry Lookup</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-zinc-400">
                    <span>Owner Registered:</span>
                    <span className="text-zinc-200 font-semibold">Rahul Sharma (Ind)</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-zinc-400">
                    <span>Tax & Insurance:</span>
                    <span className="text-[#22C55E] font-semibold uppercase text-[10px]">ACTIVE / VALID</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-zinc-400">
                    <span>Flagged Warrants:</span>
                    <span className="text-zinc-500">None found</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Officer Citation Actions */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/5">
              
              <button
                onClick={() => handleAction("reject")}
                className="py-3 px-2.5 rounded-xl border border-[#EF4444]/30 bg-[#EF4444]/5 hover:bg-[#EF4444]/25 hover:border-[#EF4444] text-[#EF4444] font-bold text-xs flex flex-col items-center gap-1 transition-all cursor-pointer"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
                Reject
              </button>

              <button
                onClick={() => handleAction("review")}
                className="py-3 px-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white font-bold text-xs flex flex-col items-center gap-1 transition-all cursor-pointer"
              >
                <AlertCircle className="w-5 h-5" />
                Review
              </button>

              <button
                onClick={() => handleAction("approve")}
                className="py-3 px-2.5 rounded-xl border border-[#22C55E]/30 bg-[#22C55E]/10 hover:bg-[#22C55E]/35 hover:border-[#22C55E] text-[#22C55E] font-bold text-xs flex flex-col items-center gap-1 transition-all cursor-pointer"
              >
                <Check className="w-5 h-5 stroke-[2.5]" />
                Approve
              </button>
            </div>

          </div>

        </div>
      ) : (
        <div className="glass-panel rounded-3xl p-16 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E] animate-bounce">
            <Check className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h3 className="font-outfit font-extrabold text-2xl text-white">Queue Empty</h3>
          <p className="text-zinc-500 max-w-sm text-sm">
            All captured traffic violations have been successfully audited by operators. Excellent work!
          </p>
          <button 
            onClick={() => {
              setQueue(initialQueue);
              setCurrentIndex(0);
            }} 
            className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all cursor-pointer"
          >
            Reload Queue
          </button>
        </div>
      )}

    </div>
  );
}
