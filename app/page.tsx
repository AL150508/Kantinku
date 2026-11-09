import Link from "next/link";

export default function Home() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
        Selamat Datang di <span className="text-orange-500">KantinKu</span>
      </h1>
      <p className="mt-4 text-lg text-slate-400">
        Pesan makanan dan minuman kantin sekolah dengan cepat, praktis, dan
        tanpa antre.
      </p>
      <div className="mt-8">
        <Link
          href="/Menu"
          className="rounded-lg bg-orange-600 px-6 py-3 text-base font-medium text-white shadow hover:bg-orange-700 transition"
        >
          Lihat Menu Kantin
        </Link>
      </div>
    </div>
  );
}
