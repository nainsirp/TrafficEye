"use client";

import { useState, useEffect } from "react";
import { 
  Eye, 
  Search, 
  Fingerprint, 
  Globe, 
  Cpu, 
  ShieldAlert, 
  RefreshCw,
  CheckCircle,
  FileCheck
} from "lucide-react";

interface PlateRecord {
  plate: string;
  state: string;
  vehicleType: string;
  model: string;
  owner: string;
  confidence: number;
  status: "Clean" | "Flagged" | "Expired";
  charConfidences: number[];
}

const mockPlates: PlateRecord[] = [
  {
    plate: "KA01AB1234",
    state: "Karnataka",
    vehicleType: "Light Motor Vehicle (Sedan)",
    model: "Honda City",
    owner: "Aditya Hegde",
    confidence: 98.6,
    status: "Clean",
    charConfidences: [99.2, 98.5, 99.0, 97.8, 98.9, 99.1, 98.4, 98.8, 99.3, 98.0]
  },
  {
    plate: "MH12XY6789",
    state: "Maharashtra",
    vehicleType: "Light Motor Vehicle (SUV)",
    model: "Mahindra XUV700",
    owner: "Sneha Deshmukh",
    confidence: 97.4,
    status: "Flagged", // Speeding record
    charConfidences: [98.1, 98.9, 96.5, 97.2, 98.0, 97.9, 95.8, 96.9, 98.1, 99.0]
  },
  {
    plate: "DL03CC5521",
    state: "Delhi NCR",
    vehicleType: "Light Motor Vehicle (Hatchback)",
    model: "Maruti Swift",
    owner: "Vikram Malhotra",
    confidence: 99.1,
    status: "Expired", // Insurance expired
    charConfidences: [99.5, 99.3, 99.2, 98.9, 99.0, 99.1, 98.7, 98.9, 99.4, 99.1]
  },
  {
    plate: "KA03HA8841",
    state: "Karnataka",
    vehicleType: "Two-Wheeler (Motorcycle)",
    model: "Royal Enfield Classic 350",
    owner: "Karthik Gowda",
    confidence: 96.8,
    status: "Clean",
    charConfidences: [97.5, 96.8, 95.9, 97.1, 98.0, 96.4, 95.5, 97.0, 96.9, 97.2]
  },
  {
    plate: "HR26AD0099",
    state: "Haryana",
    vehicleType: "Light Motor Vehicle (Sedan)",
    model: "Hyundai Verna",
    owner: "Amit Chaudhary",
    confidence: 98.2,
    status: "Clean",
    charConfidences: [98.9, 98.4, 97.8, 99.0, 98.5, 98.1, 96.9, 98.3, 99.1, 97.5]
  }
];

export default function LprModule() {
  const [activeRecord, setActiveRecord] = useState<PlateRecord>(mockPlates[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [searchResults, setSearchResults] = useState<PlateRecord[]>([]);

  // Simulate license plate scanning loop
  const triggerScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const nextIndex = (mockPlates.findIndex(p => p.plate === activeRecord.plate) + 1) % mockPlates.length;
      setActiveRecord(mockPlates[nextIndex]);
      setIsScanning(false);
    }, 1500);
  };

  // Search filter
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toUpperCase();
    if (!query) {
      setSearchResults([]);
      return;
    }
    const found = mockPlates.filter(p => p.plate.includes(query) || p.owner.toUpperCase().includes(query));
    setSearchResults(found);
    if (found.length > 0) {
      setActiveRecord(found[0]);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Search Header Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Search Plate Box */}
        <div className="md:col-span-8">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search database by plate number (e.g. KA01...) or owner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#111827]/70 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-semibold text-white focus:outline-none focus:border-[#00D4FF]/40 placeholder-zinc-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-6 rounded-2xl bg-gradient-to-r from-[#00D4FF] to-[#3B82F6] text-[#0B1020] font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-md"
            >
              Query
            </button>
          </form>
        </div>

        {/* Scan Trigger */}
        <div className="md:col-span-4 flex justify-end">
          <button
            onClick={triggerScan}
            disabled={isScanning}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 text-[#00D4FF] ${isScanning ? "animate-spin" : ""}`} />
            Scan Next Camera
          </button>
        </div>

      </div>

      {/* Main ALPR Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Plate Scanning Laser Visualizer (Col 7) */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 flex flex-col gap-6 relative overflow-hidden">
          
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#00D4FF]" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">Target OCR Ingestion Feed</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">ANPR // INPUT_NODE_08</span>
          </div>

          {/* License Plate Graphic Panel */}
          <div className="relative aspect-[3/1] bg-gradient-to-br from-zinc-950 to-zinc-900 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden">
            {/* Lasers and scans */}
            {isScanning && <div className="laser-scanner" />}
            
            {/* Indian-style license plate mock */}
            <div className="w-[85%] max-w-[400px] h-[55%] bg-yellow-400 border-[8px] border-black rounded-lg shadow-2xl flex items-center justify-center relative p-1">
              
              {/* IND badge */}
              <div className="absolute left-2 top-2 bottom-2 w-7 bg-blue-900 border border-blue-950 flex flex-col items-center justify-center text-white rounded">
                <span className="text-[6px] font-mono leading-none scale-75 opacity-75">IND</span>
                <div className="w-2.5 h-2.5 rounded-full border border-yellow-400/50 flex items-center justify-center mt-1">
                  <div className="w-1 h-1 rounded-full bg-yellow-300" />
                </div>
              </div>

              {/* Characters */}
              <span className="font-outfit font-black text-4xl sm:text-5xl text-black tracking-[0.25em] pl-12 font-sans select-none">
                {activeRecord.plate}
              </span>
            </div>

            {/* Corner alignment crosshairs */}
            <div className="absolute inset-4 border border-white/5 pointer-events-none" />
            <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#00D4FF]/30" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#00D4FF]/30" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#00D4FF]/30" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#00D4FF]/30" />
          </div>

          {/* Character Segmentation Breakdown */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-white uppercase font-mono tracking-wider">Character Segmentation Detections</h5>
            
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {activeRecord.plate.split("").map((char, idx) => {
                const conf = activeRecord.charConfidences[idx];
                return (
                  <div key={idx} className="bg-white/5 rounded-xl p-2 border border-white/5 flex flex-col items-center gap-1.5 shadow-inner">
                    <span className="text-lg font-black text-white font-mono">{char}</span>
                    <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${conf > 98 ? "bg-[#22C55E]" : "bg-[#3B82F6]"}`}
                        style={{ width: `${conf}%` }}
                      />
                    </div>
                    <span className="text-[8px] font-mono text-zinc-500 font-semibold">{conf}%</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Database Audit Information Panel (Col 5) */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 flex flex-col justify-between">
          
          <div className="space-y-6">
            
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h4 className="font-outfit font-extrabold text-lg text-white">OCR Intelligence</h4>
              <span className="text-xs font-mono text-[#00D4FF] bg-[#00D4FF]/5 border border-[#00D4FF]/20 px-2 py-0.5 rounded font-bold">
                ALPR_NODE
              </span>
            </div>

            {/* Ingestion results list */}
            <div className="space-y-4">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-xs text-zinc-500 uppercase font-mono">Recognized Plate</span>
                <span className="text-sm font-mono font-black text-white">{activeRecord.plate}</span>
              </div>

              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-xs text-zinc-500 uppercase font-mono">Overall Confidence</span>
                <span className="text-sm font-mono font-bold text-[#00D4FF]">{activeRecord.confidence}%</span>
              </div>

              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-xs text-zinc-500 uppercase font-mono">State Jurisdiction</span>
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-zinc-500" />
                  {activeRecord.state} Validation
                </span>
              </div>

              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-xs text-zinc-500 uppercase font-mono">Vehicle Owner</span>
                <span className="text-xs font-semibold text-zinc-200">{activeRecord.owner}</span>
              </div>

              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-xs text-zinc-500 uppercase font-mono">Vehicle Classification</span>
                <span className="text-xs text-zinc-300 font-light">{activeRecord.vehicleType}</span>
              </div>

              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-xs text-zinc-500 uppercase font-mono">Model Year Specs</span>
                <span className="text-xs text-zinc-300 font-light">{activeRecord.model}</span>
              </div>
            </div>

            {/* Registry status warning badge box */}
            <div className={`p-4 rounded-2xl border flex items-center gap-3.5
              ${activeRecord.status === "Clean" 
                ? "bg-[#22C55E]/10 border-[#22C55E]/20 text-[#22C55E]" 
                : activeRecord.status === "Flagged"
                ? "bg-[#F59E0B]/10 border-[#F59E0B]/20 text-[#F59E0B]"
                : "bg-[#EF4444]/10 border-[#EF4444]/20 text-[#EF4444]"
              }
            `}>
              {activeRecord.status === "Clean" ? (
                <CheckCircle className="w-5 h-5 shrink-0" />
              ) : (
                <ShieldAlert className="w-5 h-5 shrink-0" />
              )}
              
              <div>
                <h5 className="text-xs font-bold font-mono uppercase tracking-wide">
                  REGISTRY STATUS: {activeRecord.status}
                </h5>
                <p className="text-[10px] text-zinc-400 font-light mt-0.5">
                  {activeRecord.status === "Clean" 
                    ? "Vehicle registration is verified, active, and fully compliant." 
                    : activeRecord.status === "Flagged"
                    ? "This vehicle contains pending unpaid speeding citations at Junction-C."
                    : "ALERT: Vehicle insurance expired on 18-Feb-2026. Citation eligible."
                  }
                </p>
              </div>
            </div>

          </div>

          {/* Core neural engine info */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-3.5 mt-6">
            <Cpu className="w-5 h-5 text-purple-400 shrink-0" />
            <div>
              <h6 className="text-[10px] text-zinc-400 uppercase font-mono font-bold">Neural Core: TrOCR Engine</h6>
              <span className="text-[10px] text-zinc-500 font-light block leading-relaxed">
                Convolutional Transformer segments text blocks under low luminosity. Output calibrated dynamically.
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
