import { menu } from "@/Data/Menu";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const resolvedParams = await params;
  const item = menu.find((m) => String(m.id) === String(resolvedParams.id));

  if (!item) {
    return NextResponse.json(
      { pesan: "Menu tidak ditemukan" },
      { status: 404 },
    );
  }

  return NextResponse.json(item);
}
