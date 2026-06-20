"use client";

import { useEffect, useRef, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { 
  ShieldAlert, 
  Video, 
  Gauge, 
  AlertTriangle,
  Play,
  Pause,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Eye
} from "lucide-react";

// Types
interface Violation {
  id: string;
  type: string;
  plate: string;
  time: string;
  confidence: number;
  severity: "Low" | "Medium" | "High" | "Critical";
  camera: string;
}

interface LiveMonitorProps {
  onGoToVerify: () => void;
}

// Chart Mock Data
const chartData = [
  { hour: "00:00", violations: 42, flow: 1200 },
  { hour: "03:00", violations: 28, flow: 800 },
  { hour: "06:00", violations: 35, flow: 2100 },
  { hour: "09:00", violations: 98, flow: 5200 },
  { hour: "12:00", violations: 74, flow: 4800 },
  { hour: "15:00", violations: 88, flow: 5100 },
  { hour: "18:00", violations: 115, flow: 6400 },
  { hour: "21:00", violations: 62, flow: 3200 },
];

export default function LiveMonitor({ onGoToVerify }: LiveMonitorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeCam, setActiveCam] = useState("CAM-04 (HQ Junction)");
  const [violations, setViolations] = useState<Violation[]>([
    { id: "V-912", type: "Red Light Jump", plate: "KA01AB1234", time: "14:02:11", confidence: 98.4, severity: "High", camera: "CAM-04" },
    { id: "V-911", type: "Helmet Violation", plate: "KA03HA8841", time: "13:58:45", confidence: 97.3, severity: "Medium", camera: "CAM-08" },
    { id: "V-910", type: "Triple Riding", plate: "MH12XY6789", time: "13:55:02", confidence: 95.1, severity: "High", camera: "CAM-04" },
    { id: "V-909", type: "Wrong Side Driving", plate: "DL03CC5521", time: "13:49:18", confidence: 99.1, severity: "Critical", camera: "CAM-01" },
    { id: "V-908", type: "Illegal Parking", plate: "HR26AD0099", time: "13:42:30", confidence: 92.5, severity: "Low", camera: "CAM-12" },
  ]);

  // Statistics counters
  const [stats, setStats] = useState({
    violationsToday: 418,
    activeCameras: 498,
    vehiclesMonitored: 82941,
    highRiskIncidents: 12
  });

  // Camera canvas rendering loop simulating live tracking
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.offsetWidth || 640);
    let height = (canvas.height = canvas.offsetHeight || 360);

    // Cars simulation state
    interface Car {
      id: number;
      x: number;
      y: number;
      speed: number;
      lane: number;
      color: string;
      plate: string;
      violating: boolean;
      violationType: string;
      confidence: number;
    }

    const cars: Car[] = [];
    let carIdCounter = 100;
    let lightState: "GREEN" | "YELLOW" | "RED" = "GREEN";
    let lightTimer = 0;

    const platesPool = ["KA01AB1234", "MH12XY6789", "DL03CC5521", "KA03HA8841", "HR26AD0099", "UP16CK4321", "AP09TV0007"];

    // Spawn a car
    const spawnCar = () => {
      const lane = Math.floor(Math.random() * 3); // 3 lanes
      const laneY = height / 2 - 40 + lane * 30;
      cars.push({
        id: carIdCounter++,
        x: -50,
        y: laneY,
        speed: Math.random() * 3 + 2,
        lane,
        color: ["#00D4FF", "#3B82F6", "#F9FAFB", "#F59E0B"][Math.floor(Math.random() * 4)],
        plate: platesPool[Math.floor(Math.random() * platesPool.length)],
        violating: false,
        violationType: "",
        confidence: 0
      });
    };

    // Pre-populate some cars
    for (let i = 0; i < 4; i++) {
      spawnCar();
      cars[i].x = Math.random() * (width - 100) + 50;
    }

    const drawCamera = () => {
      if (!isPlaying) {
        animationId = requestAnimationFrame(drawCamera);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Light state controller
      lightTimer++;
      if (lightState === "GREEN" && lightTimer > 300) {
        lightState = "YELLOW";
        lightTimer = 0;
      } else if (lightState === "YELLOW" && lightTimer > 100) {
        lightState = "RED";
        lightTimer = 0;
      } else if (lightState === "RED" && lightTimer > 250) {
        lightState = "GREEN";
        lightTimer = 0;
      }

      // Draw Roads
      ctx.fillStyle = "#0c1328";
      ctx.fillRect(0, 0, width, height);

      // Lanes
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 4;
      ctx.setLineDash([20, 15]);
      ctx.beginPath();
      ctx.moveTo(0, height / 2 - 10);
      ctx.lineTo(width, height / 2 - 10);
      ctx.moveTo(0, height / 2 + 20);
      ctx.lineTo(width, height / 2 + 20);
      ctx.stroke();
      ctx.setLineDash([]);

      // Limit/Stop Line (Red Light Jump trigger zone)
      ctx.strokeStyle = lightState === "RED" ? "rgba(239, 68, 68, 0.6)" : "rgba(34, 197, 94, 0.4)";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(width - 150, height / 2 - 60);
      ctx.lineTo(width - 150, height / 2 + 60);
      ctx.stroke();

      // Spawn manager
      if (Math.random() < 0.015 && cars.length < 8) {
        spawnCar();
      }

      // Render Traffic Signal Overlay
      ctx.fillStyle = "#111827";
      ctx.fillRect(width - 40, 20, 25, 70);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.strokeRect(width - 40, 20, 25, 70);

      // Draw Lights
      const drawLight = (y: number, color: string, active: boolean) => {
        ctx.beginPath();
        ctx.arc(width - 27.5, y, 7, 0, Math.PI * 2);
        ctx.fillStyle = active ? color : "#1f2937";
        ctx.fill();
        if (active) {
          ctx.shadowColor = color;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(width - 27.5, y, 4, 0, Math.PI * 2);
          ctx.fillStyle = "#fff";
          ctx.fill();
          ctx.shadowBlur = 0; // reset shadow
        }
      };
      drawLight(32, "#EF4444", lightState === "RED");
      drawLight(55, "#F59E0B", lightState === "YELLOW");
      drawLight(78, "#22C55E", lightState === "GREEN");

      // Draw Cars
      cars.forEach((car, index) => {
        car.x += car.speed;

        // Red light jump check
        const stopLineX = width - 150;
        if (lightState === "RED" && car.x > stopLineX - 20 && car.x < stopLineX && !car.violating) {
          car.violating = true;
          car.violationType = "Red Light Jump";
          car.confidence = +(94 + Math.random() * 5).toFixed(1);
          car.speed += 1.5; // speeds up to run red

          // Push violation to feed
          const newViolation: Violation = {
            id: `V-${Math.floor(Math.random() * 900) + 100}`,
            type: car.violationType,
            plate: car.plate,
            time: new Date().toLocaleTimeString("en-US", { hour12: false }),
            confidence: car.confidence,
            severity: "High",
            camera: activeCam.split(" ")[0]
          };
          setViolations(prev => [newViolation, ...prev.slice(0, 9)]);
          setStats(prev => ({
            ...prev,
            violationsToday: prev.violationsToday + 1,
            highRiskIncidents: prev.highRiskIncidents + 1
          }));
        }

        // Speeding Check (e.g. speed threshold limit)
        const scaleSpeed = Math.floor(car.speed * 15);
        if (scaleSpeed > 80 && !car.violating && Math.random() < 0.005) {
          car.violating = true;
          car.violationType = "Speeding Violation";
          car.confidence = +(95 + Math.random() * 4).toFixed(1);

          const newViolation: Violation = {
            id: `V-${Math.floor(Math.random() * 900) + 100}`,
            type: car.violationType,
            plate: car.plate,
            time: new Date().toLocaleTimeString("en-US", { hour12: false }),
            confidence: car.confidence,
            severity: "Medium",
            camera: activeCam.split(" ")[0]
          };
          setViolations(prev => [newViolation, ...prev.slice(0, 9)]);
          setStats(prev => ({ ...prev, violationsToday: prev.violationsToday + 1 }));
        }

        // Draw car shape
        ctx.fillStyle = car.color;
        ctx.fillRect(car.x, car.y - 12, 36, 18);
        ctx.strokeStyle = car.violating ? "#EF4444" : "rgba(255,255,255,0.4)";
        ctx.lineWidth = 1;
        ctx.strokeRect(car.x, car.y - 12, 36, 18);

        // Track bounding box (cyberpunk style)
        if (car.x > 30 && car.x < width - 50) {
          ctx.strokeStyle = car.violating ? "#EF4444" : "#00D4FF";
          ctx.lineWidth = car.violating ? 2 : 1;
          ctx.strokeRect(car.x - 4, car.y - 18, 44, 28);
          
          // Draw corners
          ctx.fillStyle = car.violating ? "#EF4444" : "#00D4FF";
          ctx.fillRect(car.x - 4, car.y - 18, 5, 2);
          ctx.fillRect(car.x - 4, car.y - 18, 2, 5);
          ctx.fillRect(car.x + 35, car.y - 18, 5, 2);
          ctx.fillRect(car.x + 38, car.y - 18, 2, 5);
          ctx.fillRect(car.x - 4, car.y + 8, 5, 2);
          ctx.fillRect(car.x - 4, car.y + 5, 2, 5);
          ctx.fillRect(car.x + 35, car.y + 8, 5, 2);
          ctx.fillRect(car.x + 38, car.y + 5, 2, 5);

          // Labels
          ctx.font = "8px monospace";
          ctx.fillText(`ID:${car.id}`, car.x - 2, car.y - 22);
          ctx.fillText(`${scaleSpeed}km/h`, car.x + 16, car.y - 22);

          if (car.violating) {
            ctx.fillStyle = "#EF4444";
            ctx.fillText(car.violationType.toUpperCase(), car.x - 4, car.y - 30);
          }
        }
      });

      // Remove offscreen cars
      for (let i = cars.length - 1; i >= 0; i--) {
        if (cars[i].x > width + 50) {
          cars.splice(i, 1);
          setStats(prev => ({ ...prev, vehiclesMonitored: prev.vehiclesMonitored + 1 }));
        }
      }

      // Static overlays HUD
      ctx.fillStyle = "rgba(0, 212, 255, 0.6)";
      ctx.font = "10px monospace";
      ctx.fillText(`REC: ACTIVE // RESOLUTION: 3840x2160`, 20, 30);
      ctx.fillText(`TIME: ${new Date().toLocaleTimeString("en-US", { hour12: false })}`, 20, 45);
      ctx.fillText(`NODE FEED: ${activeCam.toUpperCase()}`, 20, 60);

      // Calibration markers
      ctx.strokeStyle = "rgba(0, 212, 255, 0.2)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(10, 10); ctx.lineTo(30, 10); ctx.moveTo(10, 10); ctx.lineTo(10, 30);
      ctx.moveTo(width - 10, 10); ctx.lineTo(width - 30, 10); ctx.moveTo(width - 10, 10); ctx.lineTo(width - 10, 30);
      ctx.moveTo(10, height - 10); ctx.lineTo(30, height - 10); ctx.moveTo(10, height - 10); ctx.lineTo(10, height - 30);
      ctx.moveTo(width - 10, height - 10); ctx.lineTo(width - 30, height - 10); ctx.moveTo(width - 10, height - 10); ctx.lineTo(width - 10, height - 30);
      ctx.stroke();

      animationId = requestAnimationFrame(drawCamera);
    };

    drawCamera();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying, activeCam]);

  const getSeverityColor = (sev: Violation["severity"]) => {
    switch (sev) {
      case "Low": return "text-[#22C55E] border-[#22C55E]/30 bg-[#22C55E]/10";
      case "Medium": return "text-[#F59E0B] border-[#F59E0B]/30 bg-[#F59E0B]/10";
      case "High": return "text-orange-500 border-orange-500/30 bg-orange-500/10";
      case "Critical": return "text-[#EF4444] border-[#EF4444]/30 bg-[#EF4444]/10";
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. TOP STATS CARDS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel rounded-2xl p-6 border-l-4 border-l-[#EF4444] flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-zinc-500 text-xs uppercase font-mono tracking-wider font-semibold">Violations Today</span>
            <h3 className="text-3xl font-extrabold text-white font-mono">{stats.violationsToday}</h3>
          </div>
          <div className="p-3 bg-[#EF4444]/10 rounded-xl text-[#EF4444] border border-[#EF4444]/20 animate-pulse">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 border-l-4 border-l-[#00D4FF] flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-zinc-500 text-xs uppercase font-mono tracking-wider font-semibold">Active Cameras</span>
            <h3 className="text-3xl font-extrabold text-white font-mono">{stats.activeCameras} <span className="text-xs text-zinc-500 font-normal">/500</span></h3>
          </div>
          <div className="p-3 bg-[#00D4FF]/10 rounded-xl text-[#00D4FF] border border-[#00D4FF]/20">
            <Video className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 border-l-4 border-l-[#3B82F6] flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-zinc-500 text-xs uppercase font-mono tracking-wider font-semibold">Vehicles Tracked</span>
            <h3 className="text-3xl font-extrabold text-white font-mono">{stats.vehiclesMonitored.toLocaleString()}</h3>
          </div>
          <div className="p-3 bg-[#3B82F6]/10 rounded-xl text-[#3B82F6] border border-[#3B82F6]/20">
            <Gauge className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 border-l-4 border-l-[#F59E0B] flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-zinc-500 text-xs uppercase font-mono tracking-wider font-semibold">Critical Incidents</span>
            <h3 className="text-3xl font-extrabold text-[#F59E0B] font-mono">{stats.highRiskIncidents}</h3>
          </div>
          <div className="p-3 bg-[#F59E0B]/10 rounded-xl text-[#F59E0B] border border-[#F59E0B]/20">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2. CAMERA AND LIVE FEED GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Live Camera Stream Panel */}
        <div className="lg:col-span-8 glass-panel rounded-2xl overflow-hidden flex flex-col">
          
          {/* Header toolbar */}
          <div className="p-4 border-b border-white/5 bg-[#111827]/40 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] animate-ping" />
              <select 
                value={activeCam}
                onChange={(e) => setActiveCam(e.target.value)}
                className="bg-transparent border-none text-sm font-semibold text-white focus:outline-none cursor-pointer"
              >
                <option value="CAM-04 (HQ Junction)">CAM-04 (HQ Junction)</option>
                <option value="CAM-01 (North Expressway)">CAM-01 (North Expressway)</option>
                <option value="CAM-08 (East Boulevard)">CAM-08 (East Boulevard)</option>
                <option value="CAM-12 (Central Square)">CAM-12 (Central Square)</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-md border border-white/5 bg-[#0B1020] text-zinc-400 hover:text-white cursor-pointer transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current text-[#00D4FF]" />}
              </button>
            </div>
          </div>

          {/* Canvas Wrapper */}
          <div className="relative flex-1 aspect-video min-h-[300px] bg-zinc-950">
            <canvas ref={canvasRef} className="w-full h-full block" />
            
            {/* Screen static scan line */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%] pointer-events-none opacity-40" />
          </div>
        </div>

        {/* Recent Violations Live Feed */}
        <div className="lg:col-span-4 glass-panel rounded-2xl flex flex-col max-h-[450px] lg:max-h-none">
          <div className="p-4 border-b border-white/5 bg-[#111827]/40 flex justify-between items-center">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#00D4FF]">Recent Incidents</span>
            <button 
              onClick={onGoToVerify}
              className="text-[10px] font-mono font-bold text-[#3B82F6] hover:text-[#00D4FF] hover:underline"
            >
              Officer Queue &rarr;
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
            {violations.map((violation, idx) => (
              <div 
                key={violation.id} 
                className="bg-white/5 rounded-xl p-3 border border-white/5 hover:border-white/10 transition-all flex flex-col gap-2 relative group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="text-xs font-bold text-white group-hover:text-[#00D4FF] transition-colors">{violation.type}</h5>
                    <span className="text-[10px] text-zinc-500 font-mono">{violation.camera} // {violation.time}</span>
                  </div>
                  <span className={`text-[9px] font-mono font-bold border px-1.5 py-0.5 rounded ${getSeverityColor(violation.severity)}`}>
                    {violation.severity}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono bg-[#0B1020]/50 rounded p-1.5">
                  <span>Plate: <span className="text-zinc-200 font-bold">{violation.plate}</span></span>
                  <span>Confidence: <span className="text-[#00D4FF]">{violation.confidence}%</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. MAP AND ANALYTICS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Stylized city radar blueprint map */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 flex flex-col gap-4 min-h-[300px]">
          <div>
            <h4 className="font-outfit font-bold text-white text-base">City Grid Sensors</h4>
            <p className="text-zinc-500 text-xs">Dynamic overlay mapping camera health and alerts.</p>
          </div>

          <div className="flex-1 rounded-xl bg-zinc-950 border border-white/5 overflow-hidden relative flex items-center justify-center min-h-[200px]">
            {/* Map Vector Mock */}
            <svg className="w-full h-full opacity-40 absolute" viewBox="0 0 200 120">
              <defs>
                <radialGradient id="radar" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>
              <circle cx="100" cy="60" r="50" fill="url(#radar)" />
              <circle cx="100" cy="60" r="35" fill="none" stroke="rgba(0, 212, 255, 0.2)" strokeWidth="0.5" />
              <circle cx="100" cy="60" r="15" fill="none" stroke="rgba(0, 212, 255, 0.3)" strokeWidth="0.5" />
              
              {/* Radial crosshair lines */}
              <line x1="100" y1="10" x2="100" y2="110" stroke="rgba(0,212,255,0.1)" strokeWidth="0.5" />
              <line x1="30" y1="60" x2="170" y2="60" stroke="rgba(0,212,255,0.1)" strokeWidth="0.5" />

              {/* Grid Roads */}
              <path d="M 10 10 L 190 10 M 10 60 L 190 60 M 10 110 L 190 110 M 40 10 L 40 110 M 100 10 L 100 110 M 160 10 L 160 110" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            </svg>

            {/* Blinking Nodes */}
            <div className="absolute top-[20%] left-[20%] flex flex-col items-center">
              <span className="w-3.5 h-3.5 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/50 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
              </span>
              <span className="text-[8px] font-mono text-zinc-500 mt-1">CAM-01</span>
            </div>

            <div className="absolute top-[50%] left-[50%] flex flex-col items-center translate-x-[-50%] translate-y-[-50%]">
              <span className="w-5 h-5 rounded-full bg-[#EF4444]/20 border border-[#EF4444] flex items-center justify-center animate-pulse">
                <span className="w-2 h-2 rounded-full bg-[#EF4444] pulse-glow-danger" />
              </span>
              <span className="text-[8px] font-mono text-[#EF4444] font-bold mt-1">CAM-04 (ALERT)</span>
            </div>

            <div className="absolute bottom-[25%] right-[20%] flex flex-col items-center">
              <span className="w-3.5 h-3.5 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/50 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
              </span>
              <span className="text-[8px] font-mono text-zinc-500 mt-1">CAM-08</span>
            </div>

            <div className="absolute top-[30%] right-[35%] flex flex-col items-center">
              <span className="w-3.5 h-3.5 rounded-full bg-[#F59E0B]/20 border border-[#F59E0B]/60 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
              </span>
              <span className="text-[8px] font-mono text-zinc-500 mt-1">CAM-12</span>
            </div>
            
            {/* Sonar Radar sweep border */}
            <div className="absolute inset-4 rounded-xl border border-white/5 pointer-events-none" />
            <div className="absolute bottom-3 left-3 bg-[#111827]/80 px-2 py-1 rounded border border-white/5 text-[9px] font-mono text-[#00D4FF]">
              RADAR ACTIVE // RANGE: 1.5 KM
            </div>
          </div>
        </div>

        {/* Violations trend chart */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 flex flex-col gap-4">
          <div>
            <h4 className="font-outfit font-bold text-white text-base">Violation Frequencies</h4>
            <p className="text-zinc-500 text-xs">Analyzed violation rate trends relative to flow indices.</p>
          </div>

          <div className="flex-1 w-full h-[220px] min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViolations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" stroke="#4b5563" fontSize={10} tickLine={false} />
                <YAxis stroke="#4b5563" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#111827", borderColor: "rgba(59, 130, 246, 0.2)", borderRadius: "8px" }}
                  labelStyle={{ color: "#fff", fontSize: "11px", fontWeight: "bold" }}
                  itemStyle={{ fontSize: "11px" }}
                />
                <Area type="monotone" dataKey="violations" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorViolations)" name="Violations" />
                <Area type="monotone" dataKey="flow" stroke="#00D4FF" strokeWidth={1} strokeDasharray="3 3" fillOpacity={1} fill="url(#colorFlow)" name="Vehicle Flow (index)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
