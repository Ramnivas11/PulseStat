/**
 * Safe serialization utilities.
 *
 * Converts BigInt values (and nested structures containing them) into JS
 * numbers when they fit in Number.MAX_SAFE_INTEGER, otherwise into strings.
 * This keeps JSON.stringify working and avoids loss of information for huge
 * values.
 */

function convertBigInt(value: bigint): number | string {
  const max = BigInt(Number.MAX_SAFE_INTEGER);
  if (value <= max && value >= -max) {
    return Number(value);
  }
  return value.toString();
}

export function deepSerialize<T>(input: T): unknown {
  const seen = new WeakSet();

  function recurse(value: any): any {
    if (value === null || value === undefined) return value;

    if (typeof value === "bigint") return convertBigInt(value as bigint);
    if (typeof value === "number" || typeof value === "string" || typeof value === "boolean") return value;
    if (value instanceof Date) return value.toISOString();
    if (Array.isArray(value)) return value.map(recurse);
    if (typeof value === "object") {
      if (seen.has(value)) return undefined; // break cycles
      seen.add(value);
      const out: Record<string, any> = {};
      for (const [k, v] of Object.entries(value)) {
        out[k] = recurse(v);
      }
      return out;
    }

    // Fallback: stringify unknown types
    try {
      return String(value);
    } catch (e) {
      return undefined;
    }
  }

  return recurse(input);
}

export function safeJsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(deepSerialize(data)), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export default deepSerialize;
