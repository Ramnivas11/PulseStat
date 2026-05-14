// This route has been disabled for security reasons.
// Use /api/websites (authenticated) to list user websites.
export async function GET() {
  return Response.json({ error: "Not Found" }, { status: 404 });
}
