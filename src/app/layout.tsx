import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GeoPulse Analytics | Earth System Trend Detective",
  description:
    "Zero-download NASA Earth System Trend Detective Workbench. Compares multi-decade climate trajectories, proves regional divergence, and performs OLS, Mann-Kendall, and Sen's slope testing in sub-seconds.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased flex flex-col">
        {children}
      </body>
    </html>
  );
}
