"use client";

import { useState } from "react";
import { menu } from "@/Data/Menu";
import KartuMenu from "@/components/KartuMenu";

export default function HalamanMenu() {
  const [cari, setCari] = useState("");
  const [kategori, setKategori] = useState("Semua");
  const [urutan, setUrutan] = useState("Urutan awal");

  const menuTersaring = menu.filter((item) => {
    const cocokKategori =
      kategori === "Semua" ||
      item.kategori.toLowerCase() === kategori.toLowerCase();
    const cocokCari = item.nama.toLowerCase().includes(cari.toLowerCase());
    return cocokKategori && cocokCari;
  });

  const menuTerurut = [...menuTersaring].sort((a, b) => {
    if (urutan === "Harga termurah") return a.harga - b.harga;
    if (urutan === "Harga termahal") return b.harga - a.harga;
    if (urutan === "Nama A–Z") return a.nama.localeCompare(b.nama);
    return 0;
  });

  return (
    <div className="py-8 text-white">
      <h1 className="mb-6 text-3xl font-bold">Daftar Menu Kantin</h1>

      <div className="mb-8 flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900 p-4 md:flex-row md:items-center md:justify-between shadow-md">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Cari makanan atau minuman..."
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-orange-500 focus:outline-none"
          >
            <option value="Semua">Semua Kategori</option>
            <option value="Makanan">Makanan</option>
            <option value="Minuman">Minuman</option>
            <option value="Camilan">Camilan</option>
          </select>

          <select
            value={urutan}
            onChange={(e) => setUrutan(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-orange-500 focus:outline-none"
          >
            <option value="Urutan awal">Urutan awal</option>
            <option value="Harga termurah">Harga termurah</option>
            <option value="Harga termahal">Harga termahal</option>
            <option value="Nama A–Z">Nama A–Z</option>
          </select>
        </div>
      </div>

      {menuTerurut.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {menuTerurut.map((m) => (
            <KartuMenu key={m.id} menu={m} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-xl font-semibold text-slate-400">
            Menu tidak ditemukan.
          </p>
        </div>
      )}
    </div>
  );
}
