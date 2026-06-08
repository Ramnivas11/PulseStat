const LOCALHOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

export function normalizeDomain(
  input: string,
  options: { allowLocalhost?: boolean } = {}
) {
  const raw = input.trim().toLowerCase();

  if (!raw) return null;

  const value = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw)
    ? raw
    : `https://${raw}`;

  let hostname: string;

  try {
    hostname = new URL(value).hostname.toLowerCase().replace(/\.$/, "");
  } catch {
    return null;
  }

  if (!hostname) return null;

  if (LOCALHOSTS.has(hostname)) {
    return options.allowLocalhost ? hostname : null;
  }

  if (hostname.length > 253 || hostname.includes("_")) {
    return null;
  }

  const labels = hostname.split(".");

  if (labels.length < 2) {
    return null;
  }

  const isValid = labels.every((label) => {
    return (
      label.length > 0 &&
      label.length <= 63 &&
      /^[a-z0-9-]+$/.test(label) &&
      !label.startsWith("-") &&
      !label.endsWith("-")
    );
  });

  return isValid ? hostname : null;
}

export function canUseLocalhostDomains() {
  return process.env.NODE_ENV !== "production";
}

export function isTrustedOrigin(origin: string, expectedDomain: string) {
  const normalizedOrigin = normalizeDomain(origin, {
    allowLocalhost: canUseLocalhostDomains(),
  });
  const normalizedExpected = normalizeDomain(expectedDomain, {
    allowLocalhost: canUseLocalhostDomains(),
  });

  if (!normalizedOrigin || !normalizedExpected) {
    return false;
  }

  if (LOCALHOSTS.has(normalizedExpected)) {
    return normalizedOrigin === normalizedExpected;
  }

  return (
    normalizedOrigin === normalizedExpected ||
    normalizedOrigin.endsWith(`.${normalizedExpected}`)
  );
}
