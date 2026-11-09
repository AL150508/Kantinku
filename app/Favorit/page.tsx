"use client";

import { rupiah } from "@/Data/Menu";
import Link from "next/link";
import { useState, useEffect } from "react";

type MenuItem = {
  id: number;
  nama: string;
  harga: number;
  kategori: string;
  stok: number;
};

export default function FavoritPage() {
  const [menuList, setMenuList] = useState<MenuItem[]>([]);
  const [favoritIds, setFavoritIds] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Ambil data favorit dari localStorage
    if (typeof window !== "undefined") {
      const favStr = localStorage.getItem("favorit");
      if (favStr) {
        try {
          setFavoritIds(JSON.parse(favStr));
        } catch {
          setFavoritIds([]);
        }
      }
    }

    // Fetch data menu dari Route Handler /api/menu sesuai ketentuan poin 18
    fetch("/api/menu")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat data menu.");
        return res.json();
      })
      .then((data) => {
        setMenuList(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Terjadi kesalahan.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="py-16 text-center text-slate-400">Memuat...</div>;
  }

  if (error) {
    return <div className="py-16 text-center text-red-500">{error}</div>;
  }

  const menuFavorit = menuList.filter((m) => favoritIds.includes(m.id));

  return (
    <div className="mx-auto max-w-4xl py-8 text-white">
      <h1 className="text-3xl font-bold">Menu Favorit</h1>

      {menuFavorit.length === 0 ? (
        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
          <p className="text-slate-400">Belum ada menu favorit.</p>
          <Link
            href="/Menu"
            className="mt-4 inline-block rounded-lg bg-orange-600 px-6 py-2.5 text-sm font-medium text-white shadow transition hover:bg-orange-700"
          >
            Jelajahi Menu
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {menuFavorit.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-md flex justify-between items-center"
            >
              <div>
                <span className="text-xs font-medium text-orange-400 bg-orange-500/20 px-2.5 py-0.5 rounded">
                  {item.kategori}
                </span>
                <h3 className="mt-2 text-lg font-bold">{item.nama}</h3>
                <p className="text-sm font-semibold text-orange-500 mt-1">
                  {rupiah(item.harga)}
                </p>
              </div>

              <Link
                href={`/Menu/${item.id}`}
                className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
              >
                Lihat Detail
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
