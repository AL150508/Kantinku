"use client";

import { rupiah } from "@/Data/Menu";
import Link from "next/link";
import { useState, useEffect } from "react";

type RiwayatItem = {
  tanggal: string;
  nama: string;
  kelas?: string;
  caraAmbil: string;
  rincian: string[];
  subtotal: number;
  diskon: number;
  ongkir: number;
  total: number;
};

export default function RiwayatPage() {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [riwayatList, setRiwayatList] = useState<RiwayatItem[]>([]);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const dataStr = localStorage.getItem("riwayat");
      if (dataStr) {
        try {
          setRiwayatList(JSON.parse(dataStr));
        } catch {
          setRiwayatList([]);
        }
      }
    }
  }, []);

  if (!isMounted) {
    return (
      <div className="py-16 text-center text-slate-400">Memuat riwayat...</div>
    );
  }

  const totalBelanjaSemua = riwayatList.reduce(
    (acc, item) => acc + item.total,
    0,
  );

  return (
    <div className="mx-auto max-w-3xl py-8 text-white px-4 sm:px-0">
      <h1 className="text-3xl font-bold">Riwayat Pesanan</h1>

      {riwayatList.length === 0 ? (
        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
          <p className="text-slate-400">Belum ada pesanan.</p>
          <Link
            href="/Menu"
            className="mt-4 inline-block rounded-lg bg-orange-600 px-6 py-2.5 text-sm font-medium text-white shadow transition hover:bg-orange-700"
          >
            Pesan Menu Sekarang
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 p-4 text-sm font-medium text-orange-400">
            {riwayatList.length} pesanan, total belanja{" "}
            {rupiah(totalBelanjaSemua)}
          </div>

          <div className="space-y-4">
            {riwayatList.map((item, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-md space-y-3 overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between border-b border-slate-800 pb-3 gap-2">
                  <div className="min-w-0 flex-1 pr-4">
                    <h2 className="font-bold text-lg text-slate-100 break-words">
                      {item.nama}
                    </h2>
                    {item.kelas && (
                      <p className="text-xs text-slate-400 mt-0.5">
                        Kelas: {item.kelas}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap">
                    {item.tanggal}
                  </span>
                </div>

                <div className="text-sm space-y-1 text-slate-300">
                  <p className="text-xs text-orange-400 font-medium">
                    {item.caraAmbil}
                  </p>
                  <ul className="list-disc list-inside text-slate-400 pt-1 space-y-0.5">
                    {item.rincian.map((r, i) => (
                      <li key={i} className="break-words">
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-between items-center border-t border-slate-800 pt-3 text-sm font-semibold">
                  <span className="text-slate-400">Total Bayar:</span>
                  <span className="text-orange-500 text-base">
                    {rupiah(item.total)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
