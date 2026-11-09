import { menu } from "@/Data/Menu";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(menu);
}
