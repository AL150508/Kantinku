export type MenuItem = {
  id: number;
  nama: string;
  kategori: string;
  harga: number;
  stok: number;
};

export const menu: MenuItem[] = [
  {
    id: 1,
    nama: "Nasi Goreng Spesial",
    kategori: "Makanan",
    harga: 15000,
    stok: 10,
  },
  { id: 2, nama: "Mie Ayam Bakso", kategori: "Makanan", harga: 13000, stok: 5 },
  { id: 3, nama: "Es Teh Manis", kategori: "Minuman", harga: 4000, stok: 20 },
  { id: 4, nama: "Es Jeruk", kategori: "Minuman", harga: 5000, stok: 15 },
  {
    id: 5,
    nama: "Pisang Goreng Keju",
    kategori: "Camilan",
    harga: 8000,
    stok: 8,
  },
  {
    id: 6,
    nama: "Roti Bakar Coklat",
    kategori: "Camilan",
    harga: 10000,
    stok: 0,
  },
];

export function rupiah(angka: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
}
