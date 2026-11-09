"use client";

import { menu, rupiah } from "@/Data/Menu";
import Link from "next/link";
import { useState, useEffect } from "react";

type CartItem = {
  id: number;
  jumlah: number;
};

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

export default function KeranjangPage() {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [keranjang, setKeranjang] = useState<CartItem[]>([]);
  const [kodePromoInput, setKodePromoInput] = useState<string>("");
  const [promoAktif, setPromoAktif] = useState<boolean>(false);
  const [pesanPromo, setPesanPromo] = useState<string>("");

  const [caraAmbil, setCaraAmbil] = useState<"sendiri" | "diantar">("sendiri");
  const [namaPemesan, setNamaPemesan] = useState<string>("");
  const [kelasPemesan, setKelasPemesan] = useState<string>("");

  const [pesanErrorForm, setPesanErrorForm] = useState<string>("");
  const [strukBerhasil, setStrukBerhasil] = useState<RiwayatItem | null>(null);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const dataStr = localStorage.getItem("keranjang");
      if (dataStr) {
        try {
          setKeranjang(JSON.parse(dataStr));
        } catch {
          setKeranjang([]);
        }
      }
    }
  }, []);

  const simpanDanBroadcast = (items: CartItem[]) => {
    setKeranjang(items);
    localStorage.setItem("keranjang", JSON.stringify(items));
    window.dispatchEvent(new Event("keranjang-berubah"));
  };

  const handleUbahJumlah = (id: number, delta: number) => {
    const itemMenu = menu.find((m) => m.id === id);
    if (!itemMenu) return;

    const updated = keranjang.map((ci) => {
      if (ci.id === id) {
        const jumlahBaru = ci.jumlah + delta;
        if (jumlahBaru < 1) return 1;
        if (jumlahBaru > itemMenu.stok) return itemMenu.stok;
        return jumlahBaru;
      }
      return ci.jumlah;
    });

    const newCart = keranjang.map((ci, idx) => ({
      ...ci,
      jumlah: updated[idx],
    }));

    simpanDanBroadcast(newCart);
  };

  const handleHapusItem = (id: number) => {
    const newCart = keranjang.filter((ci) => ci.id !== id);
    simpanDanBroadcast(newCart);
  };

  const subtotal = keranjang.reduce((acc, ci) => {
    const itemMenu = menu.find((m) => m.id === ci.id);
    return acc + (itemMenu ? itemMenu.harga * ci.jumlah : 0);
  }, 0);

  const handlePakaiPromo = () => {
    const kode = kodePromoInput.trim().toUpperCase();
    if (kode === "") {
      setPromoAktif(false);
      setPesanPromo("");
      return;
    }

    if (kode !== "HEMAT10") {
      setPromoAktif(false);
      setPesanPromo("Kode promo tidak dikenal.");
      return;
    }

    if (subtotal < 20000) {
      setPromoAktif(false);
      setPesanPromo("Promo HEMAT10 butuh belanja minimal Rp 20.000.");
      return;
    }

    setPromoAktif(true);
    setPesanPromo("Promo HEMAT10 dipakai: diskon 10%.");
  };

  const isPromoValid = promoAktif && subtotal >= 20000;
  const diskon = isPromoValid ? Math.round(subtotal * 0.1) : 0;
  const ongkir = caraAmbil === "diantar" ? 2000 : 0;
  const total = subtotal - diskon + ongkir;

  const handlePesanSekarang = (e: React.FormEvent) => {
    e.preventDefault();

    if (namaPemesan.trim().length < 3) {
      setPesanErrorForm("Nama pemesan minimal 3 huruf.");
      return;
    }

    if (caraAmbil === "diantar" && kelasPemesan.trim().length < 3) {
      setPesanErrorForm(
        "Kelas wajib diisi minimal 3 karakter jika pesanan diantar.",
      );
      return;
    }

    setPesanErrorForm("");

    const rincianArray = keranjang.map((ci) => {
      const m = menu.find((item) => item.id === ci.id);
      const nama = m ? m.nama : "Menu";
      const hargaSatuan = m ? m.harga : 0;
      return `${nama} x${ci.jumlah} = ${rupiah(hargaSatuan * ci.jumlah)}`;
    });

    const dataStruk: RiwayatItem = {
      tanggal: new Date().toLocaleString("id-ID"),
      nama: namaPemesan,
      kelas: caraAmbil === "diantar" ? kelasPemesan : undefined,
      caraAmbil:
        caraAmbil === "diantar"
          ? "Diantar ke kelas"
          : "Ambil sendiri di kantin",
      rincian: rincianArray,
      subtotal,
      diskon,
      ongkir,
      total,
    };

    const riwayatStr = localStorage.getItem("riwayat");
    let riwayatList: RiwayatItem[] = [];
    if (riwayatStr) {
      try {
        riwayatList = JSON.parse(riwayatStr);
      } catch {
        riwayatList = [];
      }
    }
    riwayatList.unshift(dataStruk);
    localStorage.setItem("riwayat", JSON.stringify(riwayatList));

    setStrukBerhasil(dataStruk);
    simpanDanBroadcast([]);
    setNamaPemesan("");
    setKelasPemesan("");
    setKodePromoInput("");
    setPromoAktif(false);
    setPesanPromo("");
  };

  // Jangan render isi keranjang sebelum komponen ter-mount di klien untuk mencegah hydration error
  if (!isMounted) {
    return (
      <div className="py-16 text-center text-slate-400">
        Memuat keranjang...
      </div>
    );
  }

  if (strukBerhasil) {
    return (
      <div className="mx-auto max-w-xl py-10 text-white px-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-md text-center">
          <span className="inline-block rounded-full bg-green-500/20 px-4 py-1 text-xs font-semibold text-green-400">
            Pesanan Berhasil!
          </span>
          <h2 className="mt-4 text-2xl font-bold">
            Terima kasih, {strukBerhasil.nama}!
          </h2>

          <div className="mt-6 text-left border-t border-slate-800 pt-4 space-y-2 text-sm">
            <p className="text-slate-400">
              Waktu:{" "}
              <span className="text-slate-200">{strukBerhasil.tanggal}</span>
            </p>
            <p className="text-slate-400">
              Metode:{" "}
              <span className="text-slate-200">{strukBerhasil.caraAmbil}</span>
            </p>
            {strukBerhasil.kelas && (
              <p className="text-slate-400">
                Kelas:{" "}
                <span className="text-slate-200">{strukBerhasil.kelas}</span>
              </p>
            )}

            <div className="pt-2">
              <p className="font-semibold text-slate-300">Rincian Pesanan:</p>
              <ul className="mt-1 list-disc list-inside text-slate-400 space-y-1">
                {strukBerhasil.rincian.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{rupiah(strukBerhasil.subtotal)}</span>
              </div>
              {strukBerhasil.diskon > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Diskon</span>
                  <span>- {rupiah(strukBerhasil.diskon)}</span>
                </div>
              )}
              {strukBerhasil.ongkir > 0 && (
                <div className="flex justify-between">
                  <span>Ongkir</span>
                  <span>{rupiah(strukBerhasil.ongkir)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-orange-500 text-base pt-2 border-t border-slate-800">
                <span>Total Bayar</span>
                <span>{rupiah(strukBerhasil.total)}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => setStrukBerhasil(null)}
              className="flex-1 rounded-lg bg-orange-600 px-4 py-2 font-medium text-white transition hover:bg-orange-700"
            >
              Belanja Lagi
            </button>
            <Link
              href="/Riwayat"
              className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 font-medium text-slate-200 transition hover:bg-slate-800 text-center"
            >
              Lihat Riwayat
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl py-8 text-white px-4">
      <h1 className="text-3xl font-bold">Keranjang Belanja</h1>

      {keranjang.length === 0 ? (
        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
          <p className="text-slate-400">Keranjang masih kosong.</p>
          <Link
            href="/Menu"
            className="mt-4 inline-block rounded-lg bg-orange-600 px-6 py-2.5 text-sm font-medium text-white shadow transition hover:bg-orange-700"
          >
            Pilih Menu Kantin
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-md divide-y divide-slate-800">
            {keranjang.map((ci) => {
              const itemMenu = menu.find((m) => m.id === ci.id);
              if (!itemMenu) return null;
              const subtotalBaris = itemMenu.harga * ci.jumlah;

              return (
                <div
                  key={ci.id}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div>
                    <h3 className="font-semibold text-lg">{itemMenu.nama}</h3>
                    <p className="text-sm text-orange-500">
                      {rupiah(itemMenu.harga)} / porsi
                    </p>
                  </div>

                  <div className="flex items-center gap-4 justify-between sm:justify-end">
                    <div className="flex items-center rounded-lg border border-slate-700 bg-slate-950">
                      <button
                        onClick={() => handleUbahJumlah(ci.id, -1)}
                        className="px-3 py-1 text-slate-300 hover:bg-slate-800 transition rounded-l-lg"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 font-semibold text-white">
                        {ci.jumlah}
                      </span>
                      <button
                        onClick={() => handleUbahJumlah(ci.id, 1)}
                        className="px-3 py-1 text-slate-300 hover:bg-slate-800 transition rounded-r-lg"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-semibold text-slate-200 min-w-[90px] text-right">
                      {rupiah(subtotalBaris)}
                    </span>

                    <button
                      onClick={() => handleHapusItem(ci.id)}
                      className="rounded bg-red-500/20 px-3 py-1 text-xs font-medium text-red-400 transition hover:bg-red-500/30"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-md space-y-3">
            <label className="block text-sm font-medium text-slate-300">
              Kode Promo
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Contoh: HEMAT10"
                value={kodePromoInput}
                onChange={(e) => setKodePromoInput(e.target.value)}
                className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handlePakaiPromo}
                className="rounded-lg bg-slate-800 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                Pakai
              </button>
            </div>
            {pesanPromo && (
              <p
                className={`text-sm font-medium ${isPromoValid ? "text-green-400" : "text-red-400"}`}
              >
                {pesanPromo}
              </p>
            )}
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-md space-y-4">
            <label className="block text-sm font-medium text-slate-300">
              Cara Ambil
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="caraAmbil"
                  checked={caraAmbil === "sendiri"}
                  onChange={() => setCaraAmbil("sendiri")}
                  className="accent-orange-500"
                />
                <span className="text-sm">Ambil sendiri</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="caraAmbil"
                  checked={caraAmbil === "diantar"}
                  onChange={() => setCaraAmbil("diantar")}
                  className="accent-orange-500"
                />
                <span className="text-sm">Diantar (+Rp 2.000)</span>
              </label>
            </div>
          </div>

          <form
            onSubmit={handlePesanSekarang}
            className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-md space-y-4"
          >
            <div className="space-y-2 border-b border-slate-800 pb-4 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="text-slate-200">{rupiah(subtotal)}</span>
              </div>
              {diskon > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Diskon (10%)</span>
                  <span>- {rupiah(diskon)}</span>
                </div>
              )}
              {caraAmbil === "diantar" && (
                <div className="flex justify-between text-slate-400">
                  <span>Ongkir</span>
                  <span className="text-slate-200">{rupiah(ongkir)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-orange-500 text-lg pt-2">
                <span>Total</span>
                <span>{rupiah(total)}</span>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Nama Pemesan
                </label>
                <input
                  type="text"
                  placeholder="Minimal 3 huruf"
                  value={namaPemesan}
                  onChange={(e) => setNamaPemesan(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none"
                />
              </div>

              {caraAmbil === "diantar" && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Kelas Tujuan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: XI RPL 1"
                    value={kelasPemesan}
                    onChange={(e) => setKelasPemesan(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none"
                  />
                </div>
              )}

              {pesanErrorForm && (
                <p className="text-sm font-medium text-red-500">
                  {pesanErrorForm}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-lg bg-orange-600 px-6 py-3 font-medium text-white shadow transition hover:bg-orange-700"
              >
                Pesan Sekarang
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
