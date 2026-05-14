import { NextResponse } from "next/server";
import { logError } from "./logger";

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function apiErrorHandler(error: unknown, route: string) {
  logError(error, { route });
  return errorResponse("Internal server error", 500);
}
