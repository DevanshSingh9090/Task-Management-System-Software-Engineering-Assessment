export function parseExpiryToMs(exp: string) {
  // supports formats like 15m, 7d, 1h
  if (!exp) return 15 * 60 * 1000;
  if (exp.endsWith("m")) {
    const n = Number(exp.slice(0, -1));
    return n * 60 * 1000;
  }
  if (exp.endsWith("h")) {
    const n = Number(exp.slice(0, -1));
    return n * 60 * 60 * 1000;
  }
  if (exp.endsWith("d")) {
    const n = Number(exp.slice(0, -1));
    return n * 24 * 60 * 60 * 1000;
  }
  return 15 * 60 * 1000;
}
