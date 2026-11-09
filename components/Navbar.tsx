"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  return (
    <header className="border-b border-slate-800 bg-slate-950 py-4">
      <div className="flex w-full items-center justify-between px-6 md:px-10">
        <Link href="/" className="text-xl font-bold text-orange-500">
          KantinKu
        </Link>

        <NavLinks />

        <div className="w-[88px] hidden md:block"></div>
      </div>
    </header>
  );
}

function NavLinks() {
  const pathname = usePathname();
  const [totalItem, setTotalItem] = useState<number>(0);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);

    const hitungKeranjang = () => {
      if (typeof window === "undefined") return;
      const keranjangStr = localStorage.getItem("keranjang");
      if (!keranjangStr) {
        setTotalItem(0);
        return;
      }
      try {
        const keranjang: { id: number; jumlah: number }[] =
          JSON.parse(keranjangStr);
        const total = keranjang.reduce((acc, item) => acc + item.jumlah, 0);
        setTotalItem(total);
      } catch {
        setTotalItem(0);
      }
    };

    hitungKeranjang();

    window.addEventListener("keranjang-berubah", hitungKeranjang);
    return () => {
      window.removeEventListener("keranjang-berubah", hitungKeranjang);
    };
  }, []);

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Menu", href: "/Menu" },
    { name: "Favorit", href: "/Favorit" },
    {
      name:
        isMounted && totalItem > 0 ? `Keranjang (${totalItem})` : "Keranjang",
      href: "/Keranjang",
    },
    { name: "Riwayat", href: "/Riwayat" },
  ];

  return (
    <nav className="flex gap-6 text-sm font-medium">
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`transition hover:text-orange-400 ${
              isActive ? "text-orange-500 font-semibold" : "text-slate-300"
            }`}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}
