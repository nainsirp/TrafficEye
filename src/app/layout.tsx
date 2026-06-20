import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TRAFFIC-EYE AI | Smart Traffic Intelligence & Automated Enforcement",
  description: "AI-powered smart city traffic monitoring, automated violation enforcement, license plate recognition, explainable AI, severity scoring, and digital twin visualization.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased dark"
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full flex flex-col bg-[#0B1020] text-zinc-100 selection:bg-[#00D4FF]/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
