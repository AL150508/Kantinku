"use client";

import { menu, rupiah } from "@/Data/Menu";
import { notFound } from "next/navigation";
import Link from "next/link";
import { use, useState, Suspense } from "react";

type PageProps = {
  params: Promise<{ id: string }>;
};

type CartItem = {
  id: number;
  jumlah: number;
};

export default function DetailMenuPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="py-8 text-center text-white">Memuat detail menu...</div>
      }
    >
      <DetailContent params={params} />
    </Suspense>
  );
}

function DetailContent({ params }: PageProps) {
  const resolvedParams = use(params);
  const item = menu.find((m) => String(m.id) === String(resolvedParams.id));

  if (!item) {
    notFound();
  }

  const [jumlah, setJumlah] = useState<number>(1);
  const [pesan, setPesan] = useState<string>("");
  const [errorPesan, setErrorPesan] = useState<string>("");

  const getJumlahDiKeranjang = (idMenu: number): number => {
    if (typeof window === "undefined") return 0;
    const keranjangStr = localStorage.getItem("keranjang");
    if (!keranjangStr) return 0;
    try {
      const keranjang: CartItem[] = JSON.parse(keranjangStr);
      const found = keranjang.find((item) => item.id === idMenu);
      return found ? found.jumlah : 0;
    } catch {
      return 0;
    }
  };

  const sudahDiKeranjang = getJumlahDiKeranjang(item.id);
  const sisaStok = item.stok - sudahDiKeranjang;

  const handleKurang = () => {
    if (jumlah > 1) {
      setJumlah(jumlah - 1);
      setErrorPesan("");
    }
  };

  const handleTambahJumlah = () => {
    if (jumlah < sisaStok) {
      setJumlah(jumlah + 1);
      setErrorPesan("");
    } else {
      setErrorPesan(
        `Jumlah tidak boleh melebihi sisa stok (${sisaStok} porsi).`,
      );
    }
  };

  const handleTambahKeKeranjang = () => {
    if (jumlah < 1) {
      setErrorPesan("Jumlah minimal adalah 1.");
      return;
    }
    if (jumlah > sisaStok) {
      setErrorPesan(
        `Stok tidak mencukupi. Sisa stok yang bisa dipesan: ${sisaStok}.`,
      );
      return;
    }

    const keranjangStr = localStorage.getItem("keranjang");
    let keranjang: CartItem[] = [];
    if (keranjangStr) {
      try {
        keranjang = JSON.parse(keranjangStr);
      } catch {
        keranjang = [];
      }
    }

    const index = keranjang.findIndex((ci) => ci.id === item.id);
    if (index > -1) {
      keranjang[index].jumlah += jumlah;
    } else {
      keranjang.push({ id: item.id, jumlah });
    }

    localStorage.setItem("keranjang", JSON.stringify(keranjang));
    window.dispatchEvent(new Event("keranjang-berubah"));

    setPesan("Ditambahkan ke keranjang.");
    setErrorPesan("");
    setJumlah(1);
  };

  return (
    <div className="mx-auto max-w-2xl py-8 text-white">
      <Link
        href="/Menu"
        className="text-sm text-orange-500 hover:underline font-medium"
      >
        &larr; Kembali ke Daftar Menu
      </Link>

      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-md">
        <span className="inline-block rounded bg-orange-500/20 px-3 py-1 text-xs font-medium text-orange-400">
          {item.kategori}
        </span>

        <h1 className="mt-3 text-3xl font-bold">{item.nama}</h1>

        <p className="mt-2 text-2xl font-semibold text-orange-500">
          {rupiah(item.harga)}
        </p>

        <div className="mt-6 border-t border-slate-800 pt-4">
          <p className="text-sm text-slate-400">
            Stok Tersedia:{" "}
            {item.stok > 0 ? (
              <span className="font-bold text-slate-100">
                {item.stok} porsi
              </span>
            ) : (
              <span className="font-bold text-red-500">0.</span>
            )}
          </p>
          {sudahDiKeranjang > 0 && (
            <p className="mt-1 text-xs text-orange-400">
              (Sudah ada {sudahDiKeranjang} porsi di keranjang Anda)
            </p>
          )}
        </div>

        {item.stok > 0 ? (
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-300">Jumlah:</span>
              <div className="flex items-center rounded-lg border border-slate-700 bg-slate-950">
                <button
                  onClick={handleKurang}
                  className="px-3 py-1 text-slate-300 hover:bg-slate-800 transition rounded-l-lg"
                >
                  -
                </button>
                <span className="px-4 py-1 font-semibold text-white">
                  {jumlah}
                </span>
                <button
                  onClick={handleTambahJumlah}
                  className="px-3 py-1 text-slate-300 hover:bg-slate-800 transition rounded-r-lg"
                >
                  +
                </button>
              </div>
              <span className="text-sm font-medium text-slate-300">
                Subtotal:{" "}
                <span className="text-orange-500">
                  {rupiah(item.harga * jumlah)}
                </span>
              </span>
            </div>

            {pesan && (
              <p className="text-sm font-medium text-green-400">{pesan}</p>
            )}
            {errorPesan && (
              <p className="text-sm font-medium text-red-500">{errorPesan}</p>
            )}

            <button
              onClick={handleTambahKeKeranjang}
              disabled={sisaStok <= 0}
              className={`w-full rounded-lg px-6 py-2.5 font-medium text-white transition ${
                sisaStok > 0
                  ? "bg-orange-600 hover:bg-orange-700 shadow"
                  : "bg-slate-700 cursor-not-allowed text-slate-400"
              }`}
            >
              {sisaStok > 0
                ? "Tambah ke keranjang"
                : "Stok Habis / Batas Tercapai"}
            </button>
          </div>
        ) : (
          <div className="mt-6">
            <p className="text-sm font-medium text-red-500">Menu ini habis.</p>
          </div>
        )}
      </div>
    </div>
  );
}
