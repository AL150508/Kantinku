import Link from "next/link";
import { MenuItem, rupiah } from "@/Data/Menu";

export default function KartuMenu({ menu }: { menu: MenuItem }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-md transition hover:border-orange-500/50">
      <span className="inline-block rounded bg-orange-500/20 px-2.5 py-1 text-xs font-medium text-orange-400">
        {menu.kategori}
      </span>

      <h2 className="mt-3 text-xl font-bold text-white">{menu.nama}</h2>

      <p className="mt-1 text-lg font-semibold text-orange-500">
        {rupiah(menu.harga)}
      </p>

      <p className="mt-2 text-sm text-slate-400">
        Stok:{" "}
        {menu.stok > 0 ? (
          <span className="font-semibold text-slate-100">{menu.stok}</span>
        ) : (
          <span className="font-semibold text-red-500">Habis</span>
        )}
      </p>

      <div className="mt-4">
        <Link
          href={`/Menu/${menu.id}`}
          className="block w-full rounded-lg bg-orange-600 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-orange-700"
        >
          Lihat Detail
        </Link>
      </div>
    </div>
  );
}
