import bcrypt from "bcryptjs";
import crypto from "crypto";

const SALT_ROUNDS = 10;
const AUTH_SECRET = process.env.AUTH_SECRET || "dev-super-secret-key-areventsco-secure-12345";

/**
 * Hashes a plaintext password securely using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verifies a plaintext password against a stored bcrypt hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string | null;
}

/**
 * Encodes a session payload into a cryptographically signed HMAC-SHA256 token
 */
export function createSessionToken(user: SessionUser): string {
  const payload = {
    ...user,
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days expiration
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(payloadB64)
    .digest("base64url");

  return `${payloadB64}.${signature}`;
}

/**
 * Decodes, validates cryptographic HMAC-SHA256 signature, and checks expiration
 */
export function verifySessionToken(token: string): SessionUser | null {
  try {
    if (!token || typeof token !== "string") return null;

    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [payloadB64, providedSig] = parts;

    // Verify HMAC signature
    const expectedSig = crypto
      .createHmac("sha256", AUTH_SECRET)
      .update(payloadB64)
      .digest("base64url");

    if (providedSig !== expectedSig) {
      return null;
    }

    const jsonStr = Buffer.from(payloadB64, "base64url").toString("utf-8");
    const payload = JSON.parse(jsonStr);

    // Verify expiration timestamp
    if (payload.exp && Date.now() > payload.exp) {
      return null;
    }

    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      phone: payload.phone,
    };
  } catch {
    return null;
  }
}
