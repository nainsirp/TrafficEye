"use client";

import { useState } from "react";
import { 
  Cpu, 
  HelpCircle, 
  HelpCircle as QuestionIcon,
  ShieldCheck, 
  Network, 
  Eye, 
  Compass, 
  ArrowRight,
  TrendingUp
} from "lucide-react";

interface XaiCase {
  id: string;
  name: string;
  violation: string;
  confidence: number;
  reason: string;
  logicPath: string[];
  features: { name: string; weight: number; status: "positive" | "negative" }[];
  mockType: "helmet" | "redlight" | "speeding";
}

const mockCases: XaiCase[] = [
  {
    id: "CASE-904",
    name: "Helmet Non-Compliance Inspection",
    violation: "Helmet Violation",
    confidence: 97.3,
    reason: "A bare skin/hair boundary was detected inside the rider head region box. The confidence score of a safety helmet class presence fell below the minimum compliance threshold of 85.0%.",
    logicPath: [
      "Instance segmentation detects Two-Wheeler on Junction-08 lane",
      "Object classification separates rider bounding box [x:120, y:80]",
      "CNN Head-Region filter localizes head coordinate subsegment",
      "ResNet Classifier predicts BARE HAIR (97.3%) vs HELMET (2.7%)"
    ],
    features: [
      { name: "Bare Head Silhouette matching", weight: 94, status: "positive" },
      { name: "Hair-Texture pixel contrast matching", weight: 89, status: "positive" },
      { name: "Chin-strap latch vector absence", weight: 78, status: "positive" },
      { name: "Rigid dome helmet shape matching", weight: 4, status: "negative" }
    ],
    mockType: "helmet"
  },
  {
    id: "CASE-905",
    name: "Red Light Crossing Analysis",
    violation: "Red Light Jump",
    confidence: 98.7,
    reason: "The vehicle's tire center coordinates crossed the established stop line bounding box while the junction controller state registered RED. Sensor signal delay validation checks passed.",
    logicPath: [
      "Intersection grid map calibrated at CAM-04",
      "Junction control telemetry registers RED signal state",
      "YOLOv11 tracks vehicle ID 8921 path vector approaching stop line",
      "Telemetry checks confirm axle coordinates crossed line by 1.4 meters"
    ],
    features: [
      { name: "Axle distance past boundary line", weight: 98, status: "positive" },
      { name: "Junction State signal corroboration", weight: 99, status: "positive" },
      { name: "Brake light lum brightness check", weight: 15, status: "negative" },
      { name: "Weather-Fog camera blur allowance", weight: 5, status: "negative" }
    ],
    mockType: "redlight"
  },
  {
    id: "CASE-906",
    name: "Junction Speeding Assessment",
    violation: "Speeding Violation",
    confidence: 96.4,
    reason: "The vehicle tracked displacement across sequential frames registered a velocity of 82 km/h. This speed exceeds the lane limit regulation speed of 50 km/h by 64.0%.",
    logicPath: [
      "Camera distance calibration values validated at CAM-01",
      "ByteTrack establishes vehicle tracking vector [ID_9042]",
      "Frame displacement delta calculates vehicle speed at 82 km/h",
      "Speed exceeds local municipal regulation zone maximum limit of 50 km/h"
    ],
    features: [
      { name: "Frame-to-frame displacement rate", weight: 96, status: "positive" },
      { name: "Junction speed zone threshold comparison", weight: 98, status: "positive" },
      { name: "Vehicle class acceleration capabilities", weight: 70, status: "positive" },
      { name: "Camera pan tracking vibration offsets", weight: 8, status: "negative" }
    ],
    mockType: "speeding"
  }
];

export default function XaiView() {
  const [activeCase, setActiveCase] = useState<XaiCase>(mockCases[0]);

  const getGradient = (conf: number) => {
    if (conf > 95) return "from-emerald-500 to-[#22C55E]";
    if (conf > 85) return "from-[#3B82F6] to-[#00D4FF]";
    return "from-[#F59E0B] to-yellow-500";
  };

  // Render Grad-CAM heatmaps or visuals based on active case
  const renderGradCamVisual = (type: XaiCase["mockType"]) => {
    switch (type) {
      case "helmet":
        return (
          <div className="absolute inset-0 bg-[#0c1428] flex items-center justify-center p-4">
            {/* Split Screen Grid */}
            <div className="w-full h-full grid grid-cols-2 gap-4">
              
              {/* Left: Original crop */}
              <div className="border border-white/5 bg-zinc-950 rounded-xl relative flex flex-col items-center justify-center overflow-hidden">
                <div className="w-20 h-20 bg-amber-200 border-2 border-amber-300 rounded-full flex flex-col items-center justify-center">
                  <span className="text-[10px] text-zinc-800 font-bold font-mono">HEAD</span>
                </div>
                <div className="absolute top-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[8px] font-mono text-zinc-400">INGESTION CROP</div>
              </div>

              {/* Right: Grad-CAM overlay */}
              <div className="border border-red-500/20 bg-zinc-950 rounded-xl relative flex flex-col items-center justify-center overflow-hidden">
                {/* Glowing Heatmap dot */}
                <div className="w-20 h-20 bg-gradient-to-tr from-red-600 via-orange-500 to-yellow-300 rounded-full blur-md opacity-80 flex items-center justify-center animate-pulse" />
                <div className="absolute w-20 h-20 border-2 border-[#EF4444] rounded-full scale-110 flex items-center justify-center">
                  <span className="text-[8px] font-mono font-bold text-white bg-black/80 px-1 py-0.5 rounded">HOTZONE (97.3%)</span>
                </div>
                <div className="absolute top-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[8px] font-mono text-red-400">GRAD-CAM HEATMAP</div>
              </div>

            </div>
          </div>
        );
      case "redlight":
        return (
          <div className="absolute inset-0 bg-[#0c1428] flex items-center justify-center p-4">
            <div className="w-full h-full grid grid-cols-2 gap-4">
              
              {/* Left: Stop Line Crop */}
              <div className="border border-white/5 bg-zinc-950 rounded-xl relative flex flex-col items-center justify-center overflow-hidden">
                <div className="w-24 h-1 bg-white/20" />
                <div className="w-16 h-12 border border-zinc-700 bg-zinc-800 rounded mt-2" />
                <div className="absolute top-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[8px] font-mono text-zinc-400">INGESTION CROP</div>
              </div>

              {/* Right: Grad-CAM overlay */}
              <div className="border border-red-500/20 bg-zinc-950 rounded-xl relative flex flex-col items-center justify-center overflow-hidden">
                <div className="w-24 h-2 bg-[#EF4444] shadow-[0_0_12px_#EF4444]" />
                <div className="w-20 h-14 bg-gradient-to-r from-red-600 to-orange-500 rounded blur-sm opacity-80 mt-2 flex items-center justify-center">
                  <span className="text-[8px] font-mono font-bold text-white bg-black/80 px-1.5 py-0.5 rounded">AXLE_CROSS (98.7%)</span>
                </div>
                <div className="absolute top-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[8px] font-mono text-red-400">GRAD-CAM HEATMAP</div>
              </div>

            </div>
          </div>
        );
      case "speeding":
        return (
          <div className="absolute inset-0 bg-[#0c1428] flex items-center justify-center p-4">
            <div className="w-full h-full grid grid-cols-2 gap-4">
              
              {/* Left: Displacement vector crop */}
              <div className="border border-white/5 bg-zinc-950 rounded-xl relative flex flex-col items-center justify-center overflow-hidden">
                <span className="text-[#00D4FF] text-2xl font-mono">&#8594;</span>
                <span className="text-[9px] font-mono text-zinc-500 mt-2">VECTOR: [dx:4.2m / dt:0.18s]</span>
                <div className="absolute top-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[8px] font-mono text-zinc-400">INGESTION CROP</div>
              </div>

              {/* Right: Grad-CAM overlay */}
              <div className="border border-red-500/20 bg-zinc-950 rounded-xl relative flex flex-col items-center justify-center overflow-hidden">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-[#EF4444] rounded-full blur-md opacity-80 flex items-center justify-center" />
                <div className="absolute w-20 h-10 border border-[#EF4444] rounded flex flex-col items-center justify-center bg-black/60">
                  <span className="text-[9px] font-mono text-[#EF4444] font-bold">VELOCITY ALERT</span>
                  <span className="text-[8px] font-mono text-zinc-400">82 KM/H (96.4%)</span>
                </div>
                <div className="absolute top-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[8px] font-mono text-red-400">GRAD-CAM HEATMAP</div>
              </div>

            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Selector Cases Row */}
      <div className="flex flex-wrap gap-4 border-b border-white/5 pb-4">
        {mockCases.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCase(c)}
            className={`px-5 py-3 rounded-2xl text-xs font-bold font-mono transition-all border cursor-pointer
              ${activeCase.id === c.id 
                ? "bg-[#00D4FF]/10 border-[#00D4FF]/40 text-[#00D4FF] shadow-[0_0_15px_rgba(0,212,255,0.05)]" 
                : "bg-white/5 border-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
              }
            `}
          >
            {c.id} // {c.violation}
          </button>
        ))}
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left column: Grad-CAM images (Col 7) */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 flex flex-col gap-6">
          <div>
            <h4 className="font-outfit font-bold text-white text-base">Model Attention Map</h4>
            <p className="text-zinc-500 text-xs">Grad-CAM pixel activation highlights where the model focused to classify the violation.</p>
          </div>

          <div className="flex-1 aspect-[16/10] bg-zinc-950 rounded-2xl border border-white/5 relative overflow-hidden min-h-[300px]">
            {renderGradCamVisual(activeCase.mockType)}
            <div className="laser-scanner" />
          </div>

          {/* Details reasoning block */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <h5 className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#00D4FF]" />
              Model Attribution Justification
            </h5>
            <p className="text-zinc-400 text-xs font-light leading-relaxed">
              {activeCase.reason}
            </p>
          </div>
        </div>

        {/* Right column: Confidence meter, logical trees, features (Col 5) */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 flex flex-col gap-6 justify-between">
          
          <div className="space-y-6">
            
            {/* Top row confidence dial */}
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div>
                <h4 className="font-outfit font-extrabold text-lg text-white">Explainability Trees</h4>
                <p className="text-zinc-500 text-[10px]">Decision pathway weights.</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-2xl font-black text-white font-mono tracking-tight">{activeCase.confidence}%</span>
                <span className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-wider">AI Confidence</span>
              </div>
            </div>

            {/* Logical nodes pipeline tree */}
            <div className="space-y-4">
              <h5 className="text-xs font-bold text-zinc-400 uppercase font-mono tracking-wide">Logical Attribution Pathway</h5>
              
              <div className="space-y-3 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/5">
                {activeCase.logicPath.map((step, idx) => (
                  <div key={idx} className="flex gap-4 items-start relative z-10">
                    <span className="w-7 h-7 rounded-full bg-[#111827] border border-white/10 text-[10px] font-mono font-bold flex items-center justify-center text-zinc-400 shrink-0">
                      0{idx + 1}
                    </span>
                    <p className="text-xs font-light text-zinc-300 pt-1 leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Weights Progress bars */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-zinc-400 uppercase font-mono tracking-wide">Feature Layer Weightings</h5>
              
              <div className="space-y-2.5">
                {activeCase.features.map((feat, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-zinc-400 font-light">{feat.name}</span>
                      <span className={`font-mono font-bold ${feat.status === "positive" ? "text-[#00D4FF]" : "text-zinc-500"}`}>
                        {feat.status === "positive" ? `+${feat.weight}%` : `-${feat.weight}%`}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${feat.status === "positive" ? "bg-gradient-to-r from-[#00D4FF] to-[#3B82F6]" : "bg-zinc-800"}`}
                        style={{ width: `${feat.weight}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Model information tag block */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-3.5 mt-4">
            <Cpu className="w-5 h-5 text-purple-400 shrink-0" />
            <div>
              <h6 className="text-[10px] text-zinc-400 uppercase font-mono font-bold">XAI Method: Integrated Gradients</h6>
              <p className="text-[10px] text-zinc-500 font-light block leading-relaxed">
                Visual attributions represent gradients calculated along a straight path from a black baseline reference image.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
