# 👁️ Traffic-Eye AI: Smart Traffic Intelligence & Governance

Traffic-Eye AI is a next-generation municipal smart city traffic governance platform. Powered by state-of-the-art computer vision models, explainable AI (XAI), and real-time simulations, Traffic-Eye automates vehicle detection, tracking, license plate recognition, violation classification, and predictive flow analysis.

[Live Demo](https://nainsirp.github.io/TrafficEye/)

---

## 🚀 Key Features

*   **⚡ Multi-Object Vehicle Tracking (MOT):** Deep learning tracking across dense junctions, maintaining unique tracking IDs using robust spatial matching frameworks.
*   **🚨 Automatic Violation Detection:** Instantly flags traffic anomalies such as red-light jumping, speeding, illegal parking, helmet violations, and wrong-side driving.
*   **🔍 License Plate Recognition (ANPR/LPR):** Skew-resistant OCR localization capturing characters in low-light, extreme angles, or bad weather conditions using Paddled OCR and Transformer OCR engines.
*   **🧠 Explainable AI (XAI):** Generates structural justifications and visual attention heatmaps explaining precisely why a violation was flagged.
*   **📊 Severity Scoring Engine:** Dynamically rates violation severity on a 1-100 index based on vehicular density, speeds, and immediate safety hazards.
*   **🌐 Digital Twin Simulation:** Real-time city-scale traffic simulation showing simulated vehicle flows, lane changes, speed controls, and junction stress levels.
*   **🔮 Predictive Congestion Analytics:** Machine learning congestion forecasting, peak stress hour projections, and weekly analytics logs.
*   **👮 Human-in-the-Loop Audit Queue:** Officer portal for manual validation of medium-confidence events with single-click citation dispatch.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 19, Next.js 16.2 (App Router), TypeScript |
| **Styling & Motion** | TailwindCSS v4, Framer Motion, Vanilla CSS |
| **Charts & Analytics** | Recharts (Responsive Line, Bar, Area, and Pie charts) |
| **Icons & Visuals** | Lucide React, Custom glowing SVG paths |
| **Core Models (Simulation)**| YOLOv11 (segmentation), PaddleOCR & TrOCR, ByteTrack (logic mocks) |

---

## 📂 Project Structure

```bash
TrafficEye/
├── .github/workflows/       # GitHub Pages automated deployment pipeline
├── public/                  # Static assets and images
└── src/
    ├── app/
    │   ├── layout.tsx       # Root layout configuration
    │   ├── page.tsx         # Main entry point (Landing Page vs. Dashboard state switcher)
    │   └── globals.css      # Core Tailwind CSS tokens and custom cyber-grid utilities
    └── components/
        ├── LandingPage.tsx  # Product showcase, features, tech stack & System Architecture Flowcharts
        ├── Dashboard.tsx    # Responsive side navigation grid and Control Center state management
        ├── LiveMonitor.tsx  # Real-time multi-junction CCTV streams, active alert feeds, and telemetry
        ├── DetectionCenter.tsx # Multi-junction details, camera controls, bounding boxes logs
        ├── LprModule.tsx    # License plate database, search index, OCR validation, registry matches
        ├── SeverityScoring.tsx # Violation risk index analyzer (speeds, location weights, metrics)
        ├── XaiView.tsx      # Explainable AI coordinate boxes, visual heatmaps, and JSON rule audits
        ├── DigitalTwin.tsx  # Canvas-based city-wide traffic simulation, lane congestion controls
        ├── PredictiveAnalytics.tsx # Congestion hazard forecasts, weekly peak statistics
        └── AnalyticsView.tsx # General municipal telemetry, citation rates, CPU latencies database
```

---

## ⚙️ System Architecture: Core Ingestion Pipeline

Data flows through 13 sequential neural evaluation stages to guarantee real-time autonomous governance:

1. **Traffic Camera Image** $\rightarrow$ Raw 4K RTSP CCTV frame capture.
2. **Image Quality Assessment** $\rightarrow$ Auto-analyzes contrast, blur, and exposure.
3. **Adaptive Enhancement Engine** $\rightarrow$ Night-vision filters, fog reduction, contrast adjustments.
4. **Scene Understanding Module** $\rightarrow$ Homography matrix calibration, region-of-interest (ROI).
5. **Vehicle & Road User Detection** $\rightarrow$ YOLOv11 object segmentation (cars, riders, pedestrians).
6. **Object Tracking Engine** $\rightarrow$ ByteTrack unique IDs mapping.
7. **Multi-Agent Violation Detection** $\rightarrow$ Checks red lights, lane bounds, speed triggers.
8. **Confidence Fusion Engine** $\rightarrow$ Filters transient noise across temporal frames.
9. **License Plate Recognition** $\rightarrow$ PaddleOCR character localization and TrOCR attention validation.
10. **Evidence Generation Engine** $\rightarrow$ Overlays telemetry stamps, cryptographically signed image crops.
11. **Severity Scoring Engine** $\rightarrow$ Calculates risk level hazard index (1-100).
12. **Human Verification Layer** $\rightarrow$ Dispatches medium confidence citation queue.
13. **Traffic Intelligence Dashboard** $\rightarrow$ Updates municipal database entries and UI analytics panels.

---

## 💻 Getting Started

### Prerequisites

Make sure you have Node.js (version 20 or higher) and npm installed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nainsirp/TrafficEye.git
   cd TrafficEye
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to view the local application.

### Build and Compilation

To create an optimized production build:
```bash
npm run build
```
Static page outputs will compile into the `/out` directory.

---

## 🚢 Deployment

The project is configured with GitHub Actions. Any commit pushed to the `main` branch automatically triggers the `.github/workflows/deploy.yml` workflow, building the Next.js app and deploying static pages to GitHub Pages.

---

