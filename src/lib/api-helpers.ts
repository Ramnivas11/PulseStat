import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { logError } from "./logger";

export function successResponse<T>(data: T, status = 200, headers?: HeadersInit) {
  return NextResponse.json({ success: true, data }, { status, headers });
}

export function errorResponse(message: string, status = 400, headers?: HeadersInit) {
  return NextResponse.json({ success: false, error: message }, { status, headers });
}

export async function readJsonBody(req: Request, maxBytes = 16_384): Promise<unknown> {
  const contentLength = req.headers.get("content-length");
  if (contentLength && Number.parseInt(contentLength, 10) > maxBytes) {
    throw new Response(JSON.stringify({ success: false, error: "Payload too large" }), {
      status: 413,
      headers: { "content-type": "application/json" },
    });
  }

  try {
    return await req.json();
  } catch {
    throw new Response(JSON.stringify({ success: false, error: "Invalid JSON body" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }
}

export function validationErrorResponse(error: ZodError, headers?: HeadersInit) {
  return NextResponse.json(
    {
      success: false,
      error: "Invalid payload",
      issues: error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })),
    },
    { status: 400, headers }
  );
}

export function apiErrorHandler(error: unknown, route: string) {
  if (error instanceof Response) return error;
  logError(error, { route });
  return errorResponse("Internal server error", 500);
}
