// Legacy webhook route: disabled while billing is on hold.
// TODO: Restore Paddle webhook processing when subscriptions are reactivated.

import { handlePaddleWebhook, verifyPaddleWebhookSignature } from "./paddle.service";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const signature = req.headers.get("paddle-signature");
    const body = await req.text();

    if (!signature) {
      return new Response(
        JSON.stringify({ error: "Missing webhook signature." }),
        { status: 400 }
      );
    }

    if (!verifyPaddleWebhookSignature(body, signature)) {
      return new Response(
        JSON.stringify({ error: "Invalid webhook signature." }),
        { status: 400 }
      );
    }

    const payload = JSON.parse(body);
    await handlePaddleWebhook(payload);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Paddle webhook error:", error);
    return new Response(
      JSON.stringify({ error: "Webhook processing failed." }),
      { status: 500 }
    );
  }
}
