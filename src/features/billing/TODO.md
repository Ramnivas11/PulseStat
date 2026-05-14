# Billing Reactivation Roadmap

## Goal
Restore a production-grade Paddle billing integration in a clean, maintainable way.

## Future integration plan

- Reintroduce Paddle checkout as a hosted flow for plan upgrades.
- Keep the free plan fully intact while Pro is gated behind launch readiness.
- Use backend subscription state as the source of truth.

## Required routes

- `POST /api/billing/checkout` — create a checkout session for Paddle.
- `POST /api/webhooks/paddle` — receive Paddle webhook events safely.
- Validate webhook signatures with `PADDLE_WEBHOOK_SECRET`.

## Subscription architecture

- Persist `Subscription` rows with:
  - `plan`
  - `status`
  - `paddleCustomerId`
  - `paddleSubscriptionId`
  - `paddlePriceId`
  - `currentPeriodEnd`
- Keep `billing.service.ts` as the enforcement layer for plan limits.
- Use `getUserPlan` to resolve the effective plan.

## Pricing structure

- Free plan: 1 website, 10,000 events / month.
- Pro plan: premium analytics, unlimited site growth, advanced export, team & AI features.

## Notes

- Keep upgrade UI polished and premium.
- Use `src/legacy/billing` for temporary disabled payment code.
- Preserve plans and billing page structure for future activation.
