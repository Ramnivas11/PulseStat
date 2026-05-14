const prefix = "[PulseStat]";
const isProd = process.env.NODE_ENV === "production";

function formatMessage(
  level: "INFO" | "WARN" | "ERROR",
  message: string,
  context?: Record<string, unknown>
) {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(isProd ? {} : context),        // don't log context details in prod logs
    ...(isProd ? {} : {}),
  });
}

export function logInfo(message: string, context?: Record<string, unknown>) {
  if (!isProd) {
    console.log(`${prefix} ${formatMessage("INFO", message, context)}`);
  }
}

export function logWarn(message: string, context?: Record<string, unknown>) {
  // Warnings always logged but without sensitive details in production
  console.warn(
    `${prefix} ${formatMessage("WARN", message, isProd ? undefined : context)}`
  );
}

export function logError(error: unknown, context?: Record<string, unknown>) {
  const message = error instanceof Error ? error.message : String(error);
  // Never log stack traces in production — avoids leaking internals
  const stack = !isProd && error instanceof Error ? error.stack : undefined;

  console.error(
    `${prefix} ${JSON.stringify({
      timestamp: new Date().toISOString(),
      level: "ERROR",
      message,
      ...(isProd ? {} : { ...context, stack }),
    })}`
  );
}
