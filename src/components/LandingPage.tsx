"use client";

import { useEffect, useRef, useState, Fragment } from "react";
import { motion } from "framer-motion";
import { 
  Eye, 
  ShieldCheck, 
  Video, 
  FileText, 
  Percent, 
  Layers, 
  Activity, 
  MapPin, 
  TrendingUp, 
  UserCheck, 
  Tv, 
  Cpu, 
  Network, 
  Database, 
  Cloud,
  ChevronRight,
  Play,
  ArrowRight
} from "lucide-react";

interface LandingPageProps {
  onEnterDashboard: () => void;
}

export default function LandingPage({ onEnterDashboard }: LandingPageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activePipelineStep, setActivePipelineStep] = useState(0);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [activeArchTab, setActiveArchTab] = useState<"core" | "lpr" | "hitl">("core");
  const [activeArchStep, setActiveArchStep] = useState(0);

  // Background Particle Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }> = [];

    // Create particles
    const particleCount = Math.min(60, Math.floor((width * height) / 15000));
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(0, 212, 255, 0.2)";
      ctx.strokeStyle = "rgba(59, 130, 246, 0.05)";
      ctx.lineWidth = 1;

      // Update and draw particles
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Connect particles
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 212, 255, ${0.15 * (1 - dist / 120)})`;
            ctx.stroke();
          }
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Cycle through pipeline steps in demo
  useEffect(() => {
    const timer = setInterval(() => {
      setActivePipelineStep((prev) => (prev + 1) % 9);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      title: "Traffic Violation Detection",
      desc: "Instantly flags illegal behavior: red-light running, wrong-side driving, illegal parking, and speeding.",
      icon: ShieldCheck,
      color: "from-blue-500/20 to-cyan-500/20 text-[#00D4FF]"
    },
    {
      title: "Vehicle Tracking",
      desc: "High-accuracy multi-object tracking (MOT) across dense traffic junctions, maintaining unique IDs for each vehicle.",
      icon: Video,
      color: "from-cyan-500/20 to-blue-500/20 text-[#3B82F6]"
    },
    {
      title: "License Plate Recognition",
      desc: "Deep-learning driven OCR that extracts plate characters under low-light, extreme angles, or weather conditions.",
      icon: Eye,
      color: "from-purple-500/20 to-blue-500/20 text-purple-400"
    },
    {
      title: "Explainable AI (XAI)",
      desc: "Generates clear visual heatmaps and text justifications explaining precisely why a violation was flagged.",
      icon: Network,
      color: "from-pink-500/20 to-red-500/20 text-pink-400"
    },
    {
      title: "Severity Scoring",
      desc: "Dynamically scores the severity of violations from 1-100 based on hazard levels, traffic conditions, and speed.",
      icon: Activity,
      color: "from-red-500/20 to-orange-500/20 text-[#EF4444]"
    },
    {
      title: "Evidence Generation",
      desc: "Automates the generation of cryptographically secure evidence packets, complete with image crops and speed telemetry.",
      icon: FileText,
      color: "from-teal-500/20 to-emerald-500/20 text-teal-400"
    },
    {
      title: "Violation Analytics",
      desc: "Synthesizes raw feeds into structured dashboard reports with peak violations, top locations, and enforcement stats.",
      icon: TrendingUp,
      color: "from-emerald-500/20 to-cyan-500/20 text-[#22C55E]"
    },
    {
      title: "Risk Prediction",
      desc: "Machine learning models analyze historical traffic data to forecast junction risk zones and peak violation hours.",
      icon: MapPin,
      color: "from-orange-500/20 to-yellow-500/20 text-[#F59E0B]"
    },
    {
      title: "Human Verification Queue",
      desc: "Intuitive interface designed for verification officers to inspect evidence packets with single-click actions.",
      icon: UserCheck,
      color: "from-indigo-500/20 to-purple-500/20 text-indigo-400"
    },
    {
      title: "Digital Twin Visualization",
      desc: "Interactive 2D/3D city-scale simulation mapping vehicles, traffic flows, and active violations in real-time.",
      icon: Tv,
      color: "from-blue-600/20 to-teal-500/20 text-emerald-400"
    }
  ];

  const pipelineSteps = [
    { title: "Traffic Camera", desc: "4K Live CCTV Video Feeds" },
    { title: "Image Enhancement", desc: "Low-Light & Fog Correction" },
    { title: "Scene Understanding", desc: "Junction Boundaries & Zones" },
    { title: "Vehicle Detection", desc: "YOLO Segmentations" },
    { title: "Violation Detection", desc: "Traffic Rule Violations Flagged" },
    { title: "OCR Engine", desc: "ANPR License Plate Scan" },
    { title: "Evidence Generation", desc: "Crops, Overlays & Metadata" },
    { title: "Human Review", desc: "Officer Final Verification" },
    { title: "Analytics Dashboard", desc: "City Intelligence Update" }
  ];

  const technologies = [
    {
      category: "Computer Vision",
      icon: Cpu,
      items: ["YOLOv11", "RT-DETR", "DeepLabV3+"]
    },
    {
      category: "OCR & Text",
      icon: FileText,
      items: ["PaddleOCR", "TrOCR"]
    },
    {
      category: "Vehicle Tracking",
      icon: Network,
      items: ["ByteTrack", "DeepSORT"]
    },
    {
      category: "Backend Services",
      icon: Layers,
      items: ["FastAPI", "Python Core"]
    },
    {
      category: "Frontend UI",
      icon: Tv,
      items: ["React", "Next.js", "TailwindCSS"]
    },
    {
      category: "Database Layers",
      icon: Database,
      items: ["PostgreSQL", "MongoDB"]
    },
    {
      category: "Cloud Infrastructures",
      icon: Cloud,
      items: ["AWS", "Azure GCP"]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0B1020] text-zinc-100 overflow-x-hidden relative">
      {/* Fixed background overlay grid & radial gradient */}
      <div className="fixed inset-0 cyber-grid pointer-events-none z-0" />
      
      {/* Main Scrollable Content */}
      <div className="relative z-10 flex flex-col w-full">
      
      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-[#3B82F6] to-[#00D4FF] flex items-center justify-center glow-border-cyan">
            <Eye className="w-6 h-6 text-[#0B1020] stroke-[2.5]" />
          </div>
          <div>
            <span className="font-outfit font-extrabold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-[#00D4FF]">
              TRAFFIC-EYE
            </span>
            <span className="font-mono text-xs ml-1.5 px-1.5 py-0.5 rounded border border-[#00D4FF]/30 bg-[#00D4FF]/10 text-[#00D4FF]">
              AI
            </span>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#features" className="hover:text-[#00D4FF] transition-colors">Features</a>
          <a href="#pipeline" className="hover:text-[#00D4FF] transition-colors">AI Pipeline</a>
          <a href="#architecture" className="hover:text-[#00D4FF] transition-colors">Architecture</a>
          <a href="#tech" className="hover:text-[#00D4FF] transition-colors">Technology</a>
          <a href="#impact" className="hover:text-[#00D4FF] transition-colors">Impact</a>
        </div>

        <button 
          onClick={onEnterDashboard}
          className="relative group overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-[#00D4FF]/50"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-[#00D4FF] to-[#3B82F6] rounded-full" />
          <span className="relative block px-6 py-2 rounded-full bg-[#0B1020] text-sm font-semibold transition-all group-hover:bg-transparent group-hover:text-[#0B1020] flex items-center gap-2">
            Control Center
            <ChevronRight className="w-4 h-4" />
          </span>
        </button>
      </header>

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 md:px-12 py-20">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-60" />
        
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-xs text-blue-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-[#00D4FF] pulse-glow-cyan"></span>
              SECURE SMART CITY SYSTEM
            </div>
            
            <h1 className="font-outfit font-extrabold text-5xl md:text-7xl leading-tight tracking-tight">
              Next-Gen Smart City <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] via-[#3B82F6] to-purple-400 glow-text-cyan">
                Traffic Intelligence
              </span>
            </h1>
            
            <p className="text-zinc-400 text-lg md:text-xl max-w-xl font-light leading-relaxed">
              AI-powered traffic monitoring system that detects violations, recognizes license plates, generates evidence, predicts hotspots, and provides city-wide traffic intelligence.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <button 
                onClick={onEnterDashboard}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#3B82F6] text-[#0B1020] font-bold shadow-lg hover:shadow-[#00D4FF]/20 hover:scale-[1.02] transition-all flex items-center gap-3 cursor-pointer"
              >
                View Dashboard
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>
              <button 
                onClick={() => setShowDemoModal(true)}
                className="px-8 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold transition-all flex items-center gap-3 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current text-[#00D4FF]" />
                Watch Demo
              </button>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 w-full border-t border-white/5">
              <div>
                <h3 className="text-3xl font-extrabold text-white">98.7%</h3>
                <p className="text-zinc-500 text-xs mt-1 uppercase tracking-wider font-semibold">Detection Accuracy</p>
              </div>
              <div>
                <h3 className="text-3xl font-extrabold text-white">1.2M+</h3>
                <p className="text-zinc-500 text-xs mt-1 uppercase tracking-wider font-semibold">Images Processed</p>
              </div>
              <div>
                <h3 className="text-3xl font-extrabold text-white">500+</h3>
                <p className="text-zinc-500 text-xs mt-1 uppercase tracking-wider font-semibold">Smart Cameras</p>
              </div>
              <div>
                <h3 className="text-3xl font-extrabold text-white">95%</h3>
                <p className="text-zinc-500 text-xs mt-1 uppercase tracking-wider font-semibold">Manual Effort Cut</p>
              </div>
            </div>
          </div>

          {/* Right Floating Visual Card */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#00D4FF]/10 to-purple-500/10 rounded-3xl filter blur-3xl opacity-50" />
            
            <div className="w-full glass-panel-cyan rounded-3xl p-6 relative overflow-hidden border border-[#00D4FF]/20">
              <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] animate-ping" />
                  <span className="text-xs font-mono uppercase text-[#EF4444] font-bold tracking-widest">LIVE ANOMALY DETECTED</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">JUNCTION-04 // CAM_08</span>
              </div>
              
              {/* Simulated Camera Feed inside Card */}
              <div className="relative aspect-video rounded-xl bg-zinc-950 border border-white/5 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/80 pointer-events-none z-10" />
                <div className="laser-scanner" />
                
                {/* SVG Mock Traffic */}
                <svg className="w-full h-full opacity-80" viewBox="0 0 320 180">
                  {/* Road Grid */}
                  <line x1="80" y1="180" x2="140" y2="0" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                  <line x1="240" y1="180" x2="180" y2="0" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                  
                  {/* Moving Car Outline */}
                  <rect x="110" y="80" width="100" height="60" fill="none" stroke="#EF4444" strokeWidth="2" rx="4" />
                  {/* Bounding box label */}
                  <rect x="110" y="58" width="85" height="20" fill="#EF4444" rx="2" />
                  <text x="114" y="72" fill="#fff" fontSize="10" fontFamily="monospace" fontWeight="bold">RED LIGHT JUMP</text>
                  <text x="115" y="115" fill="#EF4444" fontSize="9" fontFamily="monospace">KA-03-HA-8841</text>
                  <text x="115" y="130" fill="rgba(255,255,255,0.7)" fontSize="8" fontFamily="monospace">CONFIDENCE: 99.4%</text>
                  
                  {/* Surrounding Tracked Car */}
                  <rect x="40" y="20" width="40" height="30" fill="none" stroke="#00D4FF" strokeWidth="1" rx="2" className="opacity-40" />
                  <text x="40" y="14" fill="#00D4FF" fontSize="7" fontFamily="monospace" className="opacity-60">CAR [ID_8204]</text>
                </svg>

                {/* Cyberpunk HUD frame corners */}
                <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#00D4FF]" />
                <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#00D4FF]" />
                <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#00D4FF]" />
                <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#00D4FF]" />
              </div>
              
              {/* Telemetry info row */}
              <div className="grid grid-cols-2 gap-4 mt-4 pt-2">
                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                  <span className="text-[10px] text-zinc-500 block uppercase font-mono tracking-wider">Target Speed</span>
                  <span className="text-lg font-bold font-mono text-zinc-200">82 km/h</span>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                  <span className="text-[10px] text-zinc-500 block uppercase font-mono tracking-wider">Severity Classification</span>
                  <span className="text-lg font-bold font-mono text-[#EF4444] glow-text-blue">HIGH [92/100]</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 px-6 md:px-12 border-t border-white/5 bg-zinc-950/40 relative">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="font-outfit font-extrabold text-4xl md:text-5xl">
              Engineered for <span className="text-[#00D4FF]">Autonomous Governance</span>
            </h2>
            <p className="text-zinc-400 text-lg">
              A comprehensive suite of deep-learning modules designed to automate traffic enforcement, safety monitoring, and predictive flow optimization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="glass-panel rounded-2xl p-6 flex flex-col items-start gap-4 cursor-default group hover:border-[#00D4FF]/40 hover:shadow-[#00D4FF]/5 transition-all"
                >
                  <div className={`p-3.5 rounded-xl bg-gradient-to-br ${feat.color} bg-opacity-20 border border-white/5 group-hover:scale-110 transition-all`}>
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>
                  <h3 className="font-outfit font-bold text-xl text-white group-hover:text-[#00D4FF] transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {feat.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI PROCESSING PIPELINE */}
      <section id="pipeline" className="py-24 px-6 md:px-12 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="font-outfit font-extrabold text-4xl md:text-5xl">
              End-to-End <span className="text-[#3B82F6]">AI Pipeline</span>
            </h2>
            <p className="text-zinc-400 text-lg">
              How video signals are ingested, enhanced, analyzed, verified, and mapped into actionable city intelligence within milliseconds.
            </p>
          </div>

          {/* Pipeline flow visualizer */}
          <div className="relative">
            {/* Background connecting path line */}
            <div className="absolute top-[48px] left-[5%] right-[5%] h-0.5 bg-gradient-to-r from-[#00D4FF]/20 via-[#3B82F6]/50 to-[#22C55E]/20 hidden lg:block" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-9 gap-6 relative z-10">
              {pipelineSteps.map((step, idx) => {
                const isActive = idx === activePipelineStep;
                return (
                  <div 
                    key={idx}
                    className="flex flex-col items-center text-center space-y-3 cursor-default"
                  >
                    {/* Glowing Node */}
                    <div 
                      className={`w-24 h-24 rounded-full flex flex-col items-center justify-center border transition-all duration-700 relative
                        ${isActive 
                          ? "bg-gradient-to-tr from-[#00D4FF] to-[#3B82F6] border-[#00D4FF] scale-110 shadow-[0_0_20px_rgba(0,212,255,0.4)] text-[#0B1020]" 
                          : "bg-zinc-900/80 border-white/10 text-zinc-400"
                        }
                      `}
                    >
                      <span className="font-mono text-xs font-bold">0{idx + 1}</span>
                      
                      {/* Active glowing rings */}
                      {isActive && (
                        <>
                          <span className="absolute inset-[-6px] rounded-full border border-[#00D4FF]/40 animate-ping opacity-60" />
                          <span className="absolute inset-[-12px] rounded-full border border-[#3B82F6]/20 animate-pulse" />
                        </>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className={`font-outfit font-bold text-sm tracking-wide transition-colors ${isActive ? "text-[#00D4FF]" : "text-zinc-200"}`}>
                        {step.title}
                      </h4>
                      <p className="text-zinc-500 text-[11px] leading-tight px-2">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SYSTEM ARCHITECTURE SECTION */}
      <section id="architecture" className="py-24 px-6 md:px-12 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="font-outfit font-extrabold text-4xl md:text-5xl">
              System <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#3B82F6]">Architecture</span>
            </h2>
            <p className="text-zinc-400 text-lg">
              Detailed logical pipelines and branching decision frameworks driving autonomous smart city violation audits.
            </p>

            {/* Tab Switched Header buttons */}
            <div className="flex justify-center gap-2 pt-4">
              <button
                onClick={() => setActiveArchTab("core")}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold font-mono border transition-all cursor-pointer
                  ${activeArchTab === "core" 
                    ? "bg-[#00D4FF]/10 border-[#00D4FF]/40 text-[#00D4FF]" 
                    : "bg-white/5 border-transparent text-zinc-400 hover:text-white"
                  }
                `}
              >
                Core Ingestion Pipeline
              </button>
              <button
                onClick={() => setActiveArchTab("lpr")}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold font-mono border transition-all cursor-pointer
                  ${activeArchTab === "lpr" 
                    ? "bg-[#00D4FF]/10 border-[#00D4FF]/40 text-[#00D4FF]" 
                    : "bg-white/5 border-transparent text-zinc-400 hover:text-white"
                  }
                `}
              >
                ANPR / LPR Subsystem
              </button>
              <button
                onClick={() => setActiveArchTab("hitl")}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold font-mono border transition-all cursor-pointer
                  ${activeArchTab === "hitl" 
                    ? "bg-[#00D4FF]/10 border-[#00D4FF]/40 text-[#00D4FF]" 
                    : "bg-white/5 border-transparent text-zinc-400 hover:text-white"
                  }
                `}
              >
                Human-in-the-Loop Workflow
              </button>
            </div>
          </div>

          {/* Render Active Flowchart Content */}
          <div className="mt-8">
            
            {/* 1. Core Ingestion Pipeline Diagram */}
            {activeArchTab === "core" && (
              <div className="space-y-6">
                
                {/* Heading info */}
                <div className="space-y-2 mb-6 text-center">
                  <h3 className="text-xl md:text-2xl font-outfit font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00D4FF] tracking-wide">
                    System Architecture: Core Ingestion Pipeline
                  </h3>
                  <p className="text-zinc-400 text-sm font-light">
                    13 sequential stages from raw RTSP video streams to real-time dashboard analytics. Click any node to inspect diagnostic logs.
                  </p>
                </div>

                {/* Horizontal flow blocks wrapper */}
                <div className="flex flex-wrap items-center gap-y-3.5 gap-x-2 bg-[#0B1020]/30 border border-white/5 rounded-3xl p-5 justify-center">
                  {[
                    { title: "Traffic Camera Image", desc: "4K live stream raw CCTV capture frames." },
                    { title: "Image Quality Assessment", desc: "Auto-analyzes contrast, blur, resolution, and exposure levels." },
                    { title: "Adaptive Enhancement Engine", desc: "Applies night-vision boosts, fog filters, and resolution scaling." },
                    { title: "Scene Understanding Module", desc: "Calibrates perspective matrices, ROI boundaries, and lanes." },
                    { title: "Vehicle & Road User Detection", desc: "Segments cars, trucks, motorcycles, and pedestrians via YOLOv11." },
                    { title: "Object Tracking Engine", desc: "Establishes unique tracking IDs across frames using ByteTrack." },
                    { title: "Multi-Agent Violation Detection", desc: "Runs specialized models checking red lights, helmets, and speed." },
                    { title: "Confidence Fusion Engine", desc: "Aggregates temporal frame indicators to filter transient noise." },
                    { title: "License Plate Recognition", desc: "Localizes and OCR-scans characters using PaddleOCR & TrOCR." },
                    { title: "Evidence Generation Engine", desc: "Packs overlays, speed telemetry, timestamp, and signature crop." },
                    { title: "Severity Scoring Engine", desc: "Calculates risk hazard index (1-100) based on speed and density." },
                    { title: "Human Verification Layer", desc: "Pushes flagged packages to officer audit queues." },
                    { title: "Traffic Intelligence Dashboard", desc: "Dispatches database writes to populate analytics panels." }
                  ].map((step, idx) => (
                    <Fragment key={idx}>
                      <button
                        onClick={() => setActiveArchStep(idx)}
                        className={`flex items-center gap-2.5 py-2 px-3.5 rounded-xl border transition-all cursor-pointer text-left relative max-w-[220px] min-w-[170px]
                          ${activeArchStep === idx 
                            ? "bg-[#00D4FF]/10 border-[#00D4FF]/40 text-white shadow-[0_0_15px_rgba(0,212,255,0.1)]" 
                            : "bg-white/5 border-transparent text-zinc-400 hover:text-white"
                          }
                        `}
                      >
                        <span className={`w-5.5 h-5.5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono shrink-0
                          ${activeArchStep === idx 
                            ? "bg-gradient-to-tr from-[#00D4FF] to-[#3B82F6] text-[#0B1020]" 
                            : "bg-zinc-900 border border-white/10 text-zinc-400"
                          }
                        `}>
                          {idx + 1}
                        </span>
                        <span className="text-[10px] font-mono uppercase tracking-wide truncate">{step.title}</span>
                      </button>
                      {idx < 12 && (
                        <span className="text-[#00D4FF]/40 font-mono text-sm shrink-0 mx-1 select-none">
                          &rarr;
                        </span>
                      )}
                    </Fragment>
                  ))}
                </div>

                {/* Diagnostic Monitor Logs (Full Width below) */}
                <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden mt-6 min-h-[220px]">
                  <div className="laser-scanner" />
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-mono font-bold text-[#00D4FF] uppercase tracking-wider">Node Diagnostic logs</span>
                      </div>
                      <span className="text-[9px] font-mono text-zinc-500">STEP_0{activeArchStep + 1} // ACTIVE</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-[11px] text-zinc-400 bg-[#0B1020]/75 p-5 rounded-2xl border border-white/5">
                      <div>
                        <span className="text-[#3b82f6] block mb-1">NODE_NAME:</span>
                        <span className="text-white font-bold">{[
                          "CAMERA_INGEST_NODE", "QUALITY_AUDIT_NODE", "ADAPTIVE_FILTER_NODE", "CALIBRATION_GEOMETRY_NODE", 
                          "YOLO_OBJECT_NODE", "TEMPORAL_TRACK_NODE", "VIOLATION_CLASSIFICATION_NODE", "FUSION_FILTER_NODE", 
                          "ANPR_OCR_NODE", "EVIDENCE_COMPACTOR_NODE", "SEVERITY_SCORING_NODE", "HUMAN_AUDIT_NODE", "ANALYTICS_WRITE_NODE"
                        ][activeArchStep]}</span>
                      </div>
                      <div>
                        <span className="text-[#3b82f6] block mb-1">CPU_LATENCY:</span>
                        <span className="text-white font-bold">{[
                          "12ms", "8ms", "15ms", "6ms", "28ms", "14ms", "32ms", "5ms", "42ms", "18ms", "4ms", "Variable", "10ms"
                        ][activeArchStep]}</span>
                      </div>
                      <div>
                        <span className="text-[#3b82f6] block mb-1">PACKET_STATUS:</span>
                        <span className="text-[#22C55E] uppercase font-bold">Inbound Success</span>
                      </div>
                      <div>
                        <span className="text-[#3b82f6] block mb-1">FUNCTION:</span>
                        <span className="text-zinc-300 block">{[
                          "4K raw CCTV live capture.",
                          "Auto-analyzes contrast/blur.",
                          "Applies night-vision scaling.",
                          "Calibrates perspective matrix.",
                          "Segments road users via YOLOv11.",
                          "Establishes ByteTrack IDs.",
                          "Runs specialized audits.",
                          "Filters transient frame noise.",
                          "OCR-scans license plates.",
                          "Packs telemetry citation.",
                          "Calculates risk hazard index.",
                          "Pushes to verification queue.",
                          "Populates analytics panel."
                        ][activeArchStep]}</span>
                      </div>
                      <div className="md:col-span-2 lg:col-span-4 border-t border-white/5 pt-3 mt-1">
                        <span className="text-zinc-500 block mb-1">// SYSTEM HEURISTICS STATUS</span>
                        <span className="text-zinc-300">
                          {[
                            "Captured frames buffered at 4K @ 60fps.",
                            "Blur score: 0.14 (Compliant). Exposure: 0.78 (Optimal).",
                            "Night-vision gain: 0.0dB. Contrast ratio normalized.",
                            "Junction homography matrix established: [[1.2,0.4], [0.1,1.5]].",
                            "Detections buffered: 8 vehicles, 2 riders.",
                            "ByteTrack Kalman filters initialized. Maintaining 8 active paths.",
                            "Multi-agent trigger: Red-light breach coordinates scanned.",
                            "Aggregated anomaly index: 0.94 probability of violation.",
                            "PaddleOCR character confidence: 98.4%. TrOCR model validation complete.",
                            "Generated visual citation package under ID: TR-2026-904.",
                            "Calculated severity score: 95/100 (Critical classification).",
                            "Queue payload pushed. Officer notification dispatched.",
                            "JSON payload formatted. Dispatched PostgreSQL writing buffers."
                          ][activeArchStep]}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#111827]/70 border border-white/5 rounded-2xl p-4 flex items-center gap-3.5 mt-6 z-10">
                  <Cpu className="w-5 h-5 text-[#00D4FF] shrink-0" />
                  <div>
                    <span className="text-[10px] text-zinc-300 font-mono font-bold uppercase block">Logical Flow state</span>
                    <span className="text-[10px] text-zinc-500 font-light block leading-relaxed mt-0.5">
                      Data flows horizontally, triggering sequential neural evaluations. Output acts as input for the sibling node.
                    </span>
                  </div>
                </div>

              </div>
            )}

            {/* 2. LPR Subsystem Flowchart */}
            {activeArchTab === "lpr" && (
              <div className="space-y-6">
                <h3 className="text-xl md:text-2xl font-outfit font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00D4FF] text-center tracking-wide mb-8">
                  License Plate Recognition Subsystem
                </h3>
                <div className="space-y-8">
                  {/* Horizontal flow blocks */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                    {[
                      { step: "Vehicle Detection", model: "YOLOv11 Chassis localization", icon: Video },
                      { step: "Plate Detection", model: "Spatial region segmentation", icon: Eye },
                      { step: "OCR Engine", model: "PaddleOCR / TrOCR parsing", icon: Cpu },
                      { step: "Validation", model: "MVA state registry match", icon: FileText }
                    ].map((block, idx) => {
                      const Icon = block.icon;
                      return (
                        <div 
                          key={idx} 
                          className="glass-panel rounded-2xl p-6 flex flex-col items-center text-center gap-4 border border-white/5 hover:border-[#00D4FF]/20 transition-all relative"
                        >
                          {/* Glowing Index Badge */}
                          <span className="absolute -top-3.5 bg-gradient-to-tr from-[#3B82F6] to-[#00D4FF] text-[#0B1020] text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                            Stage 0{idx + 1}
                          </span>

                          <div className="p-3.5 rounded-xl bg-[#00D4FF]/5 border border-[#00D4FF]/10 text-[#00D4FF] mt-2">
                            <Icon className="w-5 h-5 stroke-[2]" />
                          </div>
                          
                          <div className="space-y-1">
                            <h4 className="font-outfit font-bold text-white text-sm">{block.step}</h4>
                            <p className="text-zinc-500 text-[11px] font-mono">{block.model}</p>
                          </div>

                          {/* Right connection arrow for desktop */}
                          {idx < 3 && (
                            <div className="hidden md:block absolute top-[50%] -translate-y-1/2 -right-3 text-[#00D4FF]/30 text-base font-mono z-20">
                              &rarr;
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* OCR Models details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div className="glass-panel rounded-2xl p-5 border border-white/5 flex gap-4 items-start">
                      <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/10 shrink-0 font-mono text-xs font-bold">
                        OCR_1
                      </div>
                      <div className="space-y-1">
                        <h5 className="font-bold text-white text-sm">PaddleOCR Model Integration</h5>
                        <p className="text-zinc-400 text-xs font-light leading-relaxed">
                          High-speed text detector optimized for mobile and edge deployment, ensuring sub-10ms latency for real-time video stream plates tracking.
                        </p>
                      </div>
                    </div>

                    <div className="glass-panel rounded-2xl p-5 border border-white/5 flex gap-4 items-start">
                      <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/10 shrink-0 font-mono text-xs font-bold">
                        OCR_2
                      </div>
                      <div className="space-y-1">
                        <h5 className="font-bold text-white text-sm">TrOCR (Transformer OCR) Engine</h5>
                        <p className="text-zinc-400 text-xs font-light leading-relaxed">
                          Attention-based transformer architecture that yields superior accuracy in tough frames (skewed angles, heavy rain, or low-light night conditions).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Human-in-the-Loop Workflow Branching */}
            {activeArchTab === "hitl" && (
              <div className="space-y-6">
                <h3 className="text-xl md:text-2xl font-outfit font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00D4FF] text-center tracking-wide mb-8">
                  Human-in-the-Loop Verification Workflow
                </h3>
                <div className="space-y-8">
                  
                  {/* Decision Branching Flow diagram */}
                  <div className="glass-panel rounded-3xl p-6 flex flex-col gap-6 relative overflow-hidden">
                    
                    {/* Central Node */}
                    <div className="flex flex-col items-center text-center max-w-xs mx-auto p-4 bg-zinc-900/80 border border-white/10 rounded-2xl relative z-10 shadow-lg">
                      <span className="text-[10px] font-mono text-[#3B82F6] uppercase tracking-wider font-bold">Inference Ingestion</span>
                      <h4 className="font-bold text-white text-sm mt-1">AI Violation Evaluator</h4>
                      <p className="text-[10px] text-zinc-500 font-light mt-0.5">Confidence Assessment Threshold checks</p>
                    </div>

                    {/* Connecting lines for branching */}
                    <div className="relative h-12 w-full max-w-xl mx-auto hidden md:block">
                      <svg className="w-full h-full" viewBox="0 0 200 40">
                        <path d="M 100 0 L 100 20 L 20 20 L 20 40 M 100 20 L 100 40 M 100 20 L 180 20 L 180 40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                      </svg>
                    </div>

                    {/* Branches Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                      
                      {/* Branch 1: High */}
                      <div className="bg-[#22C55E]/5 border border-[#22C55E]/20 hover:border-[#22C55E]/40 rounded-2xl p-5 flex flex-col items-center text-center gap-3 transition-all relative">
                        <span className="text-[9px] font-mono font-bold bg-[#22C55E]/10 text-[#22C55E] px-2 py-0.5 rounded border border-[#22C55E]/20 uppercase">
                          High Confidence (&ge;90%)
                        </span>
                        <h5 className="font-bold text-white text-sm">Automatic Citation Dispatch</h5>
                        <p className="text-zinc-400 text-xs font-light leading-relaxed">
                          Ticket is automatically processed, digitally signed, and dispatched to vehicle registry data. Zero manual audit required.
                        </p>
                      </div>

                      {/* Branch 2: Medium */}
                      <div className="bg-[#F59E0B]/5 border border-[#F59E0B]/20 hover:border-[#F59E0B]/40 rounded-2xl p-5 flex flex-col items-center text-center gap-3 transition-all relative">
                        <span className="text-[9px] font-mono font-bold bg-[#F59E0B]/10 text-[#F59E0B] px-2 py-0.5 rounded border border-[#F59E0B]/20 uppercase">
                          Medium Confidence (40% - 90%)
                        </span>
                        <h5 className="font-bold text-white text-sm">Human Verification Queue</h5>
                        <p className="text-zinc-400 text-xs font-light leading-relaxed">
                          Pushed to the Officer Review Portal for manual validation. AI visual overlays assist the officer in single-click decisions.
                        </p>
                      </div>

                      {/* Branch 3: Low */}
                      <div className="bg-[#EF4444]/5 border border-[#EF4444]/20 hover:border-[#EF4444]/40 rounded-2xl p-5 flex flex-col items-center text-center gap-3 transition-all relative">
                        <span className="text-[9px] font-mono font-bold bg-[#EF4444]/10 text-[#EF4444] px-2 py-0.5 rounded border border-[#EF4444]/20 uppercase">
                          Low Confidence (&lt;40%)
                        </span>
                        <h5 className="font-bold text-white text-sm">Auto-Reject Pipeline</h5>
                        <p className="text-zinc-400 text-xs font-light leading-relaxed">
                          Filtered out automatically as transient sensor noise or a false positive. Citation discarded from system logs.
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* HITL Benefits grid layout */}
                  <div className="space-y-4">
                    <h5 className="text-xs font-bold text-zinc-400 uppercase font-mono tracking-wider text-center">Platform Security Benefits</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="glass-panel rounded-xl p-5 border border-white/5 flex flex-col gap-1.5 items-center text-center">
                        <span className="font-bold text-white text-sm font-outfit">Fewer False Challans</span>
                        <p className="text-zinc-400 text-xs font-light">Double-layered operator check filters ambiguities, reducing public disputes.</p>
                      </div>
                      <div className="glass-panel rounded-xl p-5 border border-white/5 flex flex-col gap-1.5 items-center text-center">
                        <span className="font-bold text-white text-sm font-outfit">Higher System Trust</span>
                        <p className="text-zinc-400 text-xs font-light">Human-in-the-loop ensures legal backing, increasing citizen compliance trust.</p>
                      </div>
                      <div className="glass-panel rounded-xl p-5 border border-white/5 flex flex-col gap-1.5 items-center text-center">
                        <span className="font-bold text-white text-sm font-outfit">Regulatory Compliance</span>
                        <p className="text-zinc-400 text-xs font-light">Aligns with global CJIS and security mandates for smart city operations.</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* TECHNOLOGY STACK */}
      <section id="tech" className="py-24 px-6 md:px-12 border-t border-white/5 bg-zinc-950/40 relative">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="font-outfit font-extrabold text-4xl md:text-5xl">
              Enterprise <span className="text-purple-400">Technology Stack</span>
            </h2>
            <p className="text-zinc-400 text-lg">
              Leveraging state-of-the-art computer vision models, scalable database structures, and high-performance frontend frameworks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {technologies.map((tech, idx) => {
              const Icon = tech.icon;
              return (
                <div 
                  key={idx}
                  className="glass-panel rounded-2xl p-6 flex flex-col gap-4 border border-white/5 hover:border-purple-500/20 transition-all hover:bg-zinc-900/60"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/10">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-outfit font-bold text-zinc-200">{tech.category}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tech.items.map((item, id) => (
                      <span 
                        key={id}
                        className="font-mono text-xs text-[#00D4FF] bg-[#00D4FF]/5 px-3 py-1.5 rounded-md border border-[#00D4FF]/10 hover:border-[#00D4FF]/30 hover:bg-[#00D4FF]/10 transition-all cursor-default"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* IMPACT / STATS COUNTER */}
      <section id="impact" className="py-24 px-6 md:px-12 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="font-outfit font-extrabold text-4xl md:text-5xl leading-tight">
              Quantifiable Impact on <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-[#00D4FF]">
                Smart City Safety
              </span>
            </h2>
            <p className="text-zinc-400 text-lg font-light leading-relaxed">
              Deploying Traffic-Eye AI dramatically increases citation rates, cuts processing time, and fosters safer driving environments, yielding visible statistics within months.
            </p>
          </div>
          
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="glass-panel rounded-2xl p-6 border-l-4 border-l-[#22C55E] flex flex-col gap-2">
              <span className="text-[#22C55E] font-outfit font-black text-5xl">90%</span>
              <h4 className="font-bold text-white text-lg">Faster Enforcement</h4>
              <p className="text-zinc-400 text-sm">Violation processing goes from days to minutes through automated ticket routing.</p>
            </div>
            
            <div className="glass-panel rounded-2xl p-6 border-l-4 border-l-[#3B82F6] flex flex-col gap-2">
              <span className="text-[#3B82F6] font-outfit font-black text-5xl">70%</span>
              <h4 className="font-bold text-white text-lg">Manual Review Cut</h4>
              <p className="text-zinc-400 text-sm">Explainable AI justifications auto-filter noise, showing officers only highly confident cases.</p>
            </div>

            <div className="glass-panel rounded-2xl p-6 border-l-4 border-l-[#00D4FF] flex flex-col gap-2">
              <span className="text-[#00D4FF] font-outfit font-black text-5xl">50%</span>
              <h4 className="font-bold text-white text-lg">Enforcement Boost</h4>
              <p className="text-zinc-400 text-sm">Continuous monitoring tracks every lane of every junction, eliminating patrol gaps.</p>
            </div>

            <div className="glass-panel rounded-2xl p-6 border-l-4 border-l-[#EF4444] flex flex-col gap-2">
              <span className="text-[#EF4444] font-outfit font-black text-5xl">40%</span>
              <h4 className="font-bold text-white text-lg">Accident Reduction</h4>
              <p className="text-zinc-400 text-sm">Predictive risk analysis adjusts speed zones dynamically, preventing incident spikes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-zinc-950/80 backdrop-blur-md border-t border-white/5 py-12 px-6 md:px-12 text-zinc-400 text-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#3B82F6] to-[#00D4FF] flex items-center justify-center">
                <Eye className="w-5 h-5 text-[#0B1020] stroke-[2.5]" />
              </div>
              <span className="font-outfit font-extrabold text-lg text-white tracking-wider">TRAFFIC-EYE</span>
            </div>
            <p className="text-zinc-400 font-light text-xs pr-4 leading-relaxed">
              Automated AI policing and flow analytics solutions optimized for modern municipalities, police agencies, and highway developers.
            </p>
          </div>

          <div>
            <h5 className="font-outfit font-bold text-white text-xs uppercase tracking-wider mb-4">Smart City Stack</h5>
            <ul className="space-y-2 text-xs font-light">
              <li className="hover:text-[#00D4FF] transition-colors cursor-pointer">Automatic License Plate Recognition</li>
              <li className="hover:text-[#00D4FF] transition-colors cursor-pointer">Explainable Anomaly Classification</li>
              <li className="hover:text-[#00D4FF] transition-colors cursor-pointer">Urban Density Flow Predictions</li>
              <li className="hover:text-[#00D4FF] transition-colors cursor-pointer">Municipal Fine Integration APIs</li>
            </ul>
          </div>

          <div>
            <h5 className="font-outfit font-bold text-white text-xs uppercase tracking-wider mb-4">Security & Verification</h5>
            <ul className="space-y-2 text-xs font-light">
              <li className="hover:text-[#00D4FF] transition-colors cursor-pointer">Officer Human-in-the-Loop Portal</li>
              <li className="hover:text-[#00D4FF] transition-colors cursor-pointer">Cryptographic Evidence Records</li>
              <li className="hover:text-[#00D4FF] transition-colors cursor-pointer">Data Minimization Frameworks</li>
              <li className="hover:text-[#00D4FF] transition-colors cursor-pointer">GDPR & CJIS Regulatory Audits</li>
            </ul>
          </div>

          <div>
            <h5 className="font-outfit font-bold text-white text-xs uppercase tracking-wider mb-4">Global Operations</h5>
            <p className="text-xs text-zinc-400 font-light leading-relaxed mb-2">
              For administrative inquiries, system licensing, or city demonstration requests:
            </p>
            <span className="text-[#00D4FF] font-mono text-xs block hover:underline cursor-pointer">
              gov-licensing@trafficeye.ai
            </span>
            <span className="text-zinc-300 font-mono text-xs block mt-1">
              +1 (800) 555-EYE-AI
            </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-light">
          <span>&copy; 2026 TRAFFIC-EYE AI Technologies Inc. All rights reserved.</span>
          <div className="flex gap-6">
            <span className="hover:text-[#00D4FF] transition-colors cursor-pointer">Privacy Protocol</span>
            <span className="hover:text-[#00D4FF] transition-colors cursor-pointer">Regulatory Certifications</span>
            <span className="hover:text-[#00D4FF] transition-colors cursor-pointer">Terms of Operation</span>
          </div>
        </div>
      </footer>
      </div> {/* Closing main content wrapper */}

      {/* WATCH DEMO MODAL */}
      {showDemoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="relative max-w-4xl w-full glass-panel border border-[#00D4FF]/30 rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-white/5 bg-[#111827]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00D4FF] animate-pulse" />
                <h4 className="font-outfit font-bold text-lg text-white">System Demo Video</h4>
              </div>
              <button 
                onClick={() => setShowDemoModal(false)}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 transition-all text-lg font-bold"
              >
                &times;
              </button>
            </div>
            
            {/* Inner Video Placeholder with scanning animations */}
            <div className="aspect-video bg-zinc-950 flex flex-col items-center justify-center p-8 relative">
              <div className="laser-scanner" />
              <div className="text-center space-y-4 max-w-md z-10">
                <div className="w-16 h-16 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 flex items-center justify-center mx-auto text-[#00D4FF] pulse-glow-cyan">
                  <Play className="w-6 h-6 fill-current translate-x-0.5" />
                </div>
                <h3 className="font-outfit font-extrabold text-xl text-white">TRAFFIC-EYE Operational Reel</h3>
                <p className="text-zinc-500 text-sm">
                  This simulated reel showcases detection accuracy in poor weather conditions, vehicle plate OCR matching, and automated violation indexing.
                </p>
                <button
                  onClick={() => {
                    setShowDemoModal(false);
                    onEnterDashboard();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#3B82F6] text-[#0B1020] font-bold text-xs shadow-md hover:scale-105 transition-all cursor-pointer"
                >
                  Skip Demo & Enter Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
