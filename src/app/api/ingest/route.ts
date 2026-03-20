export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { ingestBiharPilot } from "@/lib/dataIngestion";

export async function GET() {
  try {
    const result = await ingestBiharPilot();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
