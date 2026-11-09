import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KantinKu",
  description: "Pesan makanan dan minuman kantin sekolah",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="bg-slate-950 text-slate-100">
      <body className={`${inter.className} min-h-screen bg-slate-950`}>
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
        <main className="mx-auto max-w-6xl px-4">{children}</main>
      </body>
    </html>
  );
}
