import type { Metadata } from "next";
import "./globals.css";

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

export const metadata: Metadata = {
  title: "Coordinaciones WN",
  description: "Plataforma de coordinación técnica ISP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <main className="flex min-h-screen bg-[#0b1120]">
          <Sidebar />

          <div className="flex-1">
            <Header />

            <section className="p-6">
              {children}
            </section>
          </div>
        </main>
      </body>
    </html>
  );
}