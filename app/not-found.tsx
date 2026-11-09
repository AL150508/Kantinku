import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center text-center px-4 text-white">
      <span className="rounded-full bg-orange-500/20 px-4 py-1.5 text-sm font-semibold text-orange-400">
        404 - Tidak Ditemukan
      </span>

      <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
        Halaman Tidak Ditemukan
      </h1>

      <p className="mt-3 max-w-md text-sm text-slate-400 sm:text-base">
        Sepertinya menu atau halaman yang Anda cari tidak tersedia, sudah
        dihapus, atau alamat URL-nya keliru.
      </p>

      <div className="mt-8 flex gap-4">
        <Link
          href="/"
          className="rounded-lg bg-orange-600 px-6 py-2.5 text-sm font-medium text-white shadow transition hover:bg-orange-700"
        >
          Kembali ke Beranda
        </Link>

        <Link
          href="/Menu"
          className="rounded-lg border border-slate-700 bg-slate-900 px-6 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-800 hover:border-slate-600"
        >
          Lihat Daftar Menu
        </Link>
      </div>
    </div>
  );
}
