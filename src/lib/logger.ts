const prefix = "[PulseStat]";

export function logInfo(message: string, context?: Record<string, unknown>) {
  const payload = context ? { message, ...context } : { message };
  console.log(prefix, JSON.stringify(payload));
}

export function logWarn(message: string, context?: Record<string, unknown>) {
  const payload = context ? { message, ...context } : { message };
  console.warn(prefix, JSON.stringify(payload));
}

export function logError(error: unknown, context?: Record<string, unknown>) {
  const payload = typeof error === "string" ? { message: error } : { error };
  if (context) {
    Object.assign(payload, context);
  }
  console.error(`${prefix} ERROR`, JSON.stringify(payload));
}