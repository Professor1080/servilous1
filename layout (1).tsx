import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Servilus — Workforce, managed better",
  description: "A modern workforce management and staffing platform.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}