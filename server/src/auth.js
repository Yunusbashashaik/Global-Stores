import crypto from "crypto";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "globalstores";
const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET || "globalstores-dev-session-secret";
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000;

function b64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function fromB64url(input) {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  return Buffer.from(padded + pad, "base64").toString("utf8");
}

function sign(payloadB64) {
  return crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payloadB64)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function safeEqualString(a, b) {
  const left = Buffer.from(String(a ?? ""), "utf8");
  const right = Buffer.from(String(b ?? ""), "utf8");
  if (left.length !== right.length) {
    // Still run a compare to reduce obvious timing leaks on length alone.
    crypto.timingSafeEqual(left.length ? left : Buffer.alloc(1), left.length ? left : Buffer.alloc(1));
    return false;
  }
  return crypto.timingSafeEqual(left, right);
}

export function authenticateAdmin(username, password) {
  return (
    safeEqualString(username, ADMIN_USERNAME) &&
    safeEqualString(password, ADMIN_PASSWORD)
  );
}

export function createSessionToken() {
  const payload = {
    role: "admin",
    exp: Date.now() + TOKEN_TTL_MS,
    nonce: crypto.randomBytes(8).toString("hex"),
  };
  const payloadB64 = b64url(JSON.stringify(payload));
  return `${payloadB64}.${sign(payloadB64)}`;
}

export function verifySessionToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return false;
  }
  const [payloadB64, sig] = token.split(".");
  if (!payloadB64 || !sig || !safeEqualString(sign(payloadB64), sig)) {
    return false;
  }
  try {
    const payload = JSON.parse(fromB64url(payloadB64));
    return payload.role === "admin" && typeof payload.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!verifySessionToken(token)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

export { ADMIN_USERNAME };
