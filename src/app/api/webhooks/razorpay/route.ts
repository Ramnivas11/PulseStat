import {
  handleRazorpayWebhook,
  verifyWebhookSignature,
} from "@/features/billing/services/billing.service";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const signature = req.headers.get(
    "x-razorpay-signature"
  );
  const body = await req.text();

  if (!signature) {
    return new Response(
      JSON.stringify({ error: "Missing webhook signature." }),
      { status: 400 }
    );
  }

  if (!verifyWebhookSignature(body, signature)) {
    return new Response(
      JSON.stringify({ error: "Invalid webhook signature." }),
      { status: 400 }
    );
  }

  const payload = JSON.parse(body);
  await handleRazorpayWebhook(payload);

  return Response.json({ success: true });
}