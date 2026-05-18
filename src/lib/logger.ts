const PREFIX = "[PulseStat]";
const IS_PROD = process.env.NODE_ENV === "production";

function fmt(level: "INFO" | "WARN" | "ERROR", message: string, context?: Record<string, unknown>) {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(IS_PROD ? {} : context),
  });
}

export function logInfo(message: string, context?: Record<string, unknown>) {
  if (!IS_PROD) console.log(`${PREFIX} ${fmt("INFO", message, context)}`);
}

export function logWarn(message: string, context?: Record<string, unknown>) {
  console.warn(`${PREFIX} ${fmt("WARN", message, IS_PROD ? undefined : context)}`);
}

export function logError(error: unknown, context?: Record<string, unknown>) {
  const message = error instanceof Error ? error.message : String(error);
  const stack = !IS_PROD && error instanceof Error ? error.stack : undefined;
  console.error(
    `${PREFIX} ${JSON.stringify({
      timestamp: new Date().toISOString(),
      level: "ERROR",
      message,
      ...(IS_PROD ? {} : { ...context, stack }),
    })}`
  );
}
