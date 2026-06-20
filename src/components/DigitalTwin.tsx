"use client";

import { useEffect, useRef, useState } from "react";
import { 
  Layers, 
  Settings, 
  Cpu, 
  AlertTriangle, 
  Play, 
  Pause,
  Compass,
  ArrowRight,
  Zap,
  TrendingDown
} from "lucide-react";

interface CityJunction {
  id: string;
  name: string;
  flowRate: number;
  lightState: "GREEN" | "RED";
  congestion: "Low" | "Moderate" | "Heavy";
}

export default function DigitalTwin() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedJunction, setSelectedJunction] = useState<string>("JUNC-01");
  const [activeLayer, setActiveLayer] = useState<"flows" | "risks" | "nodes">("flows");
  const [insights, setInsights] = useState<string[]>([
    "RECOMMENDATION: Increase green-light timing phase at Junction-01 by 8 seconds to relieve heavy northbound queue.",
    "ALERT: Congestion threshold exceeded by 18% at Eastern Boulevard Sector-D. Rerouting indicators activated.",
    "COMPLIANCE: Double-riding incident identified at Junction-02 node. Camera tracking ID established."
  ]);

  const junctions: CityJunction[] = [
    { id: "JUNC-01", name: "Junction-01 (Main Central)", flowRate: 84, lightState: "GREEN", congestion: "Heavy" },
    { id: "JUNC-02", name: "Junction-02 (Eastern Highway)", flowRate: 52, lightState: "RED", congestion: "Moderate" },
    { id: "JUNC-03", name: "Junction-03 (North Plaza)", flowRate: 31, lightState: "GREEN", congestion: "Low" },
    { id: "JUNC-04", name: "Junction-04 (Tech Boulevard)", flowRate: 72, lightState: "RED", congestion: "Heavy" }
  ];

  // Simulation Canvas loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.offsetWidth || 700);
    let height = (canvas.height = canvas.offsetHeight || 400);

    // Car particle class
    interface CarParticle {
      x: number;
      y: number;
      speed: number;
      targetX: number;
      targetY: number;
      color: string;
      radius: number;
      route: "horizontal" | "vertical" | "loop";
      dir: 1 | -1;
    }

    const particles: CarParticle[] = [];

    // Initialize car particles
    const spawnParticle = (routeType?: "horizontal" | "vertical") => {
      const route = routeType || (Math.random() > 0.5 ? "horizontal" : "vertical");
      const dir = Math.random() > 0.5 ? 1 : -1;
      
      let x = 0, y = 0;
      if (route === "horizontal") {
        x = dir === 1 ? -10 : width + 10;
        y = height / 2 + (dir === 1 ? -25 : 25);
      } else {
        x = width / 2 + (dir === 1 ? -25 : 25);
        y = dir === 1 ? -10 : height + 10;
      }

      particles.push({
        x,
        y,
        speed: Math.random() * 1.5 + 1.0,
        targetX: x,
        targetY: y,
        color: ["#00D4FF", "#3B82F6", "#F9FAFB", "#EF4444"][Math.floor(Math.random() * 4)],
        radius: 3,
        route,
        dir
      });
    };

    // Pre-spawn particles
    for (let i = 0; i < 35; i++) {
      spawnParticle();
      const p = particles[i];
      if (p.route === "horizontal") {
        p.x = Math.random() * width;
      } else {
        p.y = Math.random() * height;
      }
    }

    // Traffic signal states for junction crossings
    let j1Light: "GREEN" | "RED" = "GREEN";
    let jLightTimer = 0;

    const drawTwin = () => {
      if (!isPlaying) {
        animationId = requestAnimationFrame(drawTwin);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Light timer
      jLightTimer++;
      if (jLightTimer > 200) {
        j1Light = j1Light === "GREEN" ? "RED" : "GREEN";
        jLightTimer = 0;
      }

      // Draw futuristic grid background
      ctx.fillStyle = "#0c1328";
      ctx.fillRect(0, 0, width, height);

      // Neon grid lines overlay
      ctx.strokeStyle = "rgba(0, 212, 255, 0.03)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw roads (highways)
      ctx.fillStyle = "rgba(17, 24, 39, 0.6)";
      // Horizontal highway
      ctx.fillRect(0, height / 2 - 40, width, 80);
      // Vertical highway
      ctx.fillRect(width / 2 - 40, 0, 80, height);

      // Secondary loop road (subway/beltway mesh)
      ctx.strokeStyle = "rgba(59, 130, 246, 0.15)";
      ctx.lineWidth = 2;
      ctx.strokeRect(50, 50, width - 100, height - 100);

      // Lane dividers (highway dashed lines)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 2;
      ctx.setLineDash([15, 10]);
      
      // Horiz lane center
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      // Vert lane center
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Junction Central Bounding Area
      ctx.strokeStyle = selectedJunction === "JUNC-01" ? "rgba(0, 212, 255, 0.5)" : "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(width / 2 - 60, height / 2 - 60, 120, 120);
      
      // Draw flashing alert overlay if risk layer is active
      if (activeLayer === "risks") {
        ctx.fillStyle = "rgba(239, 68, 68, 0.1)";
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, 80, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(239, 68, 68, 0.3)";
        ctx.stroke();
        
        ctx.font = "8px monospace";
        ctx.fillStyle = "#EF4444";
        ctx.fillText("HIGH ANOMALY ZONE", width / 2 - 45, height / 2 - 70);
      }

      // Draw Traffic Signals in Canvas
      const drawSignal = (x: number, y: number, light: "GREEN" | "RED") => {
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = light === "GREEN" ? "#22C55E" : "#EF4444";
        ctx.fill();
        ctx.shadowColor = light === "GREEN" ? "#22C55E" : "#EF4444";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      };
      // Place signals near center intersection
      drawSignal(width / 2 - 50, height / 2 - 50, j1Light);
      drawSignal(width / 2 + 50, height / 2 + 50, j1Light === "GREEN" ? "RED" : "GREEN");

      // Draw and update car particles
      particles.forEach((p) => {
        // Stop checks for red lights
        let slowDown = false;
        const intersectionZoneX = width / 2;
        const intersectionZoneY = height / 2;

        if (p.route === "horizontal") {
          // Cars traveling horizontal
          p.x += p.speed * p.dir;

          // Stop at center junction if light is RED
          if (j1Light === "RED" && p.dir === 1 && p.x > intersectionZoneX - 70 && p.x < intersectionZoneX - 50) {
            slowDown = true;
          }
          if (j1Light === "RED" && p.dir === -1 && p.x < intersectionZoneX + 70 && p.x > intersectionZoneX + 50) {
            slowDown = true;
          }

          if (slowDown) {
            p.x -= p.speed * p.dir * 0.8; // decelerate
          }
        } else {
          // Cars traveling vertical
          p.y += p.speed * p.dir;

          // Stop at center junction if light is GREEN (opposing lights)
          if (j1Light === "GREEN" && p.dir === 1 && p.y > intersectionZoneY - 70 && p.y < intersectionZoneY - 50) {
            slowDown = true;
          }
          if (j1Light === "GREEN" && p.dir === -1 && p.y < intersectionZoneY + 70 && p.y > intersectionZoneY + 50) {
            slowDown = true;
          }

          if (slowDown) {
            p.y -= p.speed * p.dir * 0.8; // decelerate
          }
        }

        // Wrap around margins
        if (p.x > width + 20) { p.x = -10; p.color = "#00D4FF"; }
        if (p.x < -20) { p.x = width + 10; }
        if (p.y > height + 20) { p.y = -10; }
        if (p.y < -20) { p.y = height + 10; }

        // Render car particle glows
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Trace paths if active layer is flows
        if (activeLayer === "flows") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius + 3, 0, Math.PI * 2);
          ctx.strokeStyle = `${p.color}25`; // translucent
          ctx.stroke();
        }
      });

      // Visual annotations HUD
      ctx.fillStyle = "rgba(0, 212, 255, 0.7)";
      ctx.font = "9px monospace";
      ctx.fillText(`SIMULATED NODE MATRIX // FPS: 60`, 15, 20);
      ctx.fillText(`ACTIVE FLOW SEGMENTS: ${particles.length}`, 15, 32);
      ctx.fillText(`ACTIVE SECTOR LAYER: ${activeLayer.toUpperCase()}`, 15, 44);

      // Calibration corners
      ctx.strokeStyle = "rgba(59, 130, 246, 0.2)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(8, 8); ctx.lineTo(24, 8); ctx.moveTo(8, 8); ctx.lineTo(8, 24);
      ctx.moveTo(width - 8, 8); ctx.lineTo(width - 24, 8); ctx.moveTo(width - 8, 8); ctx.lineTo(width - 8, 24);
      ctx.stroke();

      animationId = requestAnimationFrame(drawTwin);
    };

    drawTwin();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying, activeLayer, selectedJunction]);

  const getCongestionBadge = (cong: CityJunction["congestion"]) => {
    switch (cong) {
      case "Low": return "text-[#22C55E] bg-[#22C55E]/10";
      case "Moderate": return "text-[#F59E0B] bg-[#F59E0B]/10";
      case "Heavy": return "text-[#EF4444] bg-[#EF4444]/10";
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Control Layers Row */}
      <div className="flex flex-wrap gap-4 border-b border-white/5 pb-4 items-center justify-between">
        
        {/* Layer Toggles */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveLayer("flows")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition-all border cursor-pointer
              ${activeLayer === "flows" 
                ? "bg-[#00D4FF]/10 border-[#00D4FF]/40 text-[#00D4FF]" 
                : "bg-white/5 border-transparent text-zinc-400 hover:text-white"
              }
            `}
          >
            Velocity Flow Paths
          </button>
          <button
            onClick={() => setActiveLayer("risks")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition-all border cursor-pointer
              ${activeLayer === "risks" 
                ? "bg-[#EF4444]/10 border-[#EF4444]/40 text-[#EF4444]" 
                : "bg-white/5 border-transparent text-zinc-400 hover:text-white"
              }
            `}
          >
            Incident Risk Vectors
          </button>
        </div>

        {/* Play/Pause controls */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:text-white transition-all cursor-pointer"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current text-[#00D4FF]" />}
        </button>

      </div>

      {/* Main Digital Twin Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Canvas Smart City Simulator (Col 8) */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 flex flex-col gap-6 relative overflow-hidden">
          
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#00D4FF]" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">Live City Node Mapping (2D Twin)</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">SECTOR_GRID // MOCK_SIMULATOR</span>
          </div>

          {/* Interactive Simulation Window */}
          <div className="flex-1 aspect-video min-h-[350px] bg-zinc-950 rounded-2xl border border-white/5 overflow-hidden relative">
            <canvas ref={canvasRef} className="w-full h-full block" />
          </div>
        </div>

        {/* Dynamic AI Insights & Junction Controls (Col 4) */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 flex flex-col justify-between">
          
          <div className="space-y-6">
            
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h4 className="font-outfit font-extrabold text-lg text-white font-mono">Sensors Nodes</h4>
              <span className="text-xs font-mono text-purple-400 bg-purple-400/5 px-2 py-0.5 rounded border border-purple-400/20">
                TWIN_CORE
              </span>
            </div>

            {/* Junction stats List */}
            <div className="space-y-3">
              {junctions.map((j) => (
                <button
                  key={j.id}
                  onClick={() => setSelectedJunction(j.id)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer text-left
                    ${selectedJunction === j.id 
                      ? "bg-[#00D4FF]/10 border-[#00D4FF]/30 text-white" 
                      : "bg-white/5 border-transparent text-zinc-400 hover:text-white"
                    }
                  `}
                >
                  <div className="space-y-1">
                    <h5 className="text-xs font-bold font-mono">{j.name}</h5>
                    <span className="text-[9px] font-mono text-zinc-500">Flow Index: {j.flowRate}%</span>
                  </div>
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${getCongestionBadge(j.congestion)}`}>
                    {j.congestion}
                  </span>
                </button>
              ))}
            </div>

            {/* AI Traffic Insights recommendations */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-zinc-400 uppercase font-mono tracking-wide">AI Recommendation Core</h5>
              
              <div className="space-y-2">
                {insights.map((insight, idx) => (
                  <div 
                    key={idx}
                    className="p-3 bg-white/5 border border-white/5 rounded-xl text-[10.5px] font-light leading-relaxed text-zinc-300 flex items-start gap-2.5"
                  >
                    <Cpu className="w-4 h-4 text-[#00D4FF] shrink-0 mt-0.5" />
                    <span>{insight}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Model information tags */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-3.5 mt-6">
            <Compass className="w-5 h-5 text-purple-400 shrink-0" />
            <div>
              <h6 className="text-[10px] text-zinc-400 uppercase font-mono font-bold">Optimization: Signal Coordination</h6>
              <span className="text-[10px] text-zinc-500 font-light block leading-relaxed">
                Junction nodes sync signal timers dynamically using green-wave algorithms to prevent gridlock.
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
