import { NextResponse } from "next/server";
import { trackerCode } from "@/tracker/generated";

export async function GET() {
  return new NextResponse(trackerCode, {
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
