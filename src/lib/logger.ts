const prefix = "[PulseStat]";

function formatMessage(
  level: "INFO" | "WARN" | "ERROR",
  message: string,
  context?: Record<string, unknown>
) {
  const timestamp = new Date().toISOString();
  const env = process.env.NODE_ENV || "development";
  
  return JSON.stringify({
    timestamp,
    level,
    env,
    message,
    ...context,
  });
}

export function logInfo(message: string, context?: Record<string, unknown>) {
  console.log(`${prefix} ${formatMessage("INFO", message, context)}`);
}

export function logWarn(message: string, context?: Record<string, unknown>) {
  console.warn(`${prefix} ${formatMessage("WARN", message, context)}`);
}

export function logError(error: unknown, context?: Record<string, unknown>) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;
  
  console.error(
    `${prefix} ${formatMessage("ERROR", errorMessage, {
      ...context,
      stack: errorStack,
    })}`
  );
}