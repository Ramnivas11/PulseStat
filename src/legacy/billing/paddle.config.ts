export const paddleConfig = {
  apiKey: process.env.PADDLE_API_KEY!,
  clientToken: process.env.PADDLE_CLIENT_TOKEN!,
  webhookSecret: process.env.PADDLE_WEBHOOK_SECRET!,
  environment: (process.env.PADDLE_ENV as "sandbox" | "production") || "sandbox",
  baseUrl: process.env.PADDLE_ENV === "sandbox"
    ? "https://sandbox-api.paddle.com"
    : "https://api.paddle.com",
};

export const getPaddleApiUrl = (endpoint: string) => {
  return `${paddleConfig.baseUrl}${endpoint}`;
};

export const isSandbox = () => paddleConfig.environment === "sandbox";
