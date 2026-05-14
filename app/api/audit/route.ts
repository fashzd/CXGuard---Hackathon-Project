import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Audit events are stored in browser localStorage for this MVP."
  });
}
